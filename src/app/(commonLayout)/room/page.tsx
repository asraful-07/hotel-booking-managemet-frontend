import RoomList from "@/components/modules/Room/RoomList";
import { getRooms } from "@/services/room.services";

export const dynamic = "force-dynamic";

export default async function RoomPage() {
  const rooms = await getRooms();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Rooms</h1>
      <RoomList rooms={rooms?.data || rooms} />
    </div>
  );
}
