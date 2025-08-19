import React from 'react';
import './DogProfileCard.css';

const DogProfileCard = ({ dog, onClick }) => {
  if (!dog) {
    return null; // or a loading/placeholder component
  }

  // 성별 표시를 '남아'/'여아'로 통일
  const displayGender = dog.gender === 'male' || dog.gender === '남아' || dog.gender === '수컷' ? '남아' : '여아';

  return (
    <div className="my-dog-card-square" onClick={onClick}>
      <img
        src={dog.imageUrl}
        alt={dog.name}
        className="my-dog-background-image"
      />
      <div className="my-dog-overlay-content">
        <div className="my-dog-header">
          <h2 className="my-dog-name">{dog.name}</h2>
          <span className="my-dog-age">{dog.age}살</span>
        </div>
        <div className="my-dog-details">
          <span>{dog.breed} · {displayGender}</span>
        </div>
        {dog.city && dog.district && (
          <div className="my-dog-location">
            <i className="fa-solid fa-location-dot"></i>
            <span>{dog.city} {dog.district}</span>
          </div>
        )}
        <p className="my-dog-bio">{dog.bio || '한 줄 소개가 아직 없습니다.'}</p>
      </div>
    </div>
  );
};

export default DogProfileCard;
