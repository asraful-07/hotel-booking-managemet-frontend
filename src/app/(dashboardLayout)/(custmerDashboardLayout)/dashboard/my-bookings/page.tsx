/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Home,
  Eye,
  Bed,
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { httpClient } from "@/lib/axios/httpClient";
import { IReservation } from "@/types/reservation.types";
import { format } from "date-fns";
import Image from "next/image";

export default function MyBooking() {
  const router = useRouter();
  const [reservations, setReservations] = useState<IReservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReservation, setSelectedReservation] =
    useState<IReservation | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await httpClient.get<IReservation[]>("/reservation");
        console.log("Reservations:", res);

        setReservations(res?.data ?? []);
      } catch (error) {
        console.error("Failed to load reservations:", error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return {
          bg: "bg-emerald-50",
          text: "text-emerald-700",
          icon: CheckCircle,
          label: "Confirmed",
        };
      case "CHECKED_IN":
        return {
          bg: "bg-blue-50",
          text: "text-blue-700",
          icon: CheckCircle,
          label: "Checked In",
        };
      case "CHECKED_OUT":
        return {
          bg: "bg-gray-50",
          text: "text-gray-600",
          icon: Clock,
          label: "Checked Out",
        };
      case "PENDING":
        return {
          bg: "bg-amber-50",
          text: "text-amber-700",
          icon: Clock,
          label: "Pending",
        };
      default:
        return {
          bg: "bg-gray-50",
          text: "text-gray-600",
          icon: AlertCircle,
          label: status,
        };
    }
  };

  const getPaymentStatusBadge = (status?: string) => {
    if (!status) return null;
    switch (status) {
      case "SUCCESS":
        return { bg: "bg-emerald-50", text: "text-emerald-700", label: "Paid" };
      case "FAILED":
        return { bg: "bg-red-50", text: "text-red-700", label: "Failed" };
      default:
        return { bg: "bg-amber-50", text: "text-amber-700", label: "Pending" };
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd MMM yyyy");
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
    }).format(parseFloat(price));
  };

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
            Loading MyBookings....
          </p>
        </div>
      </div>
    );
  }

  const filteredReservations = reservations.filter(
    (r) => r.payment?.status === "SUCCESS",
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#faf8f5] to-[#f5f0ea]">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-[#e8d9cc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-8 h-8 text-[#caa05c]" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#2c1810] to-[#5c3d2e] bg-clip-text text-transparent">
              My Bookings
            </h1>
          </div>
          <p className="text-[#ab8965]">
            {filteredReservations.length}{" "}
            {filteredReservations.length === 1 ? "booking" : "bookings"} found
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredReservations.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto bg-[#f5f0ea] rounded-full flex items-center justify-center mb-4">
              <Calendar className="w-10 h-10 text-[#ab8965]" />
            </div>
            <h2 className="text-xl font-semibold text-[#2c1810] mb-2">
              No bookings found
            </h2>
            <p className="text-[#ab8965] mb-6">
              You haven't made any reservations yet
            </p>
            <Button
              onClick={() => router.push("/room")}
              className="bg-gradient-to-r from-[#caa05c] to-[#b8894a] text-white hover:shadow-md"
            >
              <Home className="w-4 h-4 mr-2" />
              Explore Rooms
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-[#e8d9cc] overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-[#faf8f5]">
                  <TableRow className="border-b border-[#e8d9cc]">
                    <TableHead className="text-[#2c1810] font-semibold">
                      Room
                    </TableHead>
                    <TableHead className="text-[#2c1810] font-semibold">
                      Check In
                    </TableHead>
                    <TableHead className="text-[#2c1810] font-semibold">
                      Check Out
                    </TableHead>
                    <TableHead className="text-[#2c1810] font-semibold">
                      Guests
                    </TableHead>
                    <TableHead className="text-[#2c1810] font-semibold">
                      Status
                    </TableHead>
                    <TableHead className="text-right text-[#2c1810] font-semibold">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReservations.map((booking) => {
                    const statusInfo = getStatusBadge(booking.status);
                    const StatusIcon = statusInfo.icon;
                    const paymentStatus = getPaymentStatusBadge(
                      booking.payment?.status,
                    );

                    return (
                      <TableRow
                        key={booking.id}
                        className="hover:bg-[#faf8f5]/50 transition-colors"
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#f5f0ea]">
                              <img
                                src={
                                  booking.room.images?.[0]?.imageUrl?.[0] ||
                                  "/placeholder.jpg"
                                }
                                alt={booking.room.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-semibold text-[#2c1810]">
                                {booking.room.name}
                              </p>
                              <p className="text-xs text-[#ab8965]">
                                {formatPrice(booking.room.price)} / night
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-[#caa05c]" />
                            <span className="text-sm text-[#2c1810]">
                              {formatDate(booking.checkInDate)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-[#caa05c]" />
                            <span className="text-sm text-[#2c1810]">
                              {formatDate(booking.checkOutDate)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <Users className="w-4 h-4 text-[#caa05c]" />
                            <span className="text-sm text-[#2c1810]">
                              {booking.adults} Adult
                              {booking.adults !== 1 ? "s" : ""}
                              {booking.children > 0 &&
                                ` + ${booking.children} Child${booking.children !== 1 ? "ren" : ""}`}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="space-y-1">
                            <div
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.text}`}
                            >
                              <StatusIcon className="w-3 h-3" />
                              {statusInfo.label}
                            </div>
                            {paymentStatus && (
                              <div
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${paymentStatus.bg} ${paymentStatus.text}`}
                              >
                                <CheckCircle className="w-3 h-3" />
                                {paymentStatus.label}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedReservation(booking)}
                            className="text-[#8b6946] hover:text-[#caa05c] hover:bg-[#f5f0ea]"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            <div className="px-6 py-4 border-t border-[#e8d9cc] bg-[#faf8f5]">
              <p className="text-sm text-[#ab8965]">
                Showing {filteredReservations.length} of {reservations.length}{" "}
                bookings
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Booking Details Modal */}
      <Dialog
        open={!!selectedReservation}
        onOpenChange={() => setSelectedReservation(null)}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#2c1810] flex items-center gap-2">
              <Calendar className="w-6 h-6 text-[#caa05c]" />
              Booking Details
            </DialogTitle>
            <DialogDescription>
              Complete information about your reservation
            </DialogDescription>
          </DialogHeader>

          {selectedReservation && (
            <div className="space-y-6">
              {/* Room Image */}
              <div className="relative h-48 rounded-xl overflow-hidden">
                <img
                  src={
                    selectedReservation.room.images?.[0]?.imageUrl?.[0] ||
                    "/placeholder.jpg"
                  }
                  alt={selectedReservation.room.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <Badge className="bg-white/90 text-[#caa05c] border-0">
                    {selectedReservation.room.name}
                  </Badge>
                </div>
              </div>

              {/* Status & Payment */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-[#faf8f5] rounded-xl">
                  <p className="text-xs text-[#ab8965] mb-1">Booking Status</p>
                  <div
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge(selectedReservation.status).bg} ${getStatusBadge(selectedReservation.status).text}`}
                  >
                    {getStatusBadge(selectedReservation.status).label}
                  </div>
                </div>
                <div className="p-4 bg-[#faf8f5] rounded-xl">
                  <p className="text-xs text-[#ab8965] mb-1">Payment Status</p>
                  <div
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      selectedReservation.payment?.status === "SUCCESS"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    <CheckCircle className="w-3 h-3" />
                    {selectedReservation.payment?.status === "SUCCESS"
                      ? "Paid"
                      : "Pending"}
                  </div>
                </div>
              </div>

              {/* Booking Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-[#2c1810] flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#caa05c]" />
                    Stay Details
                  </h3>
                  <div className="bg-[#faf8f5] rounded-xl p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-[#ab8965]">Check In</span>
                      <span className="text-sm font-medium text-[#2c1810]">
                        {formatDate(selectedReservation.checkInDate)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-[#ab8965]">Check Out</span>
                      <span className="text-sm font-medium text-[#2c1810]">
                        {formatDate(selectedReservation.checkOutDate)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-[#ab8965]">Nights</span>
                      <span className="text-sm font-medium text-[#2c1810]">
                        {Math.ceil(
                          (new Date(
                            selectedReservation.checkOutDate,
                          ).getTime() -
                            new Date(
                              selectedReservation.checkInDate,
                            ).getTime()) /
                            (1000 * 60 * 60 * 24),
                        )}{" "}
                        nights
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-[#2c1810] flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#caa05c]" />
                    Guest Details
                  </h3>
                  <div className="bg-[#faf8f5] rounded-xl p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-[#ab8965]">Adults</span>
                      <span className="text-sm font-medium text-[#2c1810]">
                        {selectedReservation.adults}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-[#ab8965]">Children</span>
                      <span className="text-sm font-medium text-[#2c1810]">
                        {selectedReservation.children || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-[#ab8965]">Extra Beds</span>
                      <span className="text-sm font-medium text-[#2c1810]">
                        {selectedReservation.extraBed || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-[#ab8965]">
                        Rooms Booked
                      </span>
                      <span className="text-sm font-medium text-[#2c1810]">
                        {selectedReservation.roomsBooked}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              {selectedReservation.payment && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-[#2c1810] flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[#caa05c]" />
                    Payment Details
                  </h3>
                  <div className="bg-[#faf8f5] rounded-xl p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-[#ab8965]">
                        Amount Paid
                      </span>
                      <span className="text-lg font-bold text-[#caa05c]">
                        {formatPrice(selectedReservation.payment.amount)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-[#ab8965]">
                        Payment Method
                      </span>
                      <span className="text-sm font-medium text-[#2c1810]">
                        {selectedReservation.payment.paymentMethod}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-[#ab8965]">
                        Transaction ID
                      </span>
                      <span className="text-xs font-mono text-[#2c1810]">
                        {selectedReservation.payment.transactionId}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Room Details */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-[#2c1810] flex items-center gap-2">
                  <Bed className="w-4 h-4 text-[#caa05c]" />
                  Room Details
                </h3>
                <div className="bg-[#faf8f5] rounded-xl p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-[#ab8965]">Room Name</span>
                    <span className="text-sm font-medium text-[#2c1810]">
                      {selectedReservation.room.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-[#ab8965]">
                      Price per Night
                    </span>
                    <span className="text-sm font-medium text-[#2c1810]">
                      {formatPrice(selectedReservation.room.price)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-[#ab8965]">Capacity</span>
                    <span className="text-sm font-medium text-[#2c1810]">
                      {selectedReservation.room.capacity} Guests
                    </span>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => setSelectedReservation(null)}
                className="w-full bg-gradient-to-r from-[#caa05c] to-[#b8894a] text-white hover:shadow-md"
              >
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
