/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { IRoom } from "@/types/room.types";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";
import { Heart, Users, Bed, Maximize, Coffee, Wifi, Bath } from "lucide-react";
import { toast } from "sonner";
import { useWishlist } from "@/context/WishlistContext";

interface RoomListProps {
  rooms: IRoom[];
  roomTypes?: string[];
}

const ITEMS_PER_PAGE = 6;

export default function RoomList({ rooms, roomTypes = [] }: RoomListProps) {
  const { wishlistItems, addToWishlist, removeFromWishlist } = useWishlist();
  const [addingToWishlist, setAddingToWishlist] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter states
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [capacity, setCapacity] = useState("All");
  const [maxPrice, setMaxPrice] = useState(10000);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [sortBy, setSortBy] = useState("default");

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

  // Filter and sort rooms
  const filteredRooms = useMemo(() => {
    let result = [...rooms];

    // Search filter
    if (search) {
      result = result.filter(
        (room) =>
          room.name.toLowerCase().includes(search.toLowerCase()) ||
          room.description?.toLowerCase().includes(search.toLowerCase()),
      );
    }

    // Room type filter
    if (selectedType !== "All") {
      result = result.filter((room) => room.roomType?.name === selectedType);
    }

    // Capacity filter
    if (capacity !== "All") {
      result = result.filter((room) => room.capacity >= parseInt(capacity));
    }

    // Price filter
    result = result.filter((room: any) => parseInt(room.price) <= maxPrice);

    // Availability filter
    if (availableOnly) {
      result = result.filter((room) => room.isAvailable === true);
    }

    // Sorting
    switch (sortBy) {
      case "low":
        result.sort((a: any, b: any) => parseInt(a.price) - parseInt(b.price));
        break;
      case "high":
        result.sort((a: any, b: any) => parseInt(b.price) - parseInt(a.price));
        break;
      case "az":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "za":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        break;
      default:
        break;
    }

    return result;
  }, [rooms, search, selectedType, capacity, maxPrice, availableOnly, sortBy]);

  // Pagination logic
  const totalItems = filteredRooms.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const currentRooms = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRooms.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredRooms, currentPage]);

  const startItem =
    totalItems === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, totalItems);

  // Reset page when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [search, selectedType, capacity, maxPrice, availableOnly, sortBy]);

  // Get unique room types for filter
  const uniqueRoomTypes = useMemo(() => {
    const types = new Set(
      rooms.map((room) => room.roomType?.name).filter(Boolean),
    );
    return ["All", ...Array.from(types)] as string[];
  }, [rooms]);

  if (!rooms || rooms.length === 0) {
    return (
      <div className="container mx-auto text-center py-20">
        <p className="text-[#ab8965]">No rooms available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 max-w-7xl mx-auto pb-20">
      {/* Sidebar - Filters with Scroll */}
      <aside className="lg:sticky lg:top-24 h-fit">
        <div className="bg-white border rounded-2xl p-6 shadow-sm max-h-[calc(100vh-120px)] overflow-y-auto scrollbar-thin scrollbar-thumb-[#ab8965] scrollbar-track-gray-100">
          <h2 className="text-xl font-semibold mb-6">Filter Rooms</h2>

          {/* Search */}
          <div className="mb-6">
            <label className="text-sm font-medium mb-2 block">Search</label>
            <input
              type="text"
              placeholder="Search room..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border px-4 py-2 outline-none focus:border-[#ab8965]"
            />
          </div>

          {/* Room Type */}
          <div className="mb-6">
            <label className="text-sm font-medium mb-2 block">Room Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full rounded-lg border px-4 py-2 outline-none focus:border-[#ab8965]"
            >
              {uniqueRoomTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Capacity */}
          <div className="mb-6">
            <label className="text-sm font-medium mb-2 block">Guests</label>
            <select
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className="w-full rounded-lg border px-4 py-2 outline-none focus:border-[#ab8965]"
            >
              <option value="All">All</option>
              <option value="2">2 Guests</option>
              <option value="4">4 Guests</option>
              <option value="6">6 Guests</option>
            </select>
          </div>

          {/* Price */}
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium">Max Price</label>
              <span className="text-[#ab8965] font-semibold">${maxPrice}</span>
            </div>
            <input
              type="range"
              min={1000}
              max={10000}
              step={500}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#ab8965]"
            />
          </div>

          {/* Available */}
          <div className="mb-8 flex items-center gap-3">
            <input
              id="available"
              type="checkbox"
              checked={availableOnly}
              onChange={(e) => setAvailableOnly(e.target.checked)}
              className="w-5 h-5 accent-[#ab8965]"
            />
            <label htmlFor="available" className="cursor-pointer">
              Available Only
            </label>
          </div>

          {/* Reset */}
          <button
            onClick={() => {
              setSearch("");
              setSelectedType("All");
              setAvailableOnly(false);
              setCapacity("All");
              setMaxPrice(10000);
              setSortBy("default");
            }}
            className="w-full rounded-lg bg-[#ab8965] hover:bg-[#8c6d4b] text-white py-3 transition"
          >
            Reset Filters
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div>
        {/* Top Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-5 mb-8">
          <div>
            <h2 className="text-2xl font-bold">Rooms</h2>
            <p className="text-gray-500 mt-1">
              Showing {startItem} - {endItem} of {totalItems} Rooms
            </p>
          </div>

          {/* Sort */}
          <div className="w-full md:w-60">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-[#ab8965]"
            >
              <option value="default">Default</option>
              <option value="low">Price Low → High</option>
              <option value="high">Price High → Low</option>
              <option value="az">Name A-Z</option>
              <option value="za">Name Z-A</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>

        {/* Room Grid */}
        {currentRooms.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-2xl">
            <p className="text-gray-500">No rooms match your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {currentRooms.map((room) => {
              const images = room.images?.[0]?.imageUrl || [];
              const inWishlist = isInWishlist(room.id);
              const isAdding = addingToWishlist === room.id;

              const amenities = [
                { icon: Wifi, label: "Free WiFi" },
                { icon: Coffee, label: "Coffee Maker" },
                { icon: Bath, label: "Private Bath" },
                { icon: Maximize, label: "Spacious" },
              ];

              return (
                <Card
                  key={room.id}
                  className="rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-shadow duration-300"
                >
                  <Link href={`/room/${room.id}`}>
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        {/* Left - Image Section */}
                        <div className="relative w-full md:w-2/5 h-64 md:h-auto min-h-[300px]">
                          <div className="relative w-full h-full">
                            <Image
                              src={images[0] || "/placeholder.jpg"}
                              alt={room.name}
                              fill
                              className="object-cover transition-opacity duration-500 group-hover:opacity-0"
                            />
                            {images[1] && (
                              <Image
                                src={images[1]}
                                alt={room.name}
                                fill
                                className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                              />
                            )}
                          </div>

                          <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                            {room.roomType?.name || "Standard"}
                          </div>

                          <div className="absolute bottom-4 left-4">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${
                                room.isAvailable
                                  ? "bg-green-500/90 text-white"
                                  : "bg-red-500/90 text-white"
                              }`}
                            >
                              {room.isAvailable ? "Available" : "Booked"}
                            </span>
                          </div>
                        </div>

                        {/* Right - Content Section */}
                        <div className="flex-1 p-6 md:p-8 bg-white">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h2 className="text-2xl font-bold text-gray-900 hover:text-[#ab8965] transition-colors">
                                {room.name}
                              </h2>
                              <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                {room.description}
                              </p>
                            </div>

                            <button
                              onClick={(e) => handleWishlistClick(e, room.id)}
                              disabled={isAdding}
                              className="flex-shrink-0 ml-4 p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
                            >
                              <Heart
                                className={`w-6 h-6 transition-all duration-300 ${
                                  inWishlist
                                    ? "fill-red-500 text-red-500"
                                    : "text-gray-400 hover:text-red-500"
                                } ${isAdding ? "animate-pulse" : ""}`}
                              />
                            </button>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                            <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                              <Users className="w-4 h-4 text-[#ab8965]" />
                              <span className="text-sm text-gray-700">
                                {room.capacity} Guests
                              </span>
                            </div>
                            <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                              <Bed className="w-4 h-4 text-[#ab8965]" />
                              <span className="text-sm text-gray-700">
                                {room.roomType?.name || "Standard"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                              <Maximize className="w-4 h-4 text-[#ab8965]" />
                              <span className="text-sm text-gray-700">
                                {room.maxExtraBed > 0
                                  ? `${room.maxExtraBed} Extra Bed`
                                  : "No Extra Bed"}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-3 mb-4">
                            {amenities.map((amenity, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-1 text-sm text-gray-600"
                              >
                                <amenity.icon className="w-4 h-4 text-[#ab8965]" />
                                <span>{amenity.label}</span>
                              </div>
                            ))}
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <div>
                              <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-bold text-[#ab8965]">
                                  ${room.price}
                                </span>
                                <span className="text-sm text-gray-500">
                                  / night
                                </span>
                              </div>
                              {room.extraBedPrice && room.maxExtraBed > 0 && (
                                <p className="text-xs text-gray-500">
                                  Extra bed: ${room.extraBedPrice}/night
                                </p>
                              )}
                            </div>

                            <button className="bg-[#ab8965] hover:bg-[#8a6b4a] text-white px-6 py-2.5 rounded-lg font-medium transition-colors duration-200">
                              Book Now
                            </button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalItems > 0 && (
          <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-5">
            <p className="text-gray-600">
              Showing {startItem} - {endItem} of {totalItems} rooms
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => prev - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-gray-100 transition-colors"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`w-10 h-10 rounded-md border transition ${
                    currentPage === index + 1
                      ? "bg-[#ab8965] text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-gray-100 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
