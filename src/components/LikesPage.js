import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import DogProfileCard from './DogprofileCard';
import './LikesPage.css';

// --- 가짜 데이터 ---
const fakeSentRequests = [
  {
    id: 1,
    toUserNickname: '행복한견주',
    dog: {
      id: 101,
      name: '레오',
      breed: '포메라니안',
      age: 3,
      gender: '남아',
      city: '경기',
      district: '성남시',
      bio: '작지만 용감한 레오! 다른 강아지 친구들과 어울리는 걸 좋아해요.',
      imageUrl: 'https://images.unsplash.com/photo-1598875184988-5e67b1a874b8?q=80&w=800',
      likes: 110
    }
  },
  {
    id: 2,
    toUserNickname: '보리누나',
    dog: {
      id: 102,
      name: '보리',
      breed: '시츄',
      age: 4,
      gender: '여아',
      city: '인천',
      district: '연수구',
      bio: '순하고 낮잠 자는 걸 좋아하는 보리 공주님이에요.',
      imageUrl: 'https://images.unsplash.com/photo-1548681528-6a5c45b66b42?q=80&w=800',
      likes: 100
    }
  }
];

const fakeReceivedRequests = [
  {
    id: 3,
    fromUserNickname: '해피보호자',
    dog: {
      id: 201,
      name: '해피',
      breed: '비글',
      age: 1,
      gender: '남아',
      city: '서울',
      district: '용산구',
      bio: '지치지 않는 에너자이저 해피! 같이 뛰어놀아요!',
      imageUrl: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=800',
      distance: '1km'
    }
  },
  {
    id: 4,
    fromUserNickname: '두부언니',
    dog: {
      id: 202,
      name: '두부',
      breed: '프렌치 불독',
      age: 2,
      gender: '여아',
      city: '서울',
      district: '성동구',
      bio: '먹는 것과 자는 것을 가장 좋아하는 순둥이 두부.',
      imageUrl: 'https://images.unsplash.com/photo-1597633425046-08f5110420b5?q=80&w=800',
      distance: '2km'
    }
  }
];
// --- 가짜 데이터 끝 ---

const LikesPage = () => {
  const { openModal } = useOutletContext();
  const [activeTab, setActiveTab] = useState('received');
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // 백엔드 연결 대신 가짜 데이터를 사용합니다.
    setIsLoading(true);
    setTimeout(() => {
      setSentRequests(fakeSentRequests);
      setReceivedRequests(fakeReceivedRequests);
      setIsLoading(false);
    }, 500); // 0.5초 로딩 효과
  }, []);

  const handleAccept = (request) => {
    alert(`'${request.dog.name}'의 매칭 요청을 수락했습니다. (데모)`);
    setReceivedRequests(prev => prev.filter(req => req.id !== request.id));
  };

  const handleReject = (requestToReject) => {
    alert(`'${requestToReject.dog.name}'의 매칭 요청을 거절했습니다. (데모)`);
    setReceivedRequests(prev => prev.filter(req => req.id !== requestToReject.id));
  };

  if (isLoading) {
    return <div className="likes-page-container"><p>요청 목록을 불러오는 중입니다...</p></div>;
  }

  if (error) {
    return <div className="likes-page-container"><p>오류: {error}</p></div>;
  }

  const dataToShow = activeTab === 'sent' ? sentRequests : receivedRequests;

  return (
    <div className="likes-page-container">
      <div className="likes-page-toggle">
        <button
          className={`toggle-btn ${activeTab === 'sent' ? 'active' : ''}`}
          onClick={() => setActiveTab('sent')}
        >
          내가 매칭 신청한 사람
        </button>
        <button
          className={`toggle-btn ${activeTab === 'received' ? 'active' : ''}`}
          onClick={() => setActiveTab('received')}
        >
          나한테 매칭 보낸사람
        </button>
      </div>
      <div className="likes-list-vertical">
        {dataToShow.length === 0 ? (
          <p>표시할 요청이 없습니다.</p>
        ) : (
          dataToShow.map(request => {
            if (!request.dog) {
              return (
                <div key={request.id} className="match-request-item-no-dog">
                  <p>{activeTab === 'sent' ? request.toUserNickname : request.fromUserNickname}님의 프로필을 불러올 수 없습니다.</p>
                </div>
              );
            }
            return (
              <div key={request.id} className="match-request-item">
                <DogProfileCard dog={request.dog} onClick={() => openModal({ dog: request.dog, user: { nickname: activeTab === 'sent' ? request.toUserNickname : request.fromUserNickname }})} />
                {activeTab === 'received' && (
                  <div className="match-request-actions">
                    <button onClick={() => handleAccept(request)}>수락</button>
                    <button onClick={() => handleReject(request)}>거절</button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default LikesPage;