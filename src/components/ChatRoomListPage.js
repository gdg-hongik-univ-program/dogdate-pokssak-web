// src/components/ChatRoomListPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../config';
import './ChatRoomListPage.css';

const ChatRoomListPage = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId'); // Get userId from localStorage

  useEffect(() => {
    const fetchChatRooms = async () => {
      if (!userId) {
        setError('사용자 ID를 찾을 수 없습니다. 로그인해주세요.');
        setIsLoading(false);
        return;
      }

      try {
        // 1. Fetch chatrooms
        const response = await fetch(`${BASE_URL}/api/chat/users/${userId}/chatrooms`, {
          headers: {
            'ngrok-skip-browser-warning': 'true',
          },
        });

        const responseText = await response.text();
        console.log("--- API 응답 (/api/chat/users/{userId}/chatrooms) ---");
        console.log(responseText);

        if (responseText.trim().startsWith('<')) {
          throw new Error('서버에서 JSON이 아닌 HTML 응답을 받았습니다. 콘솔 로그를 확인하여 원인(예: 404, 500 에러)을 파악하세요.');
        }

        const chatroomData = JSON.parse(responseText);

        // 2. Fetch matches
        const matchesResponse = await fetch(`${BASE_URL}/api/matches/users/${userId}`, {
          headers: { 'ngrok-skip-browser-warning': 'true' },
        });
        
        const matchesText = await matchesResponse.text();
        console.log("--- API 응답 (/api/matches/users/{userId}) ---");
        console.log(matchesText);

        if (matchesText.trim().startsWith('<')) {
          throw new Error('서버에서 JSON이 아닌 HTML 응답을 받았습니다. 콘솔 로그를 확인하여 원인(예: 404, 500 에러)을 파악하세요.');
        }

        const matches = JSON.parse(matchesText);

        // 3. Combine data
        const chatRoomsWithNicknames = chatroomData.map(room => {
          const correspondingMatch = matches.find(match => match.id === room.matchId);
          if (correspondingMatch) {
            const otherUserNickname = 
              correspondingMatch.user1Id === parseInt(userId) 
                ? correspondingMatch.user2Nickname 
                : correspondingMatch.user1Nickname;
            return { ...room, otherUserNickname };
          } else {
            return { ...room, otherUserNickname: '알 수 없는 사용자' };
          }
        });

        // Fetch last message for each chatroom
        const chatRoomsWithLastMessages = await Promise.all(chatRoomsWithNicknames.map(async (room) => {
          try {
            const lastMessageResponse = await fetch(`${BASE_URL}/api/chat/${room.id}/last-message`, {
              headers: { 'ngrok-skip-browser-warning': 'true' },
            });
            if (lastMessageResponse.ok) {
              const lastMessageData = await lastMessageResponse.json();
              return { 
                ...room, 
                lastMessage: lastMessageData.content || '메시지 없음',
                lastMessageTimestamp: lastMessageData.timestamp || null
              };
            } else {
              console.warn(`Failed to fetch last message for chatroom ${room.id}: ${lastMessageResponse.status}`);
              return { ...room, lastMessage: '메시지 없음', lastMessageTimestamp: null };
            }
          } catch (msgErr) {
            console.error(`Error fetching last message for chatroom ${room.id}:`, msgErr);
            return { ...room, lastMessage: '메시지 없음', lastMessageTimestamp: null };
          }
        }));

        setChatRooms(chatRoomsWithLastMessages);

      } catch (err) {
        setError(err.message);
        console.error('Error fetching chat rooms:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChatRooms();
  }, [userId]);

  if (isLoading) {
    return <div className="chat-room-list-container"><p>채팅방 목록을 불러오는 중입니다...</p></div>;
  }

  if (error) {
    return <div className="chat-room-list-container"><p>오류: {error}</p></div>;
  }

  return (
    <div className="chat-room-list-container">
      <div className="chat-room-list-header">
        <h2>채팅 목록</h2>
      </div>
      <div className="chat-room-list-content">
        {chatRooms.length === 0 ? (
          <p>아직 채팅방이 없습니다.</p>
        ) : (
          chatRooms.map((room) => (
            <div key={room.id} className="chat-room-item" onClick={() => navigate(`/app/chat/${room.id}`)}>
              <div className="chat-room-info">
                <h3>{room.otherUserNickname || '알 수 없는 사용자'}</h3>
                <p className="last-message">{room.lastMessage || '메시지 없음'}</p>
              </div>
              <span className="last-message-time">{room.lastMessageTimestamp ? new Date(room.lastMessageTimestamp).toLocaleTimeString() : ''}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatRoomListPage;
