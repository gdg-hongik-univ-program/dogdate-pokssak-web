import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../config';
import './ChatRoomListPage.css';

const ChatRoomListPage = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchChatRooms = async () => {
      if (!userId) {
        setError('사용자 ID를 찾을 수 없습니다. 로그인해주세요.');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/api/chat/users/${userId}/chatrooms`, {
          headers: { 'ngrok-skip-browser-warning': 'true' },
        });

        if (!response.ok) {
          throw new Error(`채팅방 목록 불러오기 실패: ${response.statusText}`);
        }

        const chatroomData = await response.json();

        const matchesResponse = await fetch(`${BASE_URL}/api/matches/users/${userId}/active`, {
          headers: { 'ngrok-skip-browser-warning': 'true' },
        });

        if (!matchesResponse.ok) {
          throw new Error(`매치 정보 불러오기 실패: ${matchesResponse.statusText}`);
        }

        const matches = await matchesResponse.json();
        const matchesMap = new Map(matches.map(m => [m.id, m]));

        const chatRoomsWithDetails = await Promise.all(chatroomData.map(async (room) => {
          const correspondingMatch = matchesMap.get(room.matchId);
          let otherUserNickname = '알 수 없는 사용자';

          if (correspondingMatch) {
            otherUserNickname = 
              correspondingMatch.user1Id === parseInt(userId) 
                ? correspondingMatch.user2Nickname 
                : correspondingMatch.user1Nickname;
          }

          let lastMessage = '메시지 없음';
          let lastMessageTimestamp = null;

          try {
            const historyResponse = await fetch(`${BASE_URL}/api/chat/${room.id}/history?userId=${userId}&page=0&size=1`, {
                headers: { 'ngrok-skip-browser-warning': 'true' },
            });
            if (historyResponse.ok) {
              const history = await historyResponse.json();
              if (history.length > 0) {
                lastMessage = history[0].content;
                lastMessageTimestamp = history[0].sentAt;
              }
            }
          } catch (e) {
            console.error(`Failed to fetch last message for room ${room.id}`, e);
          }

          return {
            ...room,
            otherUserNickname,
            lastMessage,
            lastMessageTimestamp,
          };
        }));

        setChatRooms(chatRoomsWithDetails);

      } catch (err) {
        setError(err.message);
        console.error('Error fetching chat rooms:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchChatRooms();
    }
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
            <div key={room.id} className="chat-room-item" onClick={() => navigate(`/app/chat/${room.id}`, { state: { otherUserNickname: room.otherUserNickname } })}>
              <div className="chat-room-info">
                <h3>{room.otherUserNickname}</h3>
                <p className="last-message">{room.lastMessage}</p>
              </div>
              {room.lastMessageTimestamp && (
                  <span className="last-message-time">{new Date(room.lastMessageTimestamp).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}</span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatRoomListPage;