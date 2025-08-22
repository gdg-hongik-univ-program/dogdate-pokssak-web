import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import DogProfileCard from './DogprofileCard';
import './LikesPage.css';
import { BASE_URL } from '../config';

const LikesPage = () => {
  const { openModal } = useOutletContext();
  const [activeTab, setActiveTab] = useState('received'); // Default to received tab
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
        // Using /api/swipes/ endpoint as this seems to be the actual data source
        // Fetch received swipes (these are the actionable requests)
        const receivedResponse = await fetch(`${BASE_URL}/api/swipes/received/${userId}`, {
          headers: { 'ngrok-skip-browser-warning': 'true' },
        });
        if (receivedResponse.ok) {
          const receivedData = await receivedResponse.json();
          const receivedRequestsWithDogs = await Promise.all(receivedData.map(async (request) => {
            const otherUserId = request.fromUserId;
            try {
              const dogResponse = await fetch(`${BASE_URL}/api/dogs/users/${otherUserId}`, {
                headers: { 'ngrok-skip-browser-warning': 'true' },
              });
              if (dogResponse.ok) {
                const dogs = await dogResponse.json();
                return { ...request, dog: (dogs && dogs.length > 0) ? dogs[0] : null };
              } else {
                return { ...request, dog: null };
              }
            } catch (dogError) {
              return { ...request, dog: null };
            }
          }));
          setReceivedRequests(receivedRequestsWithDogs);
        } else {
          throw new Error(`받은 요청 불러오기 실패: ${receivedResponse.status} ${receivedResponse.statusText}`);
        }

        // Fetch sent swipes
        const sentResponse = await fetch(`${BASE_URL}/api/swipes/sent/${userId}`, {
          headers: { 'ngrok-skip-browser-warning': 'true' },
        });
        if (sentResponse.ok) {
          const sentData = await sentResponse.json();
          const sentRequestsWithDogs = await Promise.all(sentData.map(async (request) => {
            const otherUserId = request.toUserId;
            try {
              const dogResponse = await fetch(`${BASE_URL}/api/dogs/users/${otherUserId}`, {
                headers: { 'ngrok-skip-browser-warning': 'true' },
              });
              if (dogResponse.ok) {
                const dogs = await dogResponse.json();
                return { ...request, dog: (dogs && dogs.length > 0) ? dogs[0] : null };
              } else {
                return { ...request, dog: null };
              }
            } catch (dogError) {
              return { ...request, dog: null };
            }
          }));
          setSentRequests(sentRequestsWithDogs);
        } else {
          throw new Error(`보낸 요청 불러오기 실패: ${sentResponse.status} ${sentResponse.statusText}`);
        }

      } catch (err) {
        setError(err.message);
        console.error('Error fetching requests:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchRequests();
    }
  }, [userId]);

  const handleAccept = async (request) => {
    const userId = localStorage.getItem('userId');
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
        body: JSON.stringify({ toUserId: toUserId, isLike: true }), // Explicitly like back
      });

      if (swipeResponse.ok) {
        const swipeResultText = await swipeResponse.text();
        try {
          const swipeResult = JSON.parse(swipeResultText);
          if (swipeResult && swipeResult.status === 'MATCHED') {
            alert('매칭 성공! 채팅방이 생성되었습니다.');
          } else {
            alert('매칭을 수락했습니다.');
          }
        } catch (e) {
           alert('매칭을 수락했습니다.');
        }
        setReceivedRequests(prev => prev.filter(req => req.id !== request.id));
      } else {
        const errorText = await swipeResponse.text();
        if (errorText.includes('이미 스와이프한 사용자입니다.')) {
          alert('이미 처리된 요청입니다.');
          setReceivedRequests(prev => prev.filter(req => req.id !== request.id));
        } else {
          throw new Error(`수락 실패: ${swipeResponse.status} ${errorText}`);
        }
      }
    } catch (error) {
      console.error('Error accepting request:', error);
      alert(`매칭 요청 수락 중 오류 발생: ${error.message}`);
    }
  };

  const handleReject = (requestToReject) => {
    alert('매칭 요청을 거절했습니다.');
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
