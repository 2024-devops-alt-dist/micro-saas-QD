import React, { useState } from 'react';
import { useAuth } from '../../authentication/context/AuthContext';
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
  const { user } = useAuth();
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
      const API_URL = `${import.meta.env.VITE_API_BASE_URL}/upload`;
      try {
        setIsLoading(true);
        const res = await fetch(API_URL, {
          method: 'POST',
          body: formData,
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

      // User is already available from AuthContext
      if (!user) {
        setError('Utilisateur non trouvé');
        setIsLoading(false);
        return;
      }

      const user_id = user.id;
      const household_id = user.household_id;
      const API_PLANTS_URL = `${import.meta.env.VITE_API_BASE_URL}/plants`;
      const res = await fetch(API_PLANTS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
          <span className="add-plant-header text-xl text-center flex-1" id="add-plant-form-title">
            Ajouter une plante
          </span>
          <button
            className="text-gray-400 text-2xl font-bold"
            type="button"
            onClick={() => navigate(-1)}
          >
            &times;
          </button>
        </div>
        {error && <div className="error-message">{error}</div>}
        <section aria-labelledby="add-plant-form-title">
          <form className="add-plant-form" onSubmit={handleSubmit} noValidate>
            <div>
              <label htmlFor="name">Nom commun</label>
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className={fieldErrors.name ? 'form-input-error' : ''}
                aria-invalid={!!fieldErrors.name}
                aria-describedby={fieldErrors.name ? 'name-error' : undefined}
              />
              {fieldErrors.name && (
                <div className="field-error" id="name-error">
                  {fieldErrors.name}
                </div>
              )}
            </div>
            <div>
              <label htmlFor="scientificName">Nom scientifique</label>
              <input
                id="scientificName"
                name="scientificName"
                value={form.scientificName}
                onChange={handleChange}
                required
                className={fieldErrors.scientificName ? 'form-input-error' : ''}
                aria-invalid={!!fieldErrors.scientificName}
                aria-describedby={fieldErrors.scientificName ? 'scientificName-error' : undefined}
              />
              {fieldErrors.scientificName && (
                <div className="field-error" id="scientificName-error">
                  {fieldErrors.scientificName}
                </div>
              )}
            </div>
            <div>
              <label htmlFor="type">Type</label>
              <select
                id="type"
                name="type"
                value={form.type}
                onChange={handleChange}
                required
                className={fieldErrors.type ? 'form-input-error' : ''}
                aria-invalid={!!fieldErrors.type}
                aria-describedby={fieldErrors.type ? 'type-error' : undefined}
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
              {fieldErrors.type && (
                <div className="field-error" id="type-error">
                  {fieldErrors.type}
                </div>
              )}
            </div>
            <div>
              <label htmlFor="photo">Photo</label>
              <Upload onFileSelect={handleFileSelect} previewUrl={previewUrl} />
            </div>
            <div>
              <label htmlFor="waterNeed">Besoins en eau</label>
              <input
                id="waterNeed"
                name="waterNeed"
                value={form.waterNeed}
                onChange={handleChange}
                required
                className={fieldErrors.waterNeed ? 'form-input-error' : ''}
                aria-invalid={!!fieldErrors.waterNeed}
                aria-describedby={fieldErrors.waterNeed ? 'waterNeed-error' : undefined}
              />
              {fieldErrors.waterNeed && (
                <div className="field-error" id="waterNeed-error">
                  {fieldErrors.waterNeed}
                </div>
              )}
            </div>
            <div>
              <label htmlFor="room">Pièce</label>
              <input
                id="room"
                name="room"
                value={form.room}
                onChange={handleChange}
                required
                className={fieldErrors.room ? 'form-input-error' : ''}
                aria-invalid={!!fieldErrors.room}
                aria-describedby={fieldErrors.room ? 'room-error' : undefined}
              />
              {fieldErrors.room && (
                <div className="field-error" id="room-error">
                  {fieldErrors.room}
                </div>
              )}
            </div>
            <button type="submit" className="add-plant-btn" disabled={isLoading}>
              {isLoading ? 'Ajout en cours...' : 'Ajouter'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default AddPlant;
