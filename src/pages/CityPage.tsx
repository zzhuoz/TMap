import { Link, useParams } from 'react-router-dom';
import { publicAsset } from '../lib/assets';
import { findTripById, getAdjacentTrips } from '../lib/trips';

export default function CityPage() {
  const { id = '' } = useParams();
  const trip = findTripById(id);

  if (!trip) {
    return (
      <main className="city-page empty-state">
        <h1>没有找到这座城市</h1>
        <Link to="/">返回地图</Link>
      </main>
    );
  }

  const adjacent = getAdjacentTrips(trip.id);

  return (
    <main className="city-page">
      <header className="city-hero">
        <Link className="back-link" to="/">
          返回地图
        </Link>
        <p>
          {trip.province} · {trip.dateRange}
        </p>
        <h1>{trip.city}</h1>
        <p>{trip.note}</p>
      </header>
      {trip.photos.length > 0 ? (
        <section className="photo-grid" aria-label={`${trip.city}相册`}>
          {trip.photos.map((photo) => (
            <figure key={photo.src}>
              <img src={publicAsset(photo.src)} alt={photo.caption ?? trip.city} />
              {photo.caption ? <figcaption>{photo.caption}</figcaption> : null}
            </figure>
          ))}
        </section>
      ) : (
        <section className="gallery-empty" aria-label={`${trip.city}相册`}>
          <p>还没有添加照片</p>
        </section>
      )}
      <nav className="city-nav" aria-label="城市切换">
        {adjacent.previous ? (
          <Link to={`/city/${adjacent.previous.id}`}>上一站：{adjacent.previous.city}</Link>
        ) : (
          <span />
        )}
        {adjacent.next ? (
          <Link to={`/city/${adjacent.next.id}`}>下一站：{adjacent.next.city}</Link>
        ) : (
          <span />
        )}
      </nav>
    </main>
  );
}
