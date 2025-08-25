import React from 'react';
import { useNavigate } from 'react-router-dom';
import './WelcomePage.css';

function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <div className="welcome-header">
          <h1 className="welcome-title">🐕 멍게팅 🐕</h1>
          <p className="welcome-subtitle">우리 강아지의 새로운 친구를 찾아보세요!</p>
        </div>
        
        <div className="welcome-features">
          <div className="feature-card">
            <div className="feature-icon">🏠</div>
            <h3>주��� 강아지 찾기</h3>
            <p>우리 동네에서 산책 메이트를 찾아보세요</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">💝</div>
            <h3>강아지 매칭</h3>
            <p>성격과 취향이 맞는 강아지 친구들과 만나요</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3>채팅 기능</h3>
            <p>다른 반려인들과 소통하고 만남을 주선해보세요</p>
          </div>
        </div>

        <div className="welcome-actions">
          <button 
            className="login-button" 
            onClick={() => navigate('/login')}
          >
            로그인
          </button>
          <button 
            className="signup-button" 
            onClick={() => navigate('/signup-user')}
          >
            회원가입
          </button>
        </div>

        <div className="welcome-preview">
          <h3>인기 강아지 친구들</h3>
          <div className="preview-dogs">
            <div className="preview-dog-card">
              <img src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=300" alt="코코" />
              <div className="preview-dog-info">
                <span className="preview-dog-name">코코</span>
                <span className="preview-dog-breed">말티즈</span>
              </div>
            </div>
            <div className="preview-dog-card">
              <img src="https://images.unsplash.com/photo-1598875184988-5e67b1a874b8?q=80&w=300" alt="레오" />
              <div className="preview-dog-info">
                <span className="preview-dog-name">레오</span>
                <span className="preview-dog-breed">포메라니안</span>
              </div>
            </div>
            <div className="preview-dog-card">
              <img src="https://images.unsplash.com/photo-1548681528-6a5c45b66b42?q=80&w=300" alt="보리" />
              <div className="preview-dog-info">
                <span className="preview-dog-name">보리</span>
                <span className="preview-dog-breed">시츄</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WelcomePage;
