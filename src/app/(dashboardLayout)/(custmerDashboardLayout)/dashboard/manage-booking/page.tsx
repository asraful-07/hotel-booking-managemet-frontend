/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { httpClient } from "@/lib/axios/httpClient";
import { IReservation } from "@/types/reservation.types";
import { usePayment } from "@/hooks/usePayment";
import { BookingDetailModal } from "@/components/modules/Customer/BookingDetailModal";
import {
  Eye,
  CreditCard,
  Loader2,
  Bed,
  Users,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Clock,
  XCircle,
  Home,
} from "lucide-react";
import { format } from "date-fns";

export default function ManageBooking() {
  const [reservations, setReservations] = useState<IReservation[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<
    IReservation[]
  >([]);
  const [selected, setSelected] = useState<IReservation | null>(null);
  const [payingId, setPayingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "CONFIRMED" | "HOLD" | "CANCELLED"
  >("all");
  const [sortField, setSortField] = useState<"date" | "price" | "status">(
    "date",
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const { handlePay } = usePayment();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await httpClient.get<IReservation[]>("/reservation");
        setReservations(res.data);
        setFilteredReservations(res.data);
      } catch (error) {
        console.error("Failed to load reservations:", error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    let filtered = [...reservations];

    if (searchTerm) {
      filtered = filtered.filter(
        (r) =>
          r.room?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.user?.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((r) => r.status === statusFilter);
    }

    // Sorting
    filtered.sort((a, b) => {
      if (sortField === "date") {
        const dateA = new Date(a.checkInDate).getTime();
        const dateB = new Date(b.checkInDate).getTime();
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      } else if (sortField === "price") {
        const priceA = Number(a.totalPrice);
        const priceB = Number(b.totalPrice);
        return sortOrder === "asc" ? priceA - priceB : priceB - priceA;
      } else {
        const statusA = a.status || "";
        const statusB = b.status || "";
        return sortOrder === "asc"
          ? statusA.localeCompare(statusB)
          : statusB.localeCompare(statusA);
      }
    });

    setFilteredReservations(filtered);
  }, [searchTerm, statusFilter, reservations, sortField, sortOrder]);

  const handleSort = (field: "date" | "price" | "status") => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const formatDate = (date: string) => {
    try {
      return format(new Date(date), "MMM dd, yyyy");
    } catch {
      return date;
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === "CONFIRMED") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
          <CheckCircle className="w-3 h-3" />
          Confirmed
        </span>
      );
    } else if (status === "CANCELLED") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
          <XCircle className="w-3 h-3" />
          Cancelled
        </span>
      );
    } else if (status === "HOLD") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
          <Clock className="w-3 h-3" />
          Pending
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
        <Clock className="w-3 h-3" />
        {status}
      </span>
    );
  };

  const getPaymentBadge = (paymentStatus?: string) => {
    if (paymentStatus === "SUCCESS") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
          Paid
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
        Unpaid
      </span>
    );
  };

  const getRoomImage = (reservation: IReservation) => {
    const firstImage = reservation.room?.images?.[0]?.imageUrl?.[0];
    if (firstImage) {
      return firstImage;
    }
    return null;
  };

  const stats = {
    total: reservations.length,
    confirmed: reservations.filter((r) => r.status === "CONFIRMED").length,
    pending: reservations.filter((r) => r.status === "HOLD").length,
    totalSpent: reservations.reduce((sum, r) => sum + Number(r.totalPrice), 0),
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
            Loading your bookings....
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F5F2] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-800">
                Manage <span className="text-[#caa05c]">Bookings</span>
              </h1>
              <p className="text-gray-500 mt-1">
                Manage and track your reservations
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-[#caa05c]/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.total}
                </p>
              </div>
              <div className="bg-[#caa05c]/10 p-3 rounded-full">
                <Bed className="w-5 h-5 text-[#caa05c]" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-[#caa05c]/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Confirmed</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.confirmed}
                </p>
              </div>
              <div className="bg-green-50 p-3 rounded-full">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-[#caa05c]/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Pending</p>
                <p className="text-2xl font-bold text-orange-600">
                  {stats.pending}
                </p>
              </div>
              <div className="bg-orange-50 p-3 rounded-full">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-[#caa05c]/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Spent</p>
                <p className="text-2xl font-bold text-[#caa05c]">
                  ৳{stats.totalSpent.toLocaleString()}
                </p>
              </div>
              <div className="bg-[#caa05c]/10 p-3 rounded-full">
                <CreditCard className="w-5 h-5 text-[#caa05c]" />
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-[#caa05c]/20 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by room name, booking ID, or guest name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#caa05c] focus:ring-1 focus:ring-[#caa05c] transition-colors"
              />
            </div>
            <div className="flex gap-2">
              <Filter className="w-5 h-5 text-gray-400 self-center" />
              {["all", "CONFIRMED", "HOLD", "CANCELLED"].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status as any)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm ${
                    statusFilter === status
                      ? "bg-[#caa05c] text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {status === "all" ? "All" : status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-[#caa05c]/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Room Details
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-[#caa05c] transition-colors"
                    onClick={() => handleSort("date")}
                  >
                    <div className="flex items-center gap-1">
                      Check In/Out
                      {sortField === "date" &&
                        (sortOrder === "asc" ? (
                          <ChevronUp className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        ))}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Guest
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-[#caa05c] transition-colors"
                    onClick={() => handleSort("price")}
                  >
                    <div className="flex items-center gap-1">
                      Total Price
                      {sortField === "price" &&
                        (sortOrder === "asc" ? (
                          <ChevronUp className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        ))}
                    </div>
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-[#caa05c] transition-colors"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center gap-1">
                      Status
                      {sortField === "status" &&
                        (sortOrder === "asc" ? (
                          <ChevronUp className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        ))}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredReservations.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="text-center">
                        <Bed className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No bookings found</p>
                        <p className="text-sm text-gray-400 mt-1">
                          {searchTerm || statusFilter !== "all"
                            ? "Try adjusting your search or filter criteria"
                            : "You haven't made any reservations yet"}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredReservations.map((reservation) => {
                    const roomImage = getRoomImage(reservation);
                    return (
                      <tr
                        key={reservation.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {/* Room Image */}
                            {roomImage ? (
                              <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                <img
                                  src={roomImage}
                                  alt={reservation.room?.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#caa05c]/20 to-[#ab8965]/10 flex items-center justify-center flex-shrink-0">
                                <Bed className="w-5 h-5 text-[#caa05c]/60" />
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-gray-800">
                                {reservation.room?.name || "Room Booking"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm text-gray-600">
                              {formatDate(reservation.checkInDate)}
                            </p>
                            <p className="text-xs text-gray-400">to</p>
                            <p className="text-sm text-gray-600">
                              {formatDate(reservation.checkOutDate)}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {Math.ceil(
                                (new Date(reservation.checkOutDate).getTime() -
                                  new Date(reservation.checkInDate).getTime()) /
                                  (1000 * 60 * 60 * 24),
                              )}{" "}
                              nights
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#caa05c]/20 to-[#ab8965]/10 flex items-center justify-center flex-shrink-0">
                              <Users className="w-4 h-4 text-[#caa05c]" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-800">
                                {reservation.user?.name || "Guest"}
                              </p>
                              <p className="text-xs text-gray-500">
                                {reservation.adults} Adult
                                {reservation.adults !== 1 ? "s" : ""}
                                {reservation.children > 0 &&
                                  `, ${reservation.children} Child${reservation.children !== 1 ? "ren" : ""}`}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-[#caa05c]">
                            ৳{Number(reservation.totalPrice).toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-400">total amount</p>
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(reservation.status)}
                        </td>
                        <td className="px-6 py-4">
                          {getPaymentBadge(reservation.payment?.status)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelected(reservation)}
                              className="p-2 text-gray-600 hover:text-[#caa05c] hover:bg-[#caa05c]/10 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {reservation.payment?.status !== "SUCCESS" &&
                              reservation.status !== "CANCELLED" && (
                                <button
                                  onClick={() =>
                                    handlePay(reservation, setPayingId)
                                  }
                                  disabled={payingId === reservation.id}
                                  className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                                  title="Pay Now"
                                >
                                  {payingId === reservation.id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <CreditCard className="w-4 h-4" />
                                  )}
                                </button>
                              )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <BookingDetailModal
        open={!!selected}
        onOpenChange={(open) => !open && setSelected(null)}
        reservation={selected}
      />
    </div>
  );
}
