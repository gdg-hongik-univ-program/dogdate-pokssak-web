// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import UserInfoForm from './components/UserInfoForm';
import DogInfoForm from './components/DogInfoForm';
import SignupSuccessPage from './components/SignupSuccessPage';
import MainLayout from './components/MainLayout';
import HomePage from './components/HomePage';
import LikesPage from './components/LikesPage';
import MatchPage from './components/MatchPage';
import ChatPage from './components/ChatPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* 로그인/회원가입 경로 */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup-user" element={<UserInfoForm />} />
        <Route path="/signup-dog" element={<DogInfoForm />} />
        <Route path="/signup-success" element={<SignupSuccessPage />} />

        {/* 메인 화면 경로 */}
        <Route path="/app" element={<MainLayout />}>
          <Route index element={<Navigate to="/app/home" replace />} />
          <Route path="home" element={<HomePage />} />
          <Route path="likes" element={<LikesPage />} />
          <Route path="match" element={<MatchPage />} />
          <Route path="chat" element={<ChatPage />} />
        </Route>

        {/* 다른 모든 경로는 로그인 페이지로 리디렉션 */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;