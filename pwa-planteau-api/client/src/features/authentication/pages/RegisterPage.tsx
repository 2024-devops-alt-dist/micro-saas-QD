import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { authService } from '../service/authService';
import '../css/AuthPages.css';

const registerSchema = z
  .object({
    email: z.string().email('Email invalide'),
    password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
    passwordConfirm: z.string().min(8, 'La confirmation doit contenir au moins 8 caractères'),
    firstname: z.string().optional().default(''),
    name: z.string().optional().default(''),
  })
  .refine(data => data.password === data.passwordConfirm, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['passwordConfirm'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    firstname: '',
    name: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormData, string>>>({});
  const [generalError, setGeneralError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

      setIsLoading(true);
      await authService.register({
        email: validatedData.email,
        password: validatedData.password,
        firstname: validatedData.firstname,
        name: validatedData.name,
      });

      // Redirect to login on success
      navigate('/login', {
        state: { message: 'Inscription réussie. Connectez-vous maintenant.' },
      });
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
    } finally {
      setIsLoading(false);
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

              <form onSubmit={handleSubmit} className="auth-form">
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
                    disabled={isLoading}
                    placeholder="John"
                  />
                  {errors.firstname && <span className="field-error">{errors.firstname}</span>}
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
                    disabled={isLoading}
                    placeholder="Doe"
                  />
                  {errors.name && <span className="field-error">{errors.name}</span>}
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
                    disabled={isLoading}
                    placeholder="john@example.com"
                    required
                  />
                  {errors.email && <span className="field-error">{errors.email}</span>}
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
                    disabled={isLoading}
                    placeholder="••••••••"
                    required
                  />
                  {errors.password && <span className="field-error">{errors.password}</span>}
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
                    disabled={isLoading}
                    placeholder="••••••••"
                    required
                  />
                  {errors.passwordConfirm && (
                    <span className="field-error">{errors.passwordConfirm}</span>
                  )}
                </div>

                <button type="submit" disabled={isLoading} className="auth-button">
                  {isLoading ? 'Inscription en cours...' : "S'inscrire"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
