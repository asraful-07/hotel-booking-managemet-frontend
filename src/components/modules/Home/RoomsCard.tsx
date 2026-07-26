import { getRooms } from "@/services/room.services";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import HomeRoom from "./HomeRoom";

export default async function RoomsCard() {
  const rooms = await getRooms();

  const roomData = rooms?.data || rooms;

  // only 6 rooms
  const limitedRooms = roomData.slice(0, 6);

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="mx-auto mb-12 max-w-4xl px-6 text-center sm:mb-16">
        <span
          className="inline-flex items-center rounded-full px-4 py-1.5 text-xs font-medium tracking-wider uppercase"
          style={{
            backgroundColor: "var(--secondBackground)",
            color: "var(--secondary)",
          }}
        >
          Our Rooms
        </span>

        <h1 className="mt-5 text-2xl font-bold tracking-tight text-foreground sm:text-xl lg:text-3xl">
          Find Your <span className="text-[#caa05c]">Perfect Stay</span>
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
          Comfortable, elegant, and carefully selected rooms for every guest.
        </p>
      </div>

      {/* Room Grid */}
      <HomeRoom rooms={limitedRooms} />

      {/* See All Button */}
      <div className="flex justify-center mt-12">
        <Link
          href="/room"
          className="group px-8 py-3.5 bg-[#caa05c] text-white rounded-full hover:bg-[#b8894a] transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105"
        >
          <span>View All Rooms</span>
          <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
        </Link>
      </div>
    </div>
  );
}
