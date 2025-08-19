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
          const data = await response.json();
          setCharacters(data); // API에서 받아온 데이터로 설정
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

    const currentMatchId = characters[currentIndex].id; // 현재 카드의 ID를 matchId로 사용
    const userId = localStorage.getItem('userId'); // 로컬 스토리지에서 userId 가져오기

    try {
      // 매치 기반 채팅방 생성 시도 (매치 신청으로 간주)
      const response = await fetch(`${BASE_URL}/api/chat/room/match/${currentMatchId}`, {
        method: 'POST',
        headers: {
          'ngrok-skip-browser-warning': 'true',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: userId }) // userId를 body에 포함 (API 명세에 따라)
      });

      if (response.ok) {
        console.log('매치 신청 및 채팅방 생성 성공');
        alert('매치 신청이 완료되었습니다.');
      } else {
        const errorText = await response.text();
        throw new Error(`매치 신청 실패: ${response.status} ${response.statusText} - ${errorText}`);
      }

    } catch (error) {
      console.error('매치 신청 처리 중 오류 발생:', error);
      alert(`매치 신청 처리 중 오류 발생: ${error.message}`);
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
            <DogProfileCard dog={currentCard} />
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
