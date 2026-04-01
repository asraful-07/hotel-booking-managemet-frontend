import { Button } from "@/components/ui/button";
import {
  CreditCard,
  Loader2,
  Eye,
  Calendar,
  Users,
  Bed,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { IReservation } from "@/types/reservation.types";
import { format } from "date-fns";

export default function BookingCard({
  reservation,
  onPay,
  onView,
  payingId,
}: {
  reservation: IReservation;
  onPay: (r: IReservation) => void;
  onView: (r: IReservation) => void;
  payingId: string | null;
}) {
  const isPaying = payingId === reservation.id;
  const isPaid = reservation.payment?.status === "SUCCESS";
  const isConfirmed = reservation.status === "CONFIRMED";

  const formatDate = (date: string) => {
    try {
      return format(new Date(date), "MMM dd, yyyy");
    } catch {
      return date;
    }
  };

  const nights = Math.ceil(
    (new Date(reservation.checkOutDate).getTime() -
      new Date(reservation.checkInDate).getTime()) /
      (1000 * 60 * 60 * 24),
  );

  const getStatusIcon = () => {
    if (reservation.status === "CONFIRMED") {
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    } else if (reservation.status === "CANCELLED") {
      return <XCircle className="w-4 h-4 text-red-600" />;
    }
    return <Clock className="w-4 h-4 text-orange-600" />;
  };

  const getStatusColor = () => {
    if (reservation.status === "CONFIRMED")
      return "bg-green-100 text-green-700 border-green-200";
    if (reservation.status === "CANCELLED")
      return "bg-red-100 text-red-700 border-red-200";
    return "bg-orange-100 text-orange-700 border-orange-200";
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#caa05c]/30">
      {/* Image Section */}
      <div className="relative h-52 bg-gradient-to-br from-[#caa05c]/10 to-[#ab8965]/10">
        {reservation.room?.images?.[0]?.imageUrl?.[0] ? (
          <img
            src={reservation.room.images[0].imageUrl[0]}
            alt={reservation.room.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Bed className="w-16 h-16 text-[#caa05c]/30" />
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <div
            className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm flex items-center gap-1.5 ${getStatusColor()}`}
          >
            {getStatusIcon()}
            <span>{reservation.status}</span>
          </div>
        </div>

        {/* Payment Status Badge */}
        {isPaid && (
          <div className="absolute top-4 left-4">
            <div className="px-3 py-1.5 rounded-full text-xs font-semibold bg-green-600 text-white shadow-lg flex items-center gap-1.5">
              <CheckCircle className="w-3 h-3" />
              <span>Paid</span>
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5 space-y-4">
        {/* Title & Price */}
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-800 line-clamp-1">
              {reservation.room?.name || "Room Booking"}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              ID: {reservation.id.slice(0, 8)}...
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-[#caa05c]">
              ৳{Number(reservation.totalPrice).toLocaleString()}
            </p>
            <p className="text-xs text-gray-400">
              {nights} night{nights !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4 text-[#caa05c]" />
            <span>{formatDate(reservation.checkInDate)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4 text-[#caa05c]" />
            <span>{formatDate(reservation.checkOutDate)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="w-4 h-4 text-[#caa05c]" />
            <span>
              {reservation.adults} Adult{reservation.adults !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Bed className="w-4 h-4 text-[#caa05c]" />
            <span>
              {reservation.roomsBooked} Room
              {reservation.roomsBooked !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button
            onClick={() => onView(reservation)}
            variant="outline"
            className="flex-1 border-gray-200 hover:border-[#caa05c] hover:bg-[#caa05c]/5 transition-all"
          >
            <Eye className="w-4 h-4 mr-2" />
            Details
          </Button>

          {!isPaid && reservation.status !== "CANCELLED" && (
            <Button
              onClick={() => onPay(reservation)}
              disabled={isPaying}
              className="flex-1 bg-[#caa05c] hover:bg-[#ab8965] transition-all shadow-md hover:shadow-lg"
            >
              {isPaying ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4 mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Pay Now
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
