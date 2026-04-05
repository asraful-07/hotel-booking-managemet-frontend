/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Heart,
  Trash2,
  Bed,
  Users,
  Star,
  ChevronRight,
  Home,
  Calendar,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { httpClient } from "@/lib/axios/httpClient";

interface WishlistItem {
  id: string;
  roomId: string;
  userId: string;
  createdAt: string;
  room: {
    id: string;
    name: string;
    price: string;
    capacity: number;
    roomType?: { name: string };
    images?: { imageUrl: string[] }[];
  };
}

export default function WishlistPage() {
  const router = useRouter();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteItem, setDeleteItem] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  // Fetch wishlist data
  const fetchWishlist = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await httpClient.get<WishlistItem[]>("/wishlist");
      console.log("Wishlist response:", res);

      setWishlistItems(res?.data ?? []);
    } catch (error: any) {
      console.error("Failed to fetch wishlist:", error);
      if (error?.response?.status !== 401) {
        toast.error("Failed to load wishlist");
      }
      setWishlistItems([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  // Remove single item
  const handleRemove = async () => {
    if (!deleteItem) return;
    setIsDeleting(true);
    try {
      await httpClient.delete(`/wishlist/${deleteItem.id}`);
      setWishlistItems((prev) =>
        prev.filter((item) => item.id !== deleteItem.id),
      );
      toast.success("Removed from wishlist");
    } catch (error: any) {
      console.error("Failed to remove:", error);
      toast.error(error?.response?.data?.message || "Failed to remove item");
    } finally {
      setIsDeleting(false);
      setDeleteItem(null);
    }
  };

  // Clear all wishlist
  const handleClearAll = async () => {
    setIsClearing(true);
    try {
      await httpClient.delete("/wishlist/clear");
      setWishlistItems([]);
      toast.success("Wishlist cleared successfully");
      setShowClearDialog(false);
    } catch (error: any) {
      console.error("Failed to clear wishlist:", error);
      toast.error(error?.response?.data?.message || "Failed to clear wishlist");
    } finally {
      setIsClearing(false);
    }
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
    }).format(parseFloat(price));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#faf8f5] to-[#f5f0ea]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-[#e8d9cc] border-t-[#caa05c] animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Heart className="w-6 h-6 text-[#caa05c]" />
            </div>
          </div>
          <p className="text-sm text-[#ab8965] font-medium tracking-wide">
            Loading wishlist....
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#faf8f5] to-[#f5f0ea]">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-[#e8d9cc] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Heart className="w-8 h-8 text-[#caa05c]" />
                <h1 className="text-3xl font-bold bg-gradient-to-r from-[#2c1810] to-[#5c3d2e] bg-clip-text text-transparent">
                  My Wishlist
                </h1>
              </div>
              <p className="text-[#ab8965]">
                {wishlistItems.length}{" "}
                {wishlistItems.length === 1 ? "room" : "rooms"} saved for later
              </p>
            </div>

            {/* Clear All Button */}
            {wishlistItems.length > 0 && (
              <Button
                variant="outline"
                onClick={() => setShowClearDialog(true)}
                className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-all duration-300"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {wishlistItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto bg-[#f5f0ea] rounded-full flex items-center justify-center mb-4">
              <Heart className="w-10 h-10 text-[#ab8965]" />
            </div>
            <h2 className="text-xl font-semibold text-[#2c1810] mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-[#ab8965] mb-6">
              Save your favorite rooms to plan your perfect stay
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
          <>
            {/* Stats Bar */}
            <div className="mb-6 p-4 bg-white rounded-xl border border-[#e8d9cc] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-[#caa05c]" />
                <span className="text-sm text-[#2c1810]">
                  You have{" "}
                  <span className="font-semibold text-[#caa05c]">
                    {wishlistItems.length}
                  </span>{" "}
                  saved {wishlistItems.length === 1 ? "room" : "rooms"}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={fetchWishlist}
                className="text-[#ab8965] hover:text-[#caa05c]"
              >
                Refresh
              </Button>
            </div>

            {/* Wishlist List - Horizontal Layout */}
            <div className="space-y-4">
              {wishlistItems.map((item) => (
                <Card
                  key={item.id}
                  className="overflow-hidden border-[#e8d9cc] hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row">
                    {/* Room Image */}
                    <div className="relative w-full sm:w-64 h-48 sm:h-auto overflow-hidden">
                      <img
                        src={
                          item.room.images?.[0]?.imageUrl?.[0] ||
                          "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&auto=format"
                        }
                        alt={item.room.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <Badge className="absolute top-3 right-3 bg-white/90 text-[#caa05c] border-0">
                        <Star className="w-3 h-3 mr-1 fill-[#caa05c]" />
                        Popular
                      </Badge>
                      <button
                        onClick={() =>
                          setDeleteItem({
                            id: item.id,
                            name: item.room.name,
                          })
                        }
                        className="absolute top-3 left-3 p-2 bg-white/90 rounded-full hover:bg-red-50 transition-colors group/delete"
                      >
                        <Trash2 className="w-4 h-4 text-red-500 group-hover/delete:scale-110 transition-transform" />
                      </button>
                    </div>

                    {/* Room Details */}
                    <CardContent className="flex-1 p-6">
                      {/* Room Type Badge */}
                      {item.room.roomType?.name && (
                        <Badge
                          variant="secondary"
                          className="mb-2 bg-[#f5f0ea] text-[#8b6946]"
                        >
                          {item.room.roomType.name}
                        </Badge>
                      )}

                      {/* Room Name */}
                      <Link href={`/room/${item.room.id}`}>
                        <h3 className="text-xl font-semibold text-[#2c1810] mb-2 hover:text-[#caa05c] transition-colors">
                          {item.room.name}
                        </h3>
                      </Link>

                      {/* Room Details Row */}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-[#ab8965] mb-3">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{item.room.capacity || 2} Guests</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Bed className="w-4 h-4" />
                          <span>
                            {item.room.capacity === 1 ? "Single" : "Double"} Bed
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            Added{" "}
                            {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="border-t border-[#e8d9cc] my-4"></div>

                      {/* Price and Actions */}
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <p className="text-2xl font-bold text-[#caa05c]">
                            {formatPrice(item.room.price)}
                          </p>
                          <p className="text-xs text-[#ab8965]">per night</p>
                        </div>
                        <Button
                          onClick={() => router.push(`/room/${item.room.id}`)}
                          className="bg-gradient-to-r from-[#caa05c] to-[#b8894a] text-white hover:shadow-md"
                        >
                          View Details
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Delete Single Item Confirmation Dialog */}
      <AlertDialog
        open={!!deleteItem}
        onOpenChange={() => !isDeleting && setDeleteItem(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove from Wishlist</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove{" "}
              <span className="font-semibold text-foreground">
                {deleteItem?.name}
              </span>{" "}
              from your wishlist? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemove}
              disabled={isDeleting}
              className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-600"
            >
              {isDeleting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Removing...
                </>
              ) : (
                "Yes, Remove"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Clear All Confirmation Dialog */}
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear Entire Wishlist</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <span>
                Are you sure you want to remove all{" "}
                <span className="font-semibold text-foreground">
                  {wishlistItems.length}{" "}
                  {wishlistItems.length === 1 ? "room" : "rooms"}
                </span>{" "}
                from your wishlist?
              </span>
              <span className="text-sm text-red-600 font-medium block">
                This action cannot be undone.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isClearing}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClearAll}
              disabled={isClearing}
              className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-600"
            >
              {isClearing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Clearing...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Yes, Clear All
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
