import prisma from "../../models/prisma";
import { UserInput } from "../../validation";

export const getUsers = async () => {
  const users = await prisma.user.findMany();
  return users.map(({ passwordHash, ...publicUser }) => publicUser);
};

export const getUser = async (id: number) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  if (!user) return null;
  const { passwordHash, ...publicUser } = user;
  return publicUser;
};

export const createUser = async (data: UserInput) => {
  return await prisma.user.create({
    data,
  });
};

export const updateUser = async (id: number, name: string) => {
  const updatedUser = await prisma.user.update({
    where: {
      id,
    },
    data: {
      name,
    },
  });
  const { passwordHash, ...publicUser } = updatedUser;
  return publicUser;
};

export const deleteUser = async (id: number) => {
  await prisma.user.delete({
    where: {
      id,
    },
  });
};
