// src/components/ChatPage.js
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import './ChatPage.css';

const ChatPage = () => {
  const { chatroomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const socketRef = useRef(null);
  const userId = localStorage.getItem('userId'); // Get userId from localStorage

  useEffect(() => {
    // Fetch chat history
    const fetchChatHistory = async () => {
      try {
        const response = await fetch(`https://54e143bc334e.ngrok-free.app/api/chat/${chatroomId}/history?userId=${userId}`, {
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

    // Connect to WebSocket
    socketRef.current = io('https://54e143bc334e.ngrok-free.app'); // Replace with your server URL

    socketRef.current.on('connect', () => {
      console.log('Connected to WebSocket');
      socketRef.current.emit('joinRoom', { chatroomId });
    });

    socketRef.current.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [chatroomId, userId]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && socketRef.current) {
      const message = {
        chatroomId,
        senderId: userId,
        content: newMessage,
      };
      socketRef.current.emit('sendMessage', message);
      setNewMessage('');
    }
  };

  return (
    <div className="chat-page-container">
      <div className="chat-header">
        <h2>Chat</h2>
      </div>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.senderId === userId ? 'sent' : 'received'}`}>
            <div className="message-content">
              <p>{msg.content}</p>
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
