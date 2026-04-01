"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { httpClient } from "@/lib/axios/httpClient";
import {
  IRoom,
  ICreateRoomPayload,
  IUpdateRoomPayload,
} from "@/types/room.types";
import { RoomTable } from "@/components/modules/Manager/Rooms/RoomTable";
import { RoomViewModal } from "@/components/modules/Manager/Rooms/RoomViewModal";
import { RoomFormModal } from "@/components/modules/Manager/Rooms/RoomFormModal";
import { RoomDeleteDialog } from "@/components/modules/Manager/Rooms/RoomDeleteDialog";

export default function RoomManagement() {
  const [rooms, setRooms] = useState<IRoom[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewRoom, setViewRoom] = useState<IRoom | null>(null);
  const [editRoom, setEditRoom] = useState<IRoom | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<IRoom | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const fetchRooms = useCallback(async () => {
    setLoading(true);
    try {
      const res = await httpClient.get("/room");
      const data = res.data;
      setRooms(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to fetch rooms");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const handleFormSubmit = async (payload: ICreateRoomPayload) => {
    try {
      if (editRoom) {
        await httpClient.put(
          `/room/${editRoom.id}`,
          payload as IUpdateRoomPayload,
        );
        toast.success("Room updated successfully");
        setEditRoom(null);
      } else {
        await httpClient.post("/room", payload);
        toast.success("Room created successfully");
        setCreateOpen(false);
      }
      fetchRooms();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await httpClient.delete(`/room/${deleteTarget.id}`);
      toast.success("Room deleted successfully");
      setDeleteTarget(null);
      fetchRooms();
    } catch {
      toast.error("Failed to delete room");
    }
  };

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Room Management</h1>
          <p className="text-sm text-muted-foreground">
            {rooms.length} rooms total
          </p>
        </div>

        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Room
        </Button>
      </div>

      {/* Table */}
      <RoomTable
        rooms={rooms}
        loading={loading}
        onView={(r) => setViewRoom(r)}
        onEdit={(r) => setEditRoom(r)}
        onDelete={(r) => setDeleteTarget(r)}
      />

      {/* View Sheet */}
      <RoomViewModal
        open={!!viewRoom}
        onOpenChange={(o) => !o && setViewRoom(null)}
        room={viewRoom}
      />

      {/* Create Sheet */}
      <RoomFormModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleFormSubmit}
      />

      {/* Edit Sheet */}
      <RoomFormModal
        open={!!editRoom}
        onOpenChange={(o) => !o && setEditRoom(null)}
        room={editRoom}
        onSubmit={handleFormSubmit}
      />

      {/* Delete Confirm Dialog */}
      <RoomDeleteDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        roomName={deleteTarget?.name}
      />
    </div>
  );
}
