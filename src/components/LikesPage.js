import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { HiCheckCircle, HiXCircle } from "react-icons/hi2";
import './LikesPage.css';
import { BASE_URL } from '../config';
import DogProfileCard from './DogprofileCard'; // DogProfileCard 컴포넌트를 임포트합니다.

const LikesPage = () => {
  const { openModal } = useOutletContext();
  const [activeTab, setActiveTab] = useState('received');
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchRequests = async () => {
      if (!userId) {
        setError('사용자 ID를 찾을 수 없습니다. 로그인해주세요.');
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setError('');
      try {
        const headers = { 'ngrok-skip-browser-warning': 'true' };

        const [sentResponse, receivedResponse] = await Promise.all([
          fetch(`${BASE_URL}/api/swipes/sent/${userId}`, { headers }),
          fetch(`${BASE_URL}/api/swipes/received/${userId}`, { headers })
        ]);

        if (!sentResponse.ok) throw new Error(`보낸 매칭 요청 불러오기 실패`);
        if (!receivedResponse.ok) throw new Error(`받은 매칭 요청 불러오기 실패`);

        const sentData = await sentResponse.json();
        const receivedData = await receivedResponse.json();

        const fetchDogForRequest = async (request, type) => {
          const otherUserId = type === 'sent' ? request.toUserId : request.fromUserId;
          const otherUserNickname = type === 'sent' ? request.toUserNickname : request.fromUserNickname;
        
          if (!otherUserId) {
            return { ...request, dog: null, otherUserNickname };
          }
        
          try {
            const dogResponse = await fetch(`${BASE_URL}/api/dogs/users/${otherUserId}`, { headers });
        
            if (dogResponse.ok) {
              const dogs = await dogResponse.json();
              const dog = dogs[0] || null;
              return { ...request, dog, otherUserNickname };
            } else {
              return { ...request, dog: null, otherUserNickname };
            }
          } catch (err) {
            return { ...request, dog: null, otherUserNickname };
          }
        };

        const [sentRequestsWithDogs, receivedRequestsWithDogs] = await Promise.all([
          Promise.all(sentData.map(request => fetchDogForRequest(request, 'sent'))),
          Promise.all(receivedData.map(request => fetchDogForRequest(request, 'received')))
        ]);

        setSentRequests(sentRequestsWithDogs);
        setReceivedRequests(receivedRequestsWithDogs);

      } catch (err) {
        setError(err.message);
        console.error('Error fetching match requests:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, [userId]);

  const handleAccept = async (request) => {
    if (!userId) {
      alert('사용자 ID를 찾을 수 없습니다. 로그인해주세요.');
      return;
    }
    const toUserId = request.fromUserId;
    try {
      const swipeResponse = await fetch(`${BASE_URL}/api/swipes/users/${userId}`, {
        method: 'POST',
        headers: {
          'ngrok-skip-browser-warning': 'true',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ toUserId: toUserId }),
      });
      if (swipeResponse.ok) {
        const resultText = await swipeResponse.text();
        try {
          const resultJson = JSON.parse(resultText);
          if (resultJson.status === 'MATCHED') {
            openModal({ type: 'match', matchedUser: { id: request.fromUserId, nickname: request.fromUserNickname, dog: request.dog } });
          } else {
            alert('매칭 요청을 수락했습니다.');
          }
        } catch (e) {
          alert('매칭 요청을 수락했습니다.');
        }
        setReceivedRequests(prev => prev.filter(req => req.id !== request.id));
      } else {
        const errorText = await swipeResponse.text();
        throw new Error(`스와이프 실패: ${errorText}`);
      }
    } catch (error) {
      console.error('Error accepting match request:', error);
      alert(`매칭 요청 수락 중 오류 발생: ${error.message}`);
    }
  };

  const handleReject = async (request) => {
    if (!userId) {
      alert('사용자 ID를 찾을 수 없습니다. 로그인해주세요.');
      return;
    }
    const matchId = request.id;
    try {
      const response = await fetch(`${BASE_URL}/api/matches/${matchId}/status?status=INACTIVE`, {
        method: 'PUT',
        headers: { 'ngrok-skip-browser-warning': 'true' },
      });
      if (response.ok) {
        alert('매칭 요청을 거절했습니다.');
        setReceivedRequests(prev => prev.filter(req => req.id !== request.id));
      } else {
        throw new Error(`매칭 요청 거절 실패`);
      }
    } catch (error) {
      console.error('Error rejecting match request:', error);
      alert(`매칭 요청 거절 중 오류 발생: ${error.message}`);
    }
  };
  
  if (isLoading) {
    return <div className="likes-page-container"><p>매칭 요청을 불러오는 중입니다...</p></div>;
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
          보낸 요청
        </button>
        <button
          className={`toggle-btn ${activeTab === 'received' ? 'active' : ''}`}
          onClick={() => setActiveTab('received')}
        >
          받은 요청
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
                <div className="likes-dog-card-wrapper">
                  {/* --- 수정된 부분: DogProfileCard 컴포넌트 사용 --- */}
                  <DogProfileCard
                    dog={request.dog}
                    onClick={() => openModal({
                      dog: request.dog,
                      user: {
                        id: activeTab === 'sent' ? request.toUserId : request.fromUserId,
                        nickname: activeTab === 'sent' ? request.toUserNickname : request.fromUserNickname
                      }
                    })}
                  />
                  {/* --- 여기까지 수정 --- */}
                  {activeTab === 'received' && (
                    <div className="match-request-actions-overlay">
                      <button className="action-btn accept-btn" onClick={() => handleAccept(request)}>
                        <HiCheckCircle className="btn-icon" />
                      </button>
                      <button className="action-btn reject-btn" onClick={() => handleReject(request)}>
                        <HiXCircle className="btn-icon" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default LikesPage;
