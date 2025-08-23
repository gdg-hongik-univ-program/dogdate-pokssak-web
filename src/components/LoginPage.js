// src/components/LoginPage.js
import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPaw } from 'react-icons/fa';
import Input from './Input';
import './FormLayout.css';
import { BASE_URL } from '../config';

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

  // --- 실제 로그인 로직 (수정 없음) ---
  const loginUser = useCallback(async (userId, password) => {
    try {
      const response = await fetch(`${BASE_URL}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({ userId, password }),
      });

      if (response.ok) {
        const responseData = await response.json();
        localStorage.setItem('userId', responseData.userId || responseData);
        navigate('/app/home');
      } else {
        const errorData = await response.json();
        alert(`로그인 실패: ${errorData.message || '알 수 없는 오류'}`);
      }
    } catch (error) {
      alert('로그인 중 문제가 발생했습니다. 서버 상태를 확인해주세요.');
      console.error('로그인 API 호출 오류:', error);
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await loginUser(formData.userId, formData.password);
  };

  // --- 로그인 우회 핸들러 ---
  const handleDevLoginBypass = () => {
    // 1. 다른 페이지에서 사용할 임시 사용자 ID를 저장합니다.
    localStorage.setItem('userId', 'dev-user');
    // 2. 서버 통신 없이 즉시 홈 화면으로 이동합니다.
    navigate('/app/home');
  };

  return (
    <div className="form-layout-container">
      <header className="header">
        <h1 className="app-title">Mungating</h1>
        
      </header>
      <main className="content">
        <div className="login-card">
          <h1 className="header-title">로그인</h1>
          <form onSubmit={handleSubmit} className="form-content">
            <Input
              label="아이디"
              type="text"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              required
              placeholder="ID"
              icon={<FaPaw />}
            />
            <Input
              label="비밀번호"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Password"
              icon={<FaPaw />}
            />
            <div className="bottom-action">
              <button type="submit" className="submit-button">로그인</button>
              <button type="button" onClick={handleDevLoginBypass} className="submit-button" style={{backgroundColor: '#4CAF50', marginTop: '10px'}}>
                개발용 자동 로그인
              </button>
            </div>
          </form>
          <p className="link-text">
            계정이 없으신가요? <Link to="/signup-user">회원가입</Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default LoginPage;