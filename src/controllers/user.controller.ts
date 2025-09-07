import * as userService from "../services/user.service";
import { Request, Response, NextFunction } from "express";
import { userInputSchema } from "../validation";
import { AppError } from "../errors/AppError";
import { INVALID_USER_ID, INVALID_USER_INPUT, USER_NOT_FOUND } from "../constants";
import { parseUserId, parseUserInput } from "./parse";

export const getUsersHandler = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userService.getUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const getUserHandler = async (req: Request, res: Response, next: NextFunction) => {
  const parseUserIdResult = parseUserId(req.params.id);
  if (!parseUserIdResult.success) {
    throw new AppError(400, INVALID_USER_ID, parseUserIdResult.error.issues);
  }

  const userId = parseUserIdResult.data.id;

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

export const createUserHandler = async (req: Request, res: Response, next: NextFunction) => {
  const result = userInputSchema.safeParse(req.body);
  if (!result.success) {
    throw new AppError(400, INVALID_USER_INPUT, result.error.issues);
  }

  const parseUserInputResult = parseUserInput(req.body);
  if (!parseUserInputResult.success) {
    throw new AppError(400, INVALID_USER_INPUT, parseUserInputResult.error.issues);
  }

  try {
    const newUser = await userService.createUser(parseUserInputResult.data);
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

export const updateUserHandler = async (req: Request, res: Response, next: NextFunction) => {
  const parseUserIdResult = parseUserId(req.params.id);

  if (!parseUserIdResult.success) {
    throw new AppError(400, INVALID_USER_INPUT, parseUserIdResult.error.issues);
  }

  const userId = parseUserIdResult.data.id;

  const parseUserInputResult = parseUserInput(req.body);
  if (!parseUserInputResult.success) {
    throw new AppError(400, INVALID_USER_INPUT, parseUserInputResult.error.issues);
  }

  try {
    const user = await userService.updateUser(userId, parseUserInputResult.data.name);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const deleteUserHandler = async (req: Request, res: Response, next: NextFunction) => {
  const parseUserIdResult = parseUserId(req.params.id);
  if (!parseUserIdResult.success) {
    throw new AppError(400, INVALID_USER_ID, parseUserIdResult.error.issues);
  }

  const userId = parseUserIdResult.data.id;

  try {
    await userService.deleteUser(userId);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};
