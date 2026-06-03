import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ChinaTravelMap from '../components/ChinaTravelMap';
import CityPreviewCard from '../components/CityPreviewCard';
import { getMapPoints, trips } from '../lib/trips';

export default function MapPage() {
  const navigate = useNavigate();
  const points = useMemo(() => getMapPoints(), []);
  const [selectedId, setSelectedId] = useState(points[0]?.id);
  const selectedPoint = points.find((point) => point.id === selectedId);
  const keepLastPreview = (_id: string) => undefined;

  return (
    <main className="map-page">
      <header className="map-header">
        <p className="eyebrow">TMap</p>
        <h1>我们的旅行地图</h1>
        <p>{trips.length} 座城市，正在慢慢点亮。</p>
      </header>

      <section className="map-stage" aria-label="中国旅行地图">
        <ChinaTravelMap
          points={points}
          selectedId={selectedId}
          onHover={setSelectedId}
          onLeave={keepLastPreview}
          onSelect={(id) => navigate(`/city/${id}`)}
        />
        {selectedPoint ? <CityPreviewCard point={selectedPoint} className="map-preview" /> : null}
        <nav className="city-shortcuts" aria-label="旅行城市">
          {points.map((point) => (
            <div className="city-shortcut" key={point.id}>
              <button
                aria-pressed={point.id === selectedId}
                onClick={() => setSelectedId(point.id)}
                type="button"
              >
                {point.name}
              </button>
              <Link to={`/city/`}>相册</Link>
            </div>
          ))}
        </nav>
      </section>
    </main>
  );
}
