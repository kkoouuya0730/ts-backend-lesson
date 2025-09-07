import prisma from "../models/prisma";
import { UserInput } from "../validation";

export const getUsers = async () => {
  const users = await prisma.user.findMany();
  return users;
};

export const getUser = async (id: number) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  return user;
};

export const createUser = async (data: UserInput) => {
  const user = await prisma.user.create({
    data,
  });
  return user;
};

export const updateUser = async (id: number, name: string) => {
  const user = await prisma.user.update({
    where: {
      id,
    },
    data: {
      name,
    },
  });
  return user;
};

export const deleteUser = async (id: number) => {
  await prisma.user.delete({
    where: {
      id,
    },
  });
};
