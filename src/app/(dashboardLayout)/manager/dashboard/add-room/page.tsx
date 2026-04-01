/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import {
  X,
  Plus,
  Loader2,
  Image as ImageIcon,
  DollarSign,
  Users,
  Link,
  Hotel,
  Info,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";

import { createRoom } from "@/services/room.services";
import { IRoomType } from "@/types/room.types";
import { httpClient } from "@/lib/axios/httpClient";

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

const getRoomTypes = async (): Promise<IRoomType[]> => {
  try {
    const res = await httpClient.get("/room-type");
    const data = res.data;
    if (Array.isArray(data)) return data;
    return [];
  } catch (error) {
    console.error("getRoomTypes error:", error);
    return [];
  }
};

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 text-primary">
          {icon}
        </div>
        <h3 className="font-semibold text-base tracking-tight">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Field({
  label,
  required,
  error,
  children,
  helperText,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  helperText?: string;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-semibold">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {children}
      {helperText && !error && (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      )}
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <span className="inline-block w-1 h-1 rounded-full bg-red-500" />
          {error}
        </p>
      )}
    </div>
  );
}

// Component
export default function AddRoomFrom() {
  const [imageInput, setImageInput] = useState("");
  const [imageError, setImageError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [roomTypes, setRoomTypes] = useState<IRoomType[]>([]);
  const [roomTypesLoading, setRoomTypesLoading] = useState(true);
  const [roomTypesError, setRoomTypesError] = useState<string | null>(null);

  useEffect(() => {
    getRoomTypes()
      .then((data) => setRoomTypes(data || []))
      .catch(() => setRoomTypesError("Could not load room types"))
      .finally(() => setRoomTypesLoading(false));
  }, []);

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

  const onSubmit = async (values: CreateRoomFormValues) => {
    setSubmitError(null);

    // Validate that at least one image is added
    if (values.images.length === 0) {
      toast.error("Please add at least one image for the room", {
        duration: 4000,
      });
      return;
    }

    try {
      // Format the data for API
      const formattedData = {
        ...values,
        price: Number(values.price),
        capacity: Number(values.capacity),
        extraBedPrice: values.extraBedPrice ? Number(values.extraBedPrice) : 0,
        maxExtraBed: values.maxExtraBed ? Number(values.maxExtraBed) : 0,
        images: values.images,
      };

      console.log("Submitting room data:", formattedData); // Debug log

      const response = await createRoom(formattedData);

      console.log("Room created successfully:", response); // Debug log

      toast.success("Room created successfully!", {
        icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
        duration: 3000,
      });

      // Reset form
      reset({
        name: "",
        description: "",
        price: 0,
        capacity: 1,
        roomTypeId: "",
        isAvailable: true,
        images: [],
        extraBedPrice: 0,
        maxExtraBed: 0,
      });
      setImageInput("");
      setImageError(null);
    } catch (err: any) {
      console.error("Room creation error:", err); // Debug log

      // Handle different error scenarios
      let errorMessage = "Failed to create room. Please try again.";

      if (err.response) {
        // Server responded with error
        const status = err.response.status;
        const data = err.response.data;

        if (status === 400) {
          errorMessage =
            data.message || "Invalid data provided. Please check your inputs.";
        } else if (status === 401) {
          errorMessage = "You are not authorized. Please login again.";
        } else if (status === 403) {
          errorMessage = "You don't have permission to create rooms.";
        } else if (status === 500) {
          errorMessage = "Server error. Please try again later.";
        } else {
          errorMessage = data.message || errorMessage;
        }
      } else if (err.request) {
        // Request made but no response
        errorMessage = "Network error. Please check your connection.";
      } else if (err.message) {
        errorMessage = err.message;
      }

      setSubmitError(errorMessage);
      toast.error(errorMessage, {
        duration: 5000,
        icon: <AlertCircle className="h-4 w-4" />,
      });
    }
  };

  const handleAddImage = () => {
    const url = imageInput.trim();
    if (!url) return;
    try {
      new URL(url);
    } catch {
      setImageError("Invalid URL format");
      return;
    }
    if (images.includes(url)) {
      setImageError("This image URL is already added");
      return;
    }
    setValue("images", [...images, url]);
    setImageInput("");
    setImageError(null);
    toast.success("Image added successfully", {
      duration: 2000,
    });
  };

  const handleRemoveImage = (index: number) => {
    setValue(
      "images",
      images.filter((_, i) => i !== index),
    );
    toast.info("Image removed", {
      duration: 2000,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-10 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-4 justify-center sm:justify-start">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl" />
                <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/70 text-white shadow-lg">
                  <Hotel className="w-7 h-7" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Add New Room
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                  Create a new room and add it to your inventory
                </p>
              </div>
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span>Ready to publish</span>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Error Alert */}
          {submitError && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{submitError}</AlertDescription>
            </Alert>
          )}

          {/* Basic Information Section */}
          <div className="bg-card rounded-2xl border border-border/50 shadow-sm p-6 hover:shadow-md transition-shadow">
            <Section
              title="Basic Information"
              icon={<Info className="w-4 h-4" />}
            >
              <div className="space-y-4">
                <Field label="Room Name" required error={errors.name?.message}>
                  <Input
                    placeholder="e.g., Ocean View Deluxe Suite"
                    className="h-11 focus:ring-2 focus:ring-primary/20 transition-all"
                    {...register("name", { required: "Room name is required" })}
                  />
                </Field>

                <Field label="Description" error={errors.description?.message}>
                  <Textarea
                    placeholder="Describe the room amenities, view, features, and any special highlights..."
                    rows={4}
                    className="resize-none focus:ring-2 focus:ring-primary/20 transition-all"
                    {...register("description")}
                  />
                </Field>

                <Field label="Room Type" required>
                  {roomTypesError ? (
                    <p className="text-sm text-red-500">{roomTypesError}</p>
                  ) : (
                    <Select
                      value={roomTypeId}
                      onValueChange={(v) => setValue("roomTypeId", v)}
                      disabled={roomTypesLoading}
                    >
                      <SelectTrigger className="h-11 focus:ring-2 focus:ring-primary/20 transition-all">
                        {roomTypesLoading ? (
                          <span className="flex items-center gap-2 text-muted-foreground text-sm">
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            Loading room types...
                          </span>
                        ) : (
                          <SelectValue placeholder="Select a room type" />
                        )}
                      </SelectTrigger>
                      <SelectContent>
                        {roomTypes.length === 0 ? (
                          <div className="p-3 text-sm text-muted-foreground text-center">
                            No room types available
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
                </Field>
              </div>
            </Section>
          </div>

          {/* Pricing & Capacity Section */}
          <div className="bg-card rounded-2xl border border-border/50 shadow-sm p-6 hover:shadow-md transition-shadow">
            <Section
              title="Pricing & Capacity"
              icon={<DollarSign className="w-4 h-4" />}
            >
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field
                    label="Price"
                    required
                    error={errors.price?.message}
                    helperText="Base rate"
                  >
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                        ৳
                      </span>
                      <Input
                        type="number"
                        min={0}
                        step={100}
                        placeholder="0"
                        className="h-11 pl-8 focus:ring-2 focus:ring-primary/20 transition-all"
                        {...register("price", {
                          required: "Price is required",
                          valueAsNumber: true,
                          min: { value: 0, message: "Price must be positive" },
                        })}
                      />
                    </div>
                  </Field>

                  <Field
                    label="Guest Capacity"
                    required
                    error={errors.capacity?.message}
                    helperText="Maximum number of guests"
                  >
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        type="number"
                        min={1}
                        placeholder="2"
                        className="h-11 pl-9 focus:ring-2 focus:ring-primary/20 transition-all"
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field
                    label="Extra Bed Price"
                    error={errors.extraBedPrice?.message}
                    helperText="Additional charge per extra bed"
                  >
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                        ৳
                      </span>
                      <Input
                        type="number"
                        min={0}
                        step={100}
                        placeholder="0"
                        className="h-11 pl-8 focus:ring-2 focus:ring-primary/20 transition-all"
                        {...register("extraBedPrice", { valueAsNumber: true })}
                      />
                    </div>
                  </Field>

                  <Field
                    label="Max Extra Beds"
                    error={errors.maxExtraBed?.message}
                    helperText="Maximum extra beds allowed"
                  >
                    <Input
                      type="number"
                      min={0}
                      placeholder="0"
                      className="h-11 focus:ring-2 focus:ring-primary/20 transition-all"
                      {...register("maxExtraBed", { valueAsNumber: true })}
                    />
                  </Field>
                </div>
              </div>
            </Section>
          </div>

          {/* Availability Section */}
          <div className="bg-card rounded-2xl border border-border/50 shadow-sm p-6 hover:shadow-md transition-shadow">
            <Section title="Availability" icon={<Eye className="w-4 h-4" />}>
              <div className="flex items-center justify-between rounded-xl border-2 border-border/50 p-4 bg-muted/20 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${isAvailable ? "bg-green-500/10" : "bg-red-500/10"}`}
                  >
                    {isAvailable ? (
                      <Eye className="w-5 h-5 text-green-600" />
                    ) : (
                      <EyeOff className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold">
                      {isAvailable
                        ? "Available for Booking"
                        : "Currently Unavailable"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {isAvailable
                        ? "Room is visible and can be booked by guests"
                        : "Room is hidden and cannot be booked"}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={isAvailable}
                  onCheckedChange={(v) => setValue("isAvailable", v)}
                  className="data-[state=checked]:bg-green-500"
                />
              </div>
            </Section>
          </div>

          {/* Images Section */}
          <div className="bg-card rounded-2xl border border-border/50 shadow-sm p-6 hover:shadow-md transition-shadow">
            <Section
              title="Room Images"
              icon={<ImageIcon className="w-4 h-4" />}
            >
              <div className="space-y-4">
                <Field
                  label="Add Image URL"
                  helperText="Paste a direct image URL (at least 1 image required)"
                  error={imageError || undefined}
                >
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Link className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        value={imageInput}
                        onChange={(e) => {
                          setImageInput(e.target.value);
                          setImageError(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddImage();
                          }
                        }}
                        placeholder="https://example.com/room-image.jpg"
                        className="h-11 pl-9 focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddImage}
                      className="h-11 px-5 shrink-0 hover:bg-primary hover:text-primary-foreground transition-all"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add
                    </Button>
                  </div>
                </Field>

                {/* Image Grid */}
                {images.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    {images.map((img, i) => (
                      <div
                        key={i}
                        className="group relative aspect-square rounded-xl overflow-hidden border-2 border-border bg-muted shadow-sm hover:shadow-lg transition-all"
                      >
                        <Image
                          src={img}
                          alt={`Room image ${i + 1}`}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/placeholder.png";
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(i)}
                          className="absolute top-2 right-2 flex items-center justify-center w-7 h-7 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-600 hover:scale-110 shadow-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          Image {i + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/10 py-12 mt-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                      <ImageIcon className="w-8 h-8 text-primary/60" />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">
                      No images added yet
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Add at least 1 image to create the room
                    </p>
                  </div>
                )}
              </div>
            </Section>
          </div>

          {/* Submit Section */}
          <div className="sticky bottom-4 bg-card/80 backdrop-blur-lg rounded-xl border border-border/50 shadow-lg p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="hidden sm:block">
                <p className="text-xs text-muted-foreground">
                  All fields marked with <span className="text-red-500">*</span>{" "}
                  are required
                </p>
              </div>
              <div className="flex items-center gap-3 ml-auto">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    reset();
                    setImageInput("");
                    setImageError(null);
                    setSubmitError(null);
                  }}
                  disabled={isSubmitting}
                  className="h-10 hover:bg-destructive/10 hover:text-destructive transition-all"
                >
                  Reset Form
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-10 px-6 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating Room...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Create Room
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
