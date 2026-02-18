import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../authentication/service/authService';
import '../css/Header.css';

interface HeaderProps {
  avatarSrc: string;
}

const Header: React.FC<HeaderProps> = ({ avatarSrc }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [userName, setUserName] = useState<string>('Utilisateur');
  const popupRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Charger le nom de l'utilisateur connecté
  useEffect(() => {
    const loadUserName = async () => {
      try {
        // Essayer d'abord récupérer du localStorage (sauvegardé au login)
        const storedName = localStorage.getItem('user_firstname');
        if (storedName) {
          setUserName(storedName);
          return;
        }

        // Fallback : appeler l'API si pas en localStorage
        const response = await authService.getCurrentUser();
        setUserName(response.user.firstname);
        localStorage.setItem('user_firstname', response.user.firstname);
      } catch (error) {
        console.error('Failed to load user name:', error);
      }
    };
    loadUserName();
  }, []);

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
              ? avatarSrc.startsWith('/uploads/')
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
                onClick={async () => {
                  await authService.logout();
                  navigate('/login', { replace: true });
                }}
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
