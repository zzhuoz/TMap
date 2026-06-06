import { useEffect, useMemo, useState } from 'react';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';
import ReactECharts from 'echarts-for-react';
import { provincialCapitals } from '../data/provincial-capitals';
import { publicAsset } from '../lib/assets';
import type { MapPoint } from '../types/trip';

type ChinaTravelMapProps = {
  points: MapPoint[];
  selectedId?: string;
  onHover: (id: string) => void;
  onLeave: (id: string) => void;
  onSelect: (id: string) => void;
};

type ChinaGeoJson = Parameters<typeof echarts.registerMap>[1];
type GeoCoordinate = [number, number];
type BoundaryLine = { coords: GeoCoordinate[] };
type GeoJsonGeometry = {
  type: 'Polygon' | 'MultiPolygon';
  coordinates: GeoCoordinate[][] | GeoCoordinate[][][];
};
type BoundaryGeoJson = {
  features?: Array<{
    geometry?: GeoJsonGeometry | null;
  }>;
};

type ChartEventParams = {
  name?: string;
  data?: {
    id?: string;
  };
};

function getPointId(params: ChartEventParams, points: MapPoint[]): string | undefined {
  if (params.data?.id) {
    return params.data.id;
  }

  return points.find((point) => point.regionName === params.name)?.id;
}

function extractBoundaryLines(geoJson: BoundaryGeoJson): BoundaryLine[] {
  return (geoJson.features ?? []).flatMap((feature) => {
    const geometry = feature.geometry;

    if (!geometry) {
      return [];
    }

    if (geometry.type === 'Polygon') {
      return (geometry.coordinates as GeoCoordinate[][]).map((ring) => ({ coords: ring }));
    }

    if (geometry.type === 'MultiPolygon') {
      return (geometry.coordinates as GeoCoordinate[][][]).flatMap((polygon) =>
        polygon.map((ring) => ({ coords: ring }))
      );
    }

    return [];
  });
}

export default function ChinaTravelMap({
  points,
  selectedId,
  onHover,
  onLeave,
  onSelect
}: ChinaTravelMapProps) {
  const [mapState, setMapState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [provinceBoundaryLines, setProvinceBoundaryLines] = useState<BoundaryLine[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function loadChinaMap() {
      try {
        const [prefectureResponse, provinceResponse] = await Promise.all([
          fetch(publicAsset('/maps/china-prefectures.json')),
          fetch(publicAsset('/maps/china.json'))
        ]);

        if (!prefectureResponse.ok) {
          throw new Error(`Failed to load prefecture map: ${prefectureResponse.status}`);
        }

        if (!provinceResponse.ok) {
          throw new Error(`Failed to load province map: ${provinceResponse.status}`);
        }

        const [prefectureGeoJson, provinceGeoJson] = (await Promise.all([
          prefectureResponse.json(),
          provinceResponse.json()
        ])) as [ChinaGeoJson, ChinaGeoJson & BoundaryGeoJson];

        if (!cancelled) {
          echarts.registerMap('china-prefectures', prefectureGeoJson);
          setProvinceBoundaryLines(extractBoundaryLines(provinceGeoJson));
          setMapState('ready');
        }
      } catch {
        if (!cancelled) {
          setMapState('error');
        }
      }
    }

    loadChinaMap();

    return () => {
      cancelled = true;
    };
  }, []);

  const option = useMemo<EChartsOption>(
    () => ({
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item'
      },
      geo: {
        map: 'china-prefectures',
        nameProperty: '地名',
        roam: true,
        zoom: 1.35,
        layoutCenter: ['50%', '54%'],
        layoutSize: '162%',
        label: {
          show: false
        },
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
        },
        regions: points.map((point) => ({
          name: point.regionName,
          itemStyle: {
            areaColor: '#173b73',
            borderColor: '#f7f3ee',
            borderWidth: 1.1,
            opacity: 0.92
          },
          emphasis: {
            itemStyle: {
              areaColor: '#245a9f',
              opacity: 1
            },
            label: {
              show: false
            }
          }
        }))
      },
      series: [
        {
          type: 'lines',
          coordinateSystem: 'geo',
          polyline: true,
          silent: true,
          z: 2,
          lineStyle: {
            color: '#64705f',
            width: 1.8,
            opacity: 0.88
          },
          emphasis: {
            disabled: true
          },
          data: provinceBoundaryLines
        },
        {
          type: 'scatter',
          coordinateSystem: 'geo',
          silent: true,
          z: 3,
          symbol: 'circle',
          symbolSize: 5,
          itemStyle: {
            color: '#465c54',
            borderColor: '#f7f3ee',
            borderWidth: 1.2
          },
          label: {
            show: true,
            formatter: '{b}',
            position: 'right',
            distance: 5,
            color: '#2f3935',
            fontSize: 11,
            fontWeight: 600,
            backgroundColor: 'rgba(247, 243, 238, 0.72)',
            borderColor: 'rgba(70, 92, 84, 0.14)',
            borderWidth: 1,
            borderRadius: 4,
            padding: [2, 5]
          },
          emphasis: {
            disabled: true
          },
          data: provincialCapitals.map((capital) => ({
            name: capital.name,
            value: capital.coordinates
          }))
        }
      ]
    }),
    [points, provinceBoundaryLines, selectedId]
  );

  const onEvents: Record<string, (params: ChartEventParams) => void> = {
    mouseover: (params) => {
      const id = getPointId(params, points);

      if (id) {
        onHover(id);
      }
    },
    mouseout: (params) => {
      const id = getPointId(params, points);

      if (id) {
        onLeave(id);
      }
    },
    click: (params) => {
      const id = getPointId(params, points);

      if (id) {
        onSelect(id);
      }
    }
  };

  if (mapState === 'loading') {
    return <div className="map-loading">地图加载中</div>;
  }

  if (mapState === 'error') {
    return <div className="map-loading">地图加载失败</div>;
  }

  return (
    <ReactECharts
      className="china-map"
      option={option}
      onEvents={onEvents}
      style={{ width: '100%', height: '100%' }}
    />
  );
}
