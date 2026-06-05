# Couple Travel Map Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static China couple travel map where city points show cover previews and click through to photo gallery pages.

**Architecture:** Create a Vite React TypeScript app in `/home/zhuohongjie/TMap`. Keep trip records in a local JSON file, render map points with ECharts, and use React Router for `/` and `/city/:id`.

**Tech Stack:** Vite, React, TypeScript, React Router, ECharts, echarts-for-react, Vitest, Testing Library.

---

## File Structure

- `package.json`: scripts and frontend dependencies.
- `vite.config.ts`: Vite and Vitest configuration.
- `tsconfig*.json`: TypeScript project settings.
- `index.html`: application HTML shell.
- `src/main.tsx`: React entry point.
- `src/App.tsx`: route declarations.
- `src/types/trip.ts`: shared trip and photo types.
- `src/data/trips.json`: local city trip records.
- `src/lib/trips.ts`: typed accessors for trip records.
- `src/lib/trips.test.ts`: tests for trip lookup and navigation helpers.
- `src/pages/MapPage.tsx`: homepage state and map preview behavior.
- `src/pages/CityPage.tsx`: city gallery route and empty state.
- `src/components/ChinaTravelMap.tsx`: ECharts map and city marker events.
- `src/components/CityPreviewCard.tsx`: hover/tap cover preview.
- `src/components/PhotoMasonry.tsx`: responsive city gallery.
- `src/styles.css`: global layout, map, preview card, gallery, and responsive styles.
- `public/maps/china.json`: China map GeoJSON used by ECharts.
- `public/photos/*`: sample photo assets for local development.

### Task 1: Initialize Git And Vite App

**Files:**
- Create: `.gitignore`
- Create: `package.json`
- Create: `index.html`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.app.json`
- Create: `tsconfig.node.json`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/styles.css`

- [ ] **Step 1: Initialize the repository**

Run:

```bash
cd /home/zhuohongjie/TMap
git init
```

Expected: `Initialized empty Git repository` or `Reinitialized existing Git repository`.

- [ ] **Step 2: Create project configuration**

Write `.gitignore`:

```gitignore
node_modules
dist
.env
.DS_Store
.superpowers/
coverage
```

Write `package.json`:

```json
{
  "name": "tmap",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite --host 0.0.0.0",
    "build": "tsc -b && vite build",
    "preview": "vite preview --host 0.0.0.0",
    "test": "vitest run"
  },
  "dependencies": {
    "@vitejs/plugin-react": "^5.0.0",
    "echarts": "^5.6.0",
    "echarts-for-react": "^3.0.2",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router-dom": "^7.0.0"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.0",
    "@testing-library/react": "^16.0.0",
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "typescript": "^5.8.0",
    "vite": "^6.0.0",
    "vitest": "^3.0.0"
  }
}
```

Write `vite.config.ts`:

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts'
  }
});
```

Write `tsconfig.json`:

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

Write `tsconfig.app.json`:

```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "allowImportingTsExtensions": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
```

Write `tsconfig.node.json`:

```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
    "target": "ES2023",
    "lib": ["ES2023"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 3: Create the minimal app shell**

Write `index.html`:

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>TMap</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

Write `src/main.tsx`:

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
```

Write `src/App.tsx`:

```tsx
export default function App() {
  return <main className="app-shell">TMap is loading.</main>;
}
```

Write `src/styles.css`:

```css
:root {
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  color: #20201f;
  background: #f7f3ee;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
}

a {
  color: inherit;
}

.app-shell {
  min-height: 100vh;
}
```

- [ ] **Step 4: Install dependencies**

Run:

```bash
cd /home/zhuohongjie/TMap
npm install
```

Expected: dependencies install and `package-lock.json` is created.

- [ ] **Step 5: Verify the app shell builds**

Run:

```bash
npm run build
```

Expected: `tsc -b && vite build` exits with code 0 and creates `dist/`.

- [ ] **Step 6: Commit**

Run:

```bash
git add .
git commit -m "chore: initialize tmap app"
```

Expected: commit created with app shell and docs.

### Task 2: Add Trip Types, Data, And Tests

**Files:**
- Create: `src/types/trip.ts`
- Create: `src/data/trips.json`
- Create: `src/lib/trips.ts`
- Create: `src/lib/trips.test.ts`
- Create: `src/test/setup.ts`

- [ ] **Step 1: Add test setup**

Write `src/test/setup.ts`:

```ts
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 2: Write failing tests for trip helpers**

Write `src/lib/trips.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { findTripById, getAdjacentTrips, getMapPoints, trips } from './trips';

describe('trip helpers', () => {
  it('finds trips by id', () => {
    expect(findTripById('hangzhou')?.city).toBe('杭州');
    expect(findTripById('missing-city')).toBeUndefined();
  });

  it('creates map points with coordinates and cover data', () => {
    expect(getMapPoints()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'hangzhou',
          name: '杭州',
          value: [120.1551, 30.2741]
        })
      ])
    );
  });

  it('gets previous and next trips from data order', () => {
    const adjacent = getAdjacentTrips('xiamen');
    expect(adjacent.previous?.id).toBe(trips[0].id);
    expect(adjacent.next?.id).toBe(trips[2].id);
  });
});
```

- [ ] **Step 3: Run tests to verify they fail**

Run:

```bash
npm run test -- src/lib/trips.test.ts
```

Expected: FAIL because `src/lib/trips.ts` does not exist.

- [ ] **Step 4: Add trip types and sample data**

Write `src/types/trip.ts`:

```ts
export type TripPhoto = {
  src: string;
  caption?: string;
};

export type Trip = {
  id: string;
  city: string;
  province: string;
  coordinates: [number, number];
  dateRange: string;
  cover: string;
  note: string;
  photos: TripPhoto[];
};

export type MapPoint = {
  id: string;
  name: string;
  value: [number, number];
  cover: string;
  dateRange: string;
  note: string;
};
```

Write `src/data/trips.json`:

```json
[
  {
    "id": "hangzhou",
    "city": "杭州",
    "province": "浙江",
    "coordinates": [120.1551, 30.2741],
    "dateRange": "2025.05.01 - 2025.05.03",
    "cover": "/photos/hangzhou/cover.jpg",
    "note": "西湖边的一次慢旅行",
    "photos": [
      { "src": "/photos/hangzhou/cover.jpg", "caption": "西湖边的傍晚" },
      { "src": "/photos/hangzhou/01.jpg", "caption": "慢慢走过的街巷" }
    ]
  },
  {
    "id": "xiamen",
    "city": "厦门",
    "province": "福建",
    "coordinates": [118.0894, 24.4798],
    "dateRange": "2025.08.10 - 2025.08.13",
    "cover": "/photos/xiamen/cover.jpg",
    "note": "海风和橘色日落",
    "photos": [
      { "src": "/photos/xiamen/cover.jpg", "caption": "海边日落" },
      { "src": "/photos/xiamen/01.jpg", "caption": "岛上的午后" }
    ]
  },
  {
    "id": "chengdu",
    "city": "成都",
    "province": "四川",
    "coordinates": [104.0665, 30.5728],
    "dateRange": "2025.10.02 - 2025.10.05",
    "cover": "/photos/chengdu/cover.jpg",
    "note": "热气腾腾的一站",
    "photos": [
      { "src": "/photos/chengdu/cover.jpg", "caption": "夜色里的街头" },
      { "src": "/photos/chengdu/01.jpg", "caption": "悠闲的下午" }
    ]
  }
]
```

- [ ] **Step 5: Implement trip helpers**

Write `src/lib/trips.ts`:

```ts
import rawTrips from '../data/trips.json';
import type { MapPoint, Trip } from '../types/trip';

export const trips = rawTrips as Trip[];

export function findTripById(id: string): Trip | undefined {
  return trips.find((trip) => trip.id === id);
}

export function getMapPoints(): MapPoint[] {
  return trips.map((trip) => ({
    id: trip.id,
    name: trip.city,
    value: trip.coordinates,
    cover: trip.cover,
    dateRange: trip.dateRange,
    note: trip.note
  }));
}

export function getAdjacentTrips(id: string): { previous?: Trip; next?: Trip } {
  const index = trips.findIndex((trip) => trip.id === id);

  if (index === -1) {
    return {};
  }

  return {
    previous: trips[index - 1],
    next: trips[index + 1]
  };
}
```

- [ ] **Step 6: Run tests**

Run:

```bash
npm run test -- src/lib/trips.test.ts
```

Expected: PASS for all three tests.

- [ ] **Step 7: Commit**

Run:

```bash
git add src
git commit -m "feat: add trip data model"
```

Expected: commit created for trip data and helpers.

### Task 3: Add Routing, Map Page, And City Page Tests

**Files:**
- Modify: `src/App.tsx`
- Create: `src/pages/MapPage.tsx`
- Create: `src/pages/CityPage.tsx`
- Create: `src/pages/CityPage.test.tsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Write failing city page tests**

Write `src/pages/CityPage.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import CityPage from './CityPage';

function renderCity(path: string) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/city/:id" element={<CityPage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('CityPage', () => {
  it('renders a city gallery', () => {
    renderCity('/city/hangzhou');
    expect(screen.getByRole('heading', { name: '杭州' })).toBeInTheDocument();
    expect(screen.getByText('西湖边的一次慢旅行')).toBeInTheDocument();
    expect(screen.getByAltText('西湖边的傍晚')).toBeInTheDocument();
  });

  it('renders an empty state for an unknown city', () => {
    renderCity('/city/not-real');
    expect(screen.getByText('没有找到这座城市')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '返回地图' })).toHaveAttribute('href', '/');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run:

```bash
npm run test -- src/pages/CityPage.test.tsx
```

Expected: FAIL because `CityPage` is not implemented.

- [ ] **Step 3: Implement routes and placeholder pages**

Write `src/App.tsx`:

```tsx
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
```

Write `src/pages/MapPage.tsx`:

```tsx
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
```

Write `src/pages/CityPage.tsx`:

```tsx
import { Link, useParams } from 'react-router-dom';
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
        <Link className="back-link" to="/">返回地图</Link>
        <p>{trip.province} · {trip.dateRange}</p>
        <h1>{trip.city}</h1>
        <p>{trip.note}</p>
      </header>
      <section className="photo-grid" aria-label={`${trip.city}相册`}>
        {trip.photos.map((photo) => (
          <figure key={photo.src}>
            <img src={photo.src} alt={photo.caption ?? trip.city} />
            {photo.caption ? <figcaption>{photo.caption}</figcaption> : null}
          </figure>
        ))}
      </section>
      <nav className="city-nav" aria-label="城市切换">
        {adjacent.previous ? <Link to={`/city/${adjacent.previous.id}`}>上一站：{adjacent.previous.city}</Link> : <span />}
        {adjacent.next ? <Link to={`/city/${adjacent.next.id}`}>下一站：{adjacent.next.city}</Link> : <span />}
      </nav>
    </main>
  );
}
```

- [ ] **Step 4: Add page styles**

Append to `src/styles.css`:

```css
.map-page,
.city-page {
  min-height: 100vh;
}

.map-header,
.city-hero,
.empty-state {
  padding: 32px;
}

.eyebrow {
  margin: 0 0 8px;
  color: #8b5e4b;
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
}

h1 {
  margin: 0;
  font-size: clamp(2rem, 4vw, 4rem);
  letter-spacing: 0;
}

.back-link {
  display: inline-flex;
  margin-bottom: 24px;
}

.photo-grid {
  column-count: 3;
  column-gap: 16px;
  padding: 0 32px 32px;
}

.photo-grid figure {
  break-inside: avoid;
  margin: 0 0 16px;
}

.photo-grid img {
  display: block;
  width: 100%;
  min-height: 180px;
  object-fit: cover;
  border-radius: 8px;
  background: #dfd6ca;
}

.photo-grid figcaption {
  margin-top: 8px;
  color: #66615a;
  font-size: 0.92rem;
}

.city-nav {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 0 32px 40px;
}
```

- [ ] **Step 5: Run tests**

Run:

```bash
npm run test -- src/pages/CityPage.test.tsx
```

Expected: PASS for both tests.

- [ ] **Step 6: Commit**

Run:

```bash
git add src
git commit -m "feat: add routes and city gallery page"
```

Expected: commit created for routing and city page.

### Task 4: Implement China Map And Preview Interaction

**Files:**
- Create: `src/components/ChinaTravelMap.tsx`
- Create: `src/components/CityPreviewCard.tsx`
- Modify: `src/pages/MapPage.tsx`
- Modify: `src/styles.css`
- Create: `public/maps/china.json`
- Create: `public/photos/hangzhou/cover.jpg`
- Create: `public/photos/hangzhou/01.jpg`
- Create: `public/photos/xiamen/cover.jpg`
- Create: `public/photos/xiamen/01.jpg`
- Create: `public/photos/chengdu/cover.jpg`
- Create: `public/photos/chengdu/01.jpg`

- [ ] **Step 1: Add China map GeoJSON**

Add `public/maps/china.json` from a reliable China GeoJSON source. Keep it as valid GeoJSON with province-level features. ECharts uses this as the base map; city point coordinates come from `trips.json`.

Verify:

```bash
node -e "JSON.parse(require('fs').readFileSync('public/maps/china.json','utf8')); console.log('valid geojson')"
```

Expected: `valid geojson`.

- [ ] **Step 2: Add local sample photos**

Place six local JPG files at the exact paths listed in this task. Use personal photos when available. If personal photos are not available during implementation, create simple temporary image assets with the same filenames so the layout can be verified, then replace them later.

Verify:

```bash
find public/photos -type f | sort
```

Expected: the six photo paths listed in this task.

- [ ] **Step 3: Implement preview card**

Write `src/components/CityPreviewCard.tsx`:

```tsx
import { Link } from 'react-router-dom';
import type { MapPoint } from '../types/trip';

type CityPreviewCardProps = {
  point: MapPoint;
  className?: string;
};

export default function CityPreviewCard({ point, className = '' }: CityPreviewCardProps) {
  return (
    <article className={`city-preview ${className}`}>
      <img src={point.cover} alt={`${point.name}旅行封面`} />
      <div>
        <p>{point.dateRange}</p>
        <h2>{point.name}</h2>
        <p>{point.note}</p>
        <Link to={`/city/${point.id}`}>查看相册</Link>
      </div>
    </article>
  );
}
```

- [ ] **Step 4: Implement ECharts map component**

Write `src/components/ChinaTravelMap.tsx`:

```tsx
import { useEffect, useMemo, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import type { MapPoint } from '../types/trip';

type ChinaTravelMapProps = {
  points: MapPoint[];
  selectedId?: string;
  onHover: (id: string) => void;
  onLeave: () => void;
  onSelect: (id: string) => void;
};

type GeoJson = Parameters<typeof echarts.registerMap>[1];

export default function ChinaTravelMap({ points, selectedId, onHover, onLeave, onSelect }: ChinaTravelMapProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch('/maps/china.json')
      .then((response) => response.json())
      .then((geoJson: GeoJson) => {
        if (!cancelled) {
          echarts.registerMap('china', geoJson);
          setReady(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const option = useMemo(
    () => ({
      backgroundColor: 'transparent',
      geo: {
        map: 'china',
        roam: true,
        zoom: 1.25,
        itemStyle: {
          areaColor: '#dfe7dc',
          borderColor: '#ffffff',
          borderWidth: 1
        },
        emphasis: {
          itemStyle: {
            areaColor: '#d5dfd0'
          },
          label: {
            show: false
          }
        }
      },
      series: [
        {
          type: 'effectScatter',
          coordinateSystem: 'geo',
          symbolSize: 14,
          rippleEffect: {
            brushType: 'stroke',
            scale: 3
          },
          itemStyle: {
            color: '#b9574f'
          },
          data: points.map((point) => ({
            name: point.name,
            value: point.value,
            id: point.id,
            symbolSize: point.id === selectedId ? 20 : 14
          }))
        }
      ]
    }),
    [points, selectedId]
  );

  if (!ready) {
    return <div className="map-loading">地图加载中</div>;
  }

  return (
    <ReactECharts
      className="china-map"
      option={option}
      onEvents={{
        mouseover: (params) => {
          const id = (params.data as { id?: string } | undefined)?.id;
          if (id) onHover(id);
        },
        mouseout: onLeave,
        click: (params) => {
          const id = (params.data as { id?: string } | undefined)?.id;
          if (id) onSelect(id);
        }
      }}
    />
  );
}
```

- [ ] **Step 5: Wire map page interaction**

Write `src/pages/MapPage.tsx`:

```tsx
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ChinaTravelMap from '../components/ChinaTravelMap';
import CityPreviewCard from '../components/CityPreviewCard';
import { getMapPoints, trips } from '../lib/trips';

export default function MapPage() {
  const navigate = useNavigate();
  const points = useMemo(() => getMapPoints(), []);
  const [selectedId, setSelectedId] = useState(points[0]?.id);
  const selectedPoint = points.find((point) => point.id === selectedId);

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
          onLeave={() => undefined}
          onSelect={(id) => navigate(`/city/${id}`)}
        />
        {selectedPoint ? <CityPreviewCard point={selectedPoint} className="map-preview" /> : null}
      </section>
    </main>
  );
}
```

- [ ] **Step 6: Add map styles**

Append to `src/styles.css`:

```css
.map-page {
  display: grid;
  grid-template-rows: auto 1fr;
  background: #f7f3ee;
}

.map-stage {
  position: relative;
  min-height: calc(100vh - 170px);
  padding: 0 24px 24px;
}

.china-map,
.map-loading {
  width: 100%;
  height: min(720px, calc(100vh - 190px));
  min-height: 420px;
}

.map-loading {
  display: grid;
  place-items: center;
  color: #68625c;
}

.city-preview {
  width: min(320px, calc(100vw - 48px));
  overflow: hidden;
  border: 1px solid rgba(32, 32, 31, 0.12);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 18px 48px rgba(45, 38, 30, 0.18);
}

.city-preview img {
  display: block;
  width: 100%;
  height: 170px;
  object-fit: cover;
  background: #dfd6ca;
}

.city-preview div {
  padding: 14px;
}

.city-preview h2,
.city-preview p {
  margin: 0 0 8px;
}

.city-preview a {
  display: inline-flex;
  margin-top: 8px;
  color: #9c433d;
  font-weight: 700;
  text-decoration: none;
}

.map-preview {
  position: absolute;
  right: 40px;
  bottom: 48px;
}
```

- [ ] **Step 7: Verify build**

Run:

```bash
npm run build
```

Expected: PASS with no TypeScript or Vite errors.

- [ ] **Step 8: Commit**

Run:

```bash
git add public src
git commit -m "feat: add interactive travel map"
```

Expected: commit created for map and preview interaction.

### Task 5: Final Responsive Polish And Verification

**Files:**
- Modify: `src/styles.css`
- Modify: `docs/superpowers/specs/2026-06-03-couple-travel-map-design.md` only if implementation findings require a spec correction.

- [ ] **Step 1: Add responsive styles**

Append to `src/styles.css`:

```css
@media (max-width: 760px) {
  .map-header,
  .city-hero,
  .empty-state {
    padding: 24px 18px;
  }

  h1 {
    font-size: 2.35rem;
  }

  .map-stage {
    min-height: calc(100vh - 155px);
    padding: 0 12px 18px;
  }

  .china-map,
  .map-loading {
    height: 58vh;
    min-height: 360px;
  }

  .map-preview {
    position: static;
    margin: -18px auto 0;
  }

  .photo-grid {
    column-count: 1;
    padding: 0 18px 24px;
  }

  .city-nav {
    padding: 0 18px 32px;
    flex-direction: column;
  }
}

@media (min-width: 761px) and (max-width: 1080px) {
  .photo-grid {
    column-count: 2;
  }
}
```

- [ ] **Step 2: Run full test suite**

Run:

```bash
npm run test
```

Expected: PASS for trip helper and city page tests.

- [ ] **Step 3: Run production build**

Run:

```bash
npm run build
```

Expected: PASS with production assets written to `dist/`.

- [ ] **Step 4: Start local dev server**

Run:

```bash
npm run dev
```

Expected: Vite prints a local URL. Keep the server running for manual verification.

- [ ] **Step 5: Manually verify browser behavior**

Check:

- `/` renders the China map and city markers.
- Hovering a city marker changes the cover preview on desktop.
- Clicking a city marker navigates to `/city/<id>`.
- On a narrow/mobile viewport, tapping a city marker shows the preview card.
- `/city/hangzhou` renders the gallery.
- `/city/not-real` renders the unknown city state and return link.
- Text does not overlap at desktop or mobile widths.
- Broken or missing photos preserve layout with the image background area.

- [ ] **Step 6: Commit final polish**

Run:

```bash
git add .
git commit -m "style: polish responsive travel map"
```

Expected: commit created if responsive/style changes were made. If `git status --short` is empty, skip this commit.

## Self-Review

- Spec coverage: homepage map, visited city points, hover/tap preview, click-through detail, local JSON data, static photos, unknown city handling, and responsive behavior are covered by Tasks 2 through 5.
- Scope check: admin login, uploads, database storage, city boundary hover, route planning, and accounts remain excluded.
- Placeholder scan: this plan contains no unfinished markers or unspecified implementation steps.
- Type consistency: `Trip`, `TripPhoto`, and `MapPoint` are defined in Task 2 and reused consistently by helper functions and components.
- Verification coverage: tests cover trip helpers and city route rendering; manual verification covers ECharts behavior that is better validated in a browser.
