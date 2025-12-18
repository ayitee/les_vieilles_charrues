'use client';

import { useState, useEffect } from 'react';

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';

export function EncryptedTitle() {
  const [text, setText] = useState('');
  const [fade, setFade] = useState(true);

  useEffect(() => {
    // Set initial text with random length 4-9
    const length = Math.floor(Math.random() * 6) + 4; // 4-9
    setText(Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join(''));

    // Update every 500ms
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        const length = Math.floor(Math.random() * 6) + 4; // 4-9
        setText(Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join(''));
        setFade(true);
      }, 150);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <span 
      className="font-adhesive tracking-wider transition-opacity duration-150" 
      style={{ opacity: fade ? 1 : 0 }}
    >
      {text}
    </span>
  );
}
