/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "sonner";
import { IReservation } from "@/types/reservation.types";

export const usePayment = () => {
  const handlePay = async (
    reservation: IReservation,
    setPayingId: (id: string | null) => void,
  ) => {
    setPayingId(reservation.id);

    try {
      const response = await fetch(
        "http://localhost:5000/api/v1/payment/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reservationId: reservation.id,
            amount: Number(reservation.totalPrice),
          }),
        },
      );

      const data = await response.json();

      // ✅ DEBUG
      console.log("API RAW RESPONSE:", data);

      // 🔥 URL extract
      const url = data?.redirectUrl || data?.GatewayPageURL;

      console.log("REDIRECT URL:", url);

      if (url) {
        window.location.replace(url);
      } else {
        toast.error("Payment URL not found");
      }
    } catch (err: any) {
      console.error("PAYMENT ERROR:", err);
      toast.error("Payment failed");
    } finally {
      setPayingId(null);
    }
  };

  return { handlePay };
};
