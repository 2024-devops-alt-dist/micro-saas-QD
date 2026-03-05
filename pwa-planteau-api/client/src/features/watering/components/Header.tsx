import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../authentication/context/AuthContext';
import '../css/Header.css';

interface HeaderProps {
  avatarSrc: string;
}

const Header: React.FC<HeaderProps> = ({ avatarSrc }) => {
  const { user, logout } = useAuth();
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const userName = user?.firstname || 'Utilisateur';

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
      <h2 className="header-title">Bonjour {userName}</h2>
      <div className="header-avatar-wrapper">
        <img
          src={
            avatarSrc
              ? avatarSrc.startsWith('http://') || avatarSrc.startsWith('https://')
                ? avatarSrc
                : avatarSrc.startsWith('/uploads/')
                  ? import.meta.env.VITE_API_BASE_URL?.replace('/api', '') + avatarSrc
                  : avatarSrc
              : '/assets/images/avatar.png'
          }
          alt="avatar"
          className="w-15 h-15 rounded-full border-4 avatar-border object-cover cursor-pointer"
          onClick={() => setShowPopup(v => !v)}
          style={{ width: 60, height: 60 }}
        />
        {showPopup && (
          <div ref={popupRef} className="header-popup">
            <div className="header-popup-btns">
              <button
                className="header-logout-btn header-profile-btn"
                onClick={() => {
                  setShowPopup(false);
                  navigate('/profil');
                }}
                onMouseDown={e => e.stopPropagation()}
              >
                Mon Profil
              </button>
              <button
                className="header-logout-btn"
                onClick={() => logout()}
                onMouseDown={e => e.stopPropagation()}
              >
                Déconnexion
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
