import React, { useEffect } from 'react';
import { burstHearts } from '../utils/confetti';

export const FloatingHearts: React.FC = () => {
  useEffect(() => {
    // Continuous ambient floating hearts matching user script interval
    const interval = setInterval(() => {
      const box = document.getElementById('hearts');
      if (box) {
        const h = document.createElement('div');
        const symbols = ['♡', '♥', '✦', '❤'];
        h.className = 'heart-particle text-rose-400/50 drop-shadow-sm';
        h.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        h.style.left = Math.random() * 100 + 'vw';
        h.style.top = 70 + Math.random() * 30 + 'vh';
        h.style.fontSize = 12 + Math.random() * 20 + 'px';
        h.style.animationDelay = Math.random() * 0.5 + 's';
        h.style.animationDuration = '4.5s';
        box.appendChild(h);
        setTimeout(() => h.remove(), 4500);
      }
    }, 2200);

    return () => clearInterval(interval);
  }, []);

  const handleScreenClick = (e: React.MouseEvent) => {
    // Only spawn a single tiny heart on ambient clicks
    const box = document.getElementById('hearts');
    if (!box) return;
    const h = document.createElement('div');
    h.className = 'heart-particle text-rose-500/70 drop-shadow-sm';
    h.textContent = ['♡', '♥', '✨'][Math.floor(Math.random() * 3)];
    h.style.left = `${e.clientX - 10}px`;
    h.style.top = `${e.clientY - 10}px`;
    h.style.fontSize = '20px';
    h.style.animationDuration = '2.2s';
    box.appendChild(h);
    setTimeout(() => h.remove(), 2200);
  };

  return (
    <div
      id="hearts"
      aria-hidden="true"
      onClick={handleScreenClick}
      className="fixed inset-0 pointer-events-none z-30 overflow-hidden"
    />
  );
};
