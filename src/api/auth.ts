import { get, post } from "./http";

type User = {
  id: number;
  username: string;
  email: string;
};

export async function getCurrentUser() {
  return get<User>("accounts/me/");
}

export async function refreshAccessToken() {
  return post<null>("accounts/refresh/", {});
}

export async function logoutUser() {
  return post<null>("accounts/logout/", {});
}