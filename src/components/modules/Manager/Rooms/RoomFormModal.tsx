/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { IRoom, ICreateRoomPayload } from "@/types/room.types";
import { Loader2, Bed, DollarSign, Users, Hotel, Info } from "lucide-react";

interface RoomFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  room?: IRoom | null;
  onSubmit: (data: ICreateRoomPayload) => Promise<void>;
}

export function RoomFormModal({
  open,
  onOpenChange,
  room,
  onSubmit,
}: RoomFormModalProps) {
  const isEdit = !!room;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<ICreateRoomPayload>();

  useEffect(() => {
    if (room) {
      reset({
        name: room.name,
        description: room.description,
        price: Number(room.price),
        capacity: room.capacity,
        roomTypeId: room.roomType?.id || room.roomTypeId,
        isAvailable: room.isAvailable,
        extraBedPrice: Number(room.extraBedPrice),
        maxExtraBed: room.maxExtraBed,
        images: room.images?.[0]?.imageUrl ?? [],
      });
    } else {
      reset({
        isAvailable: true,
        capacity: 2,
        maxExtraBed: 0,
        extraBedPrice: 0,
      });
    }
  }, [room, reset]);

  const isAvailable = watch("isAvailable");
  const images = watch("images") || [];

  const onFormSubmit = async (data: ICreateRoomPayload) => {
    await onSubmit(data);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[480px] sm:max-w-[480px] p-0 overflow-y-auto bg-gradient-to-b from-background to-muted/20"
      >
        <div className="p-6 space-y-6">
          <SheetHeader className="space-y-2">
            <div className="flex items-center gap-2">
              <Hotel className="h-5 w-5 text-primary" />
              <SheetTitle className="text-2xl font-bold">
                {isEdit ? "Edit Room" : "Create New Room"}
              </SheetTitle>
            </div>
            <p className="text-sm text-muted-foreground">
              {isEdit
                ? "Update room details and availability"
                : "Add a new room to your hotel inventory"}
            </p>
          </SheetHeader>

          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
            {/* Basic Information Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Info className="h-4 w-4 text-primary" />
                Basic Information
              </h3>

              <div className="space-y-4">
                <Field label="Room Name" required error={errors.name}>
                  <Input
                    placeholder="e.g., Deluxe Sea View Room"
                    className="focus:ring-2 focus:ring-primary/20 transition-all"
                    {...register("name", { required: "Room name is required" })}
                  />
                </Field>

                <Field label="Description">
                  <Textarea
                    placeholder="Describe the room features, amenities, and highlights..."
                    className="min-h-[100px] resize-none focus:ring-2 focus:ring-primary/20 transition-all"
                    {...register("description")}
                  />
                </Field>
              </div>
            </div>

            {/* Pricing & Capacity Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-primary" />
                Pricing & Capacity
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Price (৳)" required error={errors.price}>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="number"
                      placeholder="3000"
                      className="pl-9 focus:ring-2 focus:ring-primary/20 transition-all"
                      {...register("price", {
                        required: "Price is required",
                        valueAsNumber: true,
                        min: { value: 0, message: "Price must be positive" },
                      })}
                    />
                  </div>
                </Field>

                <Field label="Capacity" required error={errors.capacity}>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="number"
                      placeholder="2"
                      className="pl-9 focus:ring-2 focus:ring-primary/20 transition-all"
                      {...register("capacity", {
                        required: "Capacity is required",
                        valueAsNumber: true,
                        min: {
                          value: 1,
                          message: "Capacity must be at least 1",
                        },
                      })}
                    />
                  </div>
                </Field>

                <Field label="Extra Bed Price (৳)">
                  <Input
                    type="number"
                    placeholder="500"
                    className="focus:ring-2 focus:ring-primary/20 transition-all"
                    {...register("extraBedPrice", { valueAsNumber: true })}
                  />
                </Field>

                <Field label="Max Extra Beds">
                  <Input
                    type="number"
                    placeholder="2"
                    className="focus:ring-2 focus:ring-primary/20 transition-all"
                    {...register("maxExtraBed", { valueAsNumber: true })}
                  />
                </Field>
              </div>
            </div>

            {/* Room Type Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Bed className="h-4 w-4 text-primary" />
                Room Classification
              </h3>

              <Field label="Room Type ID" required error={errors.roomTypeId}>
                <Input
                  placeholder="Enter room type ID"
                  className="font-mono text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                  {...register("roomTypeId", {
                    required: "Room type is required",
                  })}
                />
              </Field>
            </div>

            {/* Availability Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Availability Status</h3>
              <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50">
                <div className="space-y-0.5">
                  <Label className="font-medium">Room Available</Label>
                  <p className="text-xs text-muted-foreground">
                    Toggle to mark room as available or unavailable
                  </p>
                </div>
                <Switch
                  checked={isAvailable ?? true}
                  onCheckedChange={(v) => setValue("isAvailable", v)}
                  className="data-[state=checked]:bg-green-500"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label>Room Images</Label>

              {images.map((_, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="Image URL"
                    {...register(`images.${index}` as const, {
                      required:
                        index === 0 ? "At least one image required" : false,
                    })}
                  />

                  {images.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const updated = [...images];
                        updated.splice(index, 1);
                        setValue("images", updated);
                      }}
                    >
                      ✕
                    </Button>
                  )}
                </div>
              ))}

              <Button
                type="button"
                variant="secondary"
                onClick={() => setValue("images", [...images, ""])}
              >
                + Add Image
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1 h-11 hover:bg-muted/50 transition-all"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 h-11 bg-primary hover:bg-primary/90 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEdit ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>{isEdit ? "Update Room" : "Create Room"}</>
                )}
              </Button>
            </div>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Field({
  label,
  children,
  required,
  error,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
  error?: any;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1">
        <Label className="text-sm font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      </div>
      {children}
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <span className="inline-block w-1 h-1 rounded-full bg-red-500" />
          {error.message}
        </p>
      )}
    </div>
  );
}
