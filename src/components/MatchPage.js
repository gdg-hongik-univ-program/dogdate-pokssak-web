import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import DogProfileCard from './DogprofileCard';
import './MatchPage.css';
import { BASE_URL } from '../config';

function MatchPage() {
  const { openModal } = useOutletContext();
  const navigate = useNavigate();
  const [characters, setCharacters] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFinished, setIsFinished] = useState(false);

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
              return { ...user, dog: { ...dogs[0], likes: 0 } }; // Initialize likes
            } else {
              console.error(`Failed to fetch dog for user ${user.id}`);
              return { ...user, dog: null };
            }
          }));
          setCharacters(usersWithDogs);
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
  }, []);

  const advanceCard = () => {
    if (currentIndex >= characters.length - 1) {
      setIsFinished(true);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleSkip = () => {
    advanceCard();
  };

  const handleLike = async () => {
    if (characters.length === 0) return;
    const character = characters[currentIndex];
    const userId = localStorage.getItem('userId');

    if (!userId) {
      alert('사용자 ID를 찾을 수 없습니다. 로그인해주세요.');
      navigate('/login');
      return;
    }

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
        const updatedCharacters = [...characters];
        const currentDog = updatedCharacters[currentIndex].dog;
        currentDog.likes = (currentDog.likes || 0) + 1;
        setCharacters(updatedCharacters);
      } else {
        const errorText = await response.text();
        console.error(`Failed to like ${character.name}: ${response.status} ${response.statusText} - ${errorText}`);
        alert(`좋아요 실패: ${errorText}`);
      }
    } catch (error) {
      console.error('Like API call error:', error);
      alert('좋아요 처리 중 문제가 발생했습니다.');
    }
  };

  const handleMatchClick = async () => {
    if (characters.length === 0) return;
    const character = characters[currentIndex];
    const userId = localStorage.getItem('userId');

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
          if (swipeResult && swipeResult.id) {
            const matchId = swipeResult.id;
            console.log('매치 성공! 매치 ID:', matchId);
            const chatroomResponse = await fetch(`${BASE_URL}/api/chat/room/match/${matchId}`, {
              headers: { 'ngrok-skip-browser-warning': 'true' },
            });
            if (chatroomResponse.ok) {
              const chatroomData = await chatroomResponse.json();
              if (chatroomData && chatroomData.id) {
                navigate(`/app/chat/${chatroomData.id}`);
              }
            } else {
              alert('채팅방 정보를 가져오는 데 실패했습니다.');
            }
          } else {
            alert('매칭 신청이 완료되었습니다. 상대방이 수락하면 채팅방이 생성됩니다.');
          }
        } catch (jsonError) {
          if (swipeResultText.includes('스와이프가 완료되었습니다.')) {
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
    advanceCard();
  };

  if (isLoading) {
    return <div className="match-page-container"><p>매치 데이터를 불러오는 중입니다...</p></div>;
  }

  if (error) {
    return <div className="match-page-container"><p>오류: {error}</p></div>;
  }

  if (isFinished || characters.length === 0) {
    return (
      <div className="match-page-container">
        <p>표시할 강아지가 없습니다.</p>
      </div>
    );
  }

  const currentCard = characters[currentIndex];

  return (
    <div className='match-page-container'>
      <div className='card-container'>
        {currentCard && currentCard.dog ? (
          <div className="match-page-card-wrapper" onClick={() => openModal(currentCard)}>
            <DogProfileCard dog={currentCard.dog} />
          </div>
        ) : (
          <div className="no-more-cards">표시할 강아지가 없습니다.</div>
        )}
      </div>
      <div className='buttons'>
        <button onClick={handleSkip}>Skip</button>
        <button onClick={handleMatchClick}>Match</button>
        <button onClick={handleLike}>Like</button>
      </div>
    </div>
  );
}

export default MatchPage;
