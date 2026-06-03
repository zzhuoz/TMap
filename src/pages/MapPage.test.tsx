import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import MapPage from './MapPage';

vi.mock('../components/ChinaTravelMap', () => ({
  default: () => <div data-testid="mock-map" />
}));

describe('MapPage', () => {
  it('renders accessible city shortcut gallery links', () => {
    render(
      <MemoryRouter>
        <MapPage />
      </MemoryRouter>
    );

    const shortcuts = screen.getByRole('navigation', { name: '旅行城市' });

    expect(within(shortcuts).getByRole('link', { name: '查看杭州相册' })).toHaveAttribute(
      'href',
      '/city/hangzhou'
    );
    expect(within(shortcuts).getByRole('link', { name: '查看厦门相册' })).toHaveAttribute(
      'href',
      '/city/xiamen'
    );
    expect(within(shortcuts).getByRole('link', { name: '查看成都相册' })).toHaveAttribute(
      'href',
      '/city/chengdu'
    );
  });

  it('lets keyboard-accessible city buttons update the preview', () => {
    render(
      <MemoryRouter>
        <MapPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: '厦门' }));

    expect(screen.getByRole('heading', { name: '厦门' })).toBeInTheDocument();
    expect(screen.getByText('海风和橘色日落')).toBeInTheDocument();
  });
});
