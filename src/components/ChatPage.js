// src/components/ChatPage.js

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import './ChatPage.css';
import { BASE_URL } from '../config';

const ChatPage = () => {
  const { chatroomId } = useParams();
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [otherUserNickname, setOtherUserNickname] = useState(location.state?.otherUserNickname || '채팅');
  const [numericUserId, setNumericUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const stompClientRef = useRef(null);
  const messagesEndRef = useRef(null);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!userId) {
        setError("사용자 ID를 찾을 수 없습니다.");
        setIsLoading(false);
        return;
      }

      try {
        let fetchedNumericUserId = null;
        const userResponse = await fetch(`${BASE_URL}/api/users/${userId}`, {
          headers: { 'ngrok-skip-browser-warning': 'true' }
        });
        
        if (!userResponse.ok) {
          setError(`사용자 정보를 불러오지 못했습니다: ${userResponse.status}`);
          setIsLoading(false);
          return;
        }
        
        const userData = await userResponse.json();
        fetchedNumericUserId = userData.id;
        setNumericUserId(userData.id);

        const historyResponse = await fetch(`${BASE_URL}/api/chat/${chatroomId}/history?userId=${userId}`, {
          headers: { 'ngrok-skip-browser-warning': 'true' }
        });
        
        if (historyResponse.ok) {
          const history = await historyResponse.json();
          setMessages(history);
          // If nickname not passed via state, try to get it from history
          if (!location.state?.otherUserNickname && history.length > 0 && fetchedNumericUserId !== null) {
            const otherUserMsg = history.find(msg => msg.senderId !== fetchedNumericUserId);
            if (otherUserMsg) {
              setOtherUserNickname(otherUserMsg.senderNickname);
            } else {
              // If all messages are from current user, try to get nickname from the first message if it exists
              // This handles cases where the chat might be new and only current user has sent messages
              const firstMessage = history[0];
              if (firstMessage && firstMessage.senderId !== fetchedNumericUserId) {
                setOtherUserNickname(firstMessage.senderNickname);
              }
            }
          }
        }

        await fetch(`${BASE_URL}/api/chat/${chatroomId}/read?userId=${userId}`, {
          method: 'PUT',
          headers: { 'ngrok-skip-browser-warning': 'true' }
        });
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching initial chat data:', error);
        setError("초기 채팅 데이터를 불러오는 중 오류가 발생했습니다.");
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [chatroomId, userId, location.state?.otherUserNickname]);

  useEffect(() => {
    if (!numericUserId || error) return; 

    const socket = new SockJS(`${BASE_URL}/ws-stomp`);
    const stompClient = Stomp.over(socket);
    stompClientRef.current = stompClient;

    stompClient.connect({}, (frame) => {
      console.log('STOMP Connected: ' + frame);
      stompClient.subscribe(`/sub/chat/room/${chatroomId}`, (message) => {
        const chatMessage = JSON.parse(message.body);
        setMessages((prevMessages) => [...prevMessages, chatMessage]);
      });
    }, (stompError) => {
      console.error('STOMP Connection Error. Full error object:', stompError);
      setError("채팅 서버 연결에 실패했습니다.");
      console.log('현재 BASE_URL:', BASE_URL);
    });

    return () => {
      if (stompClientRef.current && stompClientRef.current.connected) {
        stompClientRef.current.disconnect();
        console.log('STOMP Disconnected');
      }
    };
  }, [chatroomId, numericUserId, error]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && stompClientRef.current && stompClientRef.current.connected) {
      const message = {
        chatroomId: parseInt(chatroomId),
        senderId: numericUserId,
        content: newMessage,
        type: 'CHAT'
      };
      stompClientRef.current.send('/pub/chat/message', {}, JSON.stringify(message));
      setNewMessage('');
    }
  };

  if (isLoading) {
    return (
      <div className="chat-page-container">
        <div className="chat-header"><h2>채팅</h2></div>
        <div className="chat-messages" style={{ justifyContent: 'center', alignItems: 'center' }}>
          <p>로딩 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chat-page-container">
        <div className="chat-header"><h2>채팅</h2></div>
        <div className="chat-messages" style={{ justifyContent: 'center', alignItems: 'center' }}>
          <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>
          <p style={{ textAlign: 'center' }}>잠시 후 다시 시도해주세요.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-page-container">
      <div className="chat-header">
        <h2>{otherUserNickname}</h2>
      </div>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.senderId === numericUserId ? 'sent' : 'received'}`}>
            <div className="message-content">
              <p>{msg.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form className="chat-input-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="메시지를 입력하세요..."
        />
        <button type="submit">전송</button>
      </form>
    </div>
  );
};

export default ChatPage;