export interface IRoomType {
  id: string;
  name: string;
}

export interface IRoomImage {
  id: string;
  roomId: string;
  imageUrl: string[];
  createdAt: string;
}

export interface IRoom {
  id: string;
  name: string;
  description?: string;
  price: number;
  capacity: number;
  roomTypeId: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;

  roomType?: IRoomType;
  images?: IRoomImage[];

  extraBedPrice?: number;
  maxExtraBed: number;
}

export interface ICreateRoomPayload {
  name: string;
  description?: string;
  price: number;
  capacity: number;
  roomTypeId: string;
  isAvailable?: boolean;
  images?: string[];
  extraBedPrice?: number;
  maxExtraBed?: number;
}

export interface IExtraService {
  id: string;
  name: string;
  price: string;
  type: "PER_NIGHT" | "PER_PERSON";
  isActive: boolean;
}

export interface ISelectedService {
  serviceId: string;
  quantity: number;
}

export interface IBookingPayload {
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  roomsBooked: number;
  extraBed: number;
  services: ISelectedService[];
}

export type IUpdateRoomPayload = Partial<ICreateRoomPayload>;
