/* eslint-disable @next/next/no-img-element */
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { IReservation } from "@/types/reservation.types";
import {
  Calendar,
  Bed,
  DollarSign,
  Users,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  MapPin,
  ChevronRight,
  X,
} from "lucide-react";
import { format } from "date-fns";

interface BookingDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reservation: IReservation | null;
}

export function BookingDetailModal({
  open,
  onOpenChange,
  reservation,
}: BookingDetailModalProps) {
  if (!reservation) return null;

  const images = reservation.room?.images?.[0]?.imageUrl ?? [];
  const isPaid = reservation.payment?.status === "SUCCESS";
  const nights = Math.ceil(
    (new Date(reservation.checkOutDate).getTime() -
      new Date(reservation.checkInDate).getTime()) /
      (1000 * 60 * 60 * 24),
  );

  const formatDate = (date: string) => {
    try {
      return format(new Date(date), "EEEE, MMMM dd, yyyy");
    } catch {
      return date;
    }
  };

  const getStatusIcon = () => {
    if (reservation.status === "CONFIRMED") {
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    } else if (reservation.status === "CANCELLED") {
      return <XCircle className="w-5 h-5 text-red-600" />;
    }
    return <Clock className="w-5 h-5 text-orange-600" />;
  };

  const getStatusColor = () => {
    if (reservation.status === "CONFIRMED")
      return "bg-green-50 text-green-700 border-green-200";
    if (reservation.status === "CANCELLED")
      return "bg-red-50 text-red-700 border-red-200";
    return "bg-orange-50 text-orange-700 border-orange-200";
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[480px] sm:max-w-[480px] p-0 overflow-y-auto bg-gradient-to-b from-white to-gray-50"
      >
        {/* Close Button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 z-50 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors shadow-sm"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Hero Image Section with Carousel */}
        <div className="relative h-64 bg-gradient-to-br from-[#caa05c]/20 to-[#ab8965]/10">
          {images.length > 0 ? (
            <Carousel className="w-full h-full">
              <CarouselContent className="h-full">
                {images.map((url, index) => (
                  <CarouselItem key={index} className="h-full">
                    <img
                      src={url}
                      alt={`${reservation.room?.name} - image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              {images.length > 1 && (
                <>
                  <CarouselPrevious className="left-2 bg-white/80 backdrop-blur-sm hover:bg-white" />
                  <CarouselNext className="right-2 bg-white/80 backdrop-blur-sm hover:bg-white" />
                </>
              )}
            </Carousel>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Bed className="h-16 w-16 text-gray-300" />
            </div>
          )}

          {/* Status Badge */}
          <div className="absolute top-4 left-4">
            <Badge className={`shadow-lg px-3 py-1.5 ${getStatusColor()}`}>
              <div className="flex items-center gap-1.5">
                {getStatusIcon()}
                <span>{reservation.status}</span>
              </div>
            </Badge>
          </div>

          {/* Payment Status Badge */}
          {isPaid && (
            <div className="absolute top-4 right-4">
              <Badge className="shadow-lg bg-green-600 text-white hover:bg-green-700 px-3 py-1.5">
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-3 h-3" />
                  <span>Paid</span>
                </div>
              </Badge>
            </div>
          )}

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 right-4 z-40 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
              {images.length} photos
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
        </div>

        <div className="p-6 space-y-6">
          {/* Header Section */}
          <SheetHeader className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <SheetTitle className="text-2xl font-bold text-gray-800">
                  {reservation.room?.name}
                </SheetTitle>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPin className="h-4 w-4" />
                  <span>Main Building</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-[#caa05c]">
                  ৳{Number(reservation.totalPrice).toLocaleString()}
                </p>
                <p className="text-xs text-gray-400">
                  total for {nights} nights
                </p>
              </div>
            </div>
          </SheetHeader>

          {/* Room Description */}
          {reservation.room?.description && (
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <p className="text-sm leading-relaxed text-gray-600">
                {reservation.room.description}
              </p>
            </div>
          )}

          {/* Stay Details */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#caa05c]" />
              Stay Details
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <FeatureCard
                icon={Calendar}
                label="Check In"
                value={formatDate(reservation.checkInDate)}
                subValue="2:00 PM onwards"
              />
              <FeatureCard
                icon={Calendar}
                label="Check Out"
                value={formatDate(reservation.checkOutDate)}
                subValue="12:00 PM"
              />
            </div>
          </div>

          {/* Room Details */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Bed className="h-4 w-4 text-[#caa05c]" />
              Room Details
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <FeatureCard
                icon={Users}
                label="Capacity"
                value={`${reservation.room?.capacity} Guests`}
              />
              <FeatureCard
                icon={Bed}
                label="Rooms Booked"
                value={`${reservation.roomsBooked} Room${reservation.roomsBooked !== 1 ? "s" : ""}`}
              />
              <FeatureCard
                icon={Users}
                label="Adults"
                value={`${reservation.adults} Adult${reservation.adults !== 1 ? "s" : ""}`}
              />
              <FeatureCard
                icon={Users}
                label="Children"
                value={`${reservation.children} Child${reservation.children !== 1 ? "ren" : ""}`}
              />
            </div>
          </div>

          {/* Payment Details */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-[#caa05c]" />
              Payment Details
            </h3>
            <div className="bg-gradient-to-r from-[#caa05c]/5 to-[#ab8965]/5 rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Room Rate</span>
                <span className="font-medium">
                  ৳{Number(reservation.room?.price).toLocaleString()} / night
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Nights</span>
                <span className="font-medium">{nights} nights</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-[#caa05c]/20">
                <span className="font-semibold text-gray-800">
                  Total Amount
                </span>
                <span className="text-xl font-bold text-[#caa05c]">
                  ৳{Number(reservation.totalPrice).toLocaleString()}
                </span>
              </div>
              {reservation.payment && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Payment Method
                    </span>
                    <span className="text-sm font-medium">
                      {reservation.payment.paymentMethod}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Payment Status
                    </span>
                    <span
                      className={`text-sm font-semibold ${reservation.payment.status === "SUCCESS" ? "text-green-600" : "text-orange-600"}`}
                    >
                      {reservation.payment.status}
                    </span>
                  </div>
                  {reservation.payment.transactionId && (
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        Transaction ID
                      </span>
                      <span className="text-xs font-mono text-gray-600">
                        {reservation.payment.transactionId}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Booking ID */}
          <div className="text-center pt-2">
            <p className="text-xs text-gray-400">
              Booking ID: <span className="font-mono">{reservation.id}</span>
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

interface FeatureCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  subValue?: string;
}

function FeatureCard({ icon: Icon, label, value, subValue }: FeatureCardProps) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
      <div className="p-2 rounded-lg bg-[#caa05c]/10 text-[#caa05c]">
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-medium text-gray-800">{value}</p>
        {subValue && <p className="text-xs text-gray-400 mt-0.5">{subValue}</p>}
      </div>
    </div>
  );
}
