import prisma from "../models/prisma";
import { UserInput } from "../validation";

export const getUsers = async () => {
  return await prisma.user.findMany();
};

export const getUser = async (id: number) => {
  return await prisma.user.findUnique({
    where: {
      id,
    },
  });
};

export const createUser = async (data: UserInput) => {
  return await prisma.user.create({
    data,
  });
};

export const updateUser = async (id: number, name: string) => {
  return await prisma.user.update({
    where: {
      id,
    },
    data: {
      name,
    },
  });
};

export const deleteUser = async (id: number) => {
  await prisma.user.delete({
    where: {
      id,
    },
  });
};
