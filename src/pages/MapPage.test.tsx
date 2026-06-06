import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import MapPage from './MapPage';

type MockMapProps = {
  onSelect: (id: string) => void;
};

vi.mock('../components/ChinaTravelMap', () => ({
  default: ({ onSelect }: MockMapProps) => (
    <button data-testid="mock-map" onClick={() => onSelect('fuzhou')} type="button">
      mock map fuzhou
    </button>
  )
}));

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('MapPage', () => {
  it('renders the brand logo in the header without the old text lockup', () => {
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
    expect(within(header).queryByText('TMap')).not.toBeInTheDocument();
    expect(within(header).queryByText('我们的旅行地图')).not.toBeInTheDocument();
    expect(within(header).queryByText(/座城市/)).not.toBeInTheDocument();
  });

  it('uses a fixed map viewport layout', () => {
    render(
      <MemoryRouter>
        <MapPage />
      </MemoryRouter>
    );

    expect(screen.getByRole('main')).toHaveAttribute('data-layout', 'fixed-map');
  });

  it('omits the old city shortcuts and preview card chrome', () => {
    render(
      <MemoryRouter>
        <MapPage />
      </MemoryRouter>
    );

    expect(screen.queryByRole('navigation', { name: '旅行城市' })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: '杭州' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: '查看相册' })).not.toBeInTheDocument();
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
