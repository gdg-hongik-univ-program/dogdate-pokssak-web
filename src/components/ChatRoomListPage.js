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
        const response = await fetch(`${BASE_URL}/api/chat/users/${userId}/chatrooms`, {
          headers: {
            'ngrok-skip-browser-warning': 'true',
          },
        });

        if (response.ok) {
          const chatroomData = await response.json();

          // Fetch all matches to get other user nicknames
          const matchesResponse = await fetch(`${BASE_URL}/api/matches/users/${userId}`, {
            headers: { 'ngrok-skip-browser-warning': 'true' },
          });

          if (matchesResponse.ok) {
            const matches = await matchesResponse.json();

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
            setChatRooms(chatRoomsWithNicknames);
          } else {
            console.error('Failed to fetch matches for chat rooms');
            setChatRooms(chatroomData); // Proceed with chatrooms without nicknames if matches fetch fails
          }
        } else {
          const errorText = await response.text();
          throw new Error(`채팅방 목록 불러오기 실패: ${response.status} ${response.statusText} - ${errorText}`);
        }
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
            <div key={room.chatroomId} className="chat-room-item" onClick={() => navigate(`/app/chat/${room.chatroomId}`)}>
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
