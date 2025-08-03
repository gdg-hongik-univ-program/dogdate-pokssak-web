// src/components/ChatPage.js
import React, { useState } from 'react';
import './ChatPage.css';


function ChatPage() {
  const [messages, setMessages] = useState([
    { id: 1, text: '안녕하세요!', sender: 'other' },
    { id: 2, text: '네, 안녕하세요!', sender: 'me' },
    { id: 3, text: '채팅 기능이 추가되었네요.', sender: 'other' },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    const newMessages = [...messages, { id: messages.length + 1, text: newMessage, sender: 'me' }];
    setMessages(newMessages);
    setNewMessage('');
  };

  return (
    <div className="chat-page">
        
        <div className="chat-messages">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.sender}`}>
              <p>{message.text}</p>
            </div>
          ))}
        </div>
        <div className="chat-input">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="메시지를 입력하세요..."
          />
          <button onClick={handleSendMessage}>전송</button>
        </div>
      </div>
  );
}

export default ChatPage;