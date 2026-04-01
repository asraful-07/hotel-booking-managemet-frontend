/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useCallback, useEffect } from "react";
import { httpClient } from "@/lib/axios/httpClient";
import {
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Search,
  Eye,
  CreditCard,
  Calendar,
  DollarSign,
  User,
  Home,
  Clock,
  Receipt,
  Phone,
  Mail,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Payment {
  id: string;
  reservationId: string;
  amount: string;
  currency: string;
  paymentMethod: string;
  status: "SUCCESS" | "FAILED" | "PENDING";
  refundStatus: "NONE" | "PENDING" | "COMPLETED" | "FAILED";
  refundAmount: string | null;
  transactionId: string;
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
    createdAt: string;
    updatedAt: string;
    room: {
      id: string;
      name: string;
      description: string;
      price: string;
      capacity: number;
      roomTypeId: string;
      isAvailable: boolean;
      extraBedPrice: string;
      maxExtraBed: number;
    };
    user: {
      id: string;
      name: string;
      email: string;
      phone: string | null;
      role: string;
      emailVerified: boolean;
      image: string | null;
      createdAt: string;
      updatedAt: string;
    };
  };
}

export default function PaymentHistory() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // View modal state
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await httpClient.get<{ data: Payment[] }>("/payment/history");
      console.log(res);
      const paymentData = res?.data?.data || res?.data || [];
      setPayments(Array.isArray(paymentData) ? paymentData : []);
    } catch (e: any) {
      console.log(e);
      setError(e?.response?.data?.message ?? "Failed to load payment history");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const openViewModal = (payment: Payment) => {
    setSelectedPayment(payment);
  };

  const closeViewModal = () => {
    setSelectedPayment(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return {
          bg: "bg-emerald-50",
          text: "text-emerald-700",
          icon: CheckCircle,
          label: "Success",
        };
      case "FAILED":
        return {
          bg: "bg-red-50",
          text: "text-red-700",
          icon: AlertCircle,
          label: "Failed",
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

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "SSLCOMMERZ":
        return <CreditCard className="w-4 h-4" />;
      default:
        return <CreditCard className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: string, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(parseFloat(amount));
  };

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.reservation?.user?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      payment.reservation?.room?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Loading Component with custom spinner
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#faf8f5] to-[#f5f0ea]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-[#e8d9cc] border-t-[#caa05c] animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Receipt className="w-6 h-6 text-[#caa05c]" />
            </div>
          </div>
          <p className="text-sm text-[#ab8965] font-medium tracking-wide">
            Loading payment history...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#faf8f5] to-[#f5f0ea]">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-[#e8d9cc]">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#2c1810] to-[#5c3d2e] bg-clip-text text-transparent">
                Payment History
              </h1>
              <p className="text-[#ab8965] mt-1 text-sm">
                Track and manage all payment transactions
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={fetchPayments}
              className="text-[#8b6946] hover:text-[#caa05c]"
            >
              <RefreshCw className="w-5 h-5" />
            </Button>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#ab8965]" />
              <Input
                type="text"
                placeholder="Search by transaction ID, guest name, or room..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-[#faf8f5] border-[#e8d9cc] focus-visible:ring-[#caa05c]"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] bg-[#faf8f5] border-[#e8d9cc] focus:ring-[#caa05c]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="SUCCESS">Success</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
              </SelectContent>
            </Select>
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
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchPayments}
              className="text-red-600 hover:text-red-700 hover:bg-red-100"
            >
              Retry
            </Button>
          </div>
        )}

        {!error && filteredPayments.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto bg-[#f5f0ea] rounded-full flex items-center justify-center mb-4">
              <Receipt className="w-10 h-10 text-[#ab8965]" />
            </div>
            <p className="text-[#ab8965] text-lg">No payments found</p>
            <p className="text-[#ab8965]/60 text-sm mt-1">
              {searchTerm
                ? "Try adjusting your search"
                : "No payment records available"}
            </p>
          </div>
        )}

        {!error && filteredPayments.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-[#e8d9cc] overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-[#faf8f5]">
                  <TableRow className="hover:bg-transparent border-b border-[#e8d9cc]">
                    <TableHead className="text-[#2c1810] font-semibold">
                      Guest
                    </TableHead>
                    <TableHead className="text-[#2c1810] font-semibold">
                      Room
                    </TableHead>
                    <TableHead className="text-[#2c1810] font-semibold">
                      Amount
                    </TableHead>
                    <TableHead className="text-[#2c1810] font-semibold">
                      Status
                    </TableHead>
                    <TableHead className="text-[#2c1810] font-semibold">
                      Payment Method
                    </TableHead>
                    <TableHead className="text-[#2c1810] font-semibold">
                      Date
                    </TableHead>
                    <TableHead className="text-right text-[#2c1810] font-semibold">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment) => {
                    const statusInfo = getStatusBadge(payment.status);
                    const StatusIcon = statusInfo.icon;

                    return (
                      <TableRow
                        key={payment.id}
                        className="hover:bg-[#faf8f5]/50 transition-colors"
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {payment.reservation?.user?.image ? (
                              <img
                                src={payment.reservation.user.image}
                                alt={payment.reservation.user.name}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#caa05c] to-[#b8894a] flex items-center justify-center">
                                <User className="w-4 h-4 text-white" />
                              </div>
                            )}
                            <div>
                              <p className="text-sm font-medium text-[#2c1810]">
                                {payment.reservation?.user?.name || "N/A"}
                              </p>
                              <p className="text-xs text-[#ab8965]">
                                {payment.transactionId.slice(0, 12)}...
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Home className="w-4 h-4 text-[#caa05c]" />
                            <span className="text-sm text-[#2c1810]">
                              {payment.reservation?.room?.name || "N/A"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4 text-[#caa05c]" />
                            <span className="font-semibold text-[#2c1810]">
                              {formatCurrency(payment.amount, payment.currency)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.text}`}
                          >
                            <StatusIcon className="w-3 h-3" />
                            {statusInfo.label}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            {getPaymentMethodIcon(payment.paymentMethod)}
                            <span className="text-sm text-[#2c1810]">
                              {payment.paymentMethod}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5 text-sm text-[#8b6946]">
                            <Calendar className="w-3.5 h-3.5" />
                            {formatDate(payment.createdAt)}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openViewModal(payment)}
                            className="text-[#8b6946] hover:text-[#caa05c] hover:bg-[#f5f0ea]"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
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
                Showing {filteredPayments.length} of {payments.length}{" "}
                transactions
              </p>
            </div>
          </div>
        )}
      </div>

      {/* View Payment Modal - Scrollable */}
      <Dialog open={!!selectedPayment} onOpenChange={closeViewModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-[#e8d9cc]">
            <DialogTitle className="text-2xl font-bold text-[#2c1810] flex items-center gap-2">
              <Receipt className="w-6 h-6 text-[#caa05c]" />
              Payment Details
            </DialogTitle>
            <DialogDescription>
              Payment transaction information
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            {selectedPayment && (
              <div className="space-y-6">
                {/* Payment Status Banner */}
                <div
                  className={`p-4 rounded-xl ${
                    selectedPayment.status === "SUCCESS"
                      ? "bg-emerald-50 border border-emerald-200"
                      : selectedPayment.status === "FAILED"
                        ? "bg-red-50 border border-red-200"
                        : "bg-amber-50 border border-amber-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {selectedPayment.status === "SUCCESS" ? (
                        <CheckCircle className="w-8 h-8 text-emerald-600" />
                      ) : selectedPayment.status === "FAILED" ? (
                        <AlertCircle className="w-8 h-8 text-red-600" />
                      ) : (
                        <Clock className="w-8 h-8 text-amber-600" />
                      )}
                      <div>
                        <p className="font-semibold text-lg">
                          Payment{" "}
                          {selectedPayment.status === "SUCCESS"
                            ? "Successful"
                            : selectedPayment.status === "FAILED"
                              ? "Failed"
                              : "Pending"}
                        </p>
                        <p className="text-sm opacity-75">
                          Transaction ID: {selectedPayment.transactionId}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">
                        {formatCurrency(
                          selectedPayment.amount,
                          selectedPayment.currency,
                        )}
                      </p>
                      <p className="text-xs opacity-75">Total Amount</p>
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#2c1810] flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-[#caa05c]" />
                    Payment Information
                  </h3>
                  <div className="bg-[#faf8f5] rounded-xl p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-[#ab8965]">Payment Method</span>
                      <span className="font-medium text-[#2c1810] flex items-center gap-1">
                        {getPaymentMethodIcon(selectedPayment.paymentMethod)}
                        {selectedPayment.paymentMethod}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#ab8965]">Transaction ID</span>
                      <span className="font-mono text-sm text-[#2c1810]">
                        {selectedPayment.transactionId}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#ab8965]">Payment Date</span>
                      <span className="text-[#2c1810]">
                        {new Date(selectedPayment.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#ab8965]">Currency</span>
                      <span className="text-[#2c1810]">
                        {selectedPayment.currency}
                      </span>
                    </div>
                    {selectedPayment.refundStatus !== "NONE" && (
                      <>
                        <div className="flex justify-between pt-2 border-t border-[#e8d9cc]">
                          <span className="text-[#ab8965]">Refund Status</span>
                          <Badge
                            variant="outline"
                            className="bg-red-50 text-red-700 border-red-200"
                          >
                            {selectedPayment.refundStatus}
                          </Badge>
                        </div>
                        {selectedPayment.refundAmount && (
                          <div className="flex justify-between">
                            <span className="text-[#ab8965]">
                              Refund Amount
                            </span>
                            <span className="text-[#2c1810]">
                              {formatCurrency(
                                selectedPayment.refundAmount,
                                selectedPayment.currency,
                              )}
                            </span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Guest Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#2c1810] flex items-center gap-2">
                    <User className="w-5 h-5 text-[#caa05c]" />
                    Guest Information
                  </h3>
                  <div className="bg-[#faf8f5] rounded-xl p-4 space-y-3">
                    <div className="flex items-center gap-3 pb-3 border-b border-[#e8d9cc]">
                      {selectedPayment.reservation?.user?.image ? (
                        <img
                          src={selectedPayment.reservation.user.image}
                          alt={selectedPayment.reservation.user.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#caa05c] to-[#b8894a] flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-[#2c1810]">
                          {selectedPayment.reservation?.user?.name}
                        </p>
                        <p className="text-sm text-[#ab8965]">
                          {selectedPayment.reservation?.user?.role}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[#ab8965]" />
                      <span className="text-sm text-[#2c1810]">
                        {selectedPayment.reservation?.user?.email}
                      </span>
                    </div>
                    {selectedPayment.reservation?.user?.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-[#ab8965]" />
                        <span className="text-sm text-[#2c1810]">
                          {selectedPayment.reservation.user.phone}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="px-6 py-4 border-t border-[#e8d9cc] bg-white">
            <Button
              onClick={closeViewModal}
              className="w-full bg-gradient-to-r from-[#caa05c] to-[#b8894a] text-white hover:shadow-md"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
