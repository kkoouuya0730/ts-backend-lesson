import request from "supertest";
import express from "express";
import * as authController from "../auth.controller";
import * as userService from "../../../services/user/user.service";
import { AppError } from "../../../errors/AppError";
import { INVALID_USER_INPUT } from "../../../constants";
import { errorHandler } from "../../../middlewares/errorHandler";
import { mockUser } from "../../../mocks/user.mock";
import prisma from "../../../models/prisma";

jest.mock("../../../services/user/user.service");

const app = express();
app.use(express.json());

app.post("/auth/register", authController.registerUserHandler);
app.use(errorHandler);

describe("AuthController", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe("正常系", () => {
    test("registerUserHandler", async () => {
      (userService.createUser as jest.Mock).mockResolvedValue(mockUser);
      jest.spyOn(prisma.user, "findUnique").mockResolvedValue(null);

      const res = await request(app)
        .post("/auth/register")
        .send({ name: "Alice", email: "test1@test.com", password: "password" });

      expect(res.status).toBe(201);
      expect(res.body).toEqual(mockUser);
      expect(userService.createUser).toHaveBeenCalledTimes(1);
      expect(res.body).toMatchSnapshot();
    });
  });

  describe("異常系", () => {
    test("registerUserHandler", async () => {
      (userService.createUser as jest.Mock).mockRejectedValue(new AppError(400, INVALID_USER_INPUT));
      const res = await request(app)
        .post("/auth/register")
        .send({ name: "", email: "test@test.com", password: "password" });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({
        error: {
          code: 400,
          message: "Invalid user input",
          details: expect.any(Array),
        },
      });
      expect(userService.createUser).toHaveBeenCalledTimes(0);
    });
  });
});
