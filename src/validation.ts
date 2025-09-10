import { z } from "zod";

export const userSchema = z.object({
  id: z.coerce.number().int().min(1),
  name: z.string().min(1).max(50),
  email: z.email(),
  passwordHash: z.string(),
  role: z.enum(["user", "admin"]).default("user"),
});

export const userInputSchema = userSchema.omit({ id: true });
export const userWithNoPasswordHashSchema = userSchema.omit({ passwordHash: true });

export const userIdSchema = z.object({
  id: z.coerce.number().int().min(1),
});

export const registerUserSchema = z.object({
  name: z.string().min(1).max(50),
  email: z.email(),
  password: z.string().min(6),
});

export const loginUserSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export type RegisterUserInput = z.infer<typeof registerUserSchema>;
export type LoginUserInput = z.infer<typeof loginUserSchema>;
export type UserWithNoPasswordHash = z.infer<typeof userWithNoPasswordHashSchema>;

export type User = z.infer<typeof userSchema>;

export type UserInput = z.infer<typeof userInputSchema>;
