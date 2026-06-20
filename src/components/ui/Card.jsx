import React from 'react';
import './Card.css';

const Card = ({ children, className = '', glass = false, hover = false, ...props }) => {
  const baseClass = glass ? 'card glass' : 'card shadow-soft';
  const hoverClass = hover ? 'shadow-hover' : '';
  
  return (
    <div className={`${baseClass} ${hoverClass} ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;
