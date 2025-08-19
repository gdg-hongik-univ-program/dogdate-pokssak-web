// src/components/ChatPage.js
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import './ChatPage.css';

const ChatPage = () => {
  const { chatroomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const stompClientRef = useRef(null);
  const userId = localStorage.getItem('userId'); // Get userId from localStorage

  // Fetch chat history on component mount
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await fetch(`https://e45d0de5c141.ngrok-free.app/api/chat/${chatroomId}/history?userId=${userId}`, {
          headers: {
            'ngrok-skip-browser-warning': 'true',
          },
        });
        if (response.ok) {
          const history = await response.json();
          setMessages(history);
        } else {
          console.error('Failed to fetch chat history');
        }
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    };

    if (chatroomId && userId) {
      fetchChatHistory();
    }
  }, [chatroomId, userId]);

  // WebSocket (STOMP) connection and subscription
  useEffect(() => {
    const socket = new SockJS('https://e45d0de5c141.ngrok-free.app/ws-stomp');
    const stompClient = Stomp.over(socket);
    stompClientRef.current = stompClient;

    stompClient.connect({}, (frame) => {
      console.log('Connected: ' + frame);

      // Subscribe to the chat room
      stompClient.subscribe(`/sub/chat/room/${chatroomId}`, (message) => {
        const chatMessage = JSON.parse(message.body);
        setMessages((prevMessages) => [...prevMessages, chatMessage]);
      });

    }, (error) => {
      console.error('STOMP Error:', error);
    });

    // Disconnect on component unmount
    return () => {
      if (stompClientRef.current && stompClientRef.current.connected) {
        stompClientRef.current.disconnect(() => {
          console.log('Disconnected');
        });
      }
    };
  }, [chatroomId, userId]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && stompClientRef.current && stompClientRef.current.connected) {
      const message = {
        chatroomId: parseInt(chatroomId),
        senderId: parseInt(userId),
        content: newMessage,
        type: 'CHAT'
      };
      stompClientRef.current.send('/pub/chat/message', {}, JSON.stringify(message));
      setNewMessage('');
    }
  };

  return (
    <div className="chat-page-container">
      <div className="chat-header">
        <h2>Chat Room {chatroomId}</h2>
      </div>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.senderId === parseInt(userId) ? 'sent' : 'received'}`}>
            <div className="message-content">
              <p>{msg.senderNickname}: {msg.content}</p>
            </div>
          </div>
        ))}
      </div>
      <form className="chat-input-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatPage;
