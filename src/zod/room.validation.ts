import z from "zod";

const createRoomSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number(),
  capacity: z.number(),
  roomTypeId: z.string(),
  isAvailable: z.boolean(),
  images: z.array(z.string()).optional(),
  extraBedPrice: z.number().optional(),
  maxExtraBed: z.number().optional(),
});

export default createRoomSchema;
