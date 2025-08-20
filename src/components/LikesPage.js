import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom'; // useOutletContext 임포트
import DogProfileCard from './DogprofileCard';
import './LikesPage.css';
import { BASE_URL } from '../config';

const LikesPage = () => {
  const { openModal } = useOutletContext(); // MainLayout에서 openModal 함수를 가져옴
  const [activeTab, setActiveTab] = useState('sent');
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchRequests = async () => {
      if (!userId) {
        setError('사용자 ID를 찾을 수 없습니다. 로그인해주세요.');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError('');

      try {
        // Fetch sent requests
        const sentResponse = await fetch(`${BASE_URL}/api/matches/requests/sent/${userId}`, {
          headers: { 'ngrok-skip-browser-warning': 'true' },
        });
        if (sentResponse.ok) {
          const data = await sentResponse.json();
          setSentRequests(data);
        } else {
          throw new Error(`보낸 매칭 요청 불러오기 실패: ${sentResponse.status} ${sentResponse.statusText}`);
        }

        // Fetch received requests
        const receivedResponse = await fetch(`${BASE_URL}/api/matches/requests/received/${userId}`, {
          headers: { 'ngrok-skip-browser-warning': 'true' },
        });
        if (receivedResponse.ok) {
          const data = await receivedResponse.json();
          setReceivedRequests(data);
        } else {
          throw new Error(`받은 매칭 요청 불러오기 실패: ${receivedResponse.status} ${receivedResponse.statusText}`);
        }

      } catch (err) {
        setError(err.message);
        console.error('Error fetching match requests:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, [userId]);

  if (isLoading) {
    return <div className="likes-page-container"><p>매칭 요청을 불러오는 중입니다...</p></div>;
  }

  if (error) {
    return <div className="likes-page-container"><p>오류: {error}</p></div>;
  }

  const dataToShow = activeTab === 'sent' ? sentRequests : receivedRequests;
