/* eslint-disable @next/next/no-img-element */
import { Eye, Home, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IRoom } from "@/types/room.types";

interface RoomTableProps {
  rooms: IRoom[];
  loading: boolean;
  onView: (room: IRoom) => void;
  onEdit: (room: IRoom) => void;
  onDelete: (room: IRoom) => void;
}

export function RoomTable({
  rooms,
  loading,
  onView,
  onEdit,
  onDelete,
}: RoomTableProps) {
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#faf8f5] to-[#f5f0ea]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-[#e8d9cc] border-t-[#caa05c] animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Home className="w-6 h-6 text-[#caa05c]" />
            </div>
          </div>
          <p className="text-sm text-[#ab8965] font-medium tracking-wide">
            Loading rooms...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Room</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Capacity</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rooms.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center text-muted-foreground py-10"
              >
                No rooms found.
              </TableCell>
            </TableRow>
          ) : (
            rooms.map((room) => {
              const thumb = room.images?.[0]?.imageUrl?.[0];
              return (
                <TableRow key={room.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {thumb && (
                        <img
                          src={thumb}
                          alt={room.name}
                          className="w-10 h-10 rounded-md object-cover shrink-0"
                        />
                      )}
                      <div>
                        <p className="font-medium">{room.name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1 max-w-[180px]">
                          {room.description}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{room.roomType?.name ?? "—"}</TableCell>
                  <TableCell>৳{room.price}</TableCell>
                  <TableCell>{room.capacity}</TableCell>
                  <TableCell>
                    <Badge variant={room.isAvailable ? "default" : "secondary"}>
                      {room.isAvailable ? "Available" : "Unavailable"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onView(room)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onEdit(room)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                        onClick={() => onDelete(room)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
