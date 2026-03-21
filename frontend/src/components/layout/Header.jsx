import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { List } from '@phosphor-icons/react';
import { ThemeToggle } from '../ui/theme-toggle';
import { publicUrl } from '@/lib/utils';

const Header = ({ darkMode, toggleDarkMode, toggleSidebar }) => {
  const navigate = useNavigate();
  const menuBtnRef = useRef(null);
  const [ripples, setRipples] = useState([]);

  const handleLogoClick = () => {
    navigate('/');
  };

  const [lastRipple, setLastRipple] = useState(0);
  const handleMenuRipple = (e) => {
    const now = Date.now();
    if (now - lastRipple < 400) return;
    setLastRipple(now);
    const btn = menuBtnRef.current;
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
    <nav className="fixed top-0 w-full z-50 glass-card border-b border-gray-200 dark:border-white/10 transition-all duration-300">
      <div className="container mx-auto px-4 md:px-8 py-3 flex justify-between items-center bg-transparent">

        <div className="flex items-center gap-3 cursor-pointer" onClick={handleLogoClick}>
          <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-success/30 shadow-lg shadow-success/20 flex-shrink-0">
            <img src={publicUrl('logo.png')} alt="منصة وزاري" className="w-full h-full object-cover" />
          </div>
          <div className="text-right flex flex-col justify-center">
            <h1 className="text-xl md:text-2xl font-head font-bold text-gray-900 dark:text-white tracking-wide">منصة وزاري</h1>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium" style={{ fontFamily: 'Cairo' }}>بإشراف الاستاذ كرار فاضل</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle isDark={darkMode} onToggle={toggleDarkMode} />
          <button
            ref={menuBtnRef}
            type="button"
            onPointerDown={handleMenuRipple}
            onClick={toggleSidebar}
            className="relative w-10 h-10 rounded-full flex items-center justify-center overflow-hidden backdrop-blur-xl bg-gray-200/90 dark:bg-white/10 border border-gray-300 dark:border-white/10 text-gray-800 dark:text-white shadow-lg">
            {ripples.map((r) => (
              <span key={r.id} className="ripple" style={{ left: r.x - 10, top: r.y - 10, width: 20, height: 20 }} />
            ))}
            <List className="text-2xl relative z-10" weight="bold" />
          </button>
        </div>

      </div>
    </nav>
  );
};

export default Header;