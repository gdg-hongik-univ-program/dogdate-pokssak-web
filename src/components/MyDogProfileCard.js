import React from 'react';
import './MyDogProfileCard.css';

const MyDogProfileCard = ({ dog, onClick }) => {
  if (!dog) {
    return null; // or a loading/placeholder component
  }

  // 성별 표시를 '남아'/'여아'로 통일
  const displayGender = dog.gender === 'male' || dog.gender === '남아' || dog.gender === '수컷' ? '남아' : '여아';

  return (
    <div className="dog-profile-card" onClick={onClick}>
      <img 
        src={dog.photoUrl || dog.imageUrl}
        alt={dog.name}
        className="dog-card-background-image"
      />
      <div className="my-dog-content">
        <div className="dog-info-layout">
          <div className="dog-info-left">
            <h3 className="dog-name">{dog.name}</h3>
            <p className="dog-details">{dog.breed} / {dog.age}살</p>
            {dog.city && dog.district && (
              <p className="dog-extra-info">{dog.city} {dog.district}</p>
            )}
            {dog.distance && <p className="dog-extra-info">{dog.distance} ���내</p>}
          </div>
          <div className="dog-info-right">
            <p className="dog-profile-bio">{dog.bio || '한 줄 소개가 아직 없습니다.'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyDogProfileCard;
