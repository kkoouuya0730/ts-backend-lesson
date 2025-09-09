import { Request, Response, NextFunction } from "express";
import { AppError } from "../../errors/AppError";
import { INVALID_USER_INPUT, USER_ALREADY_EXISTS } from "../../constants";
import * as userService from "../../services/user/user.service";
import { registerUserSchema } from "../../validation";
import prisma from "../../models/prisma";
import bcrypt from "bcrypt";

export const registerUserHandler = async (req: Request, res: Response, next: NextFunction) => {
  const result = registerUserSchema.safeParse(req.body);

  if (!result.success) {
    throw new AppError(400, INVALID_USER_INPUT, result.error.issues);
  }

  const { name, email, password } = result.data;

  // TODO userService.getUser() を使う
  const isExisting = await prisma.user.findUnique({ where: { email } });
  if (isExisting) {
    throw new AppError(400, USER_ALREADY_EXISTS);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  try {
    const newUser = await userService.createUser({ name, email, passwordHash });
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};
