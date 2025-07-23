import React, { useEffect } from 'react';
import './Toast.css';

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // Auto-close after 3 seconds

    return () => {
      clearTimeout(timer);
    };
  }, [onClose]);

  return (
    <div className={`toast toast-${type}`}>
      <p>{message.text}</p>
      {message.action && message.actionText && (
        <button onClick={() => { message.action(); onClose(); }}>{message.actionText}</button>
      )}
      <button onClick={onClose}>&times;</button>
    </div>
  );
};

export default Toast;