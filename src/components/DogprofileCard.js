import React from 'react';
import './DogProfileCard.css';

const DogProfileCard = ({ dog, onClick }) => {
  // dog 객체가 없으면 아무것도 렌더링하지 않습니다.
  if (!dog) {
    return null;
  }

  // 성별 표시를 '남아'/'여아'로 통일합니다.
  const displayGender = dog.gender === 'male' || dog.gender === '남아' || dog.gender === '수컷' ? '남아' : '여아';

  // --- 수정된 부분 ---
  // 서버에서 오는 'description'을 우선적으로 사용하고,
  // 혹시 모를 'bio' 속성도 확인합니다.
  const bioText = dog.description || dog.bio || 'tlqkffusdk.';
  // --- 여기까지 수정 ---

  return (
    <div className="dog-profile-card" onClick={onClick}>
      <img 
        src={dog.photoUrl || dog.imageUrl}
        alt={dog.name}
        className="dog-card-background-image"
      />
      <div className="dog-card-content">
        <h3 className="dog-name">{dog.name}</h3>
        <p className="dog-details">{dog.breed} / {dog.age}살</p>
        {dog.city && dog.district && (
          <p className="dog-extra-info">{dog.city} {dog.district}</p>
        )}
        {dog.distance && <p className="dog-extra-info">{dog.distance} 이내</p>}
        {/* 수정된 bioText 변수를 사용합니다. */}
        <p className="dog-profile-bio">{bioText}</p>
      </div>
    </div>
  );
};

export default DogProfileCard;
