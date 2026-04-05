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
import { IRoom } from "@/types/room.types";
import {
  Users,
  Bed,
  DollarSign,
  Maximize2,
  Home,
  ChevronRight,
  X,
} from "lucide-react";

interface RoomViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  room: IRoom | null;
}

export function RoomViewModal({
  open,
  onOpenChange,
  room,
}: RoomViewModalProps) {
  if (!room) return null;

  const images = room.images?.[0]?.imageUrl ?? [];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[480px] sm:max-w-[480px] p-0 overflow-y-auto bg-gradient-to-b from-background to-muted/20"
      >
        {/* Close Button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 z-50 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors shadow-sm"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Hero Image Section with Carousel */}
        <div className="relative h-64 bg-gradient-to-br from-primary/20 to-primary/5">
          {images.length > 0 ? (
            <Carousel className="w-full h-full">
              <CarouselContent className="h-full">
                {images.map((url, index) => (
                  <CarouselItem key={index} className="h-full">
                    <img
                      src={url}
                      alt={`${room.name} - image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              {images.length > 1 && (
                <>
                  <CarouselPrevious className="left-2 bg-background/80 backdrop-blur-sm hover:bg-background" />
                  <CarouselNext className="right-2 bg-background/80 backdrop-blur-sm hover:bg-background" />
                </>
              )}
            </Carousel>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Home className="h-16 w-16 text-muted-foreground/30" />
            </div>
          )}

          {/* Status Badge */}
          <div className="absolute top-4 left-4">
            <Badge
              variant={room.isAvailable ? "default" : "destructive"}
              className="shadow-lg px-3 py-1"
            >
              {room.isAvailable ? "Available Now" : "Currently Unavailable"}
            </Badge>
          </div>

          {/* Image Counter (if multiple images) */}
          {images.length > 1 && (
            <div className="absolute bottom-4 right-4 z-40 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
              {images.length} photos
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
        </div>

        <div className="p-6 space-y-6">
          {/* Header Section */}
          <SheetHeader className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <SheetTitle className="text-2xl font-bold">
                  {room.name}
                </SheetTitle>
                {room.roomType?.name && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Bed className="h-4 w-4" />
                    <span>{room.roomType.name}</span>
                  </div>
                )}
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">
                  ৳{room.price?.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">per night</p>
              </div>
            </div>
          </SheetHeader>

          {/* Description */}
          {room.description && (
            <div className="bg-muted/30 rounded-xl p-4 border border-border/50">
              <p className="text-sm leading-relaxed text-foreground/80">
                {room.description}
              </p>
            </div>
          )}

          {/* Key Features Grid */}
          <div className="grid grid-cols-2 gap-3">
            <FeatureCard
              icon={Users}
              label="Capacity"
              value={`${room.capacity ?? 0} Guests`}
            />
            <FeatureCard
              icon={Bed}
              label="Extra Bed"
              value={`${room.maxExtraBed ?? 0} available (৳${room.extraBedPrice ?? 0}/each)`}
            />
            <FeatureCard
              icon={DollarSign}
              label="Price"
              value={`৳${room.price ?? 0} / night`}
            />
            <FeatureCard
              icon={Maximize2}
              label="Room Type"
              value={room.roomType?.name || "Standard"}
            />
          </div>

          {/* Additional Details */}
          <div className="pt-4 border-t border-border/50">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <ChevronRight className="h-4 w-4 text-primary" />
              Additional Information
            </h3>
            <div className="space-y-2 text-sm">
              {room.maxExtraBed && room.maxExtraBed > 0 && (
                <DetailRow
                  label="Extra Bed Policy"
                  value={`Maximum ${room.maxExtraBed} extra bed(s) available at ৳${room.extraBedPrice} per bed`}
                />
              )}
              <DetailRow
                label="Availability"
                value={
                  room.isAvailable ? "Ready for booking" : "Currently occupied"
                }
                isAvailable={room.isAvailable}
              />
            </div>
          </div>

          {/* Action Buttons */}
          {room.isAvailable && (
            <div className="pt-4">
              <button
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-3 rounded-xl font-semibold transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                onClick={() => {
                  // Add your booking logic here
                  console.log("Book room:", room.id);
                }}
              >
                Book This Room
              </button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

interface FeatureCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
}

function FeatureCard({ icon: Icon, label, value }: FeatureCardProps) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 border border-border/50 hover:border-border transition-colors">
      <div className="p-2 rounded-lg bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium truncate">{value}</p>
      </div>
    </div>
  );
}

function DetailRow({
  label,
  value,
  isAvailable,
}: {
  label: string;
  value: string;
  isAvailable?: boolean;
}) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-border/30 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span
        className={`font-medium ${isAvailable !== undefined ? (isAvailable ? "text-green-600" : "text-red-600") : ""}`}
      >
        {value}
      </span>
    </div>
  );
}
