import confetti from 'canvas-confetti';
import { soundManager } from './audio';

// Matches user's exact burstHearts DOM mechanism
export function burstHearts(amount = 10) {
  soundManager.playSparkle();

  const box = document.getElementById('hearts');
  if (box) {
    const symbols = ['♡', '♥', '✦', '❤', '🌸', '✨'];
    for (let i = 0; i < amount; i++) {
      const h = document.createElement('div');
      h.className = 'heart-particle text-rose-500/80 drop-shadow-sm';
      h.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      h.style.left = Math.random() * 95 + 'vw';
      h.style.top = 70 + Math.random() * 25 + 'vh';
      h.style.fontSize = 14 + Math.random() * 26 + 'px';
      h.style.animationDelay = Math.random() * 0.5 + 's';
      h.style.animationDuration = 3.5 + Math.random() * 2 + 's';
      box.appendChild(h);
      setTimeout(() => h.remove(), 5500);
    }
  }

  // Also trigger canvas confetti when amount is large
  if (amount >= 15) {
    confetti({
      particleCount: amount * 2,
      spread: 70,
      origin: { y: 0.65 },
      colors: ['#f43f5e', '#fb7185', '#fda4af', '#e11d48', '#ffe4e6', '#fbbf24'],
      shapes: ['circle'],
      disableForReducedMotion: true,
    });
  }
}

export function triggerGrandCelebration() {
  soundManager.playSparkle();
  burstHearts(30);

  const duration = 2.5 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

  const interval: any = setInterval(function () {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.4), y: Math.random() - 0.2 },
      colors: ['#e11d48', '#f43f5e', '#fb7185', '#fda4af', '#fde047'],
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.6, 0.9), y: Math.random() - 0.2 },
      colors: ['#e11d48', '#f43f5e', '#fb7185', '#fda4af', '#fde047'],
    });
  }, 250);
}

function randomInRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
