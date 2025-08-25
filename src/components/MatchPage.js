import React, { useState, useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FaHeart, FaTimes, FaBolt } from 'react-icons/fa';
import DogProfileCard from './DogprofileCard';
import './MatchPage.css';


function MatchPage() {
  const { openModal } = useOutletContext();
  const [characters, setCharacters] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const cardRef = useRef(null);
  const [transformStyle, setTransformStyle] = useState({});

  useEffect(() => {
    setIsLoading(true);
    // 실제 백엔드 API를 연결해야 합니다.
    setTimeout(() => {
      setCharacters([]);
      setIsLoading(false);
    }, 500); // 0.5초 로딩 시뮬레이션
  }, []);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const mouseX = e.clientX - (left + width / 2);
    const mouseY = e.clientY - (top + height / 2);
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

  // 다음 카드로 넘어가는 함수
  const goToNextCard = () => {
    setTransformStyle({ // 카드가 날아가는 애니메이션 효과
      transform: `translateX(${Math.random() > 0.5 ? '' : '-'}1000px) rotate(${Math.random() * 30 - 15}deg)`,
      transition: 'transform 0.6s ease-out',
      opacity: 0
    });

    setTimeout(() => {
      setCurrentIndex(prevIndex => prevIndex + 1);
      // 카드가 제자리로 돌아오는 효과
      setTransformStyle({ 
        transform: 'translateX(0) rotate(0deg)',
        transition: 'none',
        opacity: 1
      });
    }, 600);
  };

  const handleAction = (action) => {
    if (currentIndex >= characters.length) return;
    const character = characters[currentIndex];
    alert(`${character.dog.name}에게 ${action} 보냈습니다. (데모)`);
    goToNextCard();
  };

  const handleMatchClick = () => {
    if (currentIndex >= characters.length) return;
    const character = characters[currentIndex];
    alert(`${character.dog.name}와 매치되었습니다! (데모)`);
    goToNextCard();
  };

  if (isLoading) {
    return <div className="match-page-container"><p>매치 데이터를 불러오는 중입니다...</p></div>;
  }

  if (characters.length === 0 || currentIndex >= characters.length) {
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
        <div 
          className="match-page-card-wrapper"
          onClick={() => openModal(currentCard)}
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={transformStyle}
        >
          <DogProfileCard dog={currentCard.dog} />
        </div>
      </div>
      <div className='buttons'>
        <button className="action-button dislike" onClick={() => handleAction('건너뛰기')}><FaTimes /><span className="button-text">건너뛰기</span></button>
        <button className="action-button match" onClick={handleMatchClick}><FaBolt /><span className="button-text">매치</span></button>
        <button className="action-button like" onClick={() => handleAction('좋아요')}><FaHeart /><span className="button-text">좋아요</span></button>
      </div>
    </div>
  );
}

export default MatchPage;
