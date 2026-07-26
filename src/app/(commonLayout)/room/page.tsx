import RoomList from "@/components/modules/Room/RoomList";
import { getRooms } from "@/services/room.services";
import { Home } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function RoomPage() {
  const rooms = await getRooms();

  return (
    <div className="">
      {/* Hero Section with Image */}
      <section className="relative w-full h-[350px] md:h-[420px] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 h-[280px] md:h-[380px]">
          <Image
            src="https://plus.unsplash.com/premium_photo-1661929519129-7a76946c1d38?w=1200&auto=format&fit=crop&q=80"
            alt="Contact Us Hotel Background"
            fill
            className="object-cover"
            priority
          />

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        {/* Content */}
        <div
          className="
      relative 
      z-10 
      h-[280px] 
      md:h-[320px]
      flex 
      flex-col 
      items-center 
      justify-center 
      text-center 
      text-white 
      px-4
    "
        >
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-5">
            <Link
              href="/"
              className="
          hover:text-[#caa05c]
          transition
          flex
          items-center
          gap-1
        "
            >
              <Home size={16} />
              Home
            </Link>

            <span className="text-white/50">/</span>

            <span className="text-[#caa05c]">RoomList</span>
          </div>

          {/* Heading */}
          <h1
            className="
        text-4xl 
        md:text-5xl 
        lg:text-6xl 
        font-bold 
        mb-4
      "
          >
            Room List
          </h1>

          {/* Description */}
          <p
            className="
        text-base
        md:text-lg
        text-white/90
        max-w-2xl
        leading-relaxed
      "
          >
            Discover comfortable and elegant rooms designed to make your stay
            relaxing and memorable. Choose from our wide range of rooms with
            modern amenities, premium services, and a perfect atmosphere for
            your next stay.
          </p>
        </div>
      </section>
      <RoomList rooms={rooms?.data || rooms} />
    </div>
  );
}
