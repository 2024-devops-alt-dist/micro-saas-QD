import { CustomButton } from '../components/Button';
import { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const API_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:3000';

type ApiResponse = { status: string; message: string };

export default function TestConnectPage() {
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
    <div className="navbar-layout">
      <Navbar />
      <div
        className="page-centered p-2 flex-1 flex flex-col overflow-y-auto"
        style={{ height: '90vh', maxHeight: '90vh' }}
      >
        <div className="flex flex-col items-center justify-center gap-4 home-card w-full">
          <h1>Test de connexion à l’API</h1>
          <CustomButton onClick={handleTestApi} disabled={loading}>
            {loading ? 'Connexion...' : 'Tester la connexion'}
          </CustomButton>
          {result && (
            <pre className="mt-4 rounded pre-custom">{JSON.stringify(result, null, 2)}</pre>
          )}
          {error && <div className="text-red-500 mt-2">{error}</div>}
        </div>
      </div>
    </div>
  );
}
