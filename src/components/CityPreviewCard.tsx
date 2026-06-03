import { Link } from 'react-router-dom';
import { publicAsset } from '../lib/assets';
import type { MapPoint } from '../types/trip';

type CityPreviewCardProps = {
  point: MapPoint;
  className?: string;
};

export default function CityPreviewCard({ point, className = '' }: CityPreviewCardProps) {
  const classes = ['city-preview', className].filter(Boolean).join(' ');

  return (
    <article className={classes}>
      <img src={publicAsset(point.cover)} alt={`${point.name}旅行封面`} />
      <div>
        <p>{point.dateRange}</p>
        <h2>{point.name}</h2>
        <p>{point.note}</p>
        <Link to={`/city/${point.id}`}>查看相册</Link>
      </div>
    </article>
  );
}
