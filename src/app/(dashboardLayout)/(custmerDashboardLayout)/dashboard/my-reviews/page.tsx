/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useCallback, useEffect } from "react";
import { httpClient } from "@/lib/axios/httpClient";
import {
  Star,
  Edit2,
  Trash2,
  Eye,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Search,
  Calendar,
  MessageSquare,
  User,
  Home,
  Quote,
  ThumbsUp,
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  room: {
    id: string;
    name: string;
    description: string;
    price: string;
    images: { imageUrl: string[] }[];
  };
}

interface UpdateReviewPayload {
  rating?: number;
  comment?: string;
}

export default function MyReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState<string>("ALL");

  // View modal state
  const [viewReview, setViewReview] = useState<Review | null>(null);

  // Edit modal state
  const [editReview, setEditReview] = useState<Review | null>(null);
  const [editRating, setEditRating] = useState<number>(5);
  const [editComment, setEditComment] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  // Delete dialog state
  const [deleteReview, setDeleteReview] = useState<Review | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchMyReviews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await httpClient.get<Review[]>("/review/my-reviews");
      console.log(res);
      setReviews(res?.data ?? []);
    } catch (e: any) {
      console.log(e);
      setError(e?.response?.data?.message ?? "Failed to load your reviews");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyReviews();
  }, [fetchMyReviews]);

  const openViewModal = (review: Review) => {
    setViewReview(review);
  };

  const closeViewModal = () => {
    setViewReview(null);
  };

  const openEditModal = (review: Review) => {
    setEditReview(review);
    setEditRating(review.rating);
    setEditComment(review.comment);
    setUpdateError(null);
  };

  const closeEditModal = () => {
    if (isUpdating) return;
    setEditReview(null);
    setEditRating(5);
    setEditComment("");
    setUpdateError(null);
  };

  const handleUpdateReview = async () => {
    if (!editReview) return;
    if (!editComment.trim()) {
      setUpdateError("Review comment is required");
      return;
    }

    setIsUpdating(true);
    setUpdateError(null);

    const payload: UpdateReviewPayload = {};
    if (editRating !== editReview.rating) payload.rating = editRating;
    if (editComment.trim() !== editReview.comment)
      payload.comment = editComment.trim();

    if (Object.keys(payload).length === 0) {
      closeEditModal();
      setIsUpdating(false);
      return;
    }

    try {
      const res = await httpClient.patch<Review>(
        `/review/${editReview.id}`,
        payload,
      );

      setReviews((prev) =>
        prev.map((r) =>
          r.id === editReview.id
            ? { ...r, ...res.data, updatedAt: new Date().toISOString() }
            : r,
        ),
      );

      setSuccess("Review updated successfully!");
      setTimeout(() => setSuccess(null), 3000);
      closeEditModal();
    } catch (e: any) {
      console.error("Update error:", e);
      setUpdateError(e?.response?.data?.message ?? "Failed to update review");
    } finally {
      setIsUpdating(false);
    }
  };

  const openDeleteDialog = (review: Review) => {
    setDeleteReview(review);
  };

  const closeDeleteDialog = () => {
    if (isDeleting) return;
    setDeleteReview(null);
  };

  const handleDeleteReview = async () => {
    if (!deleteReview) return;

    setIsDeleting(true);

    try {
      await httpClient.delete(`/review/${deleteReview.id}`);

      setReviews((prev) => prev.filter((r) => r.id !== deleteReview.id));
      setSuccess("Review deleted successfully!");
      setTimeout(() => setSuccess(null), 3000);
      closeDeleteDialog();
    } catch (e: any) {
      console.error("Delete error:", e);
      setError(e?.response?.data?.message ?? "Failed to delete review");
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsDeleting(false);
    }
  };

  const renderStars = (rating: number, size: "sm" | "md" = "sm") => {
    const starSize = size === "md" ? "w-5 h-5" : "w-4 h-4";
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${starSize} ${
              star <= rating
                ? "fill-[#caa05c] text-[#caa05c]"
                : "fill-gray-200 text-gray-200"
            }`}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating =
      ratingFilter === "ALL" || review.rating === parseInt(ratingFilter);
    return matchesSearch && matchesRating;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#faf8f5] to-[#f5f0ea]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-[#e8d9cc] border-t-[#caa05c] animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-[#caa05c]" />
            </div>
          </div>
          <p className="text-sm text-[#ab8965] font-medium tracking-wide">
            Loading your reviews...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#faf8f5] to-[#f5f0ea]">
      {/* Success Toast */}
      {success && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3 shadow-lg">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <p className="text-emerald-700 font-medium">{success}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-[#e8d9cc]">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#2c1810] to-[#5c3d2e] bg-clip-text text-transparent">
                My Reviews
              </h1>
              <p className="text-[#ab8965] mt-1 text-sm">
                Manage and track all your room reviews
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={fetchMyReviews}
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
                placeholder="Search by room name or review content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-[#faf8f5] border-[#e8d9cc] focus-visible:ring-[#caa05c]"
              />
            </div>
            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className="w-[180px] bg-[#faf8f5] border-[#e8d9cc] focus:ring-[#caa05c]">
                <SelectValue placeholder="Filter by rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
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
              onClick={fetchMyReviews}
              className="text-red-600 hover:text-red-700 hover:bg-red-100"
            >
              Retry
            </Button>
          </div>
        )}

        {!error && filteredReviews.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto bg-[#f5f0ea] rounded-full flex items-center justify-center mb-4">
              <MessageSquare className="w-10 h-10 text-[#ab8965]" />
            </div>
            <p className="text-[#ab8965] text-lg">No reviews found</p>
            <p className="text-[#ab8965]/60 text-sm mt-1">
              {searchTerm
                ? "Try adjusting your search"
                : "You haven't written any reviews yet"}
            </p>
          </div>
        )}

        {!error && filteredReviews.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-[#e8d9cc] overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-[#faf8f5]">
                  <TableRow className="hover:bg-transparent border-b border-[#e8d9cc]">
                    <TableHead className="text-[#2c1810] font-semibold">
                      Room
                    </TableHead>
                    <TableHead className="text-[#2c1810] font-semibold">
                      Rating
                    </TableHead>
                    <TableHead className="text-[#2c1810] font-semibold">
                      Review
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
                  {filteredReviews.map((review) => (
                    <TableRow
                      key={review.id}
                      className="hover:bg-[#faf8f5]/50 transition-colors"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {review.room.images?.[0]?.imageUrl?.[0] ? (
                            <img
                              src={review.room.images[0].imageUrl[0]}
                              alt={review.room.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-[#caa05c]/10 to-[#b8894a]/10 flex items-center justify-center">
                              <Home className="w-5 h-5 text-[#caa05c]" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-[#2c1810]">
                              {review.room.name}
                            </p>
                            <p className="text-xs text-[#ab8965]">
                              ৳{Number(review.room.price).toLocaleString()}
                              /night
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {renderStars(review.rating)}
                        <span className="text-xs text-[#ab8965] ml-1">
                          ({review.rating}/5)
                        </span>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-[#6b5744] line-clamp-2 max-w-xs">
                          {review.comment}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-sm text-[#8b6946]">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(review.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openViewModal(review)}
                            className="text-[#8b6946] hover:text-[#caa05c] hover:bg-[#f5f0ea]"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditModal(review)}
                            className="text-[#8b6946] hover:text-[#caa05c] hover:bg-[#f5f0ea]"
                            title="Edit Review"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openDeleteDialog(review)}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                            title="Delete Review"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="px-6 py-4 border-t border-[#e8d9cc] bg-[#faf8f5]">
              <p className="text-sm text-[#ab8965]">
                Showing {filteredReviews.length} of {reviews.length} reviews
              </p>
            </div>
          </div>
        )}
      </div>

      {/* View Review Modal */}
      <Dialog open={!!viewReview} onOpenChange={closeViewModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#2c1810] flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-[#caa05c]" />
              Review Details
            </DialogTitle>
            <DialogDescription>Complete review information</DialogDescription>
          </DialogHeader>

          {viewReview && (
            <div className="space-y-6">
              {/* Room Info */}
              <div className="bg-[#faf8f5] rounded-xl p-4">
                <div className="flex items-center gap-4">
                  {viewReview.room.images?.[0]?.imageUrl?.[0] ? (
                    <img
                      src={viewReview.room.images[0].imageUrl[0]}
                      alt={viewReview.room.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-lg bg-gradient-to-r from-[#caa05c]/10 to-[#b8894a]/10 flex items-center justify-center">
                      <Home className="w-8 h-8 text-[#caa05c]" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-[#2c1810]">
                      {viewReview.room.name}
                    </h3>
                    <p className="text-sm text-[#ab8965]">
                      ৳{Number(viewReview.room.price).toLocaleString()}/night
                    </p>
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div>
                <h4 className="text-sm font-semibold text-[#ab8965] mb-2">
                  Rating
                </h4>
                <div className="flex items-center gap-3">
                  {renderStars(viewReview.rating, "md")}
                  <span className="text-lg font-bold text-[#caa05c]">
                    {viewReview.rating}/5
                  </span>
                </div>
              </div>

              {/* Review Content */}
              <div>
                <h4 className="text-sm font-semibold text-[#ab8965] mb-2">
                  Review
                </h4>
                <div className="bg-[#faf8f5] rounded-xl p-4">
                  <Quote className="w-5 h-5 text-[#caa05c] mb-2" />
                  <p className="text-[#2c1810] leading-relaxed">
                    {viewReview.comment}
                  </p>
                </div>
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#e8d9cc]">
                <div>
                  <p className="text-xs text-[#ab8965]">Created</p>
                  <p className="text-sm font-medium text-[#2c1810]">
                    {new Date(viewReview.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#ab8965]">Last Updated</p>
                  <p className="text-sm font-medium text-[#2c1810]">
                    {new Date(viewReview.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <Button
                onClick={closeViewModal}
                className="w-full bg-gradient-to-r from-[#caa05c] to-[#b8894a] text-white hover:shadow-md"
              >
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Review Modal */}
      <Dialog open={!!editReview} onOpenChange={closeEditModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#2c1810]">
              Edit Review
            </DialogTitle>
            <DialogDescription>
              Update your review for {editReview?.room.name}
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
                    onClick={() => setEditRating(star)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= editRating
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
                value={editComment}
                onChange={(e) => setEditComment(e.target.value)}
                rows={4}
                className="bg-[#faf8f5] border-[#e8d9cc] focus-visible:ring-[#caa05c]"
              />
            </div>

            {updateError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{updateError}</span>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={closeEditModal}
              disabled={isUpdating}
              className="border-[#e8d9cc] text-[#8b6946] hover:bg-[#f5f0ea]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateReview}
              disabled={isUpdating}
              className="bg-gradient-to-r from-[#caa05c] to-[#b8894a] text-white hover:shadow-md"
            >
              {isUpdating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Updating...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Update Review
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteReview} onOpenChange={closeDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Review</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete your review for{" "}
              <span className="font-semibold text-foreground">
                {deleteReview?.room.name}
              </span>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteReview}
              disabled={isDeleting}
              className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-600"
            >
              {isDeleting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                "Yes, Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
