import { z } from "zod";

export const createBookingSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email"),
    phone: z.string().trim().optional(),
    date: z
      .string()
      .min(1, "Date is required")
      .refine((value) => !Number.isNaN(Date.parse(value)), "Invalid date"),
    time_slot: z.string().min(1, "Time slot is required"),
    package: z.string().trim().optional(),
    message: z.string().trim().optional(),
  }),
});

export const updateBookingStatusSchema = z.object({
  body: z.object({
    status: z.enum(["PENDING", "CONFIRMED", "CANCELLED"]),
  }),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>["body"];
export type UpdateBookingStatusInput = z.infer<typeof updateBookingStatusSchema>["body"];
