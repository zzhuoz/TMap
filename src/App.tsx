import { Route, Routes } from 'react-router-dom';
import CityPage from './pages/CityPage';
import MapPage from './pages/MapPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MapPage />} />
      <Route path="/city/:id" element={<CityPage />} />
    </Routes>
  );
}
