/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { httpClient } from "@/lib/axios/httpClient";
import { toast } from "sonner";

type Room = {
  id: string;
  name: string;
  price: string;
  images?: { imageUrl: string[] }[];
  capacity?: number;
  roomType?: { name: string };
};

type WishlistItem = {
  id: string;
  roomId: string;
  userId: string;
  createdAt: string;
  room: Room;
};

type WishlistContextType = {
  wishlistItems: WishlistItem[];
  isLoading: boolean;
  addToWishlist: (roomId: string) => Promise<void>;
  removeFromWishlist: (wishlistId: string) => Promise<void>;
  refreshWishlist: () => Promise<void>;
  isInWishlist: (roomId: string) => boolean;
};

const WishlistContext = createContext<WishlistContextType>({
  wishlistItems: [],
  isLoading: false,
  addToWishlist: async () => {},
  removeFromWishlist: async () => {},
  refreshWishlist: async () => {},
  isInWishlist: () => false,
});

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await httpClient.get<WishlistItem[]>("/wishlist");
      setWishlistItems(res?.data ?? []);
    } catch (error: any) {
      console.error("Failed to fetch wishlist:", error);
      // Don't show toast for auth errors
      if (error?.response?.status !== 401) {
        toast.error("Failed to load wishlist");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const addToWishlist = async (roomId: string) => {
    try {
      const res = await httpClient.post<WishlistItem>("/wishlist", { roomId });
      setWishlistItems((prev) => [res.data, ...prev]);
      toast.success("Added to wishlist!");
    } catch (error: any) {
      console.error("Failed to add to wishlist:", error);
      if (error?.response?.status === 401) {
        toast.error("Please login to add to wishlist");
      } else if (error?.response?.data?.message?.includes("already")) {
        toast.error("Room already in wishlist");
      } else {
        toast.error("Failed to add to wishlist");
      }
      throw error;
    }
  };

  const removeFromWishlist = async (wishlistId: string) => {
    try {
      await httpClient.delete(`/wishlist/${wishlistId}`);
      setWishlistItems((prev) => prev.filter((item) => item.id !== wishlistId));
      toast.success("Removed from wishlist!");
    } catch (error: any) {
      console.error("Failed to remove from wishlist:", error);
      toast.error("Failed to remove from wishlist");
      throw error;
    }
  };

  const isInWishlist = (roomId: string) => {
    return wishlistItems.some((item) => item.roomId === roomId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        isLoading,
        addToWishlist,
        removeFromWishlist,
        refreshWishlist: fetchWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
