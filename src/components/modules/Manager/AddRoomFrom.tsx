"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { X, Plus, Loader2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { createRoom } from "@/services/room.services";
import { IRoomType } from "@/types/room.types";
import { httpClient } from "@/lib/axios/httpClient";

// ── Types ─────────────────────────────────────────────
type CreateRoomFormValues = {
  name: string;
  description?: string;
  price: number;
  capacity: number;
  roomTypeId: string;
  isAvailable: boolean;
  images: string[];
  extraBedPrice?: number;
  maxExtraBed?: number;
};

// ── API ───────────────────────────────────────────────
const getRoomTypes = async (): Promise<IRoomType[]> => {
  try {
    const res = await httpClient.get("/room-type");

    // ✅ SAFE extraction (handles multiple API shapes)
    const data = res.data;

    if (Array.isArray(data)) return data;

    // if (data?.data && Array.isArray(data.data)) return data.data;

    return [];
  } catch (error) {
    console.error("getRoomTypes error:", error);
    return [];
  }
};

// ── Component ────────────────────────────────────────
export default function AddRoomFrom() {
  const [imageInput, setImageInput] = useState("");
  const [imageError, setImageError] = useState<string | null>(null);

  const [roomTypes, setRoomTypes] = useState<IRoomType[]>([]);
  const [roomTypesLoading, setRoomTypesLoading] = useState(true);
  const [roomTypesError, setRoomTypesError] = useState<string | null>(null);

  // ── Fetch room types ───────────────────────────────
  useEffect(() => {
    getRoomTypes()
      .then((data) => {
        setRoomTypes(data || []);
      })
      .catch(() => {
        setRoomTypesError("Could not load room types");
      })
      .finally(() => {
        setRoomTypesLoading(false);
      });
  }, []);

  // ── Form ───────────────────────────────────────────
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateRoomFormValues>({
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      capacity: 1,
      roomTypeId: "",
      isAvailable: true,
      images: [],
      extraBedPrice: 0,
      maxExtraBed: 0,
    },
  });

  const images = watch("images") || [];
  const isAvailable = watch("isAvailable");
  const roomTypeId = watch("roomTypeId");

  // ── Submit ────────────────────────────────────────
  const onSubmit = async (values: CreateRoomFormValues) => {
    try {
      await createRoom(values);

      toast.success("Room created successfully!");

      reset();
      setImageInput("");
      setImageError(null);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  // ── Image handlers ────────────────────────────────
  const handleAddImage = () => {
    const url = imageInput.trim();
    if (!url) return;

    try {
      new URL(url);
    } catch {
      setImageError("Invalid URL");
      return;
    }

    if (images.includes(url)) {
      setImageError("Already added");
      return;
    }

    setValue("images", [...images, url]);
    setImageInput("");
    setImageError(null);
  };

  const handleRemoveImage = (index: number) => {
    setValue(
      "images",
      images.filter((_, i) => i !== index),
    );
  };

  // ── UI ────────────────────────────────────────────
  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Add New Room</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name */}
            <div>
              <Label>Room Name</Label>
              <Input {...register("name")} />
            </div>

            {/* Description */}
            <div>
              <Label>Description</Label>
              <Textarea {...register("description")} />
            </div>

            {/* Room Type */}
            <div>
              <Label>Room Type</Label>

              {roomTypesError ? (
                <p className="text-red-500">{roomTypesError}</p>
              ) : (
                <Select
                  value={roomTypeId}
                  onValueChange={(v) => setValue("roomTypeId", v)}
                  disabled={roomTypesLoading}
                >
                  <SelectTrigger>
                    {roomTypesLoading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading...
                      </span>
                    ) : (
                      <SelectValue placeholder="Select room type" />
                    )}
                  </SelectTrigger>

                  <SelectContent>
                    {roomTypes.length === 0 ? (
                      <div className="p-2 text-sm text-muted-foreground">
                        No room types found
                      </div>
                    ) : (
                      roomTypes.map((rt) => (
                        <SelectItem key={rt.id} value={rt.id}>
                          {rt.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Price */}
            <div>
              <Label>Price</Label>
              <Input type="number" {...register("price")} />
            </div>

            {/* Capacity */}
            <div>
              <Label>Capacity</Label>
              <Input type="number" {...register("capacity")} />
            </div>

            {/* Availability */}
            <div className="flex items-center gap-2">
              <Switch
                checked={isAvailable}
                onCheckedChange={(v) => setValue("isAvailable", v)}
              />
              <Label>Available</Label>
            </div>

            {/* Images */}
            <div>
              <Label>Images</Label>

              <div className="flex gap-2">
                <Input
                  value={imageInput}
                  onChange={(e) => setImageInput(e.target.value)}
                />
                <Button type="button" onClick={handleAddImage}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {imageError && <p className="text-red-500">{imageError}</p>}

              <div className="grid grid-cols-3 gap-2 mt-3">
                {images.map((img, i) => (
                  <div key={i} className="relative">
                    <Image
                      src={img}
                      alt="room"
                      width={100}
                      height={100}
                      className="rounded"
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      className="absolute top-0 right-0"
                      onClick={() => handleRemoveImage(i)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit */}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Room"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
