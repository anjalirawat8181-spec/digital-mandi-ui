import api from "./api";

export interface User {
  id: number;
  name: string;
  email: string;
}

export async function getUsers(): Promise<User[]> {
  const response = await api.get<User[]>("/users");
  return response.data;
}
