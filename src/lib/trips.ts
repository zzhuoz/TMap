import rawTrips from '../data/trips.json';
import type { MapPoint, Trip } from '../types/trip';

function isTrip(value: unknown): value is Trip {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const trip = value as Partial<Trip>;

  return (
    typeof trip.id === 'string' &&
    typeof trip.city === 'string' &&
    typeof trip.province === 'string' &&
    Array.isArray(trip.coordinates) &&
    trip.coordinates.length === 2 &&
    trip.coordinates.every((coordinate) => typeof coordinate === 'number') &&
    typeof trip.dateRange === 'string' &&
    typeof trip.cover === 'string' &&
    typeof trip.note === 'string' &&
    Array.isArray(trip.photos) &&
    trip.photos.every(
      (photo) =>
        photo &&
        typeof photo === 'object' &&
        typeof photo.src === 'string' &&
        (photo.caption === undefined || typeof photo.caption === 'string')
    )
  );
}

function assertTrips(value: unknown): asserts value is Trip[] {
  if (!Array.isArray(value) || !value.every(isTrip)) {
    throw new Error('Trip data is invalid.');
  }

  const ids = value.map((trip) => trip.id);
  const uniqueIds = new Set(ids);

  if (uniqueIds.size !== ids.length) {
    throw new Error('Trip ids must be unique.');
  }
}

assertTrips(rawTrips);

export const trips: Trip[] = rawTrips.map((trip) => ({
  ...trip,
  coordinates: [trip.coordinates[0], trip.coordinates[1]]
}));

export function findTripById(id: string): Trip | undefined {
  return trips.find((trip) => trip.id === id);
}

export function getMapPoints(): MapPoint[] {
  return trips.map((trip) => ({
    id: trip.id,
    name: trip.city,
    value: trip.coordinates,
    cover: trip.cover,
    dateRange: trip.dateRange,
    note: trip.note
  }));
}

export function getAdjacentTrips(id: string): { previous?: Trip; next?: Trip } {
  const index = trips.findIndex((trip) => trip.id === id);

  if (index === -1) {
    return {};
  }

  return {
    previous: trips[index - 1],
    next: trips[index + 1]
  };
}
