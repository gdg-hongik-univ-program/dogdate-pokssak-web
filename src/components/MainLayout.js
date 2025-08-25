import React, { useState } from 'react';
import { Outlet, useNavigate, NavLink } from 'react-router-dom';
import ProfileModal from './ProfileModal';
import MatchModal from './MatchModal';
import './MainLayout.css';

const navItems = [
  { path: '/app/home', icon: 'fa-solid fa-house', label: '홈' },
  { path: '/app/likes', icon: 'fa-solid fa-heart', label: '하트' },
  { path: '/app/match', icon: 'fa-solid fa-compass', label: '매치' },
  { path: '/app/chat-list', icon: 'fa-solid fa-comment', label: '채팅' },
];

function MainLayout() {
  const navigate = useNavigate();
  const [selectedDog, setSelectedDog] = useState(null);
  const [matchUserIds, setMatchUserIds] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const openModal = (dog) => {
    setSelectedDog(dog);
  };

  const closeModal = () => {
    setSelectedDog(null);
  };

  const openMatchModal = (userIds) => {
    setMatchUserIds(userIds);
  };

  const closeMatchModal = () => {
    setMatchUserIds(null);
  };

  return (
    <div className="main-layout">
      <header className="main-header">
        <h1 className="main-header-title">Mungeting 🐾</h1>
        <button onClick={handleLogout} className="logout-button">
          로그아웃
        </button>
      </header>
      <main className="main-content">
        <Outlet context={{ openModal, openMatchModal }} />
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
      {selectedDog && <ProfileModal dog={selectedDog} onClose={closeModal} />}
      {matchUserIds && (
        <MatchModal 
          isOpen={true} 
          onClose={closeMatchModal} 
          myUserId={matchUserIds.myUserId}
          matchedUserId={matchUserIds.matchedUserId}
        />
      )}
    </div>
  );
}

export default MainLayout;