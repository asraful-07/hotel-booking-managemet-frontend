/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useCallback, useEffect } from "react";
import { httpClient } from "@/lib/axios/httpClient";
import {
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Search,
  Plus,
  Edit2,
  Trash2,
  Layers,
  Calendar,
  Hotel,
  Building,
  Star,
  Users,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface RoomType {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateRoomTypePayload {
  name: string;
}

interface UpdateRoomTypePayload {
  name: string;
}

export default function RoomTypeManagement() {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Create dialog state
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newRoomTypeName, setNewRoomTypeName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // Edit dialog state
  const [editRoomType, setEditRoomType] = useState<RoomType | null>(null);
  const [editName, setEditName] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  // Delete dialog state
  const [deleteRoomType, setDeleteRoomType] = useState<RoomType | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchRoomTypes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await httpClient.get<RoomType[]>("/room-type");
      console.log(res);
      setRoomTypes(res?.data ?? []);
    } catch (e: any) {
      console.log(e);
      setError(e?.response?.data?.message ?? "Failed to load room types");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoomTypes();
  }, [fetchRoomTypes]);

  const openCreateDialog = () => {
    setNewRoomTypeName("");
    setCreateError(null);
    setIsCreateDialogOpen(true);
  };

  const closeCreateDialog = () => {
    if (isCreating) return;
    setIsCreateDialogOpen(false);
    setNewRoomTypeName("");
    setCreateError(null);
  };

  const handleCreateRoomType = async () => {
    if (!newRoomTypeName.trim()) {
      setCreateError("Room type name is required");
      return;
    }

    setIsCreating(true);
    setCreateError(null);

    const payload: CreateRoomTypePayload = { name: newRoomTypeName.trim() };

    try {
      const res = await httpClient.post<RoomType>("/room-type", payload);
      setRoomTypes((prev) => [res.data, ...prev]);
      setSuccess("Room type created successfully!");
      setTimeout(() => setSuccess(null), 3000);
      closeCreateDialog();
    } catch (e: any) {
      console.error("Create error:", e);
      setCreateError(
        e?.response?.data?.message ?? "Failed to create room type",
      );
    } finally {
      setIsCreating(false);
    }
  };

  const openEditDialog = (roomType: RoomType) => {
    setEditRoomType(roomType);
    setEditName(roomType.name);
    setUpdateError(null);
  };

  const closeEditDialog = () => {
    if (isUpdating) return;
    setEditRoomType(null);
    setEditName("");
    setUpdateError(null);
  };

  const handleUpdateRoomType = async () => {
    if (!editRoomType) return;
    if (!editName.trim()) {
      setUpdateError("Room type name is required");
      return;
    }

    setIsUpdating(true);
    setUpdateError(null);

    const payload: UpdateRoomTypePayload = { name: editName.trim() };

    try {
      const res = await httpClient.patch<RoomType>(
        `/room-type/${editRoomType.id}`,
        payload,
      );

      setRoomTypes((prev) =>
        prev.map((rt) =>
          rt.id === editRoomType.id
            ? {
                ...rt,
                name: editName.trim(),
                updatedAt: new Date().toISOString(),
              }
            : rt,
        ),
      );

      setSuccess("Room type updated successfully!");
      setTimeout(() => setSuccess(null), 3000);
      closeEditDialog();
    } catch (e: any) {
      console.error("Update error:", e);
      setUpdateError(
        e?.response?.data?.message ?? "Failed to update room type",
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const openDeleteDialog = (roomType: RoomType) => {
    setDeleteRoomType(roomType);
  };

  const closeDeleteDialog = () => {
    if (isDeleting) return;
    setDeleteRoomType(null);
  };

  const handleDeleteRoomType = async () => {
    if (!deleteRoomType) return;

    setIsDeleting(true);

    try {
      await httpClient.delete(`/room-type/${deleteRoomType.id}`);

      setRoomTypes((prev) => prev.filter((rt) => rt.id !== deleteRoomType.id));
      setSuccess("Room type deleted successfully!");
      setTimeout(() => setSuccess(null), 3000);
      closeDeleteDialog();
    } catch (e: any) {
      console.error("Delete error:", e);
      setError(e?.response?.data?.message ?? "Failed to delete room type");
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsDeleting(false);
    }
  };

  const getRoomTypeIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("suite")) return <Hotel className="w-4 h-4" />;
    if (lowerName.includes("deluxe")) return <Star className="w-4 h-4" />;
    if (lowerName.includes("family")) return <Users className="w-4 h-4" />;
    return <Building className="w-4 h-4" />;
  };

  const filteredRoomTypes = roomTypes.filter((rt) =>
    rt.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#faf8f5] to-[#f5f0ea]">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-6">
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-5 w-96" />
          </div>
          <div className="flex gap-4 mb-6">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="bg-white rounded-xl border">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 border-b">
                <Skeleton className="h-12 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#faf8f5] to-[#f5f0ea]">
      {/* Success Toast */}
      {success && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3 shadow-lg">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <p className="text-emerald-700 font-medium">{success}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-[#e8d9cc]">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#2c1810] to-[#5c3d2e] bg-clip-text text-transparent">
                Room Type Management
              </h1>
              <p className="text-[#ab8965] mt-1 text-sm">
                Manage and organize room categories
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={fetchRoomTypes}
              className="text-[#8b6946] hover:text-[#caa05c]"
            >
              <RefreshCw className="w-5 h-5" />
            </Button>
          </div>

          {/* Search and Add Button */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#ab8965]" />
              <Input
                type="text"
                placeholder="Search room types..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-[#faf8f5] border-[#e8d9cc] focus-visible:ring-[#caa05c]"
              />
            </div>
            <Button
              onClick={openCreateDialog}
              className="bg-gradient-to-r from-[#caa05c] to-[#b8894a] text-white hover:shadow-md transition-all"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Room Type
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchRoomTypes}
              className="text-red-600 hover:text-red-700 hover:bg-red-100"
            >
              Retry
            </Button>
          </div>
        )}

        {!error && filteredRoomTypes.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto bg-[#f5f0ea] rounded-full flex items-center justify-center mb-4">
              <Layers className="w-10 h-10 text-[#ab8965]" />
            </div>
            <p className="text-[#ab8965] text-lg">No room types found</p>
            <p className="text-[#ab8965]/60 text-sm mt-1">
              {searchTerm
                ? "Try adjusting your search"
                : "Click 'Add Room Type' to create one"}
            </p>
          </div>
        )}

        {!error && filteredRoomTypes.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-[#e8d9cc] overflow-hidden">
            <Table>
              <TableHeader className="bg-[#faf8f5]">
                <TableRow className="hover:bg-transparent border-b border-[#e8d9cc]">
                  <TableHead className="text-[#2c1810] font-semibold">
                    Room Type
                  </TableHead>
                  <TableHead className="text-[#2c1810] font-semibold">
                    ID
                  </TableHead>
                  <TableHead className="text-[#2c1810] font-semibold">
                    Created At
                  </TableHead>
                  <TableHead className="text-[#2c1810] font-semibold">
                    Last Updated
                  </TableHead>
                  <TableHead className="text-right text-[#2c1810] font-semibold">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRoomTypes.map((roomType) => (
                  <TableRow
                    key={roomType.id}
                    className="hover:bg-[#faf8f5]/50 transition-colors"
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-[#caa05c]/10 to-[#b8894a]/10 rounded-lg">
                          {getRoomTypeIcon(roomType.name)}
                        </div>
                        <span className="text-[#2c1810]">{roomType.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="font-mono text-xs bg-[#faf8f5]"
                      >
                        {roomType.id.slice(0, 8)}...
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-[#8b6946]">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(roomType.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-[#8b6946]">
                        <RefreshCw className="w-3.5 h-3.5" />
                        {formatDate(roomType.updatedAt)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(roomType)}
                          className="text-[#8b6946] hover:text-[#caa05c] hover:bg-[#f5f0ea]"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDeleteDialog(roomType)}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="px-6 py-4 border-t border-[#e8d9cc] bg-[#faf8f5]">
              <p className="text-sm text-[#ab8965]">
                Showing {filteredRoomTypes.length} of {roomTypes.length} room
                types
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#2c1810]">
              Add Room Type
            </DialogTitle>
            <DialogDescription>
              Create a new room category to organize your rooms.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[#2c1810]">
                Room Type Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={newRoomTypeName}
                onChange={(e) => setNewRoomTypeName(e.target.value)}
                placeholder="e.g., Deluxe, Suite, Standard"
                className="bg-[#faf8f5] border-[#e8d9cc] focus-visible:ring-[#caa05c]"
                autoFocus
              />
              <p className="text-xs text-[#ab8965]">
                This name will be used to categorize rooms
              </p>
            </div>
            {createError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{createError}</span>
              </div>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={closeCreateDialog}
              disabled={isCreating}
              className="border-[#e8d9cc] text-[#8b6946] hover:bg-[#f5f0ea]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateRoomType}
              disabled={isCreating}
              className="bg-gradient-to-r from-[#caa05c] to-[#b8894a] text-white hover:shadow-md"
            >
              {isCreating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                "Create Room Type"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editRoomType} onOpenChange={() => closeEditDialog()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#2c1810]">
              Edit Room Type
            </DialogTitle>
            <DialogDescription>
              Update the room category name.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name" className="text-[#2c1810]">
                Room Type Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="e.g., Deluxe, Suite, Standard"
                className="bg-[#faf8f5] border-[#e8d9cc] focus-visible:ring-[#caa05c]"
                autoFocus
              />
            </div>
            {updateError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{updateError}</span>
              </div>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={closeEditDialog}
              disabled={isUpdating}
              className="border-[#e8d9cc] text-[#8b6946] hover:bg-[#f5f0ea]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateRoomType}
              disabled={isUpdating}
              className="bg-gradient-to-r from-[#caa05c] to-[#b8894a] text-white hover:shadow-md"
            >
              {isUpdating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Updating...
                </>
              ) : (
                "Update Room Type"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Alert Dialog */}
      <AlertDialog
        open={!!deleteRoomType}
        onOpenChange={() => closeDeleteDialog()}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Room Type</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                {deleteRoomType?.name}
              </span>
              ? This action cannot be undone. All rooms associated with this
              type may be affected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isDeleting}
              className="border-[#e8d9cc] text-[#8b6946] hover:bg-[#f5f0ea]"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteRoomType}
              disabled={isDeleting}
              className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-600"
            >
              {isDeleting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                "Yes, Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
