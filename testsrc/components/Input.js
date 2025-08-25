// src/components/Input.js
import React from 'react';
import './Input.css';

function Input({ label, type, name, value, onChange, required = false, error, icon, placeholder }) {
  return (
    <div className="input-group">
      <label htmlFor={name} className="label">{label}</label>
      <div className="input-wrapper">
        {icon && <span className="input-icon">{icon}</span>}
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className={`input ${icon ? 'with-icon' : ''}`}
        />
      </div>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default Input;