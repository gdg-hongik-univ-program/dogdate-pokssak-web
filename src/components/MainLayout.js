import React, { useState } from 'react';
import { Outlet, useNavigate, NavLink } from 'react-router-dom';
import { FaPaw } from 'react-icons/fa';
import ProfileModal from './ProfileModal'; // ProfileModal 임포트
import './MainLayout.css';

const navItems = [
  { path: '/app/home', icon: 'fa-solid fa-house', label: '홈' },
  { path: '/app/likes', icon: 'fa-solid fa-heart', label: '하트' },
  { path: '/app/match', icon: 'fa-solid fa-compass', label: '매치' },
  { path: '/app/chat', icon: 'fa-solid fa-comment', label: '채팅' },
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
        <FaPaw className="header-paw-icon" />
      </header>
      <main className="main-content">
        <Outlet context={{ openModal }} /> {/* openModal 함수를 context로 전달 */}
      </main>
      <nav className="bottom-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <i className={item.icon}></i>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      {/* selectedDog가 있을 때만 ProfileModal을 렌더링 */}
      {selectedDog && <ProfileModal dog={selectedDog} onClose={closeModal} />}
    </div>
  );
}

export default MainLayout;
