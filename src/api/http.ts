import { api } from "./client";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  status: number;
}

export async function post<T>(
  url: string,
  payload: any
): Promise<ApiResponse<T>> {
  try {
    const response = await api.post(url, payload);
    return {
      success: true,
      data: response.data,
      status: response.status,
    };
  } catch (error: any) {
    return {
      success: false,
      error:
        error.response?.data?.message ||
        error.message ||
        "Something went wrong",
      status: error.response?.status || 500,
    };
  }
}

// GET
export async function get<T>(url: string): Promise<ApiResponse<T>> {
  try {
    const response = await api.get(url);
    return {
      success: true,
      data: response.data,
      status: response.status,
    };
  } catch (error: any) {
    return {
      success: false,
      error:
        error.response?.data?.message ||
        error.message ||
        "Something went wrong",
      status: error.response?.status || 500,
    };
  }
}

// PUT (update)
export async function put<T>(
  url: string,
  payload: any
): Promise<ApiResponse<T>> {
  try {
    const response = await api.put(url, payload);
    return {
      success: true,
      data: response.data,
      status: response.status,
    };
  } catch (error: any) {
    return {
      success: false,
      error:
        error.response?.data?.message ||
        error.message ||
        "Something went wrong",
      status: error.response?.status || 500,
    };
  }
}

// DELETE
export async function remove<T>(url: string): Promise<ApiResponse<T>> {
  try {
    const response = await api.delete(url);
    return {
      success: true,
      data: response.data,
      status: response.status,
    };
  } catch (error: any) {
    return {
      success: false,
      error:
        error.response?.data?.message ||
        error.message ||
        "Something went wrong",
      status: error.response?.status || 500,
    };
  }
}