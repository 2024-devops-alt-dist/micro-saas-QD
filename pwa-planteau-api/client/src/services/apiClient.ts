import axios from 'axios';

/**
 * API Client centralisé basé sur Axios
 * Gère les requêtes HTTP, les cookies httpOnly, et le refresh token automatique
 */

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:3000/api';

// Création d'une instance Axios préconfigurée
const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // Important : envoie les cookies httpOnly avec chaque requête
});

/**
 * État pour empêcher plusieurs tentatives de refresh simultanées
 */
let isRefreshing = false;
let refreshPromise: Promise<any> | null = null;

/**
 * Flag pour éviter d'enregistrer les intercepteurs de logging plusieurs fois
 * (en cas de rechargement du module en développement)
 */
let loggingInterceptorsRegistered = false;

/**
 * Interceptor pour gérer les erreurs 401 et faire un refresh automatique
 */
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config as any;

    // Si l'erreur est 401 et ce n'est pas une tentative de refresh
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== '/auth/refresh'
    ) {
      // Empêcher les boucles infinies
      if (isRefreshing) {
        // Attendre que le refresh en cours se termine
        await (refreshPromise || Promise.resolve());
        // Réessayer la requête originale avec le nouveau token
        return api(originalRequest);
      }

      isRefreshing = true;

      try {
        // Appeler le refresh token endpoint
        refreshPromise = api.post('/auth/refresh', {}) as any;
        await refreshPromise;

        // Réessayer la requête originale
        originalRequest._retry = true;
        return api(originalRequest);
      } catch (refreshError) {
        console.error('[apiClient] Token refresh failed, redirecting to login', refreshError);
        // Stocker le message d'erreur pour la page login
        sessionStorage.setItem('loginError', 'Votre session a expiré, veuillez vous reconnecter.');
        // Rediriger vers login si pas déjà dessus
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        throw refreshError;
      } finally {
        isRefreshing = false;
        refreshPromise = null;
      }
    }

    return Promise.reject(error);
  }
);

/**
 * Interceptor pour ajouter des logs en développement
 */
if (import.meta.env.DEV && !loggingInterceptorsRegistered) {
  loggingInterceptorsRegistered = true;

  api.interceptors.request.use(config => {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  });

  api.interceptors.response.use(
    response => {
      console.log(`[API] ✓ ${response.status} ${response.config.url}`);
      return response;
    },
    error => {
      if (error.response) {
        console.error(`[API] ✗ ${error.response.status} ${error.config?.url}`);
      } else {
        console.error(`[API] ✗ Network Error: ${error.message}`);
      }
      return Promise.reject(error);
    }
  );
}

export default api;
