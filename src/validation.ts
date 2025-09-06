import { z } from "zod";

export const userSchema = z.object({
  id: z.number().min(1),
  name: z.string().min(2).max(100),
});

export const userInputSchema = userSchema.omit({ id: true });
export const userIdSchema = z.object({
  id: z.number().min(1),
});

export type User = z.infer<typeof userSchema>;
