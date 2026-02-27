import { z } from "zod";

export const createPackageSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Package name is required"),
    price: z.string().min(1, "Price is required"),
    description: z.string().min(10, "Description is required"),
    features: z.array(z.string().min(1)).min(1, "At least one feature is required"),
    enquiry_message: z.string().trim().optional(),
  }),
});

export type CreatePackageInput = z.infer<typeof createPackageSchema>["body"];
