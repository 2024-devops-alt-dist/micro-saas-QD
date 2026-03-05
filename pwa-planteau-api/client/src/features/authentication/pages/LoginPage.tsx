import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../css/AuthPages.css';

export default function LoginPage() {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    // Validation
    const errors: { email?: string; password?: string } = {};
    if (!email) {
      errors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Email invalide';
    }
    if (!password) {
      errors.password = 'Le mot de passe est requis';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      // Use the login method from AuthContext which handles navigation
      await login(email, password);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'Erreur lors de la connexion');
      } else {
        setError("Une erreur inconnue s'est produite");
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
              <h2 className="auth-form-title">Connexion</h2>
              <p className="auth-form-subtitle">
                Pas encore de compte ?&nbsp;&nbsp;&nbsp;
                <Link to="/register" className="auth-link">
                  S'inscrire !
                </Link>
              </p>

              {error && <div className="error-message">{error}</div>}

              <form onSubmit={handleSubmit} className="auth-form" noValidate>
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className={`form-input ${fieldErrors.email ? 'error' : ''}`}
                    placeholder="john@gmail.com"
                    value={email}
                    onChange={e => {
                      setEmail(e.target.value);
                      if (fieldErrors.email) {
                        setFieldErrors(prev => ({ ...prev, email: undefined }));
                      }
                    }}
                    disabled={loading}
                    required
                    aria-invalid={!!fieldErrors.email}
                    aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                  />
                  {fieldErrors.email && (
                    <div className="field-error" id="email-error">
                      {fieldErrors.email}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="password" className="form-label">
                    Mot de passe
                  </label>
                  <div className="password-input-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      className={`form-input ${fieldErrors.password ? 'error' : ''}`}
                      placeholder="••••••••"
                      value={password}
                      onChange={e => {
                        setPassword(e.target.value);
                        if (fieldErrors.password) {
                          setFieldErrors(prev => ({ ...prev, password: undefined }));
                        }
                      }}
                      disabled={loading}
                      required
                      aria-invalid={!!fieldErrors.password}
                      aria-describedby={fieldErrors.password ? 'password-error' : undefined}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={
                        showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'
                      }
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                  {fieldErrors.password && (
                    <div className="field-error" id="password-error">
                      {fieldErrors.password}
                    </div>
                  )}
                </div>

                <div className="form-checkbox">
                  <input
                    type="checkbox"
                    id="remember"
                    className="checkbox-input"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                  />
                  <label htmlFor="remember" className="checkbox-label">
                    Se souvenir de moi
                  </label>
                  <Link to="/forgot-password" className="forgot-password-link">
                    Mot de passe oublié ?
                  </Link>
                </div>

                <button type="submit" className="auth-button" disabled={loading}>
                  {loading ? 'Connexion en cours...' : 'Se Connecter'}
                </button>
              </form>
            </div>

            <div className="auth-divider">
              <span>Ou</span>
            </div>

            <div className="auth-social">
              <button className="social-button google">
                <img src="/assets/icons/google.webp" alt="Google" />
                Via Google
              </button>
              <button className="social-button facebook">
                <img src="/assets/icons/facebook.webp" alt="Facebook" />
                Via Facebook
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
