import React, { useState, useEffect, useRef } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import './HomePage.css';
import { BASE_URL } from '../config';
// 1번 코드의 아이콘과 추가 컴포넌트를 가져옵니다.
import TiltableDogCard from './TiltableDogCard';
import MyDogProfileCard from './MyDogProfileCard';
import { FiSettings } from "react-icons/fi";
import { HiMapPin, HiHeart, HiTrophy, HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { FaCrown } from "react-icons/fa";

function HomePage() {
  // --- 2번 코드의 로직과 상태 관리는 그대로 유지 ---
  const { openModal } = useOutletContext();
  const navigate = useNavigate();
  const [myDog, setMyDog] = useState(null);
  const [popularDogs, setPopularDogs] = useState([]);
  const [nearbyDogs, setNearbyDogs] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // --- 1번 코드의 스크롤 로직 추가 ---
  const nearbyScrollRef = useRef(null);
  const popularScrollRef = useRef(null);

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

  // --- 2번 코드의 데이터 로딩 로직을 사용 ---
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          // 강아지 없는 UI를 테스트하기 위해 임시로 주석 처리
          // setError('사용자 ID를 찾을 수 없습니다. 다시 로그인해주세요.');
          // setIsLoading(false);
          // return;

          // 강아지 없는 UI 테스트용 임시 데이터 (1번 코드처럼)
          setMyDog(null); 
        } else {
            // 내 강아지 정보 가져오기
            const myDogResponse = await fetch(`${BASE_URL}/api/dogs/users/${userId}`, {
              headers: { 'ngrok-skip-browser-warning': 'true' }
            });
            if (!myDogResponse.ok) {
              throw new Error(`내 강아지 정보를 불러오는데 실패했습니다: ${myDogResponse.statusText}`);
            }
            const myDogsData = await myDogResponse.json();
            if (myDogsData && myDogsData.length > 0) {
              setMyDog(myDogsData[0]);
            }
            else {
              setMyDog(null);
            }

            // 사용자 프로필 정보 가져오기 (도시 정보를 위해)
            const userProfileResponse = await fetch(`${BASE_URL}/api/home/profile/${userId}`, {
              headers: { 'ngrok-skip-browser-warning': 'true' }
            });
            if (!userProfileResponse.ok) {
              throw new Error(`사용자 프로필 정보를 불러오는데 실패했습니다: ${userProfileResponse.statusText}`);
            }
            const userProfileData = await userProfileResponse.json();
            const userCity = userProfileData.city;

            // 우리 동네 강아지 (위치순) 가져오기
            if (userCity) {
              const nearbyDogsResponse = await fetch(`${BASE_URL}/api/home/regional-dogs/${userCity}?limit=10`, { // Increased limit for more dogs
                headers: { 'ngrok-skip-browser-warning': 'true' }
              });
              if (nearbyDogsResponse.ok) {
                const nearbyDogsData = await nearbyDogsResponse.json();
                setNearbyDogs(nearbyDogsData.map(dog => ({
                  id: dog.dogId,
                  name: dog.dogName,
                  breed: dog.breed,
                  age: dog.age,
                  imageUrl: dog.photoUrl,
                  // distance는 API에서 제공되지 않으므로 임시로 빈 값 또는 계산 로직 필요
                  distance: '' // API에서 제공되지 않음
                })));
              } else {
                console.error(`Failed to fetch nearby dogs: ${nearbyDogsResponse.statusText}`);
                setNearbyDogs([]);
              }
            } else {
              setNearbyDogs([]);
            }

            // 하트순 강아지 가져오기
            const popularDogsResponse = await fetch(`${BASE_URL}/api/home/dog-ranking?page=0&size=10`, {
              headers: { 'ngrok-skip-browser-warning': 'true' }
            });
            if (popularDogsResponse.ok) {
              const popularDogsData = await popularDogsResponse.json();
              setPopularDogs(popularDogsData.map(dog => ({
                id: dog.dogId,
                name: dog.dogName,
                breed: dog.breed,
                age: dog.age,
                imageUrl: dog.photoUrl,
                likes: dog.likeCount
              })));
            } else {
              console.error(`Failed to fetch popular dogs: ${popularDogsResponse.statusText}`);
              setPopularDogs([]);
            }
        }

      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div className="home-container"><p>데이터를 불러오는 중입니다...</p></div>;
  }

  if (error) {
    return <div className="home-container"><p>오류: {error}</p></div>;
  }

  // 강아지 정보가 없을 경우 (2번 코드의 로직)
  if (!myDog) {
    return (
      <div className="home-container" style={{ textAlign: 'center' }}>
        <p>등록된 강아지 프로필이 없습니다.</p>
        <button onClick={() => navigate('/signup-dog')} className="submit-button" style={{ marginTop: '20px', width: 'auto', padding: '10px 20px' }}>
          강아지 프로필 등록하기
        </button>
      </div>
    );
  }

  // --- 1번 코드의 JSX(화면 구조)를 그대로 사용 ---
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
                  <p className="dog-details">{dog.breed} / {dog.age}살</p>
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
