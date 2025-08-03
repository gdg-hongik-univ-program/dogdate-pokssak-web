import React, { useState } from 'react';
import DogProfileCard from './DogprofileCard';
import './LikesPage.css';

const LikesPage = () => {
  const [activeTab, setActiveTab] = useState('sent');

  // 목업 데이터
  const sentLikes = [
    { id: 1, name: '보리', age: 3, breed: '골든 리트리버', gender: '여아', city: '서울', district: '강남구', imageUrl: 'images/image.png', bio: '산책하고 친구 만나는 걸 좋아해요!' },
    { id: 2, name: '콩이', age: 2, breed: '푸들', gender: '남아', city: '서울', district: '마포구', imageUrl: 'images/image.png', bio: '애교 많고 사람을 잘 따라요.' },
    { id: 3, name: '초코', age: 5, breed: '치와와', gender: '남아', city: '경기', district: '분당구', imageUrl: 'images/image.png', bio: '작지만 용감하답니다!' },
    { id: 4, name: '두부', age: 1, breed: '비숑 프리제', gender: '여아', city: '서울', district: '서초구', imageUrl: 'images/image.png', bio: '솜사탕 같은 매력의 소유자!' },
    { id: 5, name: '마루', age: 4, breed: '시바견', gender: '남아', city: '인천', district: '연수구', imageUrl: 'images/image.png', bio: '독립심 강하지만 마음은 따뜻해요.' },
    { id: 6, name: '코코', age: 2, breed: '포메라니안', gender: '여아', city: '서울', district: '송파구', imageUrl: 'images/image.png', bio: '활발하고 에너지 넘쳐요!' },
  ];

  const receivedLikes = [
    { id: 7, name: '레오', age: 4, breed: '래브라도 리트리버', gender: '남아', city: '서울', district: '용산구', imageUrl: 'images/image.png', bio: '수영을 즐기는 물트리버!' },
    { id: 8, name: '베리', age: 2, breed: '닥스훈트', gender: '여아', city: '경기', district: '고양시', imageUrl: 'images/image.png', bio: '짧은 다리의 매력에 빠져보세요.' },
    { id: 9, name: '짱아', age: 6, breed: '말티즈', gender: '여아', city: '서울', district: '강동구', imageUrl: 'images/image.png', bio: '참하고 조용한 성격이에요.' },
    { id: 10, name: '뭉치', age: 3, breed: '진돗개', gender: '남아', city: '부산', district: '해운대구', imageUrl: 'images/image.png', bio: '듬직하고 충성심 강한 친구.' },
    { id: 11, name: '사랑', age: 5, breed: '요크셔테리어', gender: '여아', city: '대구', district: '수성구', imageUrl: 'images/image.png', bio: '작고 소중한 나의 보물.' },
    { id: 12, name: '밤이', age: 1, breed: '프렌치 불독', gender: '남아', city: '서울', district: '중구', imageUrl: 'images/image.png', bio: '장난기 가득한 개구쟁이!' },
  ];

  const dataToShow = activeTab === 'sent' ? sentLikes : receivedLikes;

  return (
    <div className="likes-page-container">
      <div className="likes-page-toggle">
        <button
          className={`toggle-btn ${activeTab === 'sent' ? 'active' : ''}`}
          onClick={() => setActiveTab('sent')}
        >
          내가 좋아요 한 사람
        </button>
        <button
          className={`toggle-btn ${activeTab === 'received' ? 'active' : ''}`}
          onClick={() => setActiveTab('received')}
        >
          나에게 좋아요 한 사람
        </button>
      </div>
      <div className="dog-profile-grid">
        {dataToShow.map(dog => (
          <DogProfileCard key={dog.id} dog={dog} />
        ))}
      </div>
    </div>
  );
};

export default LikesPage;