// src/components/ChatPage.js

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { HiPaperAirplane } from 'react-icons/hi2';
import './ChatPage.css';

// 임시 채팅 메시지 데이터
const getChatMessages = (chatroomId) => {
  const chatData = {
    1: [
      { id: 1, senderId: 1, senderNickname: '코코 견주', content: '안녕하세요! 반갑습니다 😄', timestamp: new Date(Date.now() - 300000) },
      { id: 2, senderId: 999, senderNickname: '나', content: '안녕하세요! 코코가 정말 귀엽네요!', timestamp: new Date(Date.now() - 240000) },
      { id: 3, senderId: 1, senderNickname: '코코 견주', content: '감사해요! 멍멍이도 정말 귀여워요', timestamp: new Date(Date.now() - 180000) },
      { id: 4, senderId: 999, senderNickname: '나', content: '산책 같이 하실래요?', timestamp: new Date(Date.now() - 120000) },
      { id: 5, senderId: 1, senderNickname: '코코 견주', content: '좋은 아이디어네요! 언제가 좋으실까요?', timestamp: new Date(Date.now() - 60000) },
    ],
    2: [
      { id: 1, senderId: 2, senderNickname: '레오 아빠', content: '저희 ���아지가 엄청 활발해요', timestamp: new Date(Date.now() - 240000) },
      { id: 2, senderId: 999, senderNickname: '나', content: '우리 멍멍이도 활발한 편이에요!', timestamp: new Date(Date.now() - 180000) },
      { id: 3, senderId: 2, senderNickname: '레오 아빠', content: '산책 같이 하실래요?', timestamp: new Date(Date.now() - 120000) },
      { id: 4, senderId: 999, senderNickname: '나', content: '네! 좋아요', timestamp: new Date(Date.now() - 60000) },
    ],
    3: [
      { id: 1, senderId: 3, senderNickname: '보리 누나', content: '사진 잘 봤어요!', timestamp: new Date(Date.now() - 180000) },
      { id: 2, senderId: 999, senderNickname: '나', content: '감사해요!', timestamp: new Date(Date.now() - 120000) },
      { id: 3, senderId: 3, senderNickname: '보리 누나', content: '너무 귀여워요ㅠㅠ', timestamp: new Date(Date.now() - 60000) },
    ],
    4: [
      { id: 1, senderId: 4, senderNickname: '해피 보호자', content: '내일 공원에서 만날까요?', timestamp: new Date(Date.now() - 300000) },
      { id: 2, senderId: 999, senderNickname: '나', content: '좋아요! 몇 시에 만날까요?', timestamp: new Date(Date.now() - 240000) },
      { id: 3, senderId: 4, senderNickname: '해피 보호자', content: '오후 3시는 어���세요?', timestamp: new Date(Date.now() - 180000) },
      { id: 4, senderId: 999, senderNickname: '나', content: '네 그럼 그때 뵐게요!', timestamp: new Date(Date.now() - 120000) },
    ]
  };
  return chatData[chatroomId] || [];
};

const ChatPage = () => {
  const { chatroomId } = useParams();
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [otherUserNickname, setOtherUserNickname] = useState(location.state?.otherUserNickname || '채팅 상대');
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const myUserId = 999; // 내 사용자 ID

  useEffect(() => {
    // 임시 채팅 데이터 로드
    setIsLoading(true);
    setTimeout(() => {
      const chatMessages = getChatMessages(parseInt(chatroomId));
      setMessages(chatMessages);

      // 상대방 닉네임 설정
      if (!location.state?.otherUserNickname && chatMessages.length > 0) {
        const otherUserMsg = chatMessages.find(msg => msg.senderId !== myUserId);
        if (otherUserMsg) {
          setOtherUserNickname(otherUserMsg.senderNickname);
        }
      }

      setIsLoading(false);
    }, 500);
  }, [chatroomId, location.state?.otherUserNickname]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        senderId: myUserId,
        senderNickname: '나',
        content: newMessage,
        timestamp: new Date()
      };
      setMessages(prevMessages => [...prevMessages, message]);
      setNewMessage('');

      // 임���로 상대방 자동 응답 (데모용)
      setTimeout(() => {
        const responses = [
          '네, 알겠습니다!',
          '좋은 생각이네요 😊',
          '그럼 언제 만날까요?',
          '우리 강아지들이 좋아할 것 같아요!',
          '감사해요!',
          '재미있겠네요!'
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        const autoReply = {
          id: Date.now() + 1,
          senderId: parseInt(chatroomId),
          senderNickname: otherUserNickname,
          content: randomResponse,
          timestamp: new Date()
        };
        setMessages(prevMessages => [...prevMessages, autoReply]);
      }, 1000 + Math.random() * 2000); // 1-3초 후 자동 응답
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

  return (
    <div className="chat-page-container">
      <div className="chat-header">
        <h2>{otherUserNickname}</h2>
      </div>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={msg.id || index} className={`message ${msg.senderId === myUserId ? 'sent' : 'received'}`}>
            <div className="message-content">
              <p>{msg.content}</p>
            </div>
            <span className="message-time">
              {msg.timestamp instanceof Date ?
                msg.timestamp.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) :
                new Date(msg.timestamp).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
              }
            </span>
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
        <button type="submit">
          <HiPaperAirplane />
        </button>
      </form>
    </div>
  );
};

export default ChatPage;
