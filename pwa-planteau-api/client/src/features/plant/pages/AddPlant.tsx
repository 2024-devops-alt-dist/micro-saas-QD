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
  const [error, setError] = useState<string>('');
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<string, string>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear error for this field when user starts typing
    if (fieldErrors[e.target.name]) {
      setFieldErrors(prev => ({
        ...prev,
        [e.target.name]: undefined,
      }));
    }
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
    setError('');
    setFieldErrors({});

    // Validation
    const errors: Partial<Record<string, string>> = {};
    if (!form.name) errors.name = 'Le nom commun est requis';
    if (!form.scientificName) errors.scientificName = 'Le nom scientifique est requis';
    if (!form.type) errors.type = 'Le type est requis';
    if (!form.waterNeed) errors.waterNeed = 'Les besoins en eau sont requis';
    if (!form.room) errors.room = 'La pièce est requise';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    let imageUrl = form.image;
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'plant');
      // Récupère le token JWT du localStorage
      const token = localStorage.getItem('jwt_token');
      const API_URL = `${import.meta.env.VITE_API_BASE_URL}/upload`;
      try {
        setIsLoading(true);
        const res = await fetch(API_URL, {
          method: 'POST',
          body: formData,
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          credentials: 'include',
        });
        const data = await res.json();
        imageUrl = data.url;
      } catch (err) {
        setError("Erreur lors de l'upload de la photo");
        setIsLoading(false);
        return;
      }
    }
    // Récupère user_id et household_id automatiquement via l'utilisateur connecté
    try {
      if (!file) setIsLoading(true);
      const userInfo = await authService.getCurrentUser();
      const user_id = userInfo.user.id;
      const household_id = userInfo.user.household_id;
      const API_PLANTS_URL = `${import.meta.env.VITE_API_BASE_URL}/plants`;
      const token = localStorage.getItem('jwt_token');
      const res = await fetch(API_PLANTS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
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
      // Rediriger vers la collection de plantes après succès
      navigate('/plants', { replace: true });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Erreur lors de la création de la plante';
      setError(message);
    } finally {
      setIsLoading(false);
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
        {error && <div className="error-message">{error}</div>}
        <form className="add-plant-form" onSubmit={handleSubmit} noValidate>
          <label>
            Nom commun
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className={fieldErrors.name ? 'form-input-error' : ''}
            />
            {fieldErrors.name && <div className="field-error">{fieldErrors.name}</div>}
          </label>
          <label>
            Nom scientifique
            <input
              name="scientificName"
              value={form.scientificName}
              onChange={handleChange}
              required
              className={fieldErrors.scientificName ? 'form-input-error' : ''}
            />
            {fieldErrors.scientificName && (
              <div className="field-error">{fieldErrors.scientificName}</div>
            )}
          </label>
          <label>
            Type
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              required
              className={fieldErrors.type ? 'form-input-error' : ''}
            >
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
            {fieldErrors.type && <div className="field-error">{fieldErrors.type}</div>}
          </label>
          <label>
            Photo
            <Upload onFileSelect={handleFileSelect} previewUrl={previewUrl} />
          </label>
          <label>
            Besoins en eau
            <input
              name="waterNeed"
              value={form.waterNeed}
              onChange={handleChange}
              required
              className={fieldErrors.waterNeed ? 'form-input-error' : ''}
            />
            {fieldErrors.waterNeed && <div className="field-error">{fieldErrors.waterNeed}</div>}
          </label>
          <label>
            Pièce
            <input
              name="room"
              value={form.room}
              onChange={handleChange}
              required
              className={fieldErrors.room ? 'form-input-error' : ''}
            />
            {fieldErrors.room && <div className="field-error">{fieldErrors.room}</div>}
          </label>
          <button type="submit" className="add-plant-btn" disabled={isLoading}>
            {isLoading ? 'Ajout en cours...' : 'Ajouter'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPlant;
