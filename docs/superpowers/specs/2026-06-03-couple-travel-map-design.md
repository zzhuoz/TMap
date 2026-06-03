# Couple Travel Map Website Design

## Goal

Build a static couple travel map website for recording trips across China. The first version focuses on a visual, photo-first experience: a China map with visited city points, a hover/tap cover preview, and a city gallery detail page.

## Scope

Included in version 1:

- A China map exploration homepage.
- City point markers for visited cities only.
- Desktop hover preview with cover image, city name, trip dates, and a short note.
- Desktop click from a city point to the city detail page.
- Mobile tap behavior: first tap shows the preview, then the preview link opens the gallery.
- A city detail page centered on a photo masonry/waterfall gallery.
- Local trip data in a JSON file.
- Photos stored in the static public assets directory.
- Graceful empty state for an unknown city id.

Excluded from version 1:

- Admin login.
- Online photo upload.
- Database storage.
- Real city-level administrative boundary hover.
- Full travel route planning.
- User accounts or sharing permissions.

## Product Experience

The homepage is the product experience, not a marketing landing page. It opens directly to an interactive China map with only the cities the couple has visited. The map should feel quiet, polished, and personal, with the photos carrying the emotional weight.

On desktop, hovering over a city marker opens a compact preview card near the marker. The card shows one cover photo, the city name, the travel date range, and one short note. Clicking the marker opens that city's gallery page.

On mobile, hover is unavailable. Tapping a city marker opens the same preview card. The preview contains a clear action to view the gallery.

The city detail page has a lightweight header with the city name, date range, and a short memory note. The main content is a masonry-style photo gallery. Text is secondary and should not dominate the photos. The detail page includes a return-to-map control and previous/next city navigation when adjacent cities exist in the local data order.

## Data Model

Trip data lives in `src/data/trips.json`. Each city record contains stable identifiers, display text, map coordinates, and photo paths.

Example shape:

```json
{
  "id": "hangzhou",
  "city": "杭州",
  "province": "浙江",
  "coordinates": [120.1551, 30.2741],
  "dateRange": "2025.05.01 - 2025.05.03",
  "cover": "/photos/hangzhou/cover.jpg",
  "note": "西湖边的一次慢旅行",
  "photos": [
    {
      "src": "/photos/hangzhou/01.jpg",
      "caption": "傍晚的湖边"
    }
  ]
}
```

Rules:

- `id` is used for routing and must be unique.
- `coordinates` use longitude and latitude.
- `cover` should point to one static image used by the map preview.
- `photos` drives the detail gallery and can include optional captions.
- The map renders only records present in this file.

## Technical Approach

Use `Vite + React + TypeScript` for a static frontend. Use `ECharts` for the China map and city point markers because it handles geographic maps and coordinate-based scatter points directly.

Routes:

- `/`: map exploration page.
- `/city/:id`: city gallery page.

Proposed source structure:

```text
src/
  App.tsx
  data/trips.json
  pages/MapPage.tsx
  pages/CityPage.tsx
  components/ChinaTravelMap.tsx
  components/CityPreviewCard.tsx
  components/PhotoMasonry.tsx
  types/trip.ts
public/
  photos/
    hangzhou/
      cover.jpg
      01.jpg
```

The app can be deployed as a static site because all data and photos are bundled or served from `public/`.

## Component Boundaries

`MapPage` loads trip data and owns selected/hovered city state. It passes marker data to `ChinaTravelMap` and preview data to `CityPreviewCard`.

`ChinaTravelMap` owns only map rendering and marker interaction events. It emits city ids for hover, leave, and click/tap.

`CityPreviewCard` displays the cover preview and provides the detail page link. It should be usable both as a floating desktop card and a fixed/mobile card.

`CityPage` resolves `:id` from the route, finds the matching trip record, and renders the gallery or empty state.

`PhotoMasonry` accepts a photo list and renders a responsive gallery using CSS columns or a lightweight masonry implementation.

## Error Handling

If a city id is unknown, the detail page shows a concise message and a return-to-map button.

If a city has no photos, the detail page shows the city header and an empty gallery state.

If a cover image path is missing or broken, the preview card should preserve layout and show a neutral fallback image area.

## Responsive Behavior

Desktop:

- Map dominates the viewport.
- Hovering city markers shows a floating preview.
- Clicking markers navigates to the detail page.

Mobile:

- Map remains usable with touch.
- First tap selects a city and displays the preview.
- Preview action opens the detail page.
- Gallery uses fewer columns and preserves readable captions.

## Visual Direction

The interface should feel like a personal travel album, not a dashboard and not a marketing page. Use a restrained palette with warm photo-friendly accents, clear typography, and stable spacing. Avoid heavy decorative gradients and oversized explanatory text. Photos and map interactions are the main visual signals.

## Verification

Implementation should be verified with:

- `npm run build`
- Manual check of map page on desktop.
- Manual check of city hover preview on desktop.
- Manual check of mobile tap preview behavior.
- Manual check of city detail gallery.
- Manual check of unknown city route.

If browser tooling is available during implementation, capture desktop and mobile screenshots to catch layout overlap, blank map rendering, and broken image presentation.
