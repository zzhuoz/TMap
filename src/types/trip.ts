export type TripPhoto = {
  src: string;
  caption?: string;
};

export type Trip = {
  id: string;
  city: string;
  province: string;
  coordinates: [number, number];
  dateRange: string;
  cover: string;
  note: string;
  photos: TripPhoto[];
};

export type MapPoint = {
  id: string;
  name: string;
  value: [number, number];
  cover: string;
  dateRange: string;
  note: string;
};
