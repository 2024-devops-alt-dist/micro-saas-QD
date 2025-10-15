import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PlantCollection from './features/plant/pages/PlantCollection';
import PlantDetail from './features/plant/pages/PlantDetail';
import Home from './pages/HomePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/plants" element={<PlantCollection />} />
        <Route path="/plants/:id" element={<PlantDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
