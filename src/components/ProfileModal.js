
// src/components/ProfileModal.js
import React from 'react';
import './ProfileModal.css';

function ProfileModal({ dog, onClose, isMyDog }) {
  if (!dog) return null;

  // 배경(backdrop) 클릭 시 모달이 닫히도록 처리
  const handleBackdropClick = (e) => {
    // 클릭된 요소가 배경 자체일 때만 닫기 (컨텐츠 클릭 시 닫힘 방지)
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // 성별 표시를 '남아'/'여아'로 통일 (데이터 형식에 따라 유연하게)
  const displayGender = dog.gender === 'male' || dog.gender === '남아' || dog.gender === '수컷' ? '남아' : '여아';

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      {/* Card-style modal */}
      <div className="modal-card">
      <img src={dog.photoUrl || dog.imageUrl} alt={dog.name} className="modal-card-background-image" />
        <div className="modal-card-content">
          {isMyDog && (
            <button className="modal-edit-button">
              <i className="fa-solid fa-pen"></i>
            </button>
          )}
          <button className="modal-close-icon" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>

          <div className="modal-info">
            <div className="modal-header">
              <h2 className="modal-name">{dog.name}</h2>
              <span className="modal-age">{dog.age}살</span>
            </div>
            <div className="modal-details">
              <span>{dog.breed}</span>
              <span>·</span>
              <span>{displayGender}</span>
            </div>
            {dog.city && dog.district && (
              <div className="modal-location">
                <i className="fa-solid fa-location-dot"></i>
                <span>{dog.city} {dog.district}</span>
              </div>
            )}
            <p className="modal-bio">{dog.bio || '한 줄 소개가 아직 없습니다.'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileModal;
