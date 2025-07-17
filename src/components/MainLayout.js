// src/components/MainLayout.js
import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import './MainLayout.css';

const navItems = [
  { path: '/home', icon: 'fa-solid fa-house', label: '홈' },
  { path: '/likes', icon: 'fa-solid fa-heart', label: '하트' },
  { path: '/match', icon: 'fa-solid fa-compass', label: '매치' },
  { path: '/chat', icon: 'fa-solid fa-comment', label: '채팅' },
];

function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const handleLogout = () => {
    // 실제 로그아웃 로직 (예: localStorage.removeItem('token');)
    // 현재는 세션 관리가 없으므로, 단순히 로그인 페이지로 리디렉션
    navigate('/login');
  };

  return (
    <div className="main-layout">
      <header className="main-header"> {/* 새 헤더 추가 */}
        <h1 className="main-header-title">Mungeting</h1> {/* 앱 이름 또는 로고 */}
        <button onClick={handleLogout} className="logout-button">
          로그아웃
        </button>
      </header>
      <main className="main-content">
        <Outlet />
      </main>
      <nav className="bottom-nav">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`nav-item ${location.pathname.startsWith(item.path) ? 'active' : ''}`}>
            <i className={item.icon}></i>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

export default MainLayout;
