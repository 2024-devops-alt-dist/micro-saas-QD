
import { CustomButton } from '../components/Button';
import { useState } from 'react';
import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:3000';

type ApiResponse = { status: string; message: string };

export default function Home() {
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTestApi = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await axios.get<ApiResponse>(`${API_URL}/api/health`);
      setResult(res.data);
    } catch (err: any) {
      const apiError = err?.response?.data as ApiResponse | undefined;
      if (apiError && apiError.message) {
        setResult(apiError);
      } else {
        setError('Impossible de joindre l’API');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center min-h-screen page-centered home-bg">
      <div className="flex flex-col items-center justify-center gap-4 home-card w-full">
        <h1>Bienvenue sur la première page de Planteau</h1>
        <CustomButton onClick={handleTestApi} disabled={loading}>
          {loading ? 'Connexion...' : 'Tester la connexion'}
        </CustomButton>
        {result && <pre className="mt-4 rounded pre-custom">{JSON.stringify(result, null, 2)}</pre>}
        {error && <div className="text-red-500 mt-2">{error}</div>}
      </div>
    </div>
  );
}
