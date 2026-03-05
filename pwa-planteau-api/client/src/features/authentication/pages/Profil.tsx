import { useState, useRef } from 'react';
import Navbar from '../../../components/Navbar';
import '../css/Profil.css';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export default function Profil() {
  const { user, logout, loading } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handlePhotoUpload = async (file: File) => {
    if (!user) return;

    setUploading(true);
    try {
      // Upload image
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'user');
      const apiUrl = import.meta.env.VITE_API_BASE_URL || '';
      const res = await axios.post(`${apiUrl}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
      // Update user photo in DB
      const photoUrl = (res.data as { url: string }).url;
      await axios.put(
        `${apiUrl}/users/${user.id}`,
        { photo: photoUrl },
        {
          withCredentials: true,
        }
      );
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
  if (!user) return null;

  return (
    <div className="navbar-layout">
      <Navbar />
      <div className="page-centered profil-container">
        <h1 className="profil-title" id="profil-title">
          Mon Profil
        </h1>
        <section className="profil-card" aria-labelledby="profil-title">
          <section aria-labelledby="avatar-title" className="profil-avatar-section">
            <h2 id="avatar-title" style={{ display: 'none' }}>
              Photo de profil
            </h2>
            <img
              src={
                user.photo
                  ? user.photo.startsWith('http://') || user.photo.startsWith('https://')
                    ? user.photo
                    : import.meta.env.VITE_API_BASE_URL?.replace('/api', '') + user.photo
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
          </section>
          <section className="profil-info-section" aria-labelledby="info-title">
            <h2 id="info-title" style={{ display: 'none' }}>
              Informations personnelles
            </h2>
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
          </section>
        </section>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2.5rem' }}>
          <button className="profil-logout-btn" onClick={() => logout()}>
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  );
}
