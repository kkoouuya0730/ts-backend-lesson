import request from "supertest";
import express from "express";
import * as userController from "../../user/user.controller";
import * as userService from "../../../services/user/user.service";
import { AppError } from "../../../errors/AppError";
import { INVALID_USER_ID, INVALID_USER_INPUT, USER_NOT_FOUND } from "../../../constants";
import { errorHandler } from "../../../middlewares/errorHandler";
import { mockUser, mockUsers } from "../../../mocks/user.mock";

jest.mock("../../../services/user/user.service");

const app = express();
app.use(express.json());
app.get("/users", userController.getUsersHandler);
app.get("/users/:id", userController.getUserHandler);
// app.post("/users", userController.createUserHandler);
app.put("/users/:id", userController.updateUserHandler);
app.delete("/users/:id", userController.deleteUserHandler);
app.use(errorHandler);

describe("UserController", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe("正常系", () => {
    test("getUsersHandler", async () => {
      (userService.getUsers as jest.Mock).mockResolvedValue(mockUsers);

      const res = await request(app).get("/users");

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockUsers);
      expect(userService.getUsers).toHaveBeenCalledTimes(1);
      expect(res.body).toMatchSnapshot();
    });

    test("getUserHandler", async () => {
      (userService.getUser as jest.Mock).mockResolvedValue(mockUser);

      const res = await request(app).get("/users/1");

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockUser);
      expect(userService.getUser).toHaveBeenCalledTimes(1);
      expect(res.body).toMatchSnapshot();
    });

    // TODO authに移動したのでそっちでテスト書く
    // test("createUserHandler", async () => {
    //   (userService.createUser as jest.Mock).mockResolvedValue(mockUser);

    //   const res = await request(app).post("/users").send({ name: "Alice" });

    //   expect(res.status).toBe(201);
    //   expect(res.body).toEqual(mockUser);
    //   expect(userService.createUser).toHaveBeenCalledTimes(1);
    //   expect(res.body).toMatchSnapshot();
    // });

    test("updateUserHandler", async () => {
      (userService.updateUser as jest.Mock).mockResolvedValue({
        id: 1,
        name: "Alice updated",
        email: "test@test.com",
      });

      const res = await request(app)
        .put("/users/1")
        .send({ name: "Alice updated", email: "test@test.com", passwordHash: "hogehoge" });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ id: 1, name: "Alice updated", email: "test@test.com" });
      expect(userService.updateUser).toHaveBeenCalledTimes(1);
      expect(res.body).toMatchSnapshot();
    });

    test("deleteUserHandler", async () => {
      (userService.deleteUser as jest.Mock).mockResolvedValue({ message: "User deleted successfully" });

      const res = await request(app).delete("/users/1");

      expect(res.status).toBe(200);
      expect(userService.deleteUser).toHaveBeenCalledTimes(1);
      expect(res.body).toMatchSnapshot();
    });
  });

  describe("異常系", () => {
    test("getUserHandler", async () => {
      (userService.getUser as jest.Mock).mockRejectedValue(new AppError(404, USER_NOT_FOUND));

      const res = await request(app).get("/users/1");

      expect(res.status).toBe(404);
      expect(res.body).toEqual({
        error: {
          code: 404,
          message: "User not found",
          details: null,
        },
      });
      expect(userService.getUser).toHaveBeenCalledTimes(1);
    });

    // test("createUserHandler", async () => {
    //   (userService.createUser as jest.Mock).mockRejectedValue(new AppError(400, INVALID_USER_INPUT));

    //   const res = await request(app).post("/users").send({ name: "" });

    //   expect(res.status).toBe(400);
    //   expect(res.body).toEqual({
    //     error: {
    //       code: 400,
    //       message: "Invalid user input",
    //       details: expect.any(Array),
    //     },
    //   });
    //   expect(userService.createUser).toHaveBeenCalledTimes(0);
    // });

    test("updateUserHandler request bodyが不正", async () => {
      (userService.updateUser as jest.Mock).mockRejectedValue(new AppError(400, INVALID_USER_INPUT));

      const res = await request(app).put("/users/1").send({ name: "" });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({
        error: {
          code: 400,
          message: "Invalid user input",
          details: expect.any(Array),
        },
      });
      expect(userService.updateUser).toHaveBeenCalledTimes(0);
    });

    test("updateUserHandler path paramが不正", async () => {
      (userService.updateUser as jest.Mock).mockRejectedValue(new AppError(400, INVALID_USER_ID));

      const res = await request(app).put("/users/abc").send({ name: "Alice updated" });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({
        error: {
          code: 400,
          message: "Invalid user ID",
          details: expect.any(Array),
        },
      });
      expect(userService.updateUser).toHaveBeenCalledTimes(0);
    });

    test("deleteUserHandler", async () => {
      (userService.deleteUser as jest.Mock).mockRejectedValue(new AppError(400, INVALID_USER_INPUT));

      const res = await request(app).delete("/users/abc");

      expect(res.status).toBe(400);
      expect(res.body).toEqual({
        error: {
          code: 400,
          message: "Invalid user ID",
          details: expect.any(Array),
        },
      });
      expect(userService.deleteUser).toHaveBeenCalledTimes(0);
    });
  });
});
