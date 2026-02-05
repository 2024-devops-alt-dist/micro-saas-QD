import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../service/authService';
import '../css/AuthPages.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    try {
      setIsLoading(true);
      await authService.login({ email, password });
      // Redirect to home on success
      navigate('/', { replace: true });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'Erreur lors de la connexion');
      } else {
        setError("Une erreur inconnue s'est produite");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title">PLANT'EAU</h1>
          </div>

          <div className="auth-content">
            <div className="auth-form-section">
              <h2 className="auth-form-title">Connexion</h2>
              <p className="auth-form-subtitle">
                Pas encore de compte ?{' '}
                <Link to="/register" className="auth-link">
                  Créer un !
                </Link>
              </p>

              {error && <div className="error-message">{error}</div>}

              <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="form-input"
                    placeholder="lostbucket@gmail.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password" className="form-label">
                    Mot de passe
                  </label>
                  <div className="password-input-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      className="form-input"
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      disabled={isLoading}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
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

                <button type="submit" className="auth-button" disabled={isLoading}>
                  {isLoading ? 'Connexion en cours...' : 'Se Connecter'}
                </button>
              </form>
            </div>

            <div className="auth-divider">
              <span>Ou</span>
            </div>

            <div className="auth-social">
              <button className="social-button google">
                <img src="/assets/icons/google.svg" alt="Google" />
                Via Google
              </button>
              <button className="social-button facebook">
                <img src="/assets/icons/facebook.svg" alt="Facebook" />
                Via Facebook
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
