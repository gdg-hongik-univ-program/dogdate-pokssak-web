// src/components/Input.js
import React from 'react';
import './Input.css';

function Input({ label, type, name, value, onChange, required = false }) {
  return (
    <div className="input-group">
      <label htmlFor={name} className="label">{label}</label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="input"
      />
    </div>
  );
}

export default Input;