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
