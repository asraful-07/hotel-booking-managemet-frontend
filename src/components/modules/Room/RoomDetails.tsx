/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { format, differenceInDays } from "date-fns";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CalendarIcon,
  Users,
  BedDouble,
  ChevronLeft,
  ChevronRight,
  Star,
  Wifi,
  Wind,
  Coffee,
  Car,
  Sparkles,
  CheckCircle2,
  Minus,
  Plus,
  ShoppingCart,
  Home,
  MessageSquare,
  ThumbsUp,
  User,
  Clock,
  Quote,
} from "lucide-react";
import { httpClient } from "@/lib/axios/httpClient";
import {
  IBookingPayload,
  IExtraService,
  IRoom,
  ISelectedService,
} from "@/types/room.types";

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
  room: {
    id: string;
    name: string;
    images: { imageUrl: string[] }[];
  };
}

interface AverageRating {
  averageRating: number;
  totalReviews: number;
}

interface CreateReviewPayload {
  roomId: string;
  rating: number;
  comment: string;
}

const amenityIcons: Record<string, React.ReactNode> = {
  wifi: <Wifi className="w-4 h-4" />,
  ac: <Wind className="w-4 h-4" />,
  breakfast: <Coffee className="w-4 h-4" />,
  parking: <Car className="w-4 h-4" />,
};

const DEFAULT_AMENITIES = ["wifi", "ac", "breakfast", "parking"];

export default function RoomDetails({ roomId }: { roomId: string }) {
  const router = useRouter();

  // Data
  const [room, setRoom] = useState<IRoom | null>(null);
  const [services, setServices] = useState<IExtraService[]>([]);
  const [similarRooms, setSimilarRooms] = useState<IRoom[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState<AverageRating | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Gallery
  const [activeImage, setActiveImage] = useState(0);

  // Booking form
  const [checkIn, setCheckIn] = useState<Date | undefined>(undefined);
  const [checkOut, setCheckOut] = useState<Date | undefined>(undefined);
  const [adults, setAdults] = useState(1);
  const [extraBed, setExtraBed] = useState(0);
  const [selectedServices, setSelectedServices] = useState<ISelectedService[]>(
    [],
  );

  // Review Dialog
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [roomRes, serviceRes, similarRes, reviewsRes, ratingRes] =
        await Promise.all([
          httpClient.get<IRoom>(`/room/${roomId}`),
          httpClient.get<IExtraService[]>("/extra-service"),
          httpClient.get<IRoom[]>(`/room/similar/${roomId}`),
          httpClient.get<Review[]>("/review"),
          httpClient.get<AverageRating>(`/review/${roomId}`),
        ]);
      setRoom(roomRes.data);
      setServices(Array.isArray(serviceRes.data) ? serviceRes.data : []);
      setSimilarRooms(Array.isArray(similarRes.data) ? similarRes.data : []);
      setReviews(
        Array.isArray(reviewsRes.data)
          ? reviewsRes.data.filter((r) => r.room.id === roomId)
          : [],
      );
      setAverageRating(ratingRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load room details");
    } finally {
      setLoading(false);
    }
  }, [roomId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const nights = checkIn && checkOut ? differenceInDays(checkOut, checkIn) : 0;

  const roomTotal = room ? Number(room.price) * Math.max(nights, 0) : 0;
  const extraBedTotal = room
    ? Number(room.extraBedPrice) * extraBed * Math.max(nights, 0)
    : 0;

  const serviceTotal = selectedServices.reduce((acc, sel) => {
    const svc = services.find((s) => s.id === sel.serviceId);
    if (!svc) return acc;
    const cost =
      svc.type === "PER_NIGHT"
        ? Number(svc.price) * sel.quantity * Math.max(nights, 0)
        : Number(svc.price) * sel.quantity * adults;
    return acc + cost;
  }, 0);

  const grandTotal = roomTotal + extraBedTotal + serviceTotal;

  const getServiceQty = (id: string) =>
    selectedServices.find((s) => s.serviceId === id)?.quantity ?? 0;

  const adjustService = (id: string, delta: number) => {
    setSelectedServices((prev) => {
      const existing = prev.find((s) => s.serviceId === id);
      if (!existing) {
        if (delta > 0) return [...prev, { serviceId: id, quantity: delta }];
        return prev;
      }
      const next = existing.quantity + delta;
      if (next <= 0) return prev.filter((s) => s.serviceId !== id);
      return prev.map((s) =>
        s.serviceId === id ? { ...s, quantity: next } : s,
      );
    });
  };

  const handleBook = async () => {
    if (!checkIn || !checkOut) {
      toast.error("Please select check-in and check-out dates");
      return;
    }
    if (nights <= 0) {
      toast.error("Check-out must be after check-in");
      return;
    }
    setSubmitting(true);
    try {
      const payload: IBookingPayload = {
        roomId,
        checkInDate: format(checkIn, "yyyy-MM-dd"),
        checkOutDate: format(checkOut, "yyyy-MM-dd"),
        adults,
        roomsBooked: 1,
        extraBed,
        services: selectedServices,
      };
      await httpClient.post("/reservation", payload);
      toast.success("Reservation created successfully!");
      router.push("/dashboard/manage-booking");
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ?? "Booking failed. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewComment.trim()) {
      toast.error("Please write a review comment");
      return;
    }

    setSubmittingReview(true);
    try {
      const payload: CreateReviewPayload = {
        roomId,
        rating: reviewRating,
        comment: reviewComment.trim(),
      };
      await httpClient.post("/review", payload);
      toast.success("Review submitted successfully!");
      setReviewDialogOpen(false);
      setReviewComment("");
      setReviewRating(5);
      fetchData(); // Refresh reviews and rating
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? "fill-[#caa05c] text-[#caa05c]"
                : "fill-gray-200 text-gray-200"
            }`}
          />
        ))}
      </div>
    );
  };

  const allImages = (room?.images?.[0]?.imageUrl ?? []).filter(Boolean);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#faf8f5] to-[#f5f0ea]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-[#e8d9cc] border-t-[#caa05c] animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Home className="w-6 h-6 text-[#caa05c]" />
            </div>
          </div>
          <p className="text-sm text-[#ab8965] font-medium tracking-wide">
            Loading room details...
          </p>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf8f5]">
        <p className="text-[#ab8965]">Room not found.</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#faf8f5]"
      style={
        {
          "--primary": "#caa05c",
          "--secondary": "#ab8965",
          "--secondBackground": "#caa05c1a",
        } as React.CSSProperties
      }
    >
      {/* Nav breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-[#ab8965] hover:text-[#caa05c] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Rooms
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Title row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge
                style={{
                  background: "var(--secondBackground)",
                  color: "var(--primary)",
                }}
                className="text-xs font-semibold border-0 px-3 py-1"
              >
                {room.roomType?.name}
              </Badge>
              {room.isAvailable ? (
                <Badge className="text-xs font-semibold border-0 px-3 py-1 bg-emerald-50 text-emerald-600">
                  Available
                </Badge>
              ) : (
                <Badge className="text-xs font-semibold border-0 px-3 py-1 bg-red-50 text-red-500">
                  Unavailable
                </Badge>
              )}
            </div>
            <h1
              className="text-3xl sm:text-4xl font-bold tracking-tight"
              style={{ color: "#2c1a0e", fontFamily: "'Georgia', serif" }}
            >
              {room.name}
            </h1>
          </div>
          <div className="text-right">
            <p
              className="text-3xl font-bold"
              style={{ color: "var(--primary)" }}
            >
              ৳{Number(room.price).toLocaleString()}
            </p>
            <p className="text-sm text-[#ab8965]">per night</p>
          </div>
        </div>

        {/* Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8">
          {/* LEFT: Gallery + Info + Reviews */}
          <div className="space-y-7">
            {/* Gallery */}
            <div className="relative rounded-2xl overflow-hidden bg-[#e8ddd0] shadow-md">
              <div className="relative aspect-[16/9] w-full">
                {allImages.length > 0 ? (
                  <Image
                    src={allImages[activeImage]}
                    alt={room.name}
                    fill
                    className="object-cover transition-all duration-500"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#ab8965]">
                    No image available
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Thumbnails */}
              {allImages.length > 1 && (
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 px-4">
                  {allImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`relative w-14 h-10 rounded-lg overflow-hidden border-2 transition-all ${
                        i === activeImage
                          ? "border-[#caa05c] scale-105"
                          : "border-white/50 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={img}
                        alt=""
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Nav arrows */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setActiveImage(
                        (p) => (p - 1 + allImages.length) % allImages.length,
                      )
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow hover:bg-white transition"
                  >
                    <ChevronLeft className="w-5 h-5 text-[#2c1a0e]" />
                  </button>
                  <button
                    onClick={() =>
                      setActiveImage((p) => (p + 1) % allImages.length)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow hover:bg-white transition"
                  >
                    <ChevronRight className="w-5 h-5 text-[#2c1a0e]" />
                  </button>
                </>
              )}
            </div>

            {/* Tabs for Description and Reviews */}
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="w-full bg-white border border-[#e8ddd0] rounded-xl p-1">
                <TabsTrigger
                  value="description"
                  className="flex-1 data-[state=active]:bg-[#caa05c] data-[state=active]:text-white"
                >
                  Description
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="flex-1 data-[state=active]:bg-[#caa05c] data-[state=active]:text-white"
                >
                  Reviews ({averageRating?.totalReviews || 0})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="mt-4">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e8ddd0]">
                  <h2
                    className="text-lg font-semibold mb-2"
                    style={{ color: "#2c1a0e", fontFamily: "'Georgia', serif" }}
                  >
                    About this Room
                  </h2>
                  <p className="text-[#6b5744] leading-relaxed text-sm">
                    {room.description}
                  </p>

                  <Separator className="my-5 bg-[#e8ddd0]" />

                  {/* Room stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      {
                        icon: <Users className="w-5 h-5" />,
                        label: "Capacity",
                        value: `${room.capacity} Guests`,
                      },
                      {
                        icon: <BedDouble className="w-5 h-5" />,
                        label: "Extra Bed",
                        value: `Up to ${room.maxExtraBed}`,
                      },
                      {
                        icon: <Star className="w-5 h-5" />,
                        label: "Room Type",
                        value: room.roomType?.name,
                      },
                      {
                        icon: <Sparkles className="w-5 h-5" />,
                        label: "Extra Bed Price",
                        value: `৳${Number(room.extraBedPrice).toLocaleString()}/night`,
                      },
                    ].map((stat, i) => (
                      <div
                        key={i}
                        className="flex flex-col items-center gap-1.5 p-3 rounded-xl text-center"
                        style={{ background: "var(--secondBackground)" }}
                      >
                        <span style={{ color: "var(--primary)" }}>
                          {stat.icon}
                        </span>
                        <span className="text-xs text-[#ab8965]">
                          {stat.label}
                        </span>
                        <span className="text-sm font-semibold text-[#2c1a0e]">
                          {stat.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Amenities */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e8ddd0] mt-5">
                  <h2
                    className="text-lg font-semibold mb-4"
                    style={{ color: "#2c1a0e", fontFamily: "'Georgia', serif" }}
                  >
                    Amenities
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {DEFAULT_AMENITIES.map((key) => (
                      <div
                        key={key}
                        className="flex items-center gap-2 text-sm text-[#6b5744]"
                      >
                        <CheckCircle2
                          className="w-4 h-4 flex-shrink-0"
                          style={{ color: "var(--primary)" }}
                        />
                        <span className="capitalize">
                          {key === "ac" ? "Air Conditioning" : key}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="mt-4">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e8ddd0]">
                  {/* Rating Summary */}
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#e8ddd0]">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-[#caa05c]">
                          {averageRating?.averageRating.toFixed(1) || "0.0"}
                        </div>
                        <div className="text-xs text-[#ab8965] mt-1">
                          {averageRating?.totalReviews || 0} reviews
                        </div>
                      </div>
                      <div>
                        {renderStars(averageRating?.averageRating || 0)}
                        <p className="text-xs text-[#ab8965] mt-1">
                          Guest satisfaction rating
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => setReviewDialogOpen(true)}
                      className="bg-gradient-to-r from-[#caa05c] to-[#b8894a] text-white hover:shadow-md"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Write a Review
                    </Button>
                  </div>

                  {/* Reviews List */}
                  <div className="space-y-5">
                    {reviews.length === 0 ? (
                      <div className="text-center py-8">
                        <Quote className="w-12 h-12 text-[#e8ddd0] mx-auto mb-3" />
                        <p className="text-[#ab8965]">No reviews yet</p>
                        <p className="text-xs text-[#ab8965]/60 mt-1">
                          Be the first to review this room
                        </p>
                      </div>
                    ) : (
                      reviews.map((review) => (
                        <div
                          key={review.id}
                          className="p-4 rounded-xl bg-[#faf8f5] border border-[#e8ddd0]"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              {review.user?.image ? (
                                <img
                                  src={review.user.image}
                                  alt={review.user.name}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#caa05c] to-[#b8894a] flex items-center justify-center">
                                  <User className="w-5 h-5 text-white" />
                                </div>
                              )}
                              <div>
                                <p className="font-semibold text-[#2c1a0e]">
                                  {review.user?.name || "Anonymous"}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  {renderStars(review.rating)}
                                  <span className="text-xs text-[#ab8965] flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {new Date(
                                      review.createdAt,
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <ThumbsUp className="w-4 h-4 text-[#caa05c]" />
                          </div>
                          <p className="text-sm text-[#6b5744] leading-relaxed">
                            {review.comment}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Similar Rooms Section */}
            {similarRooms.length > 0 && (
              <div className="mt-7">
                <h2
                  className="text-xl font-semibold mb-4"
                  style={{ color: "#2c1a0e", fontFamily: "'Georgia', serif" }}
                >
                  Similar Rooms You Might Like
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {similarRooms.map((similarRoom) => (
                    <div
                      key={similarRoom.id}
                      className="group cursor-pointer bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-[#e8ddd0]"
                      onClick={() => router.push(`/room/${similarRoom.id}`)}
                    >
                      <div className="relative h-48">
                        <Image
                          src={
                            similarRoom.images?.[0]?.imageUrl?.[0] ||
                            "/placeholder.jpg"
                          }
                          alt={similarRoom.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          unoptimized
                        />
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-white/90 text-[#caa05c] border-0">
                            ৳{Number(similarRoom.price).toLocaleString()}/night
                          </Badge>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-[#2c1a0e] mb-1">
                          {similarRoom.name}
                        </h3>
                        <p className="text-xs text-[#ab8965]">
                          {similarRoom.roomType?.name} • {similarRoom.capacity}{" "}
                          guests
                        </p>
                        <Button
                          variant="link"
                          className="p-0 h-auto mt-2 text-[#caa05c] hover:text-[#b8894a]"
                        >
                          View Details →
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Booking Panel */}
          <div className="space-y-5">
            <div className="bg-white rounded-2xl shadow-sm border border-[#e8ddd0] overflow-hidden sticky top-6">
              <div
                className="px-6 py-4 flex items-center gap-2"
                style={{ background: "var(--secondBackground)" }}
              >
                <ShoppingCart
                  className="w-5 h-5"
                  style={{ color: "var(--primary)" }}
                />
                <h3
                  className="font-semibold text-base"
                  style={{ color: "#2c1a0e", fontFamily: "'Georgia', serif" }}
                >
                  Reserve Your Stay
                </h3>
              </div>

              <div className="p-6 space-y-5">
                {/* Date pickers */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-[#ab8965] uppercase tracking-wide mb-1.5 block">
                      Check-in
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left text-sm border-[#e8ddd0] hover:border-[#caa05c] hover:bg-[#caa05c1a] transition-colors"
                        >
                          <CalendarIcon className="w-4 h-4 mr-2 text-[#caa05c]" />
                          {checkIn ? format(checkIn, "dd MMM") : "Select"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={checkIn}
                          onSelect={setCheckIn}
                          disabled={(d) => d < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#ab8965] uppercase tracking-wide mb-1.5 block">
                      Check-out
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left text-sm border-[#e8ddd0] hover:border-[#caa05c] hover:bg-[#caa05c1a] transition-colors"
                        >
                          <CalendarIcon className="w-4 h-4 mr-2 text-[#caa05c]" />
                          {checkOut ? format(checkOut, "dd MMM") : "Select"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={checkOut}
                          onSelect={setCheckOut}
                          disabled={(d) =>
                            d <= (checkIn ?? new Date()) || d < new Date()
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {nights > 0 && (
                  <div
                    className="text-center text-sm font-medium py-2 rounded-lg"
                    style={{
                      background: "var(--secondBackground)",
                      color: "var(--primary)",
                    }}
                  >
                    {nights} night{nights > 1 ? "s" : ""}
                  </div>
                )}

                <CounterField
                  label="Adults"
                  value={adults}
                  min={1}
                  max={room.capacity}
                  onChange={setAdults}
                />

                {room.maxExtraBed > 0 && (
                  <CounterField
                    label={`Extra Bed (৳${Number(room.extraBedPrice).toLocaleString()}/night)`}
                    value={extraBed}
                    min={0}
                    max={room.maxExtraBed}
                    onChange={setExtraBed}
                  />
                )}

                <Separator className="bg-[#e8ddd0]" />

                {services.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-[#ab8965] uppercase tracking-wide mb-3">
                      Extra Services
                    </p>
                    <div className="space-y-2.5">
                      {services.map((svc) => {
                        const qty = getServiceQty(svc.id);
                        return (
                          <div
                            key={svc.id}
                            className="flex items-center justify-between gap-2"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-[#2c1a0e] truncate">
                                {svc.name}
                              </p>
                              <p className="text-xs text-[#ab8965]">
                                ৳{Number(svc.price).toLocaleString()} /{" "}
                                {svc.type === "PER_NIGHT" ? "night" : "person"}
                              </p>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => adjustService(svc.id, -1)}
                                disabled={qty === 0}
                                className="w-7 h-7 rounded-full border border-[#e8ddd0] flex items-center justify-center disabled:opacity-30 hover:border-[#caa05c] transition-colors"
                              >
                                <Minus className="w-3 h-3 text-[#2c1a0e]" />
                              </button>
                              <span className="w-6 text-center text-sm font-semibold text-[#2c1a0e]">
                                {qty}
                              </span>
                              <button
                                onClick={() => adjustService(svc.id, 1)}
                                className="w-7 h-7 rounded-full border border-[#e8ddd0] flex items-center justify-center hover:border-[#caa05c] hover:bg-[#caa05c1a] transition-colors"
                              >
                                <Plus className="w-3 h-3 text-[#2c1a0e]" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <Separator className="bg-[#e8ddd0]" />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-[#6b5744]">
                    <span>
                      ৳{Number(room.price).toLocaleString()} × {nights || "—"}{" "}
                      night{nights > 1 ? "s" : ""}
                    </span>
                    <span>৳{roomTotal.toLocaleString()}</span>
                  </div>
                  {extraBedTotal > 0 && (
                    <div className="flex justify-between text-[#6b5744]">
                      <span>Extra bed</span>
                      <span>৳{extraBedTotal.toLocaleString()}</span>
                    </div>
                  )}
                  {serviceTotal > 0 && (
                    <div className="flex justify-between text-[#6b5744]">
                      <span>Services</span>
                      <span>৳{serviceTotal.toLocaleString()}</span>
                    </div>
                  )}
                  <Separator className="bg-[#e8ddd0] my-2" />
                  <div className="flex justify-between font-bold text-[#2c1a0e] text-base">
                    <span>Total</span>
                    <span style={{ color: "var(--primary)" }}>
                      ৳{grandTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={handleBook}
                  disabled={submitting || !checkIn || !checkOut || nights <= 0}
                  className="w-full h-11 text-white font-semibold text-sm tracking-wide rounded-xl transition-all hover:opacity-90 disabled:opacity-50"
                  style={{ background: "var(--primary)" }}
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Booking…
                    </span>
                  ) : (
                    "Book Now"
                  )}
                </Button>

                <p className="text-xs text-center text-[#ab8965]">
                  No charges until confirmation
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#2c1810]">
              Write a Review
            </DialogTitle>
            <DialogDescription>
              Share your experience about this room
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium text-[#2c1810] mb-2">
                Rating
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= reviewRating
                          ? "fill-[#caa05c] text-[#caa05c]"
                          : "fill-gray-200 text-gray-200"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2c1810] mb-2">
                Your Review
              </label>
              <Textarea
                placeholder="Tell us about your experience..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                rows={4}
                className="bg-[#faf8f5] border-[#e8d9cc] focus-visible:ring-[#caa05c]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setReviewDialogOpen(false)}
              disabled={submittingReview}
              className="border-[#e8d9cc] text-[#8b6946] hover:bg-[#f5f0ea]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitReview}
              disabled={submittingReview}
              className="bg-gradient-to-r from-[#caa05c] to-[#b8894a] text-white hover:shadow-md"
            >
              {submittingReview ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                "Submit Review"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CounterField({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-[#2c1a0e] font-medium">{label}</span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="w-8 h-8 rounded-full border border-[#e8ddd0] flex items-center justify-center disabled:opacity-30 hover:border-[#caa05c] transition-colors"
        >
          <Minus className="w-3.5 h-3.5 text-[#2c1a0e]" />
        </button>
        <span className="w-6 text-center text-sm font-bold text-[#2c1a0e]">
          {value}
        </span>
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="w-8 h-8 rounded-full border border-[#e8ddd0] flex items-center justify-center disabled:opacity-30 hover:border-[#caa05c] hover:bg-[#caa05c1a] transition-colors"
        >
          <Plus className="w-3.5 h-3.5 text-[#2c1a0e]" />
        </button>
      </div>
    </div>
  );
}
