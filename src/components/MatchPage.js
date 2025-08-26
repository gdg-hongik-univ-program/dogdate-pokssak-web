import React, { useState, useEffect, useRef } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { FaHeart, FaTimes, FaBolt } from 'react-icons/fa';
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
  const cardRef = useRef(null);
  const [transformStyle, setTransformStyle] = useState({});
  const userId = localStorage.getItem('userId'); // Get userId from localStorage
  console.log('MatchPage: Initial userId from localStorage:', userId); // Added log

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
          console.log('MatchPage: Original potential users:', users); // Added log

          // Fetch chatrooms to identify users already chatting with
          const chatroomsResponse = await fetch(`${BASE_URL}/api/chat/users/${userId}/chatrooms`, {
            headers: { 'ngrok-skip-browser-warning': 'true' },
          });
          const chatroomData = chatroomsResponse.ok ? await chatroomsResponse.json() : [];
          console.log('MatchPage: Chatrooms data:', chatroomData); // Added log

          // Fetch matches to get user IDs from chatrooms
          const matchesResponse = await fetch(`${BASE_URL}/api/matches/users/${userId}`, {
            headers: { 'ngrok-skip-browser-warning': 'true' },
          });
          const matches = matchesResponse.ok ? await matchesResponse.json() : [];
          console.log('MatchPage: Matches data:', matches); // Added log

          const chattingUserIds = new Set();
          chatroomData.forEach(room => {
            const correspondingMatch = matches.find(match => match.id === room.matchId);
            if (correspondingMatch) {
              const otherUserId = 
                correspondingMatch.user1Id === parseInt(userId) 
                  ? correspondingMatch.user2Id 
                  : correspondingMatch.user1Id;
              chattingUserIds.add(otherUserId);
            }
          });
          console.log('MatchPage: Chatting user IDs:', chattingUserIds); // Added log

          // Filter out users who are already chatting with the current user
          const filteredUsers = users.filter(user => !chattingUserIds.has(user.id));
          console.log('MatchPage: Filtered potential users (after removing chatting users):', filteredUsers); // Added log

          const usersWithDogs = await Promise.all(filteredUsers.map(async (user) => {
            console.log(`MatchPage: Fetching dog for user ID: ${user.id}`); // Added log
            const dogResponse = await fetch(`${BASE_URL}/api/dogs/users/${user.id}`, {
              headers: { 'ngrok-skip-browser-warning': 'true' },
            });
            console.log(`MatchPage: Dog response for user ${user.id} OK: ${dogResponse.ok}`); // Added log
            if (dogResponse.ok) {
              const dogs = await dogResponse.json();
              console.log(`MatchPage: Dogs data for user ${user.id}:`, dogs); // Added log
              // API에서 description 필드를 bio로 매핑
              const dogWithBio = dogs[0] ? {
                ...dogs[0],
                bio: dogs[0].description || dogs[0].bio // description을 bio로 매핑
              } : null;
              // user 객체에 name 속성을 명시적으로 추가합니다. (nickname이 없을 경우 대비)
              return { ...user, dog: dogWithBio, name: user.nickname || user.username || user.name || `User ${user.id}` }; // Add name property, trying multiple properties for name
            } else {
              console.error(`Failed to fetch dog for user ${user.id}: ${dogResponse.status} ${dogResponse.statusText}`); // Modified error log
              return { ...user, dog: null, name: user.nickname || `User ${user.id}` };
            }
          }));
          console.log('Users with dogs before filtering (for dog data):', usersWithDogs); // Log usersWithDogs
          setCharacters(usersWithDogs.filter(u => u.dog)); // 강아지 정보가 있는 유저만 필터링
          console.log('Characters after filtering (for dog data):', usersWithDogs.filter(u => u.dog)); // Log final 
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

  const goToNextCard = () => {
    // 마지막 카드인지 확인합니다.
    if (currentIndex >= characters.length - 1) {
        // 마지막 카드 이후에는 인덱스를 증가시켜 "더 이상 카드가 없습니다" 화면이 나오게 합니다.
        setCurrentIndex(prevIndex => prevIndex + 1);
        return;
    }

    // 카드 넘기는 애니메이션 적용
    setTransformStyle({
      transform: `translateX(${Math.random() > 0.5 ? '' : '-'}1000px) rotate(${Math.random() * 30 - 15}deg)`,
      transition: 'transform 0.6s ease-out',
      opacity: 0
    });

    // 애니메이션이 끝난 후 다음 카드로 인덱스 변경 및 스타일 초기화
    setTimeout(() => {
      setCurrentIndex(prevIndex => prevIndex + 1);
      setTransformStyle({
        transform: 'translateX(0) rotate(0deg)',
        transition: 'none',
        opacity: 1
      });
    }, 600);
  };

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    const rotateX = (mouseY / (height / 2)) * -10;
    const rotateY = (mouseX / (width / 2)) * 10;

    setTransformStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`,
      transition: 'none',
    });
  };

  const handleMouseLeave = () => {
    setTransformStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)',
      transition: 'transform 0.5s ease-in-out',
    });
  };

  const handleAction = (action) => {
    if (currentIndex >= characters.length) return;

    const character = characters[currentIndex];
    const userId = localStorage.getItem('userId');

    if (!userId) {
      alert('사용자 ID를 찾을 수 없습니다. 로그인해주세요.');
      navigate('/login');
      return;
    }

    if (action === 'Like') {
      // "Fire-and-forget": 요청을 보내고 응답을 기다리지 않음
      fetch(`${BASE_URL}/api/swipes/like/${userId}/${character.id}`, {
        method: 'POST',
        headers: {
          'ngrok-skip-browser-warning': 'true',
          'Content-Type': 'application/json',
        },
      }).catch(error => {
        // UI를 막지 않고 콘솔에만 에러를 기록
        console.error('Like API call error:', error);
      });
      // 좋아요는 카드를 넘기지 않음
      console.log(`Liked ${character.name}`);
    } else if (action === 'Skip') {
      console.log(`Skipping ${character.name}`);
      goToNextCard();
    }
  };

  const handleMatchClick = async () => {
    if (currentIndex >= characters.length) return;

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

      const swipeResultText = await swipeResponse.text();

      if (swipeResponse.ok) {
        try {
          const swipeResult = JSON.parse(swipeResultText);
          if (swipeResult && swipeResult.id) {
            const matchId = swipeResult.id;
            alert('매치 성공! 채팅방으로 이동합니다.');
            
            const chatroomResponse = await fetch(`${BASE_URL}/api/chat/room/match/${matchId}`, {
              headers: { 'ngrok-skip-browser-warning': 'true' },
            });

            if (chatroomResponse.ok) {
              const chatroomData = await chatroomResponse.json();
              if (chatroomData && chatroomData.id) {
                navigate(`/app/chat/${chatroomData.id}`);
              } else {
                alert('채팅방 정보를 가져오는 데 실패했습니다.');
                goToNextCard();
              }
            } else {
              const errorText = await chatroomResponse.text();
              throw new Error(`채팅방 조회 실패: ${errorText}`);
            }
          } else {
            alert('매칭 신청이 완료되었습니다. 상대방이 수락하면 채팅방이 생성됩니다.');
            goToNextCard();
          }
        } catch (jsonError) {
            alert('매칭 신청이 완료되었습니다. 상대방이 수락하면 채팅방이 생성됩니다.');
            goToNextCard();
        }
      } else if (swipeResponse.status === 400 && swipeResultText.includes('이미 스와이프한 사용자입니다.')) {
        alert('이미 매치 신청을 보냈거나 매칭된 상대입니다.');
        goToNextCard();
      } else {
        throw new Error(`스와이프 실패: ${swipeResultText}`);
      }
    } catch (error) {
      console.error('매치 처리 중 오류 발생:', error);
      alert(`매치 처리 중 오류 발생: ${error.message}`);
    }
  };

  if (isLoading) {
    return <div className="match-page-container"><p>매치 데이터를 불러오는 중입니다...</p></div>;
  }

  if (error) {
    return <div className="match-page-container"><p>오류: {error}</p></div>;
  }

  if (currentIndex >= characters.length) {
    return (
      <div className="match-page-container">
        <p>더 이상 매치할 강아지가 없습니다.</p>
      </div>
    );
  }

  const currentCard = characters[currentIndex];
  console.log('MatchPage: currentCard being rendered:', currentCard); // Added log
  console.log('MatchPage: currentCard being rendered:', currentCard); // Added log

  return (
    <div className='match-page-container'>
      <div className='card-container'>
        <div 
          className="match-page-card-wrapper"
          onClick={() => openModal({
            ...currentCard.dog,
            city: currentCard.city,
            district: currentCard.district,
            // 강아지 정보와 사용자 정보를 결합
            ownerName: currentCard.name
          })}
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={transformStyle}
        >
          <DogProfileCard dog={currentCard.dog} />
        </div>
      </div>
      <div className='buttons'>
        <button className="action-button dislike" onClick={() => handleAction('Skip')}><FaTimes /><span className="button-text">건너뛰기</span></button>
        <button className="action-button match" onClick={handleMatchClick}><FaBolt /><span className="button-text">매치</span></button>
        <button className="action-button like" onClick={() => handleAction('Like')}><FaHeart /><span className="button-text">좋아요</span></button>
      </div>
    </div>
  );
}
export default MatchPage;
