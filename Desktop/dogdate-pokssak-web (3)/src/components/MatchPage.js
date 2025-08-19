import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom'; // useOutletContext 임포트
import DogProfileCard from './DogprofileCard';
import './MatchPage.css';

// 목업 데이터
const initialDb = [
  {
    id: 101,
    name: '활발한 보리',
    age: 3,
    breed: '골든 리트리버',
    gender: '여아',
    bio: '산책하고 친구 만나는 걸 좋아해요!',
    imageUrl: '/images/image.png'
  },
  {
    id: 102,
    name: '애교쟁이 콩이',
    age: 2,
    breed: '푸들',
    gender: '남아',
    bio: '애교 많고 사람을 잘 따라요.',
    imageUrl: '/images/image.png'
  },
  {
    id: 103,
    name: '용감한 초코',
    age: 5,
    breed: '치와와',
    gender: '남아',
    bio: '작지만 용감하답니다!',
    imageUrl: '/images/image.png'
  },
  {
    id: 104,
    name: '솜사탕 두부',
    age: 1,
    breed: '비숑 프리제',
    gender: '여아',
    bio: '솜사탕 같은 매력의 소유자!',
    imageUrl: '/images/image.png'
  },
  {
    id: 105,
    name: '시크한 마루',
    age: 4,
    breed: '시바견',
    gender: '남아',
    bio: '독립심 강하지만 마음은 따뜻해요.',
    imageUrl: '/images/image.png'
  }
];

function MatchPage() {
  const { openModal } = useOutletContext(); // MainLayout에서 openModal 함수를 가져옴
  const [characters, setCharacters] = useState(initialDb);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleAction = (action) => {
    const character = characters[currentIndex];
    console.log(`${action} on ${character.name}`);

    const nextIndex = (currentIndex + 1) % characters.length;
    setCurrentIndex(nextIndex);
  };

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
        <button>Chat</button>
        <button onClick={() => handleAction('Like')}>Like</button>
      </div>
    </div>
  );
}

export default MatchPage;
