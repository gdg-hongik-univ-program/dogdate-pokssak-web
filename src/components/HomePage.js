// src/components/HomePage.js
import React, { useState, useEffect } from 'react';
import './HomePage.css'; // 새로 만든 CSS 파일을 import
import ProfileModal from './ProfileModal'; // 모달 컴포넌트 import
import DogProfileCard from './DogprofileCard'; // DogProfileCard 컴포넌트 import

// API 호출을 위한 가짜 데이터 (실제로는 API로 받아와야 함)
const fakeMyDog = {
  id: 0,
  name: '몽실이',
  breed: '비숑 프리제',
  age: 3,
  gender: '여아',
  city: '서울',
  district: '강남구',
  bio: '우리 몽실이는 애교가 많고 사람을 좋아해요! 같이 산책할 친구를 찾아요.',
  imageUrl: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?q=80&w=800', // 새로운 강아지 사진
};



const fakePopularDogs = [
  { id: 1, name: '코코', breed: '말티즈', age: 2, gender: '여아', city: '서울', district: '마포구', bio: '에너지가 넘치는 코코입니다! 공놀이를 제일 좋아해요.', imageUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=800', likes: 120 },
  { id: 2, name: '레오', breed: '포메라니안', age: 3, gender: '남아', city: '경기', district: '성남시', bio: '작지만 용감한 레오! 다른 강아지 친구들과 어울리는 걸 좋아해요.', imageUrl: 'https://images.unsplash.com/photo-1598875184988-5e67b1a874b8?q=80&w=800', likes: 110 },
  { id: 3, name: '보리', breed: '시츄', age: 4, gender: '여아', city: '인천', district: '연수구', bio: '순하고 낮잠 자는 걸 좋아하는 보리 공주님이에요.', imageUrl: 'https://images.unsplash.com/photo-1548681528-6a5c45b66b42?q=80&w=800', likes: 100 },
  { id: 4, name: '초코', breed: '요크셔테리어', age: 5, gender: '남아', city: '부산', district: '해운대구', bio: '간식이라면 뭐든지 하는 먹보랍니다.', imageUrl: 'https://images.unsplash.com/photo-1554196409-c44b5b7895f3?q=80&w=800', likes: 90 },
  { id: 5, name: '마루', breed: '닥스훈트', age: 6, gender: '남아', city: '대구', district: '수성구', bio: '짧은 다리가 매력적인 마루입니다. 산책 메이트 구해요!', imageUrl: 'https://images.unsplash.com/photo-1529429617124-95b109e86bb8?q=80&w=800', likes: 80 },
];

const fakeNearbyDogs = [
  { id: 6, name: '해피', breed: '비글', age: 1, gender: '남아', city: '서울', district: '용산구', bio: '지치지 않는 에너자이저 해피! 같이 뛰어놀아요!', imageUrl: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=800', distance: '1km' },
  { id: 7, name: '두부', breed: '프렌치 불독', age: 2, gender: '여아', city: '서울', district: '성동구', bio: '먹는 것과 자는 것을 가장 좋아하는 순둥이 두부.', imageUrl: 'https://images.unsplash.com/photo-1597633425046-08f5110420b5?q=80&w=800', distance: '2km' },
  { id: 8, name: '콩이', breed: '퍼그', age: 3, gender: '여아', city: '서울', district: '광진구', bio: '주름진 얼굴이 매력적인 콩이에요. 느긋한 산책을 즐겨요.', imageUrl: 'https://images.unsplash.com/photo-1534351450181-ea6f7d45e388?q=80&w=800', distance: '3km' },
  { id: 9, name: '별이', breed: '치와와', age: 4, gender: '여아', city: '서울', district: '강동구', bio: '작은 몸집에 큰 용기를 가졌어요. 주인 껌딱지랍니다.', imageUrl: 'https://images.unsplash.com/photo-1601979031425-12f4a45978c6?q=80&w=800', distance: '4km' },
  { id: 10, name: '밤비', breed: '푸들', age: 5, gender: '남아', city: '서울', district: '송파구', bio: '똑똑하고 훈련을 잘 받아요. 새로운 개인기를 배우고 싶어요!', imageUrl: 'https://images.unsplash.com/photo-1585679104874-83d49a905a8e?q=80&w=800', distance: '5km' },
];

function HomePage() {
  const [myDog, setMyDog] = useState(null);
  const [popularDogs, setPopularDogs] = useState([]);
  const [nearbyDogs, setNearbyDogs] = useState([]);
  const [error, setError] = useState('');
  const [selectedDog, setSelectedDog] = useState(null); // 모달에 표시할 강아지 정보

  // 모달 열기/닫기 함수
  const openModal = (dog) => {
    setSelectedDog(dog);
  };

  const closeModal = () => {
    setSelectedDog(null);
  };

  const handleSaveMyDog = (updatedDog) => {
    console.log("Saving dog:", updatedDog);
    // 실제 앱에서는 여기서 API를 호출하여 백엔드에 정보를 저장해야 합니다.
    // 지금은 프론트엔드의 상태만 업데이트합니다.
    setMyDog(updatedDog);
    // 사용자에게 저장되었음을 알립니다.
    alert("프로필이 저장되었습니다!");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setMyDog(fakeMyDog);
        setPopularDogs(fakePopularDogs);
        setNearbyDogs(fakeNearbyDogs);
      } catch (err) {
        setError(err.message);
        console.error('Fetch error:', err);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <div className="home-container"><p>오류: {error}</p></div>;
  }

  if (!myDog || popularDogs.length === 0 || nearbyDogs.length === 0) {
    return <div className="home-container"><p>데이터를 불러오는 중입니다...</p></div>;
  }

  return (

    <div className="home-container">
      {/* 내 강아지 프로필 섹션 */}
      <section className="my-dog-section">
        <h2 className="section-title">내 강아지</h2>
        <div className="my-dog-profile-wrapper">
          <DogProfileCard 
            dog={myDog} 
            isEditable={true} 
            onSave={handleSaveMyDog}
            onClick={() => openModal(myDog)} 
          />
        </div>
      </section>
      <div className="hall-of-fame-section">
        <h2 className="section-title">멍에의 전당</h2>
      </div>

      {/* 위치 가까운 멍예의 전당 */}
      <section className="hall-of-fame-section">
        <h2 className="section-title">위치순</h2>
        <div className="dog-list-scroll-container">
          <div className="dog-list">
            {nearbyDogs.map(dog => (
              <div key={dog.id} className="dog-card" onClick={() => openModal(dog)}>
                <img src={dog.imageUrl} alt={dog.name} className="dog-card-background-image" />
                <div className="dog-card-content">
                  <h3 className="dog-name">{dog.name}</h3>
                  <p className="dog-details">{dog.breed} / {dog.age}살</p>
                  <p className="dog-extra-info">{dog.distance} 이내</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 하트 많이 받은 멍예의 전당 */}
      <section className="hall-of-fame-section">
        <h2 className="section-title">하트순</h2>
        <div className="dog-list-scroll-container">
          <div className="dog-list">
            {popularDogs.map(dog => (
              <div key={dog.id} className="dog-card" onClick={() => openModal(dog)}>
                <img src={dog.imageUrl} alt={dog.name} className="dog-card-background-image" />
                <div className="dog-card-content">
                  <h3 className="dog-name">{dog.name}</h3>
                  <p className="dog-details">{dog.breed} / {dog.age}살</p>
                  <p className="dog-extra-info">하트: {dog.likes}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 프로필 모달 */}
      <ProfileModal dog={selectedDog} onClose={closeModal} />
    </div>
  );
}

export default HomePage;