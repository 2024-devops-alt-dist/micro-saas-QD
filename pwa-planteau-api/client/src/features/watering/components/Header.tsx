import React from 'react';

interface HeaderProps {
  name: string;
  avatarSrc: string;
}

const Header: React.FC<HeaderProps> = ({ name, avatarSrc }) => (
  <div className="flex items-center justify-between mb-2">
    <div className="font-pacifico text-green-900 text-xl">Bonjour {name}</div>
    <img
      src={avatarSrc}
      alt="avatar"
      className="w-15 h-15 rounded-full border-2 border-green-300 object-cover"
    />
  </div>
);

export default Header;
