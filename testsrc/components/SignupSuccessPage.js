// src/components/SignupSuccessPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import './FormLayout.css';

function SignupSuccessPage() {
  return (
    <div className="form-layout-container">
      <header className="header">
        <h1 className="header-title">가입 완료</h1>
      </header>
      <main className="content" style={{ textAlign: 'center', justifyContent: 'center' }}>
        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            가입을 축하합니다!
          </h2>
          <p>회원가입이 완료되었습니다.</p>
        </div>
        <div className="bottom-action">
          <Link to="/login">
            <button className="submit-button">로그인 하러 가기</button>
          </Link>
        </div>
      </main>
    </div>
  );
}

export default SignupSuccessPage;