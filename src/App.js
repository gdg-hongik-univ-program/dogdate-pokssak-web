import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ChatPage from './components/ChatPage';
import ChatRoomListPage from './components/ChatRoomListPage';

// 페이지 컴포넌트 임포트
import LoginPage from './components/LoginPage';
import UserInfoForm from './components/UserInfoForm';
import DogInfoForm from './components/DogInfoForm';
import MainLayout from './components/MainLayout';
import HomePage from './components/HomePage'; // HomePage가 있다고 가정합니다.
import LikesPage from './components/LikesPage';
import MatchPage from './components/MatchPage';

const SignupSuccessPage = () => (
  <div style={{ textAlign: 'center', marginTop: '50px', padding: '20px' }}>
    <h1>🎉 회원가입 성공! 🎉</h1>
    <p>이제 당신의 반려견과 새로운 친구들을 만날 준비가 되었습니다.</p>
    <a href="/login" style={{ display: 'inline-block', marginTop: '20px', padding: '10px 20px', backgroundColor: '#111827', color: 'white', textDecoration: 'none', borderRadius: '8px' }}>
      로그인하러 가기
    </a>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* 1. 앱 시작 시 /login 페이지로 자동 이동 */}
        <Route path="/" element={<Navigate replace to="/app/home" />} />
        {/* 2. 로그인 및 회원가입 관련 페이지 */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup-user" element={<UserInfoForm />} />
        <Route path="/signup-dog" element={<DogInfoForm />} />
        <Route path="/signup-success" element={<SignupSuccessPage />} />

        {/* 3. 로그인 후 진입하는 메인 앱 (MainLayout 안에 페이지들이 표시됨) */}
        <Route path="/app" element={<MainLayout />}>
          {/* /app 으로 접속 시, 자동으로 /app/home 으로 이동 */}
          <Route index element={<Navigate replace to="/app/home" />} />
          <Route path="home" element={<HomePage />} />
          <Route path="likes" element={<LikesPage />} />
          <Route path="match" element={<MatchPage />} />
          <Route path="chat/:chatroomId" element={<ChatPage />} />
          <Route path="chat-list" element={<ChatRoomListPage />} />
        </Route>

        {/* 4. 정의되지 않은 경로로 접근 시 */}
        <Route path="*" element={
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>404 - 페이지를 찾을 수 없습니다.</h1>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;