import { useEffect, useMemo, useState } from 'react';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';
import ReactECharts from 'echarts-for-react';
import type { MapPoint } from '../types/trip';

type ChinaTravelMapProps = {
  points: MapPoint[];
  selectedId?: string;
  onHover: (id: string) => void;
  onLeave: () => void;
  onSelect: (id: string) => void;
};

type ChinaGeoJson = Parameters<typeof echarts.registerMap>[1];

type ChartEventParams = {
  data?: {
    id?: string;
  };
};

function getPointId(params: ChartEventParams): string | undefined {
  return params.data?.id;
}

export default function ChinaTravelMap({
  points,
  selectedId,
  onHover,
  onLeave,
  onSelect
}: ChinaTravelMapProps) {
  const [mapState, setMapState] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    let cancelled = false;

    async function loadChinaMap() {
      try {
        const response = await fetch('/maps/china.json');

        if (!response.ok) {
          throw new Error(`Failed to load China map: ${response.status}`);
        }

        const geoJson = (await response.json()) as ChinaGeoJson;

        if (!cancelled) {
          echarts.registerMap('china', geoJson);
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
        map: 'china',
        roam: true,
        zoom: 1.25,
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
          emphasis: {
            scale: true
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

  const onEvents: Record<string, (params: ChartEventParams) => void> = {
    mouseover: (params) => {
      const id = getPointId(params);

      if (id) {
        onHover(id);
      }
    },
    mouseout: () => {
      onLeave();
    },
    click: (params) => {
      const id = getPointId(params);

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

  return <ReactECharts className="china-map" option={option} onEvents={onEvents} />;
}
