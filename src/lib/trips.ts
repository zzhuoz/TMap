import rawTrips from '../data/trips.json';
import type { MapPoint, Trip } from '../types/trip';

export const trips = rawTrips as Trip[];

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
