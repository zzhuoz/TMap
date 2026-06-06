import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ChinaTravelMap from '../components/ChinaTravelMap';
import { publicAsset } from '../lib/assets';
import { getMapPoints } from '../lib/trips';

export default function MapPage() {
  const navigate = useNavigate();
  const points = useMemo(() => getMapPoints(), []);
  const keepMapSelection = (_id: string) => undefined;

  function handleMapSelect(id: string) {
    navigate(`/city/${id}`);
  }

  return (
    <main className="map-page" data-layout="fixed-map">
      <header className="map-header">
        <img className="brand-logo" src={publicAsset('/brand/tmap_logo.png')} alt="TMap" />
      </header>

      <section className="map-stage" aria-label="中国旅行地图">
        <ChinaTravelMap
          points={points}
          onHover={keepMapSelection}
          onLeave={keepMapSelection}
          onSelect={handleMapSelect}
        />
      </section>
    </main>
  );
}
