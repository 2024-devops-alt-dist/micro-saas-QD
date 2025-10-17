import '../assets/css/Navbar.css';

export default function Navbar() {
  return (
    <nav className="navbar-custom">
      <div className="navbar-home">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="20" fill="#FFD600" />
          <path d="M18 28V20H30V28" stroke="#0f4805" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <rect x="21" y="24" width="6" height="4" fill="#0f4805" />
        </svg>
      </div>
      <div className="navbar-icons">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M16 28C16 28 6 22 6 14C6 9.58 9.58 6 14 6C16.39 6 18.61 7.22 20 9.22C21.39 7.22 23.61 6 26 6C30.42 6 34 9.58 34 14C34 22 24 28 24 28H16Z" stroke="#0f4805" strokeWidth="2"/></svg>
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="12" stroke="#0f4805" strokeWidth="2"/><path d="M16 10V16L20 18" stroke="#0f4805" strokeWidth="2" strokeLinecap="round"/></svg>
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M16 6C11.58 6 8 9.58 8 14V20L6 22V24H26V22L24 20V14C24 9.58 20.42 6 16 6Z" stroke="#0f4805" strokeWidth="2"/><circle cx="16" cy="28" r="2" fill="#0f4805"/></svg>
      </div>
    </nav>
  );
}
