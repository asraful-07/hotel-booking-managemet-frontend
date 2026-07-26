/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { IRoom } from "@/types/room.types";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { useWishlist } from "@/context/WishlistContext";

interface RoomListProps {
  rooms: IRoom[];
}

export default function HomeRoom({ rooms }: RoomListProps) {
  const { wishlistItems, addToWishlist, removeFromWishlist } = useWishlist();
  const [addingToWishlist, setAddingToWishlist] = useState<string | null>(null);

  const isInWishlist = (roomId: string) => {
    return wishlistItems.some((item) => item.roomId === roomId);
  };

  const handleWishlistClick = async (e: React.MouseEvent, roomId: string) => {
    e.preventDefault();
    e.stopPropagation();

    setAddingToWishlist(roomId);

    try {
      if (isInWishlist(roomId)) {
        const wishlistItem = wishlistItems.find(
          (item) => item.roomId === roomId,
        );
        if (wishlistItem) {
          await removeFromWishlist(wishlistItem.id);
          toast.success("Removed from wishlist");
        }
      } else {
        await addToWishlist(roomId);
        toast.success("Added to wishlist");
      }
    } catch (error: any) {
      if (error?.response?.status === 401) {
        toast.error("Please login to add to wishlist");
      } else {
        toast.error(error?.response?.data?.message || "Something went wrong");
      }
    } finally {
      setAddingToWishlist(null);
    }
  };

  if (!rooms || rooms.length === 0) {
    return (
      <div className="container mx-auto text-center py-20">
        <p className="text-[#ab8965]">No rooms available</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {rooms.map((room) => {
        const images = room.images?.[0]?.imageUrl || [];
        const inWishlist = isInWishlist(room.id);
        const isAdding = addingToWishlist === room.id;

        return (
          <Card
            key={room.id}
            className="rounded-2xl shadow-md overflow-hidden group relative"
          >
            <Link href={`/room/${room.id}`}>
              <CardContent className="">
                {/* Image Container with Heart Overlay */}
                <div className="relative w-full h-56 rounded-xl overflow-hidden group/image">
                  {/* Default Image */}
                  <Image
                    src={images[0] || "/placeholder.jpg"}
                    alt={room.name}
                    fill
                    className="object-cover transition-opacity duration-500 group-hover/image:opacity-0"
                  />

                  {/* Hover Image */}
                  {images[1] && (
                    <Image
                      src={images[1]}
                      alt={room.name}
                      fill
                      className="object-cover opacity-0 transition-opacity duration-500 group-hover/image:opacity-100"
                    />
                  )}

                  {/* Heart Icon Button - Positioned Absolutely on Image */}
                  <button
                    onClick={(e) => handleWishlistClick(e, room.id)}
                    disabled={isAdding}
                    className="absolute top-3 right-3 p-2.5 rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:bg-white transition-all duration-300 disabled:opacity-50 z-10"
                  >
                    <Heart
                      className={`w-5 h-5 transition-all duration-300 ${
                        inWishlist
                          ? "fill-red-500 text-red-500"
                          : "text-gray-600 hover:text-red-500"
                      } ${isAdding ? "animate-pulse" : ""}`}
                    />
                  </button>
                </div>
              </CardContent>
            </Link>
          </Card>
        );
      })}
    </div>
  );
}
