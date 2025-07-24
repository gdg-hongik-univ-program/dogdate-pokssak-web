
// src/components/ProfileModal.js
import React from 'react';
import './ProfileModal.css';

function ProfileModal({ dog, onClose }) {
  if (!dog) return null;

  // 배경 클릭 시 모달이 닫히도록 처리
  const handleBackdropClick = () => {
    onClose();
  };

  // 모달 컨텐츠 클릭 시 이벤트 전파를 막아 모달이 닫히지 않도록 함
  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content" onClick={handleContentClick}>
        <img src={dog.imageUrl} alt={`${dog.name} 프로필 사진`} className="modal-dog-image" />
        <h2 className="modal-dog-name">{dog.name}</h2>
        <p className="modal-dog-details">{dog.breed} / {dog.age}살</p>
        {/* 추가 정보 (거리 또는 하트 수) */}
        {dog.distance && <p className="modal-dog-extra">약 {dog.distance} 이내</p>}
        {dog.likes && <p className="modal-dog-extra">하트 {dog.likes}개</p>}
        <button onClick={onClose} className="modal-close-button">닫기</button>
      </div>
    </div>
  );
}

export default ProfileModal;
