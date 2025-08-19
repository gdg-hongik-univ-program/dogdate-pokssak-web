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

  const handleSubmit = (e) => {
    e.preventDefault();
    // 임시로 백엔드 API 호출 없이 홈 화면으로 바로 이동
    navigate('/app/home');
  };

  return (
    <div className="form-layout-container">
      <header className="header">
        <h1 className="app-title">Mungating</h1>
        <div className="logo-container">
          <img src="/images/image.png" alt="Logo" className="logo" />
        </div>
      </header>
      <main className="content">
        <div className="login-card">
          <h1 className="header-title">로그인</h1>
          <form onSubmit={handleSubmit} className="form-content">
            <Input
            label="아이디"
            type="text"
            name="id"
            value={formData.id}
            onChange={handleChange}
            required
            placeholder="ID"
          />
          <Input
            label="비밀번호"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Password"
          />
            <div className="bottom-action">
              <button type="submit" className="submit-button">로그인</button>
            </div>
          </form>
          <p className="link-text">
            계정이 없으신가요? <Link to="/signup-user">회��가입</Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default LoginPage;
