import React, { useRef, useState } from 'react';

const TiltableDogCard = ({ dog, onClick, children }) => {
  const cardRef = useRef(null);
  const [transformStyle, setTransformStyle] = useState({});

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;

    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    const rotateX = (mouseY / (height / 2)) * -10; // Max 10deg rotation
    const rotateY = (mouseX / (width / 2)) * 10;  // Max 10deg rotation

    setTransformStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`,
      transition: 'none',
    });
  };

  const handleMouseLeave = () => {
    setTransformStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)',
      transition: 'transform 0.5s ease-in-out',
    });
  };

  return (
    <div 
      className="dog-card" 
      onClick={onClick}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={transformStyle}
    >
      {children}
    </div>
  );
};

export default TiltableDogCard;
