import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PlantCollection from './features/plant/pages/PlantCollection';
import PlantDetail from './features/plant/pages/PlantDetail';
import WateringCreate from './features/watering/pages/WateringCreate';
import Home from './pages/HomePage';
import WateringList from './features/watering/pages/WateringList';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/plants" element={<PlantCollection />} />
        <Route path="/plants/:id" element={<PlantDetail />} />
        <Route path="/watering/create" element={<WateringCreate />} />
        <Route path="/watering" element={<WateringList />} />
        
      </Routes>
    </Router>
  );
}

export default App;
