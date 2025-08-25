import React, { useState } from 'react';
import { Outlet, useNavigate, NavLink } from 'react-router-dom';
import ProfileModal from './ProfileModal'; // ProfileModal 임포트
import { HiHome, HiHeart, HiSparkles, HiChatBubbleLeftRight } from 'react-icons/hi2';
import { GiPawPrint } from 'react-icons/gi';
import './MainLayout.css';

const navItems = [
  { path: '/app/home', icon: HiHome, label: '홈' },
  { path: '/app/likes', icon: HiHeart, label: '하트' },
  { path: '/app/match', icon: HiSparkles, label: '매치' },
  { path: '/app/chat-list', icon: HiChatBubbleLeftRight, label: '채팅' },
];

function MainLayout() {
  const navigate = useNavigate();
  const [selectedDog, setSelectedDog] = useState(null);

  const handleLogout = () => {
    navigate('/login');
  };

  const openModal = (dog) => {
    setSelectedDog(dog);
  };

  const closeModal = () => {
    setSelectedDog(null);
  };

  return (
    <div className="main-layout">
      <header className="main-header">
        <h1 className="main-header-title">Mungeting</h1>
        <button onClick={handleLogout} className="paw-logout-button" aria-label="로그아웃">
          <GiPawPrint size={24} />
          <span className="logout-label">로그아웃</span>
        </button>
      </header>
      <main className="main-content">
        <Outlet context={{ openModal }} /> {/* openModal 함수를 context로 전달 */}
      </main>
      <nav className="bottom-nav">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <IconComponent size={24} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
      {/* selectedDog가 있을 때만 ProfileModal을 렌더링 */}
      {selectedDog && <ProfileModal dog={selectedDog} onClose={closeModal} />}
    </div>
  );
}

export default MainLayout;
