import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../config';
import './ProfileEditPage.css';

const ProfileEditPage = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    nickname: '',
    gender: 'MALE',
    city: '',
    district: ''
  });
  const [dogInfo, setDogInfo] = useState({
    id: null,
    name: '',
    breed: '',
    age: '',
    gender: 'MALE',
    description: '',
    photoUrl: ''
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfileData = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        navigate('/login');
        return;
      }

      try {
        // 사용자 정보 가져오기
        const userResponse = await fetch(`${BASE_URL}/api/users/${userId}`, {
          headers: { 'ngrok-skip-browser-warning': 'true' }
        });
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUserInfo({
            nickname: userData.nickname || '',
            gender: userData.gender || 'MALE',
            city: userData.city || '',
            district: userData.district || ''
          });
        }

        // 강아지 정보 가져오기
        const dogResponse = await fetch(`${BASE_URL}/api/dogs/users/${userId}`, {
          headers: { 'ngrok-skip-browser-warning': 'true' }
        });
        if (dogResponse.ok) {
          const dogData = await dogResponse.json();
          if (dogData && dogData.length > 0) {
            const dog = dogData[0];
            setDogInfo({
              id: dog.id,
              name: dog.name || '',
              breed: dog.breed || '',
              age: dog.age || '',
              gender: dog.gender || 'MALE',
              description: dog.description || dog.bio || '',
              photoUrl: dog.photoUrl || ''
            });
          }
        }
      } catch (err) {
        setError('프로필 정보를 불러오는 중 오류가 발생했습니다.');
        console.error('Profile fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [navigate]);

  const handleUserInfoChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleDogInfoChange = (e) => {
    const { name, value } = e.target;
    setDogInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    
    // 필수 필드 검증
    if (!userInfo.nickname || userInfo.nickname.trim() === '') {
      alert('닉네임은 필수 입력 항목입니다.');
      return;
    }
    
    if (!userInfo.city || userInfo.city.trim() === '') {
      alert('시/도는 필수 입력 항목입니다.');
      return;
    }
    
    try {
      // 사용자 정보 디버깅
      console.log('사용자 정보:', userInfo);
      console.log('nickname 값:', userInfo.nickname);
      
      // URL 파라미터로 전송
      const userParams = new URLSearchParams({
        nickname: userInfo.nickname,
        gender: userInfo.gender,
        city: userInfo.city
      });
      
      const userUpdateUrl = `${BASE_URL}/api/users/${userId}/profile?${userParams.toString()}`;
      console.log('전송할 URL:', userUpdateUrl);
      
      // 사용자 정보 업데이트 - URL 파라미터로 전송
      const userUpdateResponse = await fetch(userUpdateUrl, {
        method: 'PUT',
        headers: {
          'ngrok-skip-browser-warning': 'true'
        }
      });

      // 강아지 정보 업데이트 - multipart/form-data로 전송
      const formData = new FormData();
      
      // 강아지 정보를 JSON Blob으로 추가 (Content-Type: application/json 설정)
      const dogInfoBlob = new Blob([JSON.stringify({
        name: dogInfo.name,
        breed: dogInfo.breed,
        age: parseInt(dogInfo.age),
        gender: dogInfo.gender,
        description: dogInfo.description
      })], { type: 'application/json' });
      
      formData.append('dogInfo', dogInfoBlob);
      
      // 이미지 파일이 선택된 경우 추가
      if (selectedImage) {
        formData.append('image', selectedImage);
      }

      const dogUpdateResponse = await fetch(`${BASE_URL}/api/dogs/${dogInfo.id}`, {
        method: 'PUT',
        headers: {
          'ngrok-skip-browser-warning': 'true'
          // Content-Type은 설정하지 않음 (브라우저가 자동으로 boundary 설정)
        },
        body: formData
      });

      if (userUpdateResponse.ok && dogUpdateResponse.ok) {
        alert('프로필이 성공적으로 업데이트되었습니다!');
        navigate('/app');
      } else {
        // 각각의 에러 응답 상세 확인
        let errorMessage = '프로필 업데이트에 실패했습니다.\n';
        
        if (!userUpdateResponse.ok) {
          const userErrorText = await userUpdateResponse.text();
          errorMessage += `사용자 정보 업데이트 실패 (${userUpdateResponse.status}): ${userErrorText}\n`;
          console.error('User update error:', userErrorText);
        }
        
        if (!dogUpdateResponse.ok) {
          const dogErrorText = await dogUpdateResponse.text();
          errorMessage += `강아지 정보 업데이트 실패 (${dogUpdateResponse.status}): ${dogErrorText}`;
          console.error('Dog update error:', dogErrorText);
        }
        
        throw new Error(errorMessage);
      }
    } catch (err) {
      setError('프로필 업데이트 중 오류가 발생했습니다.');
      console.error('Profile update error:', err);
    }
  };

  if (isLoading) {
    return <div className="profile-edit-container"><p>프로필 정보를 불러오는 중...</p></div>;
  }

  if (error) {
    return <div className="profile-edit-container"><p className="error">{error}</p></div>;
  }

  return (
    <div className="profile-edit-container">
      <div className="profile-edit-header">
        <button onClick={() => navigate('/app')} className="back-button">← 뒤로</button>
        <h1>프로필 수정</h1>
      </div>

      <form onSubmit={handleSubmit} className="profile-edit-form">
        <div className="section">
          <h2>내 정보</h2>
          <div className="form-group">
            <label htmlFor="nickname">닉네임</label>
            <input
              type="text"
              id="nickname"
              name="nickname"
              value={userInfo.nickname}
              onChange={handleUserInfoChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="userGender">성별</label>
            <select
              id="userGender"
              name="gender"
              value={userInfo.gender}
              onChange={handleUserInfoChange}
              required
            >
              <option value="MALE">남성</option>
              <option value="FEMALE">여성</option>
            </select>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">시/도</label>
              <input
                type="text"
                id="city"
                name="city"
                value={userInfo.city}
                onChange={handleUserInfoChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="district">구/군</label>
              <input
                type="text"
                id="district"
                name="district"
                value={userInfo.district}
                onChange={handleUserInfoChange}
                required
              />
            </div>
          </div>
        </div>

        <div className="section">
          <h2>강아지 정보</h2>
          <div className="form-group">
            <label htmlFor="dogName">이름</label>
            <input
              type="text"
              id="dogName"
              name="name"
              value={dogInfo.name}
              onChange={handleDogInfoChange}
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="breed">견종</label>
              <input
                type="text"
                id="breed"
                name="breed"
                value={dogInfo.breed}
                onChange={handleDogInfoChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="age">나이</label>
              <input
                type="number"
                id="age"
                name="age"
                value={dogInfo.age}
                onChange={handleDogInfoChange}
                min="0"
                max="30"
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="gender">성별</label>
            <select
              id="gender"
              name="gender"
              value={dogInfo.gender}
              onChange={handleDogInfoChange}
              required
            >
              <option value="MALE">남아</option>
              <option value="FEMALE">여아</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="description">소개</label>
            <textarea
              id="description"
              name="description"
              value={dogInfo.description}
              onChange={handleDogInfoChange}
              placeholder="강아지에 대한 소개를 입력해주세요"
              rows="4"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="photoUrl">현재 사진 URL</label>
            <input
              type="url"
              id="photoUrl"
              name="photoUrl"
              value={dogInfo.photoUrl}
              onChange={handleDogInfoChange}
              placeholder="현재 강아지 사진 URL"
              readOnly
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="imageFile">새 사진 업로드</label>
            <input
              type="file"
              id="imageFile"
              accept="image/*"
              onChange={handleImageChange}
            />
            <small>새 사진을 업로드하면 기존 사진을 대체합니다.</small>
          </div>
        </div>

        <button type="submit" className="submit-button">저장하기</button>
      </form>
    </div>
  );
};

export default ProfileEditPage;