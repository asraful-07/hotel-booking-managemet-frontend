export type ReservationStatus =
  | "HOLD"
  | "CONFIRMED"
  | "CANCELLED"
  | "EXPIRED"
  | "COMPLETED";

export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED";

export interface IPayment {
  id: string;
  reservationId: string;
  amount: string;
  currency: string;
  status: PaymentStatus;
  transactionId: string;
  paymentMethod: string;
  createdAt: string;
}

export interface IRoomImage {
  id: string;
  imageUrl: string[];
}

import { UserInfo } from "@/types/user.types";

export interface IRoom {
  id: string;
  name: string;
  description: string;
  price: string;
  capacity: number;
  extraBedPrice: string;
  roomType?: { name: string };
  images: IRoomImage[];
}

export interface IReservation {
  id: string;
  roomId: string;
  userId: string;
  user?: UserInfo | null;
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  children: number;
  roomsBooked: number;
  extraBed: number;
  totalPrice: string;
  status: ReservationStatus;
  createdAt: string;
  room: IRoom;
  payment: IPayment | null;
}
