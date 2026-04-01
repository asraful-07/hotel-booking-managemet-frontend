/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useCallback } from "react";
import { httpClient } from "@/lib/axios/httpClient";
import {
  Calendar,
  User,
  Home,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Eye,
  Edit,
  ChevronRight,
  Phone,
  Mail,
  Bed,
  Users,
  DollarSign,
  RefreshCw,
  Search,
  Filter,
  ChevronDown,
  LogIn,
  LogOut,
  Plus,
} from "lucide-react";

enum CheckinStatus {
  PENDING = "PENDING",
  CHECKED_IN = "CHECKED_IN",
  CHECKED_OUT = "CHECKED_OUT",
}

interface Checkin {
  id: string;
  reservationId: string;
  roomId: string;
  checkinTime: string;
  checkoutTime: string;
  status: CheckinStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
  reservation: {
    id: string;
    userId: string;
    roomId: string;
    checkInDate: string;
    checkOutDate: string;
    adults: number;
    children: number;
    roomsBooked: number;
    extraBed: number;
    totalPrice: string;
    status: string;
    user?: {
      name: string;
      email: string;
      phone: string | null;
    };
  };
  room: {
    id: string;
    name: string;
    description: string;
    price: string;
    capacity: number;
    images: { imageUrl: string[] }[];
  };
}

interface UpdateStatusPayload {
  status: CheckinStatus;
}

export default function CheckinManagementPage() {
  const [checkins, setCheckins] = useState<Checkin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const [selectedCheckin, setSelectedCheckin] = useState<Checkin | null>(null);
  const [viewCheckin, setViewCheckin] = useState<Checkin | null>(null);
  const [updating, setUpdating] = useState(false);

  const fetchCheckins = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await httpClient.get<Checkin[]>("/checkin");
      console.log(res);
      setCheckins(res?.data ?? []);
    } catch (e: any) {
      console.log(e);
      setError(e?.response?.data?.message ?? "Failed to load check-ins");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCheckins();
  }, [fetchCheckins]);

  const handleStatusUpdate = async (
    checkin: Checkin,
    newStatus: CheckinStatus,
  ) => {
    if (updating) return;

    setUpdating(true);
    try {
      const payload: UpdateStatusPayload = { status: newStatus };
      await httpClient.patch(`/checkin/${checkin.id}/status`, payload);

      // Update local state
      setCheckins((prev) =>
        prev.map((c) =>
          c.id === checkin.id
            ? { ...c, status: newStatus, updatedAt: new Date().toISOString() }
            : c,
        ),
      );

      setSelectedCheckin(null);
    } catch (e: any) {
      console.error("Status update error:", e);
      alert(e?.response?.data?.message ?? "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status: CheckinStatus) => {
    switch (status) {
      case CheckinStatus.CHECKED_IN:
        return {
          bg: "bg-blue-50",
          text: "text-blue-700",
          icon: LogIn,
          label: "Checked In",
        };
      case CheckinStatus.CHECKED_OUT:
        return {
          bg: "bg-gray-50",
          text: "text-gray-600",
          icon: LogOut,
          label: "Checked Out",
        };
      default:
        return {
          bg: "bg-amber-50",
          text: "text-amber-700",
          icon: Clock,
          label: "Pending",
        };
    }
  };

  const getAvailableActions = (status: CheckinStatus) => {
    switch (status) {
      case CheckinStatus.PENDING:
        return [
          {
            label: "Mark as Checked In",
            nextStatus: CheckinStatus.CHECKED_IN,
            icon: LogIn,
          },
        ];
      case CheckinStatus.CHECKED_IN:
        return [
          {
            label: "Mark as Checked Out",
            nextStatus: CheckinStatus.CHECKED_OUT,
            icon: LogOut,
          },
        ];
      default:
        return [];
    }
  };

  const filteredCheckins = checkins.filter((checkin) => {
    const matchesSearch =
      checkin.reservation?.user?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      checkin.room?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      checkin.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" || checkin.status === statusFilter;
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
            Loading check-ins...
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
                Check-in Management
              </h1>
              <p className="text-[#ab8965] mt-1 text-sm">
                Track and manage guest check-ins and check-outs
              </p>
            </div>
            <button
              onClick={fetchCheckins}
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
                placeholder="Search by guest name, room or check-in ID..."
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
                <option value="PENDING">Pending</option>
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
              onClick={fetchCheckins}
              className="px-4 py-1.5 bg-red-100 hover:bg-red-200 rounded-lg transition-colors text-red-700 text-sm font-medium"
            >
              Retry
            </button>
          </div>
        )}

        {!error && filteredCheckins.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto bg-[#f5f0ea] rounded-full flex items-center justify-center mb-4">
              <Home className="w-10 h-10 text-[#ab8965]" />
            </div>
            <p className="text-[#ab8965] text-lg">No check-ins found</p>
            <p className="text-[#ab8965]/60 text-sm mt-1">
              Try adjusting your search or filters
            </p>
          </div>
        )}

        {!error && filteredCheckins.length > 0 && (
          <div className="grid gap-5">
            {filteredCheckins.map((checkin) => {
              const statusInfo = getStatusBadge(checkin.status);
              const StatusIcon = statusInfo.icon;
              const actions = getAvailableActions(checkin.status);
              const roomImage =
                checkin.room?.images?.[0]?.imageUrl?.[0] ||
                "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&auto=format";
              const checkinDate = new Date(checkin.checkinTime);
              const checkoutDate = new Date(checkin.checkoutTime);

              return (
                <div
                  key={checkin.id}
                  className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-[#e8d9cc]/50 hover:border-[#e8d9cc]"
                >
                  <div className="flex flex-col lg:flex-row">
                    {/* Room Image */}
                    <div className="lg:w-72 h-56 lg:h-auto relative overflow-hidden bg-[#f5f0ea]">
                      <img
                        src={roomImage}
                        alt={checkin.room?.name || "Room"}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                      <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-2.5 py-1 text-xs font-medium text-[#2c1810]">
                        {checkin.room?.name}
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
                          </div>
                          <div className="flex items-center gap-2 text-[#2c1810]">
                            <User className="w-4 h-4 text-[#caa05c]" />
                            <span className="font-semibold">
                              {checkin.reservation?.user?.name || "Guest"}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-[#8b6946]">
                            {checkin.reservation?.user?.email && (
                              <div className="flex items-center gap-1">
                                <Mail className="w-3.5 h-3.5" />
                                <span>{checkin.reservation.user.email}</span>
                              </div>
                            )}
                            {checkin.reservation?.user?.phone && (
                              <div className="flex items-center gap-1">
                                <Phone className="w-3.5 h-3.5" />
                                <span>{checkin.reservation.user.phone}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-[#caa05c]">
                            ৳
                            {parseInt(
                              checkin.reservation?.totalPrice || "0",
                            ).toLocaleString()}
                          </div>
                          <div className="text-xs text-[#ab8965]">
                            Total Reservation Amount
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 pt-5 border-t border-[#e8d9cc]">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-[#caa05c]" />
                          <div>
                            <p className="text-xs text-[#ab8965]">
                              Check-in Time
                            </p>
                            <p className="text-sm font-medium text-[#2c1810]">
                              {checkinDate.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-[#caa05c]" />
                          <div>
                            <p className="text-xs text-[#ab8965]">
                              Check-out Time
                            </p>
                            <p className="text-sm font-medium text-[#2c1810]">
                              {checkoutDate.toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-[#caa05c]" />
                          <div>
                            <p className="text-xs text-[#ab8965]">Guests</p>
                            <p className="text-sm font-medium text-[#2c1810]">
                              {checkin.reservation?.adults || 0} Adult
                              {checkin.reservation?.adults !== 1 ? "s" : ""}
                              {(checkin.reservation?.children || 0) > 0 &&
                                `, ${checkin.reservation?.children} Child${checkin.reservation?.children !== 1 ? "ren" : ""}`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Bed className="w-4 h-4 text-[#caa05c]" />
                          <div>
                            <p className="text-xs text-[#ab8965]">Extra Bed</p>
                            <p className="text-sm font-medium text-[#2c1810]">
                              {checkin.reservation?.extraBed || 0} Bed
                              {checkin.reservation?.extraBed !== 1 ? "s" : ""}
                            </p>
                          </div>
                        </div>
                      </div>

                      {checkin.notes && (
                        <div className="mt-4 p-3 bg-[#faf8f5] rounded-xl">
                          <p className="text-xs text-[#ab8965] mb-1">Notes</p>
                          <p className="text-sm text-[#2c1810]">
                            {checkin.notes}
                          </p>
                        </div>
                      )}

                      <div className="flex justify-end gap-3 mt-5">
                        <button
                          onClick={() => setViewCheckin(checkin)}
                          className="px-4 py-2 border border-[#e8d9cc] rounded-xl text-sm font-medium text-[#8b6946] hover:bg-[#f5f0ea] transition-colors flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </button>

                        {actions.length > 0 && (
                          <button
                            onClick={() => setSelectedCheckin(checkin)}
                            className="px-4 py-2 bg-gradient-to-r from-[#caa05c] to-[#b8894a] text-white rounded-xl text-sm font-medium hover:shadow-md transition-all flex items-center gap-2"
                          >
                            <Edit className="w-4 h-4" />
                            {actions[0].label}
                          </button>
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

      {/* Status Update Modal */}
      {selectedCheckin && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedCheckin(null);
          }}
        >
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-[#2c1810] to-[#5c3d2e] px-6 py-4">
              <h2 className="text-xl font-bold text-white">Update Status</h2>
              <p className="text-white/70 text-sm mt-1">
                Change check-in status
              </p>
            </div>

            <div className="p-6">
              <div className="bg-[#faf8f5] rounded-xl p-4 mb-5">
                <p className="font-semibold text-[#2c1810]">
                  {selectedCheckin.reservation?.user?.name || "Guest"}
                </p>
                <p className="text-sm text-[#ab8965]">
                  Room: {selectedCheckin.room?.name}
                </p>
                <div className="mt-2 p-2 bg-white rounded-lg">
                  <p className="text-xs text-[#ab8965]">Current Status</p>
                  <p className="text-sm font-medium text-[#2c1810]">
                    {selectedCheckin.status}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-[#2c1810]">Change to:</p>
                {getAvailableActions(selectedCheckin.status).map((action) => (
                  <button
                    key={action.nextStatus}
                    onClick={() =>
                      handleStatusUpdate(selectedCheckin, action.nextStatus)
                    }
                    disabled={updating}
                    className="w-full p-3 bg-gradient-to-r from-[#caa05c] to-[#b8894a] text-white rounded-xl text-sm font-medium hover:shadow-md transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    <action.icon className="w-4 h-4" />
                    {action.label}
                  </button>
                ))}
              </div>

              <div className="mt-5">
                <button
                  onClick={() => setSelectedCheckin(null)}
                  disabled={updating}
                  className="w-full py-2.5 border border-[#e8d9cc] rounded-xl text-sm font-medium text-[#8b6946] hover:bg-[#f5f0ea] transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {viewCheckin && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setViewCheckin(null);
          }}
        >
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-[#2c1810] to-[#5c3d2e] px-6 py-4 sticky top-0">
              <h2 className="text-xl font-bold text-white">Check-in Details</h2>
              <p className="text-white/70 text-sm mt-1">
                Complete check-in information
              </p>
            </div>

            <div className="p-6">
              {/* Room Image */}
              {viewCheckin.room?.images?.[0]?.imageUrl?.[0] && (
                <div className="mb-6 rounded-xl overflow-hidden h-48">
                  <img
                    src={viewCheckin.room.images[0].imageUrl[0]}
                    alt={viewCheckin.room.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Guest Information */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[#2c1810] mb-3 flex items-center gap-2">
                  <User className="w-5 h-5 text-[#caa05c]" />
                  Guest Information
                </h3>
                <div className="bg-[#faf8f5] rounded-xl p-4 space-y-2">
                  <p>
                    <span className="text-[#ab8965]">Name:</span>{" "}
                    {viewCheckin.reservation?.user?.name || "N/A"}
                  </p>
                  <p>
                    <span className="text-[#ab8965]">Email:</span>{" "}
                    {viewCheckin.reservation?.user?.email || "N/A"}
                  </p>
                  <p>
                    <span className="text-[#ab8965]">Phone:</span>{" "}
                    {viewCheckin.reservation?.user?.phone || "N/A"}
                  </p>
                </div>
              </div>

              {/* Room Information */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[#2c1810] mb-3 flex items-center gap-2">
                  <Bed className="w-5 h-5 text-[#caa05c]" />
                  Room Information
                </h3>
                <div className="bg-[#faf8f5] rounded-xl p-4 space-y-2">
                  <p>
                    <span className="text-[#ab8965]">Room Name:</span>{" "}
                    {viewCheckin.room?.name || "N/A"}
                  </p>
                  <p>
                    <span className="text-[#ab8965]">Price per Night:</span> ৳
                    {viewCheckin.room?.price || "0"}
                  </p>
                  <p>
                    <span className="text-[#ab8965]">Capacity:</span>{" "}
                    {viewCheckin.room?.capacity || 0} person
                    {viewCheckin.room?.capacity !== 1 ? "s" : ""}
                  </p>
                  {viewCheckin.room?.description && (
                    <p>
                      <span className="text-[#ab8965]">Description:</span>{" "}
                      {viewCheckin.room.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Check-in Details */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[#2c1810] mb-3 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#caa05c]" />
                  Check-in Details
                </h3>
                <div className="bg-[#faf8f5] rounded-xl p-4 space-y-2">
                  <p>
                    <span className="text-[#ab8965]">Check-in Time:</span>{" "}
                    {new Date(viewCheckin.checkinTime).toLocaleString()}
                  </p>
                  <p>
                    <span className="text-[#ab8965]">Check-out Time:</span>{" "}
                    {new Date(viewCheckin.checkoutTime).toLocaleDateString()}
                  </p>
                  <p>
                    <span className="text-[#ab8965]">Status:</span>{" "}
                    {viewCheckin.status}
                  </p>
                  {viewCheckin.notes && (
                    <p>
                      <span className="text-[#ab8965]">Notes:</span>{" "}
                      {viewCheckin.notes}
                    </p>
                  )}
                </div>
              </div>

              {/* Reservation Details */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[#2c1810] mb-3 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-[#caa05c]" />
                  Reservation Details
                </h3>
                <div className="bg-[#faf8f5] rounded-xl p-4 space-y-2">
                  <p>
                    <span className="text-[#ab8965]">Total Price:</span> ৳
                    {parseInt(
                      viewCheckin.reservation?.totalPrice || "0",
                    ).toLocaleString()}
                  </p>
                  <p>
                    <span className="text-[#ab8965]">Adults:</span>{" "}
                    {viewCheckin.reservation?.adults || 0}
                  </p>
                  <p>
                    <span className="text-[#ab8965]">Children:</span>{" "}
                    {viewCheckin.reservation?.children || 0}
                  </p>
                  <p>
                    <span className="text-[#ab8965]">Extra Beds:</span>{" "}
                    {viewCheckin.reservation?.extraBed || 0}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setViewCheckin(null)}
                className="w-full py-2.5 bg-gradient-to-r from-[#caa05c] to-[#b8894a] text-white rounded-xl text-sm font-medium hover:shadow-md transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
