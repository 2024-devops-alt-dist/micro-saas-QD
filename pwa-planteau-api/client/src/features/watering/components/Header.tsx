import React from 'react';
import '../css/Header.css';

interface HeaderProps {
  name: string;
  avatarSrc: string;
}

const Header: React.FC<HeaderProps> = ({ name, avatarSrc }) => (
  <div className="flex items-center justify-between mb-2">
    <h2 className="header-title">Bonjour {name}</h2>
    <img
      src={avatarSrc}
      alt="avatar"
      className="w-15 h-15 rounded-full border-4 avatar-border object-cover"
    />
  </div>
);

export default Header;
