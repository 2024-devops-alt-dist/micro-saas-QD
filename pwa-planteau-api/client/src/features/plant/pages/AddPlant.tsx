import React, { useState } from 'react';
import { authService } from '../../authentication/service/authService';
import Upload from '../../upload/Upload';
import Navbar from '../../../components/Navbar';
import '../css/AddPlant.css';
import { useNavigate } from 'react-router-dom';

const initialState = {
  name: '',
  scientificName: '',
  type: '',
  image: '',
  waterNeed: '',
  room: '',
  // userId et householdId seront renseignés automatiquement
};

const AddPlant: React.FC = () => {
  const [form, setForm] = useState(initialState);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileSelect = (file: File | null) => {
    setFile(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(undefined);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let imageUrl = form.image;
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      // Récupère le token JWT du localStorage
      const token = localStorage.getItem('jwt_token');
      const API_URL = `${import.meta.env.VITE_API_BASE_URL}/upload`;
      try {
        const res = await fetch(API_URL, {
          method: 'POST',
          body: formData,
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          credentials: 'include',
        });
        const data = await res.json();
        // Correction: l'URL doit pointer vers /uploads
        imageUrl = data.url.replace('/assets/images/', '/uploads/');
      } catch (err) {
        alert('Erreur lors de l’upload de la photo');
        return;
      }
    }
    // Récupère user_id automatiquement via l'utilisateur connecté
    try {
      const userInfo = await authService.getCurrentUser();
      const user_id = userInfo.user.id;
      // TODO: Récupérer household_id via un autre appel ou contexte si besoin
      const household_id = 1; // Remplace 1 par la vraie logique si besoin
      const API_PLANTS_URL = `${import.meta.env.VITE_API_BASE_URL}/plants`;
      const res = await fetch(API_PLANTS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          scientific_name: form.scientificName,
          type: form.type,
          photo: imageUrl,
          water_need: form.waterNeed,
          room: form.room,
          user_id,
          household_id,
        }),
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Erreur lors de la création de la plante');
      alert('Plante ajoutée avec succès !');
    } catch (err) {
      alert('Erreur lors de la création de la plante');
    }
  };

  return (
    <div className="navbar-layout">
      <Navbar />
      <div
        className="page-centered p-2 flex-1 flex flex-col overflow-y-auto"
        style={{ height: '90vh', maxHeight: '90vh' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div />
          <span className="add-plant-header text-xl text-center flex-1">Ajouter une plante</span>
          <button
            className="text-gray-400 text-2xl font-bold"
            type="button"
            onClick={() => navigate(-1)}
          >
            &times;
          </button>
        </div>
        <form className="add-plant-form" onSubmit={handleSubmit}>
          <label>
            Nom commun
            <input name="name" value={form.name} onChange={handleChange} required />
          </label>
          <label>
            Nom scientifique
            <input
              name="scientificName"
              value={form.scientificName}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Type
            <select name="type" value={form.type} onChange={handleChange} required>
              <option value="">Sélectionner un type</option>
              <option value="TROPICAL">Tropical</option>
              <option value="DESERT">Désert</option>
              <option value="TEMPERATE">Tempéré</option>
              <option value="SUCCULENT">Succulente</option>
              <option value="AQUATIC">Aquatique</option>
              <option value="MEDITERRANEAN">Méditerranéenne</option>
              <option value="BONSAI">Bonsaï</option>
              <option value="ORCHID">Orchidée</option>
            </select>
          </label>
          <label>
            Photo
            <Upload onFileSelect={handleFileSelect} previewUrl={previewUrl} />
          </label>
          <label>
            Besoins en eau
            <input name="waterNeed" value={form.waterNeed} onChange={handleChange} required />
          </label>
          <label>
            Pièce
            <input name="room" value={form.room} onChange={handleChange} required />
          </label>
          {/*
            Les champs User ID et Household ID sont renseignés automatiquement côté client.
            TODO: Récupérer household_id via un autre appel ou contexte si besoin.
          */}
          <button type="submit" className="add-plant-btn">
            Ajouter
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPlant;
