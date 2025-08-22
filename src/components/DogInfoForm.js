// src/components/DogInfoForm.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './FormLayout.css'; // 공통 스타일 사용
import './DogInfoForm.css'; // DogInfoForm 고유 스타일
import { BASE_URL } from '../config';

function DogInfoForm() {
  const [dogInfo, setDogInfo] = useState({
    name: '',
    breed: '',
    age: '',
    gender: 'male', // 'male' or 'female'
    introduction: '',
    photo: null,
  });
  const [photoPreview, setPhotoPreview] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = location.state || {};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDogInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setDogInfo((prev) => ({ ...prev, photo: file }));
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview); // 이전 프리뷰 URL 메모리 해제
      }
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    return () => photoPreview && URL.revokeObjectURL(photoPreview);
  }, [photoPreview]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      alert('사용자 정보가 없습니다. 다시 로그인해주세요.');
      navigate('/login');
      return;
    }

    const formData = new FormData();

    // dogInfo를 JSON 객체로 만들어서 Blob으로 추가
    const dogInfoJson = {
      name: dogInfo.name,
      breed: dogInfo.breed,
      age: parseInt(dogInfo.age),
      gender: dogInfo.gender,
      description: dogInfo.introduction  // 'introduction' -> 'description'
    };

    formData.append('dogInfo', new Blob([JSON.stringify(dogInfoJson)], {
      type: 'application/json'
    }));

    // 이미지 파일명을 'image'로 변경
    if (dogInfo.photo) {
      formData.append('image', dogInfo.photo);
    }

    try {
      const response = await fetch(`${BASE_URL}/api/dogs/users/${userId}`, {
        method: 'POST',
        headers: {
          'ngrok-skip-browser-warning': 'true'
        },
        body: formData,
      });

      if (response.ok) {
        console.log('강아지 정보 저장 성공');
        navigate('/signup-success');
      } else {
        console.error('강아지 정보 저장 실패 - 응답 상태:', response.status, response.statusText);
        const responseBody = await response.text();
        console.error('강아지 정보 저장 실패 - 응답 본문:', responseBody);
        try {
            const errorData = JSON.parse(responseBody);
            alert(`강아지 정보 저장 실패: ${errorData.message || '잘못된 요청입니다.'}`);
            console.error('강아지 정보 저장 실패:', errorData);
        } catch (e) {
            alert(`강아지 정보 저장 실패: ${responseBody || '알 수 없는 오류'}`);
        }
      }
    } catch (error) {
      console.error('강아지 정보 저장 API 호출 오류:', error);
      alert('강아지 정보 저장 중 문제가 발생했습니다.');
    }
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
              {photoPreview ? (
                <img src={photoPreview} alt="preview" className="photo-preview" />
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
