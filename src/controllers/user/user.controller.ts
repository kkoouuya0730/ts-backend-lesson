import * as userService from "../../services/user/user.service";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../../errors/AppError";
import { INVALID_USER_ID, INVALID_USER_INPUT, USER_NOT_FOUND } from "../../constants";
import { userIdSchema, userInputSchema } from "../../validation";

export const getUsersHandler = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userService.getUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const getUserHandler = async (req: Request, res: Response, next: NextFunction) => {
  const parsedUserIdResult = userIdSchema.safeParse({ id: req.params.id });
  console.log(parsedUserIdResult);
  if (!parsedUserIdResult.success) {
    throw new AppError(400, INVALID_USER_ID, parsedUserIdResult.error.issues);
  }

  const userId = parsedUserIdResult.data.id;

  try {
    const user = await userService.getUser(userId);
    if (!user) {
      throw new AppError(404, USER_NOT_FOUND);
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const updateUserHandler = async (req: Request, res: Response, next: NextFunction) => {
  const parsedUserIdResult = userIdSchema.safeParse({ id: req.params.id });

  if (!parsedUserIdResult.success) {
    throw new AppError(400, INVALID_USER_ID, parsedUserIdResult.error.issues);
  }

  const userId = parsedUserIdResult.data.id;

  const parsedInput = userInputSchema.safeParse(req.body);
  if (!parsedInput.success) {
    throw new AppError(400, INVALID_USER_INPUT, parsedInput.error.issues);
  }

  try {
    const user = await userService.updateUser(userId, parsedInput.data.name);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const deleteUserHandler = async (req: Request, res: Response, next: NextFunction) => {
  const parsedUserIdResult = userIdSchema.safeParse({ id: req.params.id });
  if (!parsedUserIdResult.success) {
    throw new AppError(400, INVALID_USER_ID, parsedUserIdResult.error.issues);
  }

  const userId = parsedUserIdResult.data.id;

  try {
    await userService.deleteUser(userId);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};
