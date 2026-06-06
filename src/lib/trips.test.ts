import { describe, expect, it } from 'vitest';
import { findTripById, getAdjacentTrips, getMapPoints, trips } from './trips';

describe('trip helpers', () => {
  it('finds trips by id', () => {
    expect(findTripById('shanghai')?.city).toBe('上海');
    expect(findTripById('missing-city')).toBeUndefined();
  });

  it('creates map points with coordinates and cover data', () => {
    expect(getMapPoints()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'fuzhou',
          name: '福州',
          value: [119.2965, 26.0745],
          regionCode: '350100'
        })
      ])
    );
  });

  it('gets previous and next trips from data order', () => {
    const adjacent = getAdjacentTrips('hangzhou');

    expect(adjacent.previous?.id).toBe(trips[0].id);
    expect(adjacent.next?.id).toBe(trips[2].id);
  });
});
