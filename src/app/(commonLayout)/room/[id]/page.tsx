"use client";

import { useParams } from "next/navigation";
import RoomDetails from "@/components/modules/Room/RoomDetails";

export const dynamic = "force-dynamic";

const RoomDetailsPage = () => {
  const params = useParams();
  const id = params?.id as string;

  return <RoomDetails roomId={id} />;
};

export default RoomDetailsPage;
