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
        console.log(`Fetching sent requests from: ${BASE_URL}/api/matches/requests/sent/${userId}`);
        const sentResponse = await fetch(`${BASE_URL}/api/matches/requests/sent/${userId}`, {
          headers: { 'ngrok-skip-browser-warning': 'true' },
        });
        console.log('Sent Response OK:', sentResponse.ok);
        console.log('Sent Response Status:', sentResponse.status, sentResponse.statusText);
        if (sentResponse.ok) {
          const sentData = await sentResponse.json();
          console.log('Sent requests raw data:', sentData);
          const sentRequestsWithDogs = await Promise.all(sentData.map(async (request) => {
            const otherUserId = request.user1Id === parseInt(userId) ? request.user2Id : request.user1Id;
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
          console.log('Sent requests with dogs:', sentRequestsWithDogs);
          setSentRequests(sentRequestsWithDogs);
        } else {
          const errorText = await sentResponse.text();
          console.error(`보낸 매칭 요청 불러오기 실패: ${sentResponse.status} ${sentResponse.statusText} - ${errorText}`);
          throw new Error(`보낸 매칭 요청 불러오기 실패: ${sentResponse.status} ${sentResponse.statusText} - ${errorText}`);
        }

        // Fetch received requests
        console.log(`Fetching received requests from: ${BASE_URL}/api/matches/requests/received/${userId}`);
        const receivedResponse = await fetch(`${BASE_URL}/api/matches/requests/received/${userId}`, {
          headers: { 'ngrok-skip-browser-warning': 'true' },
        });
        console.log('Received Response OK:', receivedResponse.ok);
        console.log('Received Response Status:', receivedResponse.status, receivedResponse.statusText);
        if (receivedResponse.ok) {
          const receivedData = await receivedResponse.json();
          console.log('Received requests raw data:', receivedData);
          const receivedRequestsWithDogs = await Promise.all(receivedData.map(async (request) => {
            const otherUserId = request.user1Id === parseInt(userId) ? request.user2Id : request.user1Id;
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
          console.log('Received requests with dogs:', receivedRequestsWithDogs);
          setReceivedRequests(receivedRequestsWithDogs);
        } else {
          const errorText = await receivedResponse.text();
          console.error(`받은 매칭 요청 불러오기 실패: ${receivedResponse.status} ${receivedResponse.statusText} - ${errorText}`);
          throw new Error(`받은 매칭 요청 불러오기 실패: ${receivedResponse.status} ${receivedResponse.statusText} - ${errorText}`);
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

  const handleAccept = async (requestId) => {
    try {
      const response = await fetch(`${BASE_URL}/api/matches/requests/${requestId}/accept`, {
        method: 'PUT',
        headers: { 'ngrok-skip-browser-warning': 'true' },
      });
      if (response.ok) {
        alert('매칭 요청을 수락했습니다.');
        // 성공 후 받은 요청 목록을 새로고침하거나 UI에서 해당 항목을 제거하는 로직 추가
        setReceivedRequests(prev => prev.filter(req => req.id !== requestId));
      } else {
        throw new Error(`매칭 요청 수락 실패: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error accepting match request:', error);
      alert(`매칭 요청 수락 중 오류 발생: ${error.message}`);
    }
  };

  const handleReject = async (requestId) => {
    try {
      const response = await fetch(`${BASE_URL}/api/matches/requests/${requestId}/reject`, {
        method: 'PUT',
        headers: { 'ngrok-skip-browser-warning': 'true' },
      });
      if (response.ok) {
        alert('매칭 요청을 거절했습니다.');
        // 성공 후 받은 요청 목록을 새로고침하거나 UI에서 해당 항목을 제거하는 로직 추가
        setReceivedRequests(prev => prev.filter(req => req.id !== requestId));
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
  console.log('dataToShow:', dataToShow);
  console.log('activeTab:', activeTab);
  console.log('receivedRequests (after set):', receivedRequests);

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
                  <div className="match-request-actions blurred-buttons">
                    <button onClick={() => handleAccept(request.id)}>수락</button>
                    <button onClick={() => handleReject(request.id)}>거절</button>
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