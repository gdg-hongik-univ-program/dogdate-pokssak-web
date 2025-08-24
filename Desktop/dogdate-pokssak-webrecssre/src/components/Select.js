// src/components/Select.js
import React from 'react';
import './Select.css';

function Select({ label, name, value, onChange, options, error }) {
  return (
    <div className="select-group">
      <label htmlFor={name} className="label">{label}</label>
      <select id={name} name={name} value={value} onChange={onChange} className="select">
        <option value="">-- 선택하세요 --</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default Select;