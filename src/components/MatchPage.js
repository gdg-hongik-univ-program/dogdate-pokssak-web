import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import DogProfileCard from './DogprofileCard';
import './MatchPage.css';
import { BASE_URL } from '../config';

function MatchPage() {
  const { openModal } = useOutletContext();
  const navigate = useNavigate();
  const [characters, setCharacters] = useState([]); // 초기값을 빈 배열로 변경
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가
  const [error, setError] = useState(''); // 에러 상태 추가
  

  useEffect(() => {
    const fetchPotentialMatches = async () => {
      setIsLoading(true);
      setError('');
      const userId = localStorage.getItem('userId');

      if (!userId) {
        setError('사용자 ID를 찾을 수 없습니다. 로그인해주세요.');
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/api/users/${userId}/potential-matches`, {
          headers: {
            'ngrok-skip-browser-warning': 'true',
          },
        });

        if (response.ok) {
          const users = await response.json();
          const usersWithDogs = await Promise.all(users.map(async (user) => {
            const dogResponse = await fetch(`${BASE_URL}/api/dogs/users/${user.id}`, {
              headers: { 'ngrok-skip-browser-warning': 'true' },
            });
            if (dogResponse.ok) {
              const dogs = await dogResponse.json();
              return { ...user, dog: dogs[0] }; // Assuming each user has at least one dog and we take the first one
            } else {
              console.error(`Failed to fetch dog for user ${user.id}`);
              return { ...user, dog: null };
            }
          }));
          setCharacters(usersWithDogs); // API에서 받아온 데이터로 설정
        } else {
          const errorText = await response.text();
          throw new Error(`매치 데이터 불러오기 실패: ${response.status} ${response.statusText} - ${errorText}`);
        }
      } catch (err) {
        setError(err.message);
        console.error('Fetch potential matches error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    
  fetchPotentialMatches();
  }, []); // userId가 변경될 때마다 다시 불러오도록 의존성 배열에 추가

  const handleAction = async (action) => { // async 키워드 추가
    if (characters.length === 0) return; // 캐릭터가 없으면 아무것도 하지 않음

    const character = characters[currentIndex];
    const userId = localStorage.getItem('userId');

    if (!userId) {
      alert('사용자 ID를 찾을 수 없습니다. 로그인해주세요.');
      navigate('/login');
      return;
    }

    if (action === 'Like') {
      try {
        const response = await fetch(`${BASE_URL}/api/swipes/like/${userId}/${character.id}`, {
          method: 'POST',
          headers: {
            'ngrok-skip-browser-warning': 'true',
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          console.log(`Liked ${character.name}`);
        } else {
          const errorText = await response.text();
          console.error(`Failed to like ${character.name}: ${response.status} ${response.statusText} - ${errorText}`);
          alert(`좋아요 실패: ${errorText}`);
        }
      } catch (error) {
        console.error('Like API call error:', error);
        alert('좋아요 처리 중 문제가 발생했습니다.');
      }
    }

    // 다음 사용자로 이동 (Skip 또는 Like 후)
    const nextIndex = (currentIndex + 1) % characters.length;
    setCurrentIndex(nextIndex);
  };

  const handleMatchClick = async () => {
    if (characters.length === 0) return; // 캐릭터가 없으면 아무것도 하지 않음

    const character = characters[currentIndex];
    const userId = localStorage.getItem('userId'); // 로컬 스토리지에서 userId 가져오기

    if (!userId) {
      alert('사용자 ID를 찾을 수 없습니다. 로그인해주세요.');
      navigate('/login');
      return;
    }

    try {
      const swipeResponse = await fetch(`${BASE_URL}/api/swipes/users/${userId}`, {
        method: 'POST',
        headers: {
          'ngrok-skip-browser-warning': 'true',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ toUserId: character.id }),
      });

      if (swipeResponse.ok) {
        const swipeResultText = await swipeResponse.text();
        
        try {
          const swipeResult = JSON.parse(swipeResultText);
          // If a match object is returned, it means a successful match
          if (swipeResult && swipeResult.id) { // Assuming swipeResult.id is the matchId
            const matchId = swipeResult.id;
            console.log('매치 성공! 매치 ID:', matchId);

            // Get the chatroom ID based on the matchId
            const chatroomResponse = await fetch(`${BASE_URL}/api/chat/room/match/${matchId}`, {
              headers: {
                'ngrok-skip-browser-warning': 'true',
              },
            });

            if (chatroomResponse.ok) {
              const chatroomData = await chatroomResponse.json();
              if (chatroomData && chatroomData.id) {
                navigate(`/app/chat/${chatroomData.id}`);
              } else {
                alert('채팅방 정보를 가져오는 데 실패했습니다.');
              }
            } else {
              const errorText = await chatroomResponse.text();
              throw new Error(`채팅방 조회 실패: ${chatroomResponse.status} ${chatroomResponse.statusText} - ${errorText}`);
            }
          } else {
            // No match object returned, meaning swipe completed but no immediate match
            console.log('매칭 신청이 완료되었습니다. 상대방이 수락하면 채팅방이 생성됩니다.');
            alert('매칭 신청이 완료되었습니다. 상대방이 수락하면 채팅방이 생성됩니다.');
          }
        } catch (jsonError) {
          // If response is not JSON, it's likely "스와이프가 완료되었습니다."
          if (swipeResultText.includes('스와이프가 완료되었습니다.')) {
            console.log('매칭 신청이 완료되었습니다. 상대방이 수락하면 채팅방이 생성됩니다.');
            alert('매칭 신청이 완료되었습니다. 상대방이 수락하면 채팅방이 생성됩니다.');
          } else {
            throw new Error(`스와이프 응답 파싱 오류: ${jsonError.message} - ${swipeResultText}`);
          }
        }
      } else if (swipeResponse.status === 400) {
        const errorText = await swipeResponse.text();
        if (errorText.includes('이미 스와이프한 사용자입니다.')) {
          alert('이미 매치 신청을 보냈거나 매칭된 상대입니다.');
        } else {
          throw new Error(`스와이프 실패: ${swipeResponse.status} ${swipeResponse.statusText} - ${errorText}`);
        }
      } else {
        const errorText = await swipeResponse.text();
        throw new Error(`스와이프 실패: ${swipeResponse.status} ${swipeResponse.statusText} - ${errorText}`);
      }
    } catch (error) {
      console.error('매치 처리 중 오류 발생:', error);
      alert(`매치 처리 중 오류 발생: ${error.message}`);
    }
  };

  // 로딩 및 에러 상태 처리
  if (isLoading) {
    return <div className="match-page-container"><p>매치 데이터를 불러오는 중입니다...</p></div>;
  }

  if (error) {
    return <div className="match-page-container"><p>오류: {error}</p></div>;
  }

  // 캐릭터가 없을 경우 메시지 표시
  if (characters.length === 0) {
    return (
      <div className="match-page-container">
        <p>더 이상 매치할 강아지가 없습니다.</p>
      </div>
    );
  }

  const currentCard = characters[currentIndex];

  return (
    <div className='match-page-container'>
      <div className='card-container'>
        {currentCard ? (
          <div className="match-page-card-wrapper" onClick={() => openModal(currentCard)}>
            <DogProfileCard dog={currentCard.dog} />
          </div>
        ) : (
          <div className="no-more-cards">더 이상 카드가 없습니다.</div>
        )}
      </div>
      <div className='buttons'>
        <button onClick={() => handleAction('Skip')}>Skip</button>
        <button onClick={handleMatchClick}>Match</button>
        <button onClick={() => handleAction('Like')}>Like</button>
      </div>
    </div>
  );
}

export default MatchPage;
