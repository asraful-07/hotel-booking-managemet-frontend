export type CheckinStatus = "PENDING" | "CHECKED_IN" | "CHECKED_OUT";

export interface ICheckin {
  id: string;
  reservationId: string;
  roomId: string;
  checkinTime: string;
  checkoutTime?: string | null;
  status: CheckinStatus;
  notes?: string | null;
  reservation?: {
    id: string;
    totalPrice: number;
    status: string;
    customer?: { name?: string; email?: string };
  };
  room?: {
    id: string;
    name?: string;
    images?: { url: string }[];
  };
}
