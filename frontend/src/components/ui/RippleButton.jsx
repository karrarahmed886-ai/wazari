import React, { useState, useRef } from 'react';

const RippleButton = ({ children, className, style, ...props }) => {
  const btnRef = useRef(null);
  const [ripples, setRipples] = useState([]);
  const lastRippleRef = useRef(0);

  const handleRipple = (e) => {
    const now = Date.now();
    if (now - lastRippleRef.current < 350) return;
    lastRippleRef.current = now;
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const clientX = e.touches?.[0]?.clientX ?? e.clientX;
    const clientY = e.touches?.[0]?.clientY ?? e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const id = now;
    setRipples((prev) => [...prev, { id, x, y }]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 750);
  };

  return (
    <button
      ref={btnRef}
      onPointerDown={handleRipple}
      type="button"
      className={`relative overflow-hidden ${className || ''}`}
      style={style}
      {...props}
    >
      {ripples.map((r) => (
        <span key={r.id} className="ripple" style={{ left: r.x - 10, top: r.y - 10, width: 20, height: 20 }} />
      ))}
      <span className="relative z-10 flex items-center justify-center gap-2 w-full">{children}</span>
    </button>
  );
};

export default RippleButton;