export type TripPhoto = {
  src: string;
  caption?: string;
};

export type Trip = {
  id: string;
  city: string;
  province: string;
  coordinates: [number, number];
  regionCode: string;
  regionName: string;
  dateRange: string;
  cover: string;
  note: string;
  photos: TripPhoto[];
};

export type MapPoint = {
  id: string;
  name: string;
  value: [number, number];
  regionCode: string;
  regionName: string;
  cover: string;
  dateRange: string;
  note: string;
};
