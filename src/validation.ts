import { z } from "zod";

export const userSchema = z.object({
  id: z.coerce.number().int().min(1),
  name: z.string().min(1).max(50),
});

export const userInputSchema = userSchema.omit({ id: true });
export const userIdSchema = z.object({
  id: z.coerce.number().int().min(1),
});

export type User = z.infer<typeof userSchema>;

export type UserInput = z.infer<typeof userInputSchema>;
