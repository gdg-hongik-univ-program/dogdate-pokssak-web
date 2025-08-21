// src/components/UserInfoForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from './Input';
import Select from './Select';
import './FormLayout.css';
import { BASE_URL } from '../config';

const koreanRegions = {
    seoul: { label: '서울', districts: ['강남구', '강동구', '강북구', '강서구', '관악구', '광진구', '구로구', '금천구', '노원구', '도봉구', '동대문구', '동작구', '마포구', '서대문구', '서초구', '성동구', '성북구', '송파구', '양천구', '영등포구', '용산구', '은평구', '종로구', '중구', '중랑구'] },
    busan: { label: '부산', districts: ['강서구', '금정구', '기장군', '남구', '동구', '동래구', '부산진구', '북구', '사상구', '사하구', '서구', '수영구', '연제구', '영도구', '중구', '해운대구'] },
    incheon: { label: '인천', districts: ['강화군', '계양구', '남동구', '동구', '미추홀구', '부평구', '서구', '연수구', '옹진군', '중구'] },
    gwangju: { label: '광주', districts: ['광산구', '남구', '동구', '북구', '서구'] },
    daegu: { label: '대구', districts: ['군위군', '남구', '달서구', '달성군', '동구', '북구', '서구', '수성구', '중구'] },
    daejeon: { label: '대전', districts: ['대덕구', '동구', '서구', '유성구', '중구'] },
    sejong: { label: '세종', districts: ['세종시'] },
    ulsan: { label: '울산', districts: ['남구', '동구', '북구', '울주군', '중구'] },
    gyeonggi: { label: '경기', districts: ['가평군', '고양시', '과천시', '광명시', '광주시', '구리시', '군포시', '김포시', '남양주시', '동두천시', '부천시', '성남시', '수원시', '시흥시', '안산시', '안성시', '안양시', '양주시', '양평군', '여주시', '연천군', '오산시', '용인시', '의왕시', '의정부시', '이천시', '파주시', '평택시', '포천시', '하남시', '화성시'] },
};

const regionOptions = Object.keys(koreanRegions).map(key => ({
    value: key,
    label: koreanRegions[key].label,
}));

const genderOptions = [
    { value: 'male', label: '남성' },
    { value: 'female', label: '여성' },
];

function UserInfoForm() {
    const [formData, setFormData] = useState({
        nickname: '',
        userId: '',
        password: '',
        passwordConfirm: '',
        region: '', // 시/도 (영문 value)
        district: '', // 시/군/구 (한글 label)
        gender: '',
    });
    const [districtOptions, setDistrictOptions] = useState([]);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        if (formData.region && koreanRegions[formData.region]) {
            const districts = koreanRegions[formData.region].districts.map(d => ({ value: d, label: d }));
            setDistrictOptions(districts);
        } else {
            setDistrictOptions([]);
        }
    }, [formData.region]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => {
            const newState = { ...prev, [name]: value };
            if (name === 'region') {
                newState.district = ''; // 시/도 변경 시 구/군 초기화
            }
            return newState;
        });
        setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let newErrors = {};
        let isValid = true;

        if (formData.password !== formData.passwordConfirm) {
            newErrors.passwordConfirm = '비밀번호가 일치하지 않습니다.';
            isValid = false;
        }

        if (!formData.nickname) newErrors.nickname = '별명을 입력해주세요.';
        if (!formData.userId) newErrors.userId = 'ID를 입력해주세요.';
        if (!formData.password) newErrors.password = '비밀번호를 입력해주세요.';
        if (!formData.region) newErrors.region = '사는곳(시/도)을 선택해주세요.';
        if (!formData.district) newErrors.district = '시/군/구를 선택해주세요.';
        if (!formData.gender) newErrors.gender = '성별을 선택해주세요.';

        if (Object.keys(newErrors).length > 0 || !isValid) {
            setErrors(newErrors);
            return;
        }

        // API 명세에 맞게 데이터 재구성
        const apiData = {
            nickname: formData.nickname,
            userId: formData.userId, // 'userId' 키에 userId 값 할당
            password: formData.password,
            confirmPassword: formData.passwordConfirm,
            gender: genderOptions.find(opt => opt.value === formData.gender)?.label || '',
            city: koreanRegions[formData.region]?.label || '', // 'city' 키에 시/도 한글 이름 할당
            district: formData.district, // 'district' 키에 시/군/구 이름 할당
        };

        console.log('API로 전송할 데이터:', apiData); // 데이터 확인용 로그

        try {
            const response = await fetch(` ${BASE_URL}/api/users/signup`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true'
                },
                body: JSON.stringify(apiData),
            });

            if (response.ok) {
                const responseData = await response.json();
                console.log('회원 정보 저장 성공:', responseData);
                // 다음 페이지로 사용자 ID 또는 전체 정보를 전달할 수 있습니다.
                navigate('/signup-dog', { state: { userId: responseData.id } });
            } else {
                const errorData = await response.json().catch(() => ({ message: '알 수 없는 오류' }));
                alert(`회원가입 실패: ${errorData.message || errorData.userId || '잘못된 요청입니다.'}`);
                console.error('회원가입 실패:', errorData);
            }
        } catch (error) {
            console.error('회원가입 API 호출 오류:', error);
            alert('회원가입 중 문제가 발생했습니다.');
        }
    };

    return (
        <div className="form-layout-container">
            <header className="header">
                <button className="back-button" onClick={() => navigate('/login')}>
                    <i className="fa-solid fa-arrow-left"></i>
                </button>
                <h1 className="header-title">회원 정보 입력</h1>
                <div style={{ width: '2rem' }}></div>
            </header>
            <main className="content">
                <form onSubmit={handleSubmit} className="form-content">
                    <Input label="별명" type="text" name="nickname" value={formData.nickname} onChange={handleChange} required error={errors.nickname} />
                    <Input label="userId" type="text" name="userId" value={formData.userId} onChange={handleChange} required error={errors.userId} />
                    <Input label="PW" type="password" name="password" value={formData.password} onChange={handleChange} required error={errors.password} />
                    <Input label="PW 확인" type="password" name="passwordConfirm" value={formData.passwordConfirm} onChange={handleChange} required error={errors.passwordConfirm} />
                    <Select label="사는곳 (시/도)" name="region" value={formData.region} onChange={handleChange} options={regionOptions} error={errors.region} />
                    {formData.region && (
                        <Select label="시/군/구" name="district" value={formData.district} onChange={handleChange} options={districtOptions} error={errors.district} />
                    )}
                    <Select label="성별" name="gender" value={formData.gender} onChange={handleChange} options={genderOptions} error={errors.gender} />
                    <div className="bottom-action">
                        <button type="submit" className="submit-button">다음</button>
                    </div>
                </form>
            </main>
        </div>
    );
}

export default UserInfoForm;
