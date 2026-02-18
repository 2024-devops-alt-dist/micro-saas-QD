import { useState, useEffect, useRef } from 'react';
import Navbar from '../../../components/Navbar';
import '../css/Profil.css';
import { authService } from '../service/authService';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Profil() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await authService.getCurrentUser();
        setUser(res.user);
      } catch (err) {
        setError('Erreur lors du chargement du profil');
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  const handlePhotoUpload = async (file: File) => {
    setUploading(true);
    try {
      // Upload image
      const formData = new FormData();
      formData.append('file', file);
      const apiUrl = import.meta.env.VITE_API_BASE_URL || '';
      const res = await axios.post(`${apiUrl}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      // Update user photo in DB
      const photoUrl = res.data.url;
      await axios.put(`${apiUrl}/users/${user.id}`, { photo: photoUrl }, { withCredentials: true });
      setUser((u: any) => ({ ...u, photo: photoUrl }));
    } catch (err) {
      alert("Erreur lors de l'upload de la photo");
    } finally {
      setUploading(false);
    }
  };

  if (loading)
    return (
      <div className="navbar-layout">
        <Navbar />
        <div className="page-centered">Chargement...</div>
      </div>
    );
  if (error)
    return (
      <div className="navbar-layout">
        <Navbar />
        <div className="page-centered text-red-500">{error}</div>
      </div>
    );
  if (!user) return null;

  return (
    <div className="navbar-layout">
      <Navbar />
      <div className="page-centered profil-container">
        <h2 className="profil-title">Mon Profil</h2>
        <div className="profil-card">
          <div className="profil-avatar-section">
            <img
              src={
                user.photo
                  ? import.meta.env.VITE_API_BASE_URL?.replace('/api', '') + user.photo
                  : '/assets/images/avatar.png'
              }
              alt="Avatar"
              className="profil-avatar-img"
            />
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={e => {
                if (e.target.files && e.target.files[0]) handlePhotoUpload(e.target.files[0]);
              }}
            />
            <button
              className="profil-upload-btn"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              style={{ marginTop: '0.5rem' }}
            >
              {uploading ? 'Envoi...' : 'Changer la photo'}
            </button>
          </div>
          <div className="profil-info-section">
            <div>
              <strong>Prénom :</strong> {user.firstname}
            </div>
            <div>
              <strong>Nom :</strong> {user.name}
            </div>
            <div>
              <strong>Email :</strong> {user.email}
            </div>
            <div>
              <strong>Rôle :</strong> {user.role}
            </div>
            {user.inviteCode && (
              <div>
                <strong>Code d'invitation :</strong>{' '}
                <span className="profil-invite-code">{user.inviteCode}</span>
              </div>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2.5rem' }}>
          <button
            className="profil-logout-btn"
            onClick={async () => {
              await authService.logout();
              navigate('/login');
            }}
          >
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  );
}
