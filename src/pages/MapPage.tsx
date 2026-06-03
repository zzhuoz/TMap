import { trips } from '../lib/trips';

export default function MapPage() {
  return (
    <main className="map-page">
      <header className="map-header">
        <p className="eyebrow">TMap</p>
        <h1>我们的旅行地图</h1>
        <p>{trips.length} 座城市，正在慢慢点亮。</p>
      </header>
    </main>
  );
}
