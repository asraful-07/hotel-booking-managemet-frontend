// payment.interface.ts
export interface ICreatePaymentPayload {
  reservationId: string;
  amount: number;
  currency?: string;
}

export interface IPaymentResponse {
  status: "success" | "fail";
  redirectUrl?: string;
  GatewayPageURL?: string;
  transactionId?: string;
  message?: string;
}
