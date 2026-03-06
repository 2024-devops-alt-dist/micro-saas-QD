import { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../service/authService';
import { useNavigate, useLocation } from 'react-router-dom';

interface User {
  id: number;
  email: string;
  firstname: string;
  name?: string;
  role: string;
  photo?: string;
  household_id: number;
  inviteCode?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    firstname?: string;
    name?: string;
    inviteCode?: string;
    householdName?: string;
  }) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Vérifie la session au montage
  // Appelle /api/auth/me pour restaurer la session après un refresh de page
  // Skip sur les pages publiques (login, register) pour éviter les 401 inutiles
  useEffect(() => {
    const loadUser = async () => {
      // Skip session check on public pages
      const publicPages = ['/login', '/register'];
      if (publicPages.includes(location.pathname)) {
        setLoading(false);
        return;
      }

      try {
        const response = await authService.me();
        setUser(response.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [location.pathname]);

  // Connexion
  const login = async (email: string, password: string) => {
    try {
      await authService.login({ email, password });
      // The user object from login may not have all fields, call me() to get full info
      const fullUserInfo = await authService.me();
      setUser(fullUserInfo.user);
      navigate('/watering');
    } catch (err: any) {
      throw new Error(err.message || 'Erreur lors de la connexion.');
    }
  };

  // Inscription
  const register = async (data: {
    email: string;
    password: string;
    firstname?: string;
    name?: string;
    inviteCode?: string;
    householdName?: string;
  }) => {
    try {
      await authService.register(data);
      // Registration successful, redirect to login
      // Note: registration does NOT automatically log the user in
      navigate('/login');
    } catch (err: any) {
      throw new Error(err.message || "Erreur lors de l'inscription.");
    }
  };

  // Déconnexion
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
    setUser(null);
    navigate('/login');
  };

  // Rafraîchir l'utilisateur
  const refreshUser = async () => {
    try {
      const response = await authService.me();
      setUser(response.user);
    } catch {
      setUser(null);
    }
  };

  // isAuthenticated = user !== null
  const isAuthenticated = user !== null;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        logout,
        register,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook personnalisé pour accéder au contexte d'authentification
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};
