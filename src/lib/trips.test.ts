import { describe, expect, it } from 'vitest';
import { findTripById, getAdjacentTrips, getMapPoints, trips } from './trips';

describe('trip helpers', () => {
  it('finds trips by id', () => {
    expect(findTripById('hangzhou')?.city).toBe('杭州');
    expect(findTripById('missing-city')).toBeUndefined();
  });

  it('creates map points with coordinates and cover data', () => {
    expect(getMapPoints()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'hangzhou',
          name: '杭州',
          value: [120.1551, 30.2741]
        })
      ])
    );
  });

  it('gets previous and next trips from data order', () => {
    const adjacent = getAdjacentTrips('xiamen');

    expect(adjacent.previous?.id).toBe(trips[0].id);
    expect(adjacent.next?.id).toBe(trips[2].id);
  });
});
