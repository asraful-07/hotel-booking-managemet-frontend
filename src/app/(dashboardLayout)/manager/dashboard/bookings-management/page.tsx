/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useCallback } from "react";
import { httpClient } from "@/lib/axios/httpClient";
import {
  Calendar,
  User,
  Home,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Eye,
  ChevronRight,
  MapPin,
  Phone,
  Mail,
  Bed,
  Users,
  Luggage,
  DollarSign,
  RefreshCw,
  Search,
  Filter,
  ChevronLeft,
  ChevronDown,
} from "lucide-react";

interface Reservation {
  id: string;
  checkInDate: string;
  checkOutDate: string;
  status: "PENDING" | "CONFIRMED" | "CHECKED_IN" | "CHECKED_OUT";
  user: {
    name: string;
    email: string;
    phone: string | null;
  };
  room: {
    name: string;
    images: { imageUrl: string[] }[];
  };
  payment?: { status: "SUCCESS" | "FAILED" | "PENDING" };
  totalPrice: string;
  adults: number;
  children: number;
  extraBed: number;
  roomsBooked: number;
}

interface CheckinPayload {
  reservationId: string;
  notes?: string;
}

export default function BookingManagementPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const fetchReservations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await httpClient.get<Reservation[]>("/reservation");
      const data = res?.data;
      setReservations(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(
        err?.response?.data?.message ??
          err?.message ??
          "Failed to load reservations.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const openModal = (r: Reservation) => {
    setSelectedReservation(r);
    setNotes("");
    setSubmitError(null);
  };

  const closeModal = () => {
    if (submitting) return;
    setSelectedReservation(null);
    setNotes("");
    setSubmitError(null);
  };

  const handleCheckin = async () => {
    if (!selectedReservation) return;
    setSubmitting(true);
    setSubmitError(null);

    const payload: CheckinPayload = {
      reservationId: selectedReservation.id,
      ...(notes.trim() && { notes: notes.trim() }),
    };

    try {
      await httpClient.post("/checkin", payload);

      // Update the reservation status to CHECKED_IN
      setReservations((prev) =>
        prev.map((r) =>
          r.id === selectedReservation.id ? { ...r, status: "CHECKED_IN" } : r,
        ),
      );

      closeModal();
    } catch (err: any) {
      console.error("Checkin error:", err);
      setSubmitError(
        err?.response?.data?.message ?? "Check-in failed. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string, paymentStatus?: string) => {
    switch (status) {
      case "CONFIRMED":
        if (paymentStatus === "SUCCESS") {
          return {
            bg: "bg-emerald-50",
            text: "text-emerald-700",
            icon: CheckCircle,
            label: "Confirmed & Paid",
          };
        }
        return {
          bg: "bg-amber-50",
          text: "text-amber-700",
          icon: Clock,
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
          icon: XCircle,
          label: "Checked Out",
        };
      default:
        return {
          bg: "bg-gray-50",
          text: "text-gray-600",
          icon: Clock,
          label: status,
        };
    }
  };

  const filteredReservations = reservations.filter((res) => {
    const matchesSearch =
      res.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || res.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
            Loading reservations...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#faf8f5] to-[#f5f0ea]">
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-[#e8d9cc]">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#2c1810] to-[#5c3d2e] bg-clip-text text-transparent">
                Booking Management
              </h1>
              <p className="text-[#ab8965] mt-1 text-sm">
                Manage and process guest reservations
              </p>
            </div>
            <button
              onClick={fetchReservations}
              className="p-2 text-[#8b6946] hover:text-[#caa05c] transition-colors rounded-full hover:bg-[#f5f0ea]"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#ab8965]" />
              <input
                type="text"
                placeholder="Search by guest name, room or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#faf8f5] border border-[#e8d9cc] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#caa05c]/20 focus:border-[#caa05c] text-[#2c1810] placeholder:text-[#ab8965]/60"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#ab8965]" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2.5 bg-[#faf8f5] border border-[#e8d9cc] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#caa05c]/20 focus:border-[#caa05c] text-[#2c1810] appearance-none cursor-pointer"
              >
                <option value="ALL">All Status</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="CHECKED_IN">Checked In</option>
                <option value="CHECKED_OUT">Checked Out</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#ab8965] pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
            <button
              onClick={fetchReservations}
              className="px-4 py-1.5 bg-red-100 hover:bg-red-200 rounded-lg transition-colors text-red-700 text-sm font-medium"
            >
              Retry
            </button>
          </div>
        )}

        {!error && filteredReservations.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto bg-[#f5f0ea] rounded-full flex items-center justify-center mb-4">
              <Home className="w-10 h-10 text-[#ab8965]" />
            </div>
            <p className="text-[#ab8965] text-lg">No reservations found</p>
            <p className="text-[#ab8965]/60 text-sm mt-1">
              Try adjusting your search or filters
            </p>
          </div>
        )}

        {!error && filteredReservations.length > 0 && (
          <div className="grid gap-5">
            {filteredReservations.map((reservation) => {
              const statusInfo = getStatusBadge(
                reservation.status,
                reservation.payment?.status,
              );
              const StatusIcon = statusInfo.icon;
              const roomImage =
                reservation.room.images?.[0]?.imageUrl?.[0] ||
                "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&auto=format";
              const checkInDate = new Date(reservation.checkInDate);
              const checkOutDate = new Date(reservation.checkOutDate);
              const nights = Math.ceil(
                (checkOutDate.getTime() - checkInDate.getTime()) /
                  (1000 * 60 * 60 * 24),
              );

              // Check if button should be disabled
              const isCheckinDisabled =
                reservation.status === "CHECKED_IN" ||
                reservation.status === "CHECKED_OUT";

              return (
                <div
                  key={reservation.id}
                  className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-[#e8d9cc]/50 hover:border-[#e8d9cc]"
                >
                  <div className="flex flex-col lg:flex-row">
                    {/* Room Image */}
                    <div className="lg:w-72 h-56 lg:h-auto relative overflow-hidden bg-[#f5f0ea]">
                      <img
                        src={roomImage}
                        alt={reservation.room.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                      <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-2.5 py-1 text-xs font-medium text-[#2c1810]">
                        {reservation.room.name}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6">
                      <div className="flex flex-wrap justify-between items-start gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div
                              className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${statusInfo.bg} ${statusInfo.text}`}
                            >
                              <StatusIcon className="w-3 h-3" />
                              {statusInfo.label}
                            </div>
                            {reservation.payment?.status === "SUCCESS" && (
                              <div className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium">
                                Payment Verified
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[#2c1810]">
                            <User className="w-4 h-4 text-[#caa05c]" />
                            <span className="font-semibold">
                              {reservation.user.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-[#8b6946]">
                            <div className="flex items-center gap-1">
                              <Mail className="w-3.5 h-3.5" />
                              <span>{reservation.user.email}</span>
                            </div>
                            {reservation.user.phone && (
                              <div className="flex items-center gap-1">
                                <Phone className="w-3.5 h-3.5" />
                                <span>{reservation.user.phone}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-[#caa05c]">
                            ৳{parseInt(reservation.totalPrice).toLocaleString()}
                          </div>
                          <div className="text-xs text-[#ab8965]">
                            Total for {nights} night{nights !== 1 ? "s" : ""}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 pt-5 border-t border-[#e8d9cc]">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-[#caa05c]" />
                          <div>
                            <p className="text-xs text-[#ab8965]">Check In</p>
                            <p className="text-sm font-medium text-[#2c1810]">
                              {checkInDate.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-[#caa05c]" />
                          <div>
                            <p className="text-xs text-[#ab8965]">Check Out</p>
                            <p className="text-sm font-medium text-[#2c1810]">
                              {checkOutDate.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-[#caa05c]" />
                          <div>
                            <p className="text-xs text-[#ab8965]">Guests</p>
                            <p className="text-sm font-medium text-[#2c1810]">
                              {reservation.adults} Adult
                              {reservation.adults !== 1 ? "s" : ""}
                              {reservation.children > 0
                                ? `, ${reservation.children} Child${reservation.children !== 1 ? "ren" : ""}`
                                : ""}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Bed className="w-4 h-4 text-[#caa05c]" />
                          <div>
                            <p className="text-xs text-[#ab8965]">
                              Rooms / Extra Beds
                            </p>
                            <p className="text-sm font-medium text-[#2c1810]">
                              {reservation.roomsBooked} Room
                              {reservation.roomsBooked !== 1 ? "s" : ""}
                              {reservation.extraBed > 0
                                ? ` + ${reservation.extraBed} Extra Bed`
                                : ""}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end mt-5">
                        {reservation.status === "CONFIRMED" &&
                          reservation.payment?.status === "SUCCESS" && (
                            <button
                              onClick={() => openModal(reservation)}
                              disabled={isCheckinDisabled}
                              className={`px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all duration-300 ${
                                isCheckinDisabled
                                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                  : "bg-gradient-to-r from-[#caa05c] to-[#b8894a] text-white hover:shadow-lg"
                              }`}
                            >
                              Process Check-in
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          )}
                        {reservation.status === "CHECKED_IN" && (
                          <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-sm font-medium">
                              Guest Checked In
                            </span>
                          </div>
                        )}
                        {reservation.status === "CHECKED_OUT" && (
                          <div className="flex items-center gap-2 text-gray-500 bg-gray-50 px-4 py-2 rounded-xl">
                            <XCircle className="w-4 h-4" />
                            <span className="text-sm font-medium">
                              Already Checked Out
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Check-in Modal */}
      {selectedReservation && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-[#2c1810] to-[#5c3d2e] px-6 py-4">
              <h2 className="text-xl font-bold text-white">Guest Check-in</h2>
              <p className="text-white/70 text-sm mt-1">
                Confirm arrival and assign room
              </p>
            </div>

            <div className="p-6">
              <div className="bg-[#faf8f5] rounded-xl p-4 mb-5">
                <p className="font-semibold text-[#2c1810]">
                  {selectedReservation.user.name}
                </p>
                <p className="text-sm text-[#ab8965]">
                  Room: {selectedReservation.room.name}
                </p>
                <div className="flex justify-between mt-2 text-xs text-[#8b6946]">
                  <span>
                    Check-in:{" "}
                    {new Date(
                      selectedReservation.checkInDate,
                    ).toLocaleDateString()}
                  </span>
                  <span>
                    Check-out:{" "}
                    {new Date(
                      selectedReservation.checkOutDate,
                    ).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <label className="block text-sm font-medium text-[#2c1810] mb-2">
                Notes (Optional)
              </label>
              <textarea
                placeholder="Add any special instructions or notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full border border-[#e8d9cc] rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#caa05c]/20 focus:border-[#caa05c] resize-none bg-[#faf8f5]"
              />

              {submitError && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {submitError}
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  onClick={closeModal}
                  disabled={submitting}
                  className="flex-1 py-2.5 border border-[#e8d9cc] rounded-xl text-sm font-medium text-[#8b6946] hover:bg-[#f5f0ea] transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCheckin}
                  disabled={submitting}
                  className="flex-1 bg-gradient-to-r from-[#caa05c] to-[#b8894a] text-white py-2.5 rounded-xl text-sm font-medium hover:shadow-md transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Confirm Check-in"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
