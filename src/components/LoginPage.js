// src/components/LoginPage.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from './Input';
import './FormLayout.css'; // Revert to original CSS file

function LoginPage() {
  const [formData, setFormData] = useState({
    userId: '',
    password: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://5febe71ba2fa.ngrok-free.app/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({
          userId: formData.userId,
          password: formData.password,
        }),
      });

      console.log('로그인 요청 응답 (raw):', response); // Raw response object

      if (response.ok) {
        const contentType = response.headers.get('content-type');
        let responseData;
        if (contentType && contentType.includes('application/json')) {
          responseData = await response.json();
          console.log('로그인 성공 (JSON 파싱):', responseData);
          // userId를 로컬 스토리지에 저장
          if (responseData && responseData.userId) {
            localStorage.setItem('userId', responseData.userId);
          } else if (responseData) {
            // Fallback for cases where the response is just the userId
            localStorage.setItem('userId', responseData);
          }
        } else {
          const responseText = await response.text();
          console.log('로그인 성공 (텍스트 응답):', responseText);
          // 텍스트 응답일 경우 userId를 어떻게 처리할지 추가 논의 필요
          // 현재는 userId를 로컬 스토리지에 저장하지 않음
        }
        // 로그인 성공 후 홈 화면으로 이동
        navigate('/app/home');
      } else {
        // Error handling for non-ok responses
        const errorResponseText = await response.text(); // Get raw error response text
        console.error('로그인 실패 (raw 응답 본문):', errorResponseText);
        try {
            const errorData = JSON.parse(errorResponseText);
            alert(`로그인 실패: ${errorData.message || '잘못된 요청입니다.'}`);
            console.error('로그인 실패 (JSON 파싱):', errorData);
        } catch (e) {
            alert(`로그인 실패: ${errorResponseText || '알 수 없는 오류'}`); // Fallback to raw text if not JSON
            console.error('로그인 실패 (JSON 파싱 실패):', e);
        }
      }
    } catch (error) { // This catch block handles network errors or errors before response is received
      console.error('로그인 API 호출 오류:', error);
      alert('로그인 중 문제가 발생했습니다.');
    }
  }; // <-- handleSubmit 함수가 여기서 끝납니다.

  // --------------------------------------------------------
  // handleSubmit과 return 사이에 있던 불필요한 '}'를 제거했습니다.
  // --------------------------------------------------------

  return (
    <div className="form-layout-container">
      <header className="header">
        <div className="logo-container">
          <img src="/images/image.png" alt="Logo" className="logo" />
        </div>
        <h1 className="header-title">로그인</h1>
      </header>
      <main className="content">
        <form onSubmit={handleSubmit} className="form-content">
          <Input
            label="ID"
            type="text"
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            required
          />
          <Input
            label="PW"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <div className="bottom-action">
            <button type="submit" className="submit-button">로그인</button>
          </div>
        </form>
        <p className="link-text">
          계정이 없으신가요? <Link to="/signup-user">회원가입</Link>
        </p>
      </main>
    </div>
  );
} // <-- LoginPage 함수는 여기서 끝나야 합니다.

export default LoginPage;