// src/components/UserInfoForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from './Input';
import Select from './Select';
import './FormLayout.css';

const regionOptions = [
    { value: 'seoul', label: '서울' },
    { value: 'busan', label: '부산' },
    { value: 'incheon', label: '인천' },
    { value: 'gwangju', label: '광주' },
    { value: 'daegu', label: '대구' },
    { value: 'daejeon', label: '대전' },
    { value: 'sejong', label: '세종' },
    { value: 'ulsan', label: '울산' },
    { value: 'gyeonggi', label: '경기' },
];

const genderOptions = [
    { value: 'male', label: '남성' },
    { value: 'female', label: '여성' },
];

function UserInfoForm() {
    const [formData, setFormData] = useState({
        nickname: '',
        id: '',
        password: '',
        passwordConfirm: '',
        region: '',
        gender: '',
    });
    // error 상태를 객체로 변경
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // 입력이 변경될 때 해당 필드의 에러 메시지 제거
        setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let newErrors = {};
        let isValid = true;

        if (formData.password !== formData.passwordConfirm) {
            newErrors.passwordConfirm = '비밀번호가 일치하지 않습니다.';
            isValid = false;
        }

        // 다른 필드에 대한 유효성 검사 추가 (예시)
        if (!formData.nickname) {
            newErrors.nickname = '별명을 입력해주세요.';
            isValid = false;
        }
        if (!formData.id) {
            newErrors.id = 'ID를 입력해주세요.';
            isValid = false;
        }
        if (!formData.password) {
            newErrors.password = '비밀번호를 입력해주세요.';
            isValid = false;
        }
        if (!formData.region) {
            newErrors.region = '사는곳을 선택해주세요.';
            isValid = false;
        }
        if (!formData.gender) {
            newErrors.gender = '성별을 선택해주세요.';
            isValid = false;
        }


        setErrors(newErrors);

        if (isValid) {
            navigate('/signup-dog', { state: { userInfo: formData } });
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
                    <Input label="ID" type="text" name="id" value={formData.id} onChange={handleChange} required error={errors.id} />
                    <Input label="PW" type="password" name="password" value={formData.password} onChange={handleChange} required error={errors.password} />
                    <Input label="PW 확인" type="password" name="passwordConfirm" value={formData.passwordConfirm} onChange={handleChange} required error={errors.passwordConfirm} />
                    <Select label="사는곳" name="region" value={formData.region} onChange={handleChange} options={regionOptions} error={errors.region} />
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