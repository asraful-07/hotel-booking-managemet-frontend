import { getRooms } from "@/services/room.services";
import React from "react";
import RoomList from "../Room/RoomList";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

export default async function RoomsCard() {
  const rooms = await getRooms();

  const roomData = rooms?.data || rooms;

  // only 6 rooms
  const limitedRooms = roomData.slice(0, 6);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">OUR FAVORITE ROOMS</h1>

      {/* Room List */}
      <RoomList rooms={limitedRooms} />

      {/* See All Button */}
      <div className="flex justify-center mt-8">
        <Link
          href="/room"
          className="px-6 py-3 bg-[#caa05c] text-white rounded-full hover:bg-[#b8894a] transition duration-300 flex items-center gap-2"
        >
          See All Rooms
          <FaArrowRight />
        </Link>
      </div>
    </div>
  );
}
