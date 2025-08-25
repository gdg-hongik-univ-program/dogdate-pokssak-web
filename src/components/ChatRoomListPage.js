import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ChatRoomListPage.css';

// --- 가짜 데이터 ---
const fakeChatRooms = [
  {
    id: 1,
    otherUserNickname: '코코 견주',
    lastMessage: '네, 안녕하세요! 반갑습니다 😄',
    lastMessageTimestamp: new Date(new Date().getTime() - 5 * 60000).toISOString(), // 5 minutes ago
    otherUserImageUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=800'
  },
  {
    id: 2,
    otherUserNickname: '레오 아빠',
    lastMessage: '산책 같이 하실래요? 저희 강아지가 엄청 활발해요.',
    lastMessageTimestamp: new Date(new Date().getTime() - 30 * 60000).toISOString(), // 30 minutes ago
    otherUserImageUrl: 'https://images.unsplash.com/photo-1598875184988-5e67b1a874b8?q=80&w=800'
  },
  {
    id: 3,
    otherUserNickname: '보리 누나',
    lastMessage: '사진 잘 봤어요! 너무 귀여워요ㅠㅠ',
    lastMessageTimestamp: new Date(new Date().getTime() - 120 * 60000).toISOString(), // 2 hours ago
    otherUserImageUrl: 'https://images.unsplash.com/photo-1548681528-6a5c45b66b42?q=80&w=800'
  },
  {
    id: 4,
    otherUserNickname: '해피 보호자',
    lastMessage: '네 그럼 그때 뵐게요!',
    lastMessageTimestamp: new Date(new Date().getTime() - 24 * 60 * 60000).toISOString(), // 1 day ago
    otherUserImageUrl: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=800'
  }
];
// --- 가짜 데이터 끝 ---

const ChatRoomListPage = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setChatRooms([]);
      setIsLoading(false);
    }, 500); // 0.5초 로딩 시뮬레이션
  }, []);

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
              <div className="chat-room-avatar">
                <img src={room.otherUserImageUrl} alt={room.otherUserNickname} />
              </div>
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
