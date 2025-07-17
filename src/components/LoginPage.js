// src/components/LoginPage.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from './Input';
import './FormLayout.css'; // Revert to original CSS file

function LoginPage() {
  const [formData, setFormData] = useState({
    id: '',
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
      const response = await fetch('http://192.168.0.15:8080/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // 로그인이 성공하면 토큰 등을 저장할 수 있습니다.
        // const data = await response.json();
        // localStorage.setItem('token', data.token);
        console.log('로그인 성공');
        navigate('/app/home');
      } else {
        // 로그인 실패 처리
        alert('아이디 또는 비밀번호가 일치하지 않습니다.');
        console.error('로그인 실패');
      }
    } catch (error) {
      console.error('로그인 API 호출 중 오류 발생:', error);
      alert('로그인 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

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
            name="id"
            value={formData.id}
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
}

export default LoginPage;