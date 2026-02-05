import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../authentication/service/authService';
import '../css/Header.css';

interface HeaderProps {
  name: string;
  avatarSrc: string;
}

const Header: React.FC<HeaderProps> = ({ name, avatarSrc }) => {
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!showPopup) return;
    function handleClickOutside(e: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setShowPopup(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showPopup]);

  return (
    <div className="flex items-center justify-between mb-2 header-container">
      <h2 className="header-title">Bonjour {name}</h2>
      <div className="header-avatar-wrapper">
        <img
          src={avatarSrc}
          alt="avatar"
          className="w-15 h-15 rounded-full border-4 avatar-border object-cover cursor-pointer"
          onClick={() => setShowPopup(v => !v)}
          style={{ width: 60, height: 60 }}
        />
        {showPopup && (
          <div ref={popupRef} className="header-popup">
            <button
              className="header-logout-btn"
              onClick={async () => {
                await authService.logout();
                navigate('/login', { replace: true });
              }}
              onMouseDown={e => e.stopPropagation()}
            >
              Déconnexion
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
