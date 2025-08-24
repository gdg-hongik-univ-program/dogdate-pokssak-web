import React, { useState, useEffect, useRef } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom'; // useNavigate 임포트
import './HomePage.css';
import { BASE_URL } from '../config';
import DogProfileCard from './DogprofileCard';
import TiltableDogCard from './TiltableDogCard';
import MyDogProfileCard from './MyDogProfileCard';
import { FiSettings } from "react-icons/fi";
import { HiMapPin, HiHeart, HiTrophy, HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { FaCrown } from "react-icons/fa";

// API 호출을 위한 가짜 데이터 (더미 데이터는 이제 사용하지 않음)

function HomePage() {
  const { openModal } = useOutletContext(); // MainLayout에서 openModal 함수를 가져옴
  const navigate = useNavigate(); // useNavigate 훅 사용
  const [myDog, setMyDog] = useState(null);
  const [popularDogs, setPopularDogs] = useState([]);
  const [nearbyDogs, setNearbyDogs] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가

  // 스크롤 컨테이너 참조
  const nearbyScrollRef = useRef(null);
  const popularScrollRef = useRef(null);

  // 스크롤 함수들
  const scrollLeft = (ref) => {
    if (ref.current) {
      ref.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = (ref) => {
    if (ref.current) {
      ref.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  const handleSaveMyDog = (updatedDog) => {
    console.log("Saving dog:", updatedDog);
    setMyDog(updatedDog);
    alert("프로필이 저장되었습니다!");
  };

  useEffect(() => {
    // 백엔�� 연결 없이 임시 데이터로 작동
    setIsLoading(true);

    // 임시 내 강아지 데이터
    const myDogData = {
      id: 999,
      name: '멍멍이',
      breed: '믹스',
      age: 3,
      gender: '남아',
      city: '서울',
      district: '강남구',
      bio: '활발하고 사람을 좋아하는 멍멍이입니다! 산책과 간식을 제일 좋아해요.',
      imageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=800',
      likes: 200
    };

    // 로딩 시뮬레이션
    setTimeout(() => {
      setMyDog(null);

      setPopularDogs([
        { id: 1, name: '코코', breed: '말티즈', age: 2, gender: '여아', city: '서울', district: '마포구', bio: '에너지가 ���치는 코코입니다! 공놀이를 제일 좋아해요.', imageUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=800', likes: 120 },
        { id: 2, name: '레오', breed: '포메라니안', age: 3, gender: '남아', city: '경기', district: '성남시', bio: '작지만 용감한 레오! 다른 강아지 친구들과 어울리는 걸 좋아해요.', imageUrl: 'https://images.unsplash.com/photo-1598875184988-5e67b1a874b8?q=80&w=800', likes: 110 },
        { id: 3, name: '보리', breed: '시츄', age: 4, gender: '여아', city: '인천', district: '연수구', bio: '순하고 낮잠 자는 걸 좋아하는 보�� 공주님이에요.', imageUrl: 'https://images.unsplash.com/photo-1548681528-6a5c45b66b42?q=80&w=800', likes: 100 },
        { id: 4, name: '초코', breed: '요크셔테리어', age: 5, gender: '남아', city: '부산', district: '해운대구', bio: '간식이라면 뭐든지 하는 먹보랍니다.', imageUrl: 'https://images.unsplash.com/photo-1554196409-c44b5b7895f3?q=80&w=800', likes: 90 },
        { id: 5, name: '마루', breed: '닥스훈트', age: 6, gender: '남아', city: '대구', district: '수성구', bio: '짧은 다리가 매력적인 마루입니다. 산책 메이트 구해요!', imageUrl: 'https://images.unsplash.com/photo-1529429617124-95b109e86bb8?q=80&w=800', likes: 80 },
      ]);

      setNearbyDogs([
        { id: 6, name: '해피', breed: '비글', age: 1, gender: '남아', city: '서울', district: '용산구', bio: '지치지 않는 에너자이저 해피! 같이 뛰어놀아요!', imageUrl: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=800', distance: '1km' },
        { id: 7, name: '두부', breed: '프렌치 불독', age: 2, gender: '여아', city: '서울', district: '성동구', bio: '먹는 것과 자는 것을 가장 좋아하는 순둥이 두부.', imageUrl: 'https://images.unsplash.com/photo-1597633425046-08f5110420b5?q=80&w=800', distance: '2km' },
        { id: 8, name: '콩이', breed: '퍼그', age: 3, gender: '여아', city: '서울', district: '광진구', bio: '주름진 얼굴��� 매력적인 콩이에요. 느긋한 산책을 즐���요.', imageUrl: 'https://images.unsplash.com/photo-1534351450181-ea6f7d45e388?q=80&w=800', distance: '3km' },
        { id: 9, name: '별이', breed: '치와와', age: 4, gender: '여아', city: '서울', district: '강동구', bio: '작은 몸집에 큰 용기를 가졌어요. 주�� 껌딱지랍니다.', imageUrl: 'https://images.unsplash.com/photo-1601979031425-12f4a45978c6?q=80&w=800', distance: '4km' },
        { id: 10, name: '밤비', breed: '푸들', age: 5, gender: '남아', city: '서울', district: '송파구', bio: '똑똑하고 훈련을 잘 받아요. 새로운 개인기를 배우고 싶��요!', imageUrl: 'https://images.unsplash.com/photo-1585679104874-83d49a905a8e?q=80&w=800', distance: '5km' },
      ]);

      setIsLoading(false);
    }, 500);
  }, []);

  if (isLoading) {
    return <div className="home-container"><p>데이터를 불러오는 중입니다...</p></div>;
  }

  return (
    <div className="home-container">
      <section className="my-dog-section">
        <div className="my-dog-title-container">
          <h2 className="my-dog-title">내 강아지</h2>
        </div>
        <div className="my-dog-profile-wrapper">
          <button className="settings-button settings-button-on-card" aria-label="환경설정">
            <FiSettings size={28} color="#111" />
          </button>
          <TiltableDogCard dog={myDog} onClick={() => openModal(myDog)}>
            <MyDogProfileCard
              dog={myDog}
              isEditable={true}
              onSave={handleSaveMyDog}
            />
          </TiltableDogCard>
        </div>
      </section>

      <div className="hall-of-fame-container">
        <HiTrophy className="trophy-icon trophy-left" />
        <HiTrophy className="trophy-icon trophy-right" />
        <div className="hall-of-fame-section">
          <div className="crown-icon-container">
            <FaCrown className="crown-icon" />
          </div>
          <h2 className="hall-of-fame-title">명예의전당</h2>
        </div>

        <section className="hall-of-fame-section location-section">
        <h2 className="section-title section-title-with-icon">
          <HiMapPin className="section-icon location-icon" />
          우리 동네
        </h2>
        <div className="dog-list-wrapper">
          <button className="scroll-overlay-btn scroll-overlay-left" onClick={() => scrollLeft(nearbyScrollRef)}>
            <HiChevronLeft />
          </button>
          <button className="scroll-overlay-btn scroll-overlay-right" onClick={() => scrollRight(nearbyScrollRef)}>
            <HiChevronRight />
          </button>
          <div className="dog-list-scroll-container" ref={nearbyScrollRef}>
            <div className="dog-list">
              {nearbyDogs.map((dog, index) => (
                <TiltableDogCard key={dog.id} dog={dog} onClick={() => openModal(dog)}>
                  {index === 0 && <div className="rank-badge location-badge first-place"><HiHeart /></div>}
                  <img src={dog.photoUrl || dog.imageUrl} alt={dog.name} className="dog-card-background-image" />
                  <div className="dog-card-content">
                    <h3 className="dog-name">{dog.name}</h3>
                    <p className="dog-details">{dog.breed} / {dog.age}살</p>
                    <p className="dog-extra-info">{dog.distance} 이내</p>
                  </div>
                </TiltableDogCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="hall-of-fame-section likes-section">
        <div className="section-header-with-controls">
          <h2 className="section-title section-title-with-icon">
            <HiHeart className="section-icon likes-icon" />
            하트순
          </h2>
          <div className="scroll-controls">
            <button className="scroll-btn scroll-left" onClick={() => scrollLeft(popularScrollRef)}>
              <HiChevronLeft />
            </button>
            <button className="scroll-btn scroll-right" onClick={() => scrollRight(popularScrollRef)}>
              <HiChevronRight />
            </button>
          </div>
        </div>
        <div className="dog-list-scroll-container" ref={popularScrollRef}>
          <div className="dog-list">
            {popularDogs.map((dog, index) => (
              <TiltableDogCard key={dog.id} dog={dog} onClick={() => openModal(dog)}>
                {index === 0 && <div className="rank-badge likes-badge first-place"><HiHeart /></div>}
                <img src={dog.photoUrl || dog.imageUrl} alt={dog.name} className="dog-card-background-image" />
                <div className="dog-card-content">
                  <h3 className="dog-name">{dog.name}</h3>
                  <p className="dog-details">{dog.breed} / {dog.age}��</p>
                  <p className="dog-extra-info">하트: {dog.likes}</p>
                </div>
              </TiltableDogCard>
            ))}
          </div>
        </div>
      </section>
      </div>
    </div>
  );
}

export default HomePage;
