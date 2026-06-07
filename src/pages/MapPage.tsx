import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ChinaTravelMap from '../components/ChinaTravelMap';
import { publicAsset } from '../lib/assets';
import { findTripById, getMapPoints, trips } from '../lib/trips';
import type { Trip } from '../types/trip';

type PointerPosition = { x: number; y: number };

type PreviewState = {
  id: string;
  position: PointerPosition;
};

const previewOffset = 16;

function CityHoverPreview({ trip, position }: { trip: Trip; position: PointerPosition }) {
  const firstPhoto = trip.photos[0];

  return (
    <aside
      aria-label={`${trip.city}预览`}
      className="map-city-preview"
      role="complementary"
      style={{ transform: `translate(${position.x + previewOffset}px, ${position.y + previewOffset}px)` }}
    >
      {firstPhoto ? (
        <img src={publicAsset(firstPhoto.src)} alt={firstPhoto.caption ?? `${trip.city}旅行照片`} />
      ) : (
        <div className="map-city-card" aria-label={`${trip.city}城市名片`}>
          <p>{trip.province}</p>
          <h2>{trip.city}</h2>
          <span>{trip.dateRange}</span>
        </div>
      )}
    </aside>
  );
}


function DashboardHeader() {
  return (
    <header className="dashboard-header">
      <img className="brand-logo" src={publicAsset('/brand/tmap_logo.png')} alt="TMap" />
      <nav className="dashboard-nav" aria-label="主导航">
        <a href="#map-home" aria-current="page">首页</a>
        <a href="#recent-trips">去过的地方</a>
        <a href="#travel-notes">旅行日记</a>
        <a href="#stats">足迹统计</a>
      </nav>
      <div className="dashboard-actions">
        <input aria-label="搜索城市或景点" placeholder="搜索城市 / 景点" type="search" />
        <button aria-label="通知" type="button">⌾</button>
        <div className="avatar-chip" aria-label="旅行者头像">T</div>
      </div>
    </header>
  );
}

function TravelerOverview({
  isFavoriteMode,
  onToggleFavoriteMode,
  visitedTrips,
  photoCount
}: {
  isFavoriteMode: boolean;
  onToggleFavoriteMode: () => void;
  visitedTrips: Trip[];
  photoCount: number;
}) {
  const recentTrips = visitedTrips.slice(0, 5);

  return (
    <aside className="dashboard-sidebar" aria-label="旅行者概览">
      <section className="traveler-card">
        <div className="traveler-profile">
          <div className="profile-photo">T</div>
          <div>
            <h2>Hi，旅行者</h2>
            <p>记录世界，遇见自己</p>
          </div>
        </div>
        <dl className="quick-stats">
          <div>
            <dt>去过的城市</dt>
            <dd>{visitedTrips.length}</dd>
          </div>
          <div>
            <dt>打卡的地点</dt>
            <dd>{trips.length}</dd>
          </div>
          <div>
            <dt>上传的照片</dt>
            <dd>{photoCount}</dd>
          </div>
        </dl>
      </section>

      <section className="recent-card" id="recent-trips">
        <div className="section-heading">
          <h2>最近去过</h2>
          <a href="#stats">查看足迹</a>
        </div>
        <ul aria-label="最近去过">
          {recentTrips.map((trip) => (
            <li key={trip.id}>
              {trip.photos[0] ? (
                <img src={publicAsset(trip.photos[0].src)} alt="" />
              ) : (
                <span className="recent-placeholder" />
              )}
              <div>
                <strong>{trip.city}市</strong>
                <span>{trip.dateRange}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="trace-card" id="stats">
        <div>
          <h2>旅行足迹</h2>
          <p>已经去过 {visitedTrips.length} 个城市</p>
        </div>
        <div className="trace-progress"><span style={{ width: `${Math.min(100, visitedTrips.length * 12)}%` }} /></div>
        <button
          aria-pressed={isFavoriteMode}
          className={`trace-favorite-button${isFavoriteMode ? ' is-active' : ''}`}
          onClick={onToggleFavoriteMode}
          type="button"
        >
          收藏城市
        </button>
      </section>
    </aside>
  );
}


export default function MapPage() {
  const navigate = useNavigate();
  const points = useMemo(() => getMapPoints(), []);
  const visitedTrips = useMemo(() => trips.filter((trip) => trip.photos.length > 0), []);
  const photoCount = useMemo(() => trips.reduce((total, trip) => total + trip.photos.length, 0), []);
  const [preview, setPreview] = useState<PreviewState | null>(null);
  const [isFavoriteMode, setIsFavoriteMode] = useState(false);
  const [favoriteFeedback, setFavoriteFeedback] = useState<Trip | null>(null);
  const previewTrip = preview ? findTripById(preview.id) : undefined;

  function showPreview(id: string, position: PointerPosition) {
    setPreview({ id, position });
  }

  function movePreview(id: string, position: PointerPosition) {
    setPreview((current) => (current?.id === id ? { id, position } : current));
  }

  function hidePreview(id: string) {
    setPreview((current) => (current?.id === id ? null : current));
  }

  function handleMapSelect(id: string) {
    if (isFavoriteMode) {
      const selectedTrip = findTripById(id);

      if (selectedTrip) {
        setFavoriteFeedback(selectedTrip);
      }

      return;
    }

    navigate(`/city/${id}`);
  }

  function toggleFavoriteMode() {
    setIsFavoriteMode((current) => !current);
  }

  return (
    <main className="map-page dashboard-page" data-layout="travel-dashboard" id="map-home">
      <DashboardHeader />
      <div className="dashboard-shell">
        <TravelerOverview
          isFavoriteMode={isFavoriteMode}
          onToggleFavoriteMode={toggleFavoriteMode}
          visitedTrips={visitedTrips}
          photoCount={photoCount}
        />

        <section className="dashboard-map-panel" aria-label="旅行地图主区域">
          <section className="map-stage" aria-label="中国旅行地图">
            <ChinaTravelMap
              points={points}
              onHover={showPreview}
              onLeave={hidePreview}
              onMove={movePreview}
              onSelect={handleMapSelect}
            />
          </section>
          {favoriteFeedback ? (
            <div
              className="favorite-feedback"
              onAnimationEnd={() => setFavoriteFeedback(null)}
              role="status"
            >
              <span>★</span> 已收藏{favoriteFeedback.city}
            </div>
          ) : null}
        </section>
      </div>

      {preview && previewTrip ? <CityHoverPreview trip={previewTrip} position={preview.position} /> : null}
    </main>
  );
}
