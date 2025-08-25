// src/components/MatchModal.js
import React, { useState, useEffect } from 'react';
import { FaHeart } from 'react-icons/fa';
import { BASE_URL } from '../config';
import './MatchModal.css';

const MatchModal = ({ isOpen, onClose, myUserId, matchedUserId }) => {
  const [myDog, setMyDog] = useState(null);
  const [matchedDog, setMatchedDog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen || !myUserId || !matchedUserId) return;

    console.log('MatchModal: Fetching profiles for myUserId:', myUserId, 'and matchedUserId:', matchedUserId); // Log input IDs

    const fetchDogProfiles = async () => {
      setLoading(true);
      setError('');
      try {
        const headers = {
          'ngrok-skip-browser-warning': 'true',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        };

        const [myProfileResponse, matchedProfileResponse] = await Promise.all([
          fetch(`${BASE_URL}/api/home/user/${myUserId}`, { headers }),
          fetch(`${BASE_URL}/api/home/user/${matchedUserId}`, { headers })
        ]);

        if (!myProfileResponse.ok || !matchedProfileResponse.ok) {
          throw new Error('프로필 정보를 불러오는 데 실패했습니다.');
        }

        const myProfile = await myProfileResponse.json();
        const matchedProfile = await matchedProfileResponse.json();

        console.log('MatchModal: My Profile Data:', myProfile); // Log my profile data
        console.log('MatchModal: Matched Profile Data:', matchedProfile); // Log matched profile data

        const myDogData = myProfile.dogs && myProfile.dogs.length > 0 ? myProfile.dogs[0] : null;
        const matchedDogData = matchedProfile.dogs && matchedProfile.dogs.length > 0 ? matchedProfile.dogs[0] : null;

        setMyDog(myDogData);
        setMatchedDog(matchedDogData);

      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDogProfiles();
  }, [isOpen, myUserId, matchedUserId]);

  if (!isOpen) return null;

  return (
    <div className="match-modal-overlay" onClick={onClose}>
      <div className="match-modal-content" onClick={(e) => e.stopPropagation()}>
        {loading && <p>프로필을 불러오는 중...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {!loading && !error && myDog && matchedDog && (
          <>
            <h2 className="match-modal-title">It's a Match!</h2>
            <p className="match-modal-subtitle">{matchedDog.ownerNickname || '상대방'}님과 성공적으로 매치되었습니다.</p>
            <div className="match-modal-profiles">
              <div className="match-modal-profile-item">
                <img src={myDog.photoUrl || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500'} alt={myDog.name} className="match-modal-dog-image" />
                <p>{myDog.name}</p>
              </div>
              <FaHeart className="match-modal-heart-icon" />
              <div className="match-modal-profile-item">
                <img src={matchedDog.photoUrl || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500'} alt={matchedDog.name} className="match-modal-dog-image" />
                <p>{matchedDog.name}</p>
              </div>
            </div>
            <div className="match-modal-actions">
              <button onClick={onClose} className="match-modal-close-btn">계속 탐색하기</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MatchModal;
