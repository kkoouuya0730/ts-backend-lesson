import prisma from "../../../models/prisma";
import * as userService from "../../user/user.service";
import { AppError } from "../../../errors/AppError";
import { mockUser, mockUsers, mockUsersWithNoPassword } from "../../../mocks/user.mock";

describe("User Service", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("正常系", () => {
    test("getUsers はユーザー一覧を返す", async () => {
      const findManySpy = jest.spyOn(prisma.user, "findMany").mockResolvedValue(mockUsers);

      const result = await userService.getUsers();

      expect(result).toEqual(mockUsersWithNoPassword);
      expect(findManySpy).toHaveBeenCalledTimes(1);
      expect(result).toMatchSnapshot();
    });

    test("getUser は指定されたIDのユーザーを返す", async () => {
      const userId = 1;
      const findUniqueSpy = jest.spyOn(prisma.user, "findUnique").mockResolvedValue(mockUser);

      const result = await userService.getUser(userId);

      expect(result).toEqual({ id: mockUser.id, name: mockUser.name, email: mockUser.email });
      expect(findUniqueSpy).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(result).toMatchSnapshot();
    });

    test("updateUser は指定されたIDのユーザーを更新して返す", async () => {
      const userId = 1;
      const newName = "Alice Updated";
      const updatedUser = {
        id: userId,
        name: newName,
        email: "test@test.com",
        passwordHash: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      };
      const updateSpy = jest.spyOn(prisma.user, "update").mockResolvedValue(updatedUser);

      const result = await userService.updateUser(userId, newName);

      const { passwordHash, ...publicUser } = updatedUser;

      expect(result).toEqual(publicUser);
      expect(updateSpy).toHaveBeenCalledWith({
        where: { id: userId },
        data: { name: newName },
      });
      expect(result).toMatchSnapshot();
    });

    test("deleteUser は指定されたIDのユーザーを削除する", async () => {
      const userId = 1;
      const deleteSpy = jest.spyOn(prisma.user, "delete").mockResolvedValue(mockUser);

      await userService.deleteUser(userId);

      expect(deleteSpy).toHaveBeenCalledWith({
        where: { id: userId },
      });
    });
  });

  describe("異常系", () => {
    test("getUserで存在しないIDを指定した場合、nullを返す", async () => {
      const userId = 999;
      const findUniqueSpy = jest.spyOn(prisma.user, "findUnique").mockResolvedValue(null);

      const result = await userService.getUser(userId);

      expect(result).toBeNull();
      expect(findUniqueSpy).toHaveBeenCalledWith({
        where: { id: userId },
      });
    });

    test("updateUserで存在しないIDを指定した場合、エラーになる", async () => {
      const userId = 999;
      const newName = "Alice Updated";
      const updateSpy = jest.spyOn(prisma.user, "update").mockRejectedValue(new AppError(404, "User not found"));

      await expect(userService.updateUser(userId, newName)).rejects.toMatchObject({
        statusCode: 404,
        message: "User not found",
      });
      expect(updateSpy).toHaveBeenCalledTimes(1);
      expect(updateSpy).toHaveBeenCalledWith({
        where: { id: userId },
        data: { name: newName },
      });
    });

    test("deleteUserで存在しないIDを指定した場合、エラーになる", async () => {
      const userId = 999;
      const deleteSpy = jest.spyOn(prisma.user, "delete").mockRejectedValue(new AppError(404, "User not found"));
      await expect(userService.deleteUser(userId)).rejects.toMatchObject({
        statusCode: 404,
        message: "User not found",
      });
      expect(deleteSpy).toHaveBeenCalledTimes(1);
      expect(deleteSpy).toHaveBeenCalledWith({
        where: { id: userId },
      });
    });
  });
});
