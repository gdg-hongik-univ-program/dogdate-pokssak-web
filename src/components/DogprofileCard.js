import React from 'react';
import './DogProfileCard.css';

const DogProfileCard = ({ dog, onClick }) => {
  if (!dog) {
    return null; // or a loading/placeholder component
  }

  // 성별 표시를 '남아'/'여아'로 통일
  const displayGender = dog.gender === 'male' || dog.gender === '남아' || dog.gender === '수컷' ? '남아' : '여아';

  return (
    <div className="dog-profile-card" onClick={onClick}>
      <div className="dog-profile-image-container">
        <img 
          src={dog.imageUrl}
          alt={dog.name}
          className="dog-profile-image"
        />
      </div>
      <div className="dog-profile-info">
        <div className="dog-profile-header">
          <h2 className="dog-name">{dog.name}</h2>
          <span className="dog-age">{dog.age}살</span>
        </div>
        <div className="dog-profile-details">
          <span>{dog.breed}</span>
          <span>·</span>
          <span>{displayGender}</span>
        </div>
        {dog.city && dog.district && (
          <div className="dog-profile-location">
            <i className="fa-solid fa-location-dot"></i>
            <span>{dog.city} {dog.district}</span>
          </div>
        )}
        <p className="dog-profile-bio">{dog.bio || '한 줄 소개가 아직 없습니다.'}</p>
      </div>
    </div>
  );
};

export default DogProfileCard;
