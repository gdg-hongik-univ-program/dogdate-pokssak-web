import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import DogProfileCard from './DogprofileCard';
import './LikesPage.css';
import { BASE_URL } from '../config';

const LikesPage = () => {
  const { openModal } = useOutletContext();
  const [activeTab, setActiveTab] = useState('sent');
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
        // Fetch sent requests
        const sentResponse = await fetch(`${BASE_URL}/api/matches/requests/sent/${userId}`, {
          headers: { 'ngrok-skip-browser-warning': 'true' },
        });
        if (sentResponse.ok) {
          const sentData = await sentResponse.json();
          const sentRequestsWithDogs = await Promise.all(sentData.map(async (request) => {
            const otherUserId = request.user1Id === parseInt(userId) ? request.user2Id : request.user1Id;
            if (!otherUserId) {
              console.warn('otherUserId is undefined or null for request:', request);
              return { ...request, dog: null };
            }
            const dogResponse = await fetch(`${BASE_URL}/api/dogs/users/${otherUserId}`, {
              headers: { 'ngrok-skip-browser-warning': 'true' },
            });
            if (dogResponse.ok) {
              const dogs = await dogResponse.json();
              return { ...request, dog: dogs[0] }; // Assuming each user has at least one dog and we take the first one
            } else {
              console.error(`Failed to fetch dog for user ${otherUserId}`);
              return { ...request, dog: null };
            }
          }));
          setSentRequests(sentRequestsWithDogs);
        } else {
          throw new Error(`보낸 매칭 요청 불러오기 실패: ${sentResponse.status} ${sentResponse.statusText}`);
        }

        // Fetch received requests
        const receivedResponse = await fetch(`${BASE_URL}/api/matches/requests/received/${userId}`, {
          headers: { 'ngrok-skip-browser-warning': 'true' },
        });
        if (receivedResponse.ok) {
          const receivedData = await receivedResponse.json();
          const receivedRequestsWithDogs = await Promise.all(receivedData.map(async (request) => {
            const otherUserId = request.user1Id === parseInt(userId) ? request.user2Id : request.user1Id;
            if (!otherUserId) {
              console.warn('otherUserId is undefined or null for request:', request);
              return { ...request, dog: null };
            }
            const dogResponse = await fetch(`${BASE_URL}/api/dogs/users/${otherUserId}`, {
              headers: { 'ngrok-skip-browser-warning': 'true' },
            });
            if (dogResponse.ok) {
              const dogs = await dogResponse.json();
              return { ...request, dog: dogs[0] }; // Assuming each user has at least one dog and we take the first one
            } else {
              console.error(`Failed to fetch dog for user ${otherUserId}`);
              return { ...request, dog: null };
            }
          }));
          setReceivedRequests(receivedRequestsWithDogs);
        } else {
          throw new Error(`받은 매칭 요청 불러오기 실패: ${receivedResponse.status} ${receivedResponse.statusText}`);
        }

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
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('사용자 ID를 찾을 수 없습니다. 로그인해주세요.');
      return;
    }

    const toUserId = request.user1Id; // The sender of the received request

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
        const swipeResultText = await swipeResponse.text();
        try {
          const swipeResult = JSON.parse(swipeResultText);
          if (swipeResult && swipeResult.id) { // Match successful
            alert('매칭 성공! 채팅방이 생성되었습니다.');
            // Refresh received requests to remove the accepted one
            setReceivedRequests(prev => prev.filter(req => req.id !== request.id));
            // Optionally navigate to chat or update chat list
          } else {
            alert('스와이프가 완료되었습니다. 상대방이 수락하면 매칭됩니다.');
            setReceivedRequests(prev => prev.filter(req => req.id !== request.id));
          }
        } catch (jsonError) {
          if (swipeResultText.includes('스와이프가 완료되었습니다.')) {
            alert('스와이프가 완료되었습니다. 상대방이 수락하면 매칭됩니다.');
            setReceivedRequests(prev => prev.filter(req => req.id !== request.id));
          } else {
            throw new Error(`스와이프 응답 파싱 오류: ${jsonError.message} - ${swipeResultText}`);
          }
        }
      } else if (swipeResponse.status === 400) {
        const errorText = await swipeResponse.text();
        if (errorText.includes('이미 스와이프한 사용자입니다.')) {
          alert('이미 스와이프한 사용자입니다.');
        } else {
          throw new Error(`스와이프 실패: ${swipeResponse.status} ${swipeResponse.statusText} - ${errorText}`);
        }
      } else {
        const errorText = await swipeResponse.text();
        throw new Error(`스와이프 실패: ${swipeResponse.status} ${swipeResponse.statusText} - ${errorText}`);
      }
    } catch (error) {
      console.error('Error accepting match request:', error);
      alert(`매칭 요청 수락 중 오류 발생: ${error.message}`);
    }
  };

  const handleReject = async (request) => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('사용자 ID를 찾을 수 없습니다. 로그인해주세요.');
      return;
    }

    const matchId = request.id; // Assuming request.id is the matchId for the pending request

    try {
      const response = await fetch(`${BASE_URL}/api/matches/${matchId}/status?status=INACTIVE`, {
        method: 'PUT',
        headers: { 'ngrok-skip-browser-warning': 'true' },
      });
      if (response.ok) {
        alert('매칭 요청을 거절했습니다.');
        setReceivedRequests(prev => prev.filter(req => req.id !== request.id));
      } else {
        throw new Error(`매칭 요청 거절 실패: ${response.status} ${response.statusText}`);
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
          <p>표시할 매칭 요청이 없습니다.</p>
        ) : (
          dataToShow.map(request => {
            // '내가 보낸 요청' 탭에서는 상대방(receiver) 강아지 정보를,
            // '내가 받은 요청' 탭에서는 요청을 보낸(sender) 강아지 정보를 보여줍니다.
            const dogToShow = request.dog;

            // dogToShow 객체가 없는 경우 렌더링하지 않도록 방어 코드 추가
            if (!dogToShow) return null;

            return (
              <div key={request.id} className="match-request-item">
                <DogProfileCard dog={dogToShow} onClick={() => openModal(dogToShow)} />
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