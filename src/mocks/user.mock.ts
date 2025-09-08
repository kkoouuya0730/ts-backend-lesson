import { User, UserWithNoPasswordHash } from "../validation";

export const mockUsers: User[] = [
  { id: 1, name: "Alice", email: "test1@test.com", passwordHash: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" },
  { id: 2, name: "Bob", email: "test2@test.com", passwordHash: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" },
];
export const mockUsersWithNoPassword: UserWithNoPasswordHash[] = [
  { id: 1, name: "Alice", email: "test1@test.com" },
  { id: 2, name: "Bob", email: "test2@test.com" },
];

export const mockUser = {
  id: 1,
  name: "Alice",
  email: "test1@test.com",
  passwordHash: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
};
