import { Request, Response, NextFunction } from "express";
import { AppError } from "../../errors/AppError";
import { INVALID_CREDENTIALS, INVALID_USER_INPUT, USER_ALREADY_EXISTS, USER_NOT_FOUND } from "../../constants";
import * as userService from "../../services/user/user.service";
import { loginUserSchema, registerUserSchema } from "../../validation";
import prisma from "../../models/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

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
    const newUser = await userService.createUser({ name, email, passwordHash, role: "user" });
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

export const loginUserHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = loginUserSchema.safeParse(req.body);

    if (!result.success) {
      throw new AppError(400, INVALID_USER_INPUT, result.error.issues);
    }

    const { email, password } = result.data;

    // TODO userService.getUser() を使う
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new AppError(404, USER_NOT_FOUND);
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      throw new AppError(401, INVALID_CREDENTIALS);
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (error) {
    next(error);
  }
};
