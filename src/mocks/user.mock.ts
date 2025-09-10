import { User, UserWithNoPasswordHash } from "../validation";

export const mockUsers: User[] = [
  {
    id: 1,
    name: "Alice",
    email: "test1@test.com",
    passwordHash: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    role: "user",
  },
  {
    id: 2,
    name: "Bob",
    email: "test2@test.com",
    passwordHash: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    role: "user",
  },
];
export const mockUsersWithNoPassword: UserWithNoPasswordHash[] = [
  { id: 1, name: "Alice", email: "test1@test.com", role: "user" },
  { id: 2, name: "Bob", email: "test2@test.com", role: "user" },
];

export const mockUser = {
  id: 1,
  name: "Alice",
  email: "test1@test.com",
  passwordHash: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  role: "user",
};
