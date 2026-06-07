import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import MapPage from './MapPage';

type PointerPosition = { x: number; y: number };

type MockMapProps = {
  onHover: (id: string, position: PointerPosition) => void;
  onLeave: (id: string) => void;
  onMove: (id: string, position: PointerPosition) => void;
  onSelect: (id: string) => void;
};

vi.mock('../components/ChinaTravelMap', () => ({
  default: ({ onHover, onLeave, onMove, onSelect }: MockMapProps) => (
    <div data-testid="mock-map-props">
      <button
        data-testid="mock-map"
        onClick={() => onSelect('fuzhou')}
        onMouseEnter={() => onHover('hangzhou', { x: 120, y: 140 })}
        onMouseLeave={() => onLeave('hangzhou')}
        onMouseMove={() => onMove('hangzhou', { x: 180, y: 210 })}
        type="button"
      >
        mock map fuzhou
      </button>
      <button
        data-testid="mock-empty-city"
        onMouseEnter={() => onHover('fuzhou', { x: 48, y: 64 })}
        type="button"
      >
        mock empty fuzhou
      </button>
    </div>
  )
}));

afterEach(() => {
  localStorage.clear();
  vi.unstubAllGlobals();
});

describe('MapPage', () => {
  it('renders the dashboard header with the TMap logo replacing the template title', () => {
    render(
      <MemoryRouter>
        <MapPage />
      </MemoryRouter>
    );

    const header = screen.getByRole('banner');

    expect(within(header).getByRole('img', { name: 'TMap' })).toHaveAttribute(
      'src',
      '/TMap/brand/tmap_logo.png'
    );
    expect(within(header).getByRole('navigation', { name: '主导航' })).toHaveTextContent('首页');
    expect(within(header).getByRole('searchbox', { name: '搜索城市或景点' })).toBeInTheDocument();
    expect(within(header).queryByText('我的旅行地图')).not.toBeInTheDocument();
  });

  it('renders a travel dashboard around the interactive map', () => {
    render(
      <MemoryRouter>
        <MapPage />
      </MemoryRouter>
    );

    expect(screen.getByRole('main')).toHaveAttribute('data-layout', 'travel-dashboard');
    expect(screen.queryByRole('heading', { name: '记录去过的地方' })).not.toBeInTheDocument();
    expect(screen.queryByText('每一个足迹，都是故事')).not.toBeInTheDocument();
    expect(screen.getByRole('complementary', { name: '旅行者概览' })).toBeInTheDocument();
    expect(screen.getByRole('list', { name: '最近去过' })).toBeInTheDocument();
    expect(screen.getByText(/已经去过 \d+ 个城市/)).toBeInTheDocument();
    expect(screen.queryByRole('region', { name: '地图图例' })).not.toBeInTheDocument();
    expect(screen.queryByRole('region', { name: '照片墙' })).not.toBeInTheDocument();
  });

  it('keeps favorite mode inside the travel trace card without the old wanted city list', () => {
    render(
      <MemoryRouter>
        <MapPage />
      </MemoryRouter>
    );

    expect(screen.getByRole('button', { name: '收藏城市' })).toBeInTheDocument();
    expect(screen.queryByRole('complementary', { name: '想去城市' })).not.toBeInTheDocument();
    expect(screen.queryByRole('list', { name: '想去城市列表' })).not.toBeInTheDocument();
  });


  it('shows a temporary favorite feedback instead of navigating while favorite mode is active', () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<MapPage />} />
          <Route path="/city/:id" element={<div>city gallery route</div>} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: '收藏城市' }));
    fireEvent.click(screen.getByTestId('mock-map'));

    expect(screen.queryByText('city gallery route')).not.toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('已收藏福州');
  });
});

describe('MapPage map selection', () => {
  it('navigates directly to the selected city gallery', () => {
    vi.stubGlobal('matchMedia', () => ({ matches: true }));

    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<MapPage />} />
          <Route path="/city/:id" element={<div>city gallery route</div>} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByTestId('mock-map'));

    expect(screen.getByText('city gallery route')).toBeInTheDocument();
  });
});

describe('MapPage city preview', () => {
  it('shows the city first photo near the hovered region and moves it with the pointer', () => {
    render(
      <MemoryRouter>
        <MapPage />
      </MemoryRouter>
    );

    fireEvent.mouseEnter(screen.getByTestId('mock-map'));

    const preview = screen.getByRole('complementary', { name: '杭州预览' });

    expect(within(preview).getByRole('img', { name: '西湖边的傍晚' })).toHaveAttribute(
      'src',
      '/TMap/photos/hangzhou/cover.jpg'
    );
    expect(preview).toHaveStyle({ transform: 'translate(136px, 156px)' });

    fireEvent.mouseMove(screen.getByTestId('mock-map'));

    expect(preview).toHaveStyle({ transform: 'translate(196px, 226px)' });
  });

  it('hides the preview when the pointer leaves the current region', () => {
    render(
      <MemoryRouter>
        <MapPage />
      </MemoryRouter>
    );

    fireEvent.mouseEnter(screen.getByTestId('mock-map'));
    expect(screen.getByRole('complementary', { name: '杭州预览' })).toBeInTheDocument();

    fireEvent.mouseLeave(screen.getByTestId('mock-map'));

    expect(screen.queryByRole('complementary', { name: '杭州预览' })).not.toBeInTheDocument();
  });

  it('uses a city card when the hovered city has no photos', () => {
    render(
      <MemoryRouter>
        <MapPage />
      </MemoryRouter>
    );

    fireEvent.mouseEnter(screen.getByTestId('mock-empty-city'));

    const preview = screen.getByRole('complementary', { name: '福州预览' });

    expect(within(preview).queryByRole('img')).not.toBeInTheDocument();
    expect(within(preview).getByText('福州')).toBeInTheDocument();
    expect(within(preview).getByText('福建')).toBeInTheDocument();
    expect(within(preview).getByText('待整理')).toBeInTheDocument();
  });
});

