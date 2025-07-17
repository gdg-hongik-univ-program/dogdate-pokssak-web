// src/components/DogInfoForm.js
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './FormLayout.css'; // 공통 스타일 사용
import './DogInfoForm.css'; // DogInfoForm 고유 스타일

function DogInfoForm() {
  const [dogInfo, setDogInfo] = useState({
    name: '',
    breed: '',
    age: '',
    gender: 'male', // 'male' or 'female'
    introduction: '',
    photo: null,
  });
  const navigate = useNavigate();
  const location = useLocation();
  const userInfo = location.state?.userInfo;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDogInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setDogInfo((prev) => ({ ...prev, photo: e.target.files[0] }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalData = { ...userInfo, dogInfo };
    console.log('최종 회원가입 데이터:', finalData);
    navigate('/signup-success');
  };

  return (
    <div className="form-layout-container">
      <header className="header">
        <button className="back-button" onClick={() => navigate('/signup-user')}>
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <h1 className="header-title">강아지 프로필 등록</h1>
        <div style={{ width: '2rem' }}></div>
      </header>
      <main className="content">
        <form onSubmit={handleSubmit} className="form-content">
          <div className="photo-upload-section">
            <label htmlFor="photo-upload" className="photo-upload-box">
              {dogInfo.photo ? (
                <img src={URL.createObjectURL(dogInfo.photo)} alt="preview" className="photo-preview" />
              ) : (
                <i className="fa-solid fa-plus"></i>
              )}
            </label>
            <input id="photo-upload" type="file" onChange={handlePhotoChange} accept="image/*" style={{ display: 'none' }} />
            <p className="photo-upload-label">강아지 사진 추가</p>
          </div>

          <div className="input-group">
            <label className="label">강아지 이름</label>
            <input type="text" name="name" placeholder="이름을 입력하세요" value={dogInfo.name} onChange={handleChange} className="input" />
          </div>

          <div className="input-group">
            <label className="label">견종</label>
            <input type="text" name="breed" placeholder="견종을 입력하세요" value={dogInfo.breed} onChange={handleChange} className="input" />
          </div>

          <div className="input-group">
            <label className="label">나이</label>
            <input type="number" name="age" placeholder="나이를 입력하세요" value={dogInfo.age} onChange={handleChange} className="input" />
          </div>

          <div className="input-group">
            <label className="label">성별</label>
            <div className="toggle-container">
              <button type="button" onClick={() => setDogInfo(prev => ({ ...prev, gender: 'male' }))} className={`toggle-button ${dogInfo.gender === 'male' ? 'active' : ''}`}>
                수컷
              </button>
              <button type="button" onClick={() => setDogInfo(prev => ({ ...prev, gender: 'female' }))} className={`toggle-button ${dogInfo.gender === 'female' ? 'active' : ''}`}>
                암컷
              </button>
            </div>
          </div>

          <div className="input-group">
            <label className="label">강아지 소개</label>
            <textarea name="introduction" placeholder="우리 강아지를 소개해주세요" rows="4" value={dogInfo.introduction} onChange={handleChange} className="textarea"></textarea>
          </div>
          
          <div className="bottom-action">
            <button type="submit" className="submit-button">프로필 등록하기</button>
          </div>
        </form>
      </main>
    </div>
  );
}
export default DogInfoForm;
