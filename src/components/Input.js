// src/components/Input.js
import React from 'react';
import './Input.css';

function Input({ label, type, name, value, onChange, required = false, error, placeholder, icon }) {
  return (
    <div className="input-group">
      <label htmlFor={name} className="label">{label}</label>
      <div className="input-wrapper">
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className="input"
          placeholder={placeholder}
        />
        {icon && <div className="input-icon">{icon}</div>}
      </div>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default Input;
