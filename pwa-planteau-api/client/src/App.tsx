import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PlantCollection from './features/plant/pages/PlantCollection';
import PlantDetail from './features/plant/pages/PlantDetail';
import WateringCreate from './features/watering/pages/WateringCreate';
import Home from './pages/HomePage';
import WateringList from './features/watering/pages/WateringList';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/plants"
          element={
            <ProtectedRoute>
              <PlantCollection />
            </ProtectedRoute>
          }
        />
        <Route
          path="/plants/:id"
          element={
            <ProtectedRoute>
              <PlantDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/watering/create"
          element={
            <ProtectedRoute>
              <WateringCreate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/watering"
          element={
            <ProtectedRoute>
              <WateringList />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
