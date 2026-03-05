import { useState } from 'react';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext';
import '../css/AuthPages.css';

const registerSchema = z
  .object({
    email: z.string().email('Email invalide'),
    password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
    passwordConfirm: z.string().min(8, 'La confirmation doit contenir au moins 8 caractères'),
    firstname: z.string().optional().default(''),
    name: z.string().optional().default(''),
    joinOrCreate: z.enum(['join', 'create']),
    householdName: z.string().optional(),
    inviteCode: z.string().min(4, 'Le code doit contenir au moins 4 caractères'),
  })
  .refine(data => data.password === data.passwordConfirm, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['passwordConfirm'],
  })
  .refine(
    data => {
      if (data.joinOrCreate === 'create') {
        return data.householdName && data.householdName.length > 0;
      }
      return true;
    },
    {
      message: 'Le nom du foyer est requis',
      path: ['householdName'],
    }
  );

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { register, loading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    firstname: '',
    name: '',
    joinOrCreate: 'join', // 'join' ou 'create'
    householdName: '',
    inviteCode: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormData, string>>>({});
  const [generalError, setGeneralError] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name as keyof RegisterFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGeneralError('');
    setErrors({});

    try {
      // Validate form data
      const validatedData = registerSchema.parse(formData);

      // Prepare the data for registration
      const registerData: any = {
        email: validatedData.email,
        password: validatedData.password,
        firstname: validatedData.firstname,
        name: validatedData.name,
        inviteCode: validatedData.inviteCode,
      };

      // Add householdName if creating a new household
      if (validatedData.joinOrCreate === 'create') {
        registerData.householdName = validatedData.householdName;
      }

      // Use the register method from AuthContext
      await register(registerData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle validation errors
        const fieldErrors: Partial<Record<keyof RegisterFormData, string>> = {};
        error.issues.forEach(err => {
          const path = err.path[0] as keyof RegisterFormData;
          fieldErrors[path] = err.message;
        });
        setErrors(fieldErrors);
      } else if (error instanceof Error) {
        // Handle API errors
        const message = error.message || "Erreur lors de l'inscription";
        setGeneralError(message);
      } else {
        setGeneralError("Une erreur inconnue s'est produite");
      }
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1 className="auth-page-title">PLANT'EAU</h1>
        <div className="auth-card">
          <div className="auth-content">
            <div className="auth-form-section">
              <h2 className="auth-form-title">Créer un compte</h2>
              <p className="auth-form-subtitle">
                Vous avez déjà un compte ?&nbsp;&nbsp;&nbsp;
                <Link to="/login" className="auth-link">
                  Se connecter
                </Link>
              </p>

              {generalError && <div className="error-message">{generalError}</div>}

              <form onSubmit={handleSubmit} className="auth-form" noValidate>
                <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
                  <legend style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>
                    Type de compte
                  </legend>
                  <div
                    className="form-group"
                    style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}
                  >
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <input
                        id="joinOrCreate-join"
                        type="radio"
                        name="joinOrCreate"
                        value="join"
                        checked={formData.joinOrCreate === 'join'}
                        onChange={handleInputChange}
                        disabled={loading}
                      />
                      Rejoindre un foyer existant
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <input
                        id="joinOrCreate-create"
                        type="radio"
                        name="joinOrCreate"
                        value="create"
                        checked={formData.joinOrCreate === 'create'}
                        onChange={handleInputChange}
                        disabled={loading}
                      />
                      Créer un nouveau foyer
                    </label>
                  </div>
                </fieldset>

                {formData.joinOrCreate === 'create' && (
                  <div className="form-group">
                    <label htmlFor="householdName" className="form-label">
                      Nom du foyer
                    </label>
                    <input
                      type="text"
                      id="householdName"
                      name="householdName"
                      className="form-input"
                      value={formData.householdName}
                      onChange={handleInputChange}
                      disabled={loading}
                      placeholder="Ma famille, Coloc, ..."
                      aria-invalid={!!errors.householdName}
                      aria-describedby={errors.householdName ? 'householdName-error' : undefined}
                    />
                    {errors.householdName && (
                      <span className="field-error" id="householdName-error">
                        {errors.householdName}
                      </span>
                    )}
                  </div>
                )}
                <div className="form-group">
                  <label htmlFor="inviteCode" className="form-label">
                    Code d'invitation{' '}
                    {formData.joinOrCreate === 'create' ? 'à choisir' : 'du foyer'}
                  </label>
                  <input
                    type="text"
                    id="inviteCode"
                    name="inviteCode"
                    className="form-input"
                    value={formData.inviteCode}
                    onChange={handleInputChange}
                    disabled={loading}
                    placeholder={
                      formData.joinOrCreate === 'create' ? 'Ex: FAMILLE2024' : 'Ex: code reçu'
                    }
                    aria-invalid={!!errors.inviteCode}
                    aria-describedby={errors.inviteCode ? 'inviteCode-error' : undefined}
                  />
                  {errors.inviteCode && (
                    <span className="field-error" id="inviteCode-error">
                      {errors.inviteCode}
                    </span>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="firstname" className="form-label">
                    Prénom
                  </label>
                  <input
                    type="text"
                    id="firstname"
                    name="firstname"
                    className="form-input"
                    value={formData.firstname}
                    onChange={handleInputChange}
                    disabled={loading}
                    placeholder="John"
                    aria-invalid={!!errors.firstname}
                    aria-describedby={errors.firstname ? 'firstname-error' : undefined}
                  />
                  {errors.firstname && (
                    <span className="field-error" id="firstname-error">
                      {errors.firstname}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    Nom
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-input"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={loading}
                    placeholder="Doe"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                  />
                  {errors.name && (
                    <span className="field-error" id="name-error">
                      {errors.name}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-input"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={loading}
                    placeholder="john@gmail.com"
                    required
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                  />
                  {errors.email && (
                    <span className="field-error" id="email-error">
                      {errors.email}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="password" className="form-label">
                    Mot de passe
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="form-input"
                    value={formData.password}
                    onChange={handleInputChange}
                    disabled={loading}
                    placeholder="••••••••"
                    required
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? 'password-error' : undefined}
                  />
                  {errors.password && (
                    <span className="field-error" id="password-error">
                      {errors.password}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="passwordConfirm" className="form-label">
                    Confirmer le mot de passe
                  </label>
                  <input
                    type="password"
                    id="passwordConfirm"
                    name="passwordConfirm"
                    className="form-input"
                    value={formData.passwordConfirm}
                    onChange={handleInputChange}
                    disabled={loading}
                    placeholder="••••••••"
                    required
                    aria-invalid={!!errors.passwordConfirm}
                    aria-describedby={errors.passwordConfirm ? 'passwordConfirm-error' : undefined}
                  />
                  {errors.passwordConfirm && (
                    <span className="field-error" id="passwordConfirm-error">
                      {errors.passwordConfirm}
                    </span>
                  )}
                </div>

                <button type="submit" disabled={loading} className="auth-button">
                  {loading ? 'Inscription en cours...' : "S'inscrire"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
