
export interface AllDeliveryActiveResponse {
  id: string;
  workerId: string;
  truckId: string;
  routeId: string;
  startedAt: number;
}

export interface DeliverAlert {
  id: string;
  type: string;
  message: string;
  createdAt: number;
}

export interface DeliveryTransit {
  id: string;
  transitPoint: TransitPoint;
  arrivedAt: number;
}

export interface TransitPoint {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

export interface DeliveryDetailResponse {
  id: string;
  workerId: string;
  truckId: string;
  routeId: string;
  startedAt: number;
  finishedAt?: number;
  alerts: DeliverAlert[];
  transits: DeliveryTransit[];
}

// ✅ Request types
export interface DeliveryRequest {
  truckId: string;
  routeId: string;
}

export interface PositionRequest {
  latitude: number;
  longitude: number;
  recordedAt: number;
}

export interface DoTransitRequest {
  deliveryId: string;
  transitPointId: number;
}

// ✅ Response types
export interface PositionResponse {
  latitude: number;
  longitude: number;
  recordedAt: number;
}

export interface WebResponse<T> {
  status: string;
  data: T;
  errors?: string;
}
