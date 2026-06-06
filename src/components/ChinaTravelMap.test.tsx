import { render, screen, waitFor } from '@testing-library/react';
import * as echarts from 'echarts';
import { afterEach, describe, expect, it, vi } from 'vitest';
import ChinaTravelMap from './ChinaTravelMap';

vi.mock('echarts', () => ({
  registerMap: vi.fn()
}));

type MockOption = {
  geo: {
    map: string;
    zoom: number;
    nameProperty?: string;
    regions?: Array<{
      name: string;
      itemStyle?: { areaColor?: string };
    }>;
  };
  series: Array<{
    type: string;
    coordinateSystem?: string;
    data?: unknown[];
    itemStyle?: { areaColor?: string };
    label?: { formatter?: string; show?: boolean };
    lineStyle?: { color?: string; width?: number };
    map?: string;
    silent?: boolean;
  }>;
};

vi.mock('echarts-for-react', () => ({
  default: ({ option, style }: { option: MockOption; style?: { height?: string; width?: string } }) => {
    const provinceBoundary = option.series.find(
      (series) => series.type === 'lines' && series.coordinateSystem === 'geo'
    );
    const capitalLabels = option.series.find(
      (series) => series.type === 'scatter' && series.silent === true
    );
    const visitedRegions = option.geo.regions;
    const oldPointLayer = option.series.find((series) => series.type === 'effectScatter');

    return (
      <div
        data-testid="chart"
        data-capital-count={capitalLabels?.data?.length}
        data-capital-label-formatter={capitalLabels?.label?.formatter}
        data-capital-silent={String(capitalLabels?.silent)}
        data-has-point-layer={String(Boolean(oldPointLayer))}
        data-height={style?.height}
        data-map={option.geo.map}
        data-name-property={option.geo.nameProperty}
        data-province-boundary-count={provinceBoundary?.data?.length}
        data-province-boundary-system={provinceBoundary?.coordinateSystem}
        data-province-boundary-type={provinceBoundary?.type}
        data-province-line-color={provinceBoundary?.lineStyle?.color}
        data-province-line-width={provinceBoundary?.lineStyle?.width}
        data-province-silent={String(provinceBoundary?.silent)}
        data-visited-color={visitedRegions?.[0]?.itemStyle?.areaColor}
        data-visited-count={visitedRegions?.length}
        data-visited-region-name={visitedRegions?.[0]?.name}
        data-width={style?.width}
        data-zoom={option.geo.zoom}
      />
    );
  }
}));

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('ChinaTravelMap', () => {
  it('draws province boundaries as silent geo lines that follow map roam', async () => {
    const prefectureGeoJson = { type: 'FeatureCollection', features: [] };
    const provinceGeoJson = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: { name: '测试省' },
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [100, 30],
                [101, 30],
                [101, 31],
                [100, 30]
              ]
            ]
          }
        }
      ]
    };
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ ok: true, json: async () => prefectureGeoJson })
      .mockResolvedValueOnce({ ok: true, json: async () => provinceGeoJson });
    vi.stubGlobal('fetch', fetchMock);

    render(
      <ChinaTravelMap
        points={[
          {
            id: 'fuzhou',
            name: '福州',
            value: [119.2965, 26.0745],
            regionCode: '350100',
            regionName: '福州市',
            cover: '',
            dateRange: '待整理',
            note: '待整理'
          }
        ]}
        onHover={() => undefined}
        onLeave={() => undefined}
        onSelect={() => undefined}
      />
    );

    await waitFor(() => expect(screen.getByTestId('chart')).toBeInTheDocument());

    expect(fetchMock).toHaveBeenNthCalledWith(1, '/TMap/maps/china-prefectures.json');
    expect(fetchMock).toHaveBeenNthCalledWith(2, '/TMap/maps/china.json');
    expect(echarts.registerMap).toHaveBeenCalledWith('china-prefectures', prefectureGeoJson);
    expect(screen.getByTestId('chart')).toHaveAttribute('data-capital-count', '34');
    expect(screen.getByTestId('chart')).toHaveAttribute('data-capital-label-formatter', '{b}');
    expect(screen.getByTestId('chart')).toHaveAttribute('data-capital-silent', 'true');
    expect(screen.getByTestId('chart')).toHaveAttribute('data-has-point-layer', 'false');
    expect(screen.getByTestId('chart')).toHaveAttribute('data-height', '100%');
    expect(screen.getByTestId('chart')).toHaveAttribute('data-visited-count', '1');
    expect(screen.getByTestId('chart')).toHaveAttribute('data-visited-color', '#173b73');
    expect(screen.getByTestId('chart')).toHaveAttribute('data-visited-region-name', '福州市');
    expect(screen.getByTestId('chart')).toHaveAttribute('data-width', '100%');
    expect(screen.getByTestId('chart')).toHaveAttribute('data-map', 'china-prefectures');
    expect(screen.getByTestId('chart')).toHaveAttribute('data-name-property', '地名');
    expect(screen.getByTestId('chart')).toHaveAttribute('data-province-boundary-type', 'lines');
    expect(screen.getByTestId('chart')).toHaveAttribute('data-province-boundary-system', 'geo');
    expect(screen.getByTestId('chart')).toHaveAttribute('data-province-boundary-count', '1');
    expect(screen.getByTestId('chart')).toHaveAttribute('data-province-silent', 'true');
    expect(screen.getByTestId('chart')).toHaveAttribute('data-province-line-width', '1.8');
    expect(screen.getByTestId('chart')).toHaveAttribute('data-zoom', '1.35');
  });
});
