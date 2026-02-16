import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PlantCollection from './features/plant/pages/PlantCollection';
import PlantDetail from './features/plant/pages/PlantDetail';
import WateringCreate from './features/watering/pages/WateringCreate';
import WateringList from './features/watering/pages/WateringList';
import TestConnectPage from './pages/TestConnectPage';
import LoginPage from './features/authentication/pages/LoginPage';
import RegisterPage from './features/authentication/pages/RegisterPage';
import { ProtectedRoute } from './features/authentication/components/ProtectedRoute';
import AddPlant from './features/plant/pages/AddPlant';

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
              <WateringList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/test-connect"
          element={
            <ProtectedRoute>
              <TestConnectPage />
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
          path="/add-plant"
          element={
            <ProtectedRoute>
              <AddPlant />
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
