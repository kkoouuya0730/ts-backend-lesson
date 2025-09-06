import * as userService from "../services/user.service";
import { Request, Response } from "express";
import { userIdSchema, userInputSchema } from "../validation";

export const getUsersHandler = async (_req: Request, res: Response) => {
  try {
    const users = await userService.getUsers();
    res.json(users);
  } catch (error) {
    return res.status(500).json({ error: "Failed to retrieve users" });
  }
};

export const getUserHandler = async (req: Request, res: Response) => {
  const result = userIdSchema.safeParse(req.params);
  if (!result.success) {
    return res.status(400).json({ error: result.error.issues });
  }

  const userId = result.data.id;

  try {
    const user = await userService.getUser(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    return res.status(500).json({ error: "Failed to retrieve user" });
  }
};

export const createUserHandler = async (req: Request, res: Response) => {
  const result = userInputSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.issues });
  }

  try {
    const newUser = await userService.createUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    return res.status(500).json({ error: "Failed to create user" });
  }
};

export const updateUserHandler = async (req: Request, res: Response) => {
  const userIdResult = userIdSchema.safeParse(req.params);
  if (!userIdResult.success) {
    return res.status(400).json({ error: userIdResult.error.issues });
  }

  const userId = userIdResult.data.id;

  const result = userInputSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.issues });
  }

  try {
    const user = await userService.updateUser(userId, result.data.name);
    res.json(user);
  } catch (error) {
    return res.status(500).json({ error: "Failed to update user" });
  }
};

export const deleteUserHandler = async (req: Request, res: Response) => {
  const result = userIdSchema.safeParse(req.params);
  if (!result.success) {
    return res.status(400).json({ error: result.error.issues });
  }

  const userId = result.data.id;

  try {
    await userService.deleteUser(userId);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete user" });
  }
};
