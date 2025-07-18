// src/components/HomePage.js
import React, { useState, useEffect } from 'react';
import './HomePage.css'; // 새로 만든 CSS 파일을 import

// API 호출을 위한 가짜 데이터 (실제로는 API로 받아와야 함)
const fakeMyDog = {
  name: '몽실이',
  breed: '비숑 프리제',
  age: 3,
  imageUrl: '/images/image.png', // public 폴더에 있는 이미지 경로
};



const fakePopularDogs = [
  { id: 1, name: '하트1', breed: '말티즈', age: 2, imageUrl: '/images/image.png', likes: 120 },
  { id: 2, name: '하트2', breed: '포메라니안', age: 3, imageUrl: '/images/image.png', likes: 110 },
  { id: 3, name: '하트3', breed: '시츄', age: 4, imageUrl: '/images/image.png', likes: 100 },
  { id: 4, name: '하트4', breed: '요크셔테리어', age: 5, imageUrl: '/images/image.png', likes: 90 },
  { id: 5, name: '하트5', breed: '닥스훈트', age: 6, imageUrl: '/images/image.png', likes: 80 },
];

const fakeNearbyDogs = [
  { id: 6, name: '근처1', breed: '비글', age: 1, imageUrl: '/images/image.png', distance: '1km' },
  { id: 7, name: '근처2', breed: '불독', age: 2, imageUrl: '/images/image.png', distance: '2km' },
  { id: 8, name: '근처3', breed: '퍼그', age: 3, imageUrl: '/images/image.png', distance: '3km' },
  { id: 9, name: '근처4', breed: '치와와', age: 4, imageUrl: '/images/image.png', distance: '4km' },
  { id: 10, name: '근처5', breed: '푸들', age: 5, imageUrl: '/images/image.png', distance: '5km' },
];

function HomePage() {
  const [myDog, setMyDog] = useState(null);
  const [popularDogs, setPopularDogs] = useState([]);
  const [nearbyDogs, setNearbyDogs] = useState([]);
  const [error, setError] = useState('');

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
        <div className="my-dog-card">
          <img src={myDog.imageUrl} alt={`${myDog.name} 프로필 사진`} />
          <h3 className="dog-name">{myDog.name}</h3>
          <p className="dog-details">{myDog.breed} / {myDog.age}살</p>
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
              <div key={dog.id} className="dog-card">
                <img src={dog.imageUrl} alt={`${dog.name} 프로필 사진`} />
                <h3 className="dog-name">{dog.name}</h3>
                <p className="dog-details">{dog.breed} / {dog.age}살</p>
                <p className="dog-details">{dog.distance} 이내</p>
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
              <div key={dog.id} className="dog-card">
                <img src={dog.imageUrl} alt={`${dog.name} 프로필 사진`} />
                <h3 className="dog-name">{dog.name}</h3>
                <p className="dog-details">{dog.breed} / {dog.age}살</p>
                <p className="dog-details">하트: {dog.likes}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;