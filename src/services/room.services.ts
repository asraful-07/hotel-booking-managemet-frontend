"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ICreateRoomPayload, IRoom } from "@/types/room.types";

export const getRooms = async () => {
  try {
    const rooms = await httpClient.get<IRoom[]>("/room");
    return rooms;
  } catch (error) {
    console.log("Error fetching rooms:", error);
    throw error;
  }
};

export const createRoom = async (data: ICreateRoomPayload) => {
  try {
    const response = await httpClient.post("/room", data);

    return response.data;
  } catch (error) {
    console.error("Error creating room:", error);
    throw error;
  }
};
export const getRoomById = async (id: string) => {
  try {
    const room = await httpClient.get<IRoom>(`/room/${id}`);
    return room;
  } catch (error) {
    console.log("Error fetching room by id:", error);
    throw error;
  }
};

// export const getRooms = async (params?: {
//   searchTerm?: string;
//   roomTypeId?: string;
//   minPrice?: number;
//   maxPrice?: number;
//   capacity?: number;
// }) => {
//   try {
//     const query = new URLSearchParams();

//     if (params?.searchTerm) query.append("search", params.searchTerm);
//     if (params?.roomTypeId) query.append("roomTypeId", params.roomTypeId);
//     if (params?.minPrice)
//       query.append("minPrice", params.minPrice.toString());
//     if (params?.maxPrice)
//       query.append("maxPrice", params.maxPrice.toString());
//     if (params?.capacity)
//       query.append("capacity", params.capacity.toString());

//     const queryString = query.toString();

//     const rooms = await httpClient.get<IRoom[]>(
//       queryString ? `/room?${queryString}` : "/room"
//     );

//     return rooms;
//   } catch (error) {
//     console.log("Error fetching rooms:", error);
//     throw error;
//   }
// };
