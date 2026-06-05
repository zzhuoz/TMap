import { render, screen, waitFor } from '@testing-library/react';
import * as echarts from 'echarts';
import { afterEach, describe, expect, it, vi } from 'vitest';
import ChinaTravelMap from './ChinaTravelMap';

vi.mock('echarts', () => ({
  registerMap: vi.fn()
}));

vi.mock('echarts-for-react', () => ({
  default: ({ option }: { option: { geo: { map: string; zoom: number; nameProperty?: string } } }) => (
    <div
      data-testid="chart"
      data-map={option.geo.map}
      data-name-property={option.geo.nameProperty}
      data-zoom={option.geo.zoom}
    />
  )
}));

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('ChinaTravelMap', () => {
  it('loads and renders the prefecture-level China map', async () => {
    const geoJson = { type: 'FeatureCollection', features: [] };
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => geoJson });
    vi.stubGlobal('fetch', fetchMock);

    render(
      <ChinaTravelMap
        points={[]}
        onHover={() => undefined}
        onLeave={() => undefined}
        onSelect={() => undefined}
      />
    );

    await waitFor(() => expect(screen.getByTestId('chart')).toBeInTheDocument());

    expect(fetchMock).toHaveBeenCalledWith('/TMap/maps/china-prefectures.json');
    expect(echarts.registerMap).toHaveBeenCalledWith('china-prefectures', geoJson);
    expect(screen.getByTestId('chart')).toHaveAttribute('data-map', 'china-prefectures');
    expect(screen.getByTestId('chart')).toHaveAttribute('data-name-property', '地名');
    expect(screen.getByTestId('chart')).toHaveAttribute('data-zoom', '1.75');
  });
});
