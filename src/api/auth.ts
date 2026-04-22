import { api } from "./client";

export async function getCurrentUser() {
  try {
    const res = await api.get("accounts/me");

    return {
      success: true,
      data: res.data,
    };
  } catch (error) {
    return {
      success: false,
    };
  }
}