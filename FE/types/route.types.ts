export interface Route {
  id: string;
  startCityName: string;
  endCityName: string;
  details: string;
  basePrice: number;
  distanceKM: number;
  estimatedDurationHours: number;
  isActive: boolean;
  createdAt: number;
}
