import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import CityPage from './CityPage';

vi.mock('../lib/trips', () => ({
  findTripById: (id: string) =>
    id === 'empty-city'
      ? {
          id: 'empty-city',
          city: '空相册城市',
          province: '测试',
          coordinates: [120, 30],
          dateRange: '2026.01.01',
          cover: '/photos/empty/cover.jpg',
          note: '还没整理照片的一站',
          photos: []
        }
      : undefined,
  getAdjacentTrips: () => ({})
}));

describe('CityPage empty gallery', () => {
  it('renders an empty gallery state for a known city without photos', () => {
    render(
      <MemoryRouter initialEntries={["/city/empty-city"]}>
        <Routes>
          <Route path="/city/:id" element={<CityPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: '空相册城市' })).toBeInTheDocument();
    expect(screen.getByText('还没有添加照片')).toBeInTheDocument();
  });
});
