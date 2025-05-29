import axios from "axios";
import {
  type UserCreate,
  type UserFull,
  type UserLogin,
} from "../../types/userTypes";

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: UserFull;
}

export interface ApiResponse<T> {
  data?: T;
  message: string;
  status: number;
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const getHeaders = () => {
  const headers: any = {
    "Content-Type": "application/json",
  };
  const token = localStorage.getItem("access_token");
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

export const usersApi = {
  // register
  async register(userData: UserCreate): Promise<ApiResponse<UserFull>> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/users/register`,
        userData,
        {
          headers: getHeaders(),
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Registration failed");
    }
  },

  // login
  async login(body: UserLogin): Promise<ApiResponse<LoginResponse>> {
    try {
      const response = await axios.post(`${API_BASE_URL}/users/login`, body, {
        headers: { "Content-Type": "application/json" },
      });

      const apiResponse = response.data;

      if (apiResponse.success && apiResponse.data) {
        return {
          data: apiResponse.data,
          message: apiResponse.message,
          status: apiResponse.status,
        };
      }

      return apiResponse;
    } catch (error: any) {
      if (error.response?.status === 401) {
        localStorage.removeItem("access_token");
        window.location.href = "/";
      }
      throw new Error(error.response?.data?.message || "Login failed");
    }
  },

  // get all users
  async getAllUsers(
    skip: number = 0,
    limit: number = 100
  ): Promise<ApiResponse<UserFull[]>> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/users/?skip=${skip}&limit=${limit}`,
        {
          headers: getHeaders(),
        }
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        window.location.href = "/";
      }
      throw new Error(error.response?.data?.message || "Failed to fetch users");
    }
  },

  // get user by id
  async getUserById(userId: number): Promise<ApiResponse<UserFull>> {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/${userId}`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        window.location.href = "/";
      }
      throw new Error(error.response?.data?.message || "Failed to fetch user");
    }
  },

  // change user role
  async changeRole(
    userId: number,
    newRoleId: number
  ): Promise<ApiResponse<UserFull>> {
    try {
      const response = await axios.put(`${API_BASE_URL}/users/role`, null, {
        headers: getHeaders(),
        params: {
          user_id: userId,
          new_role_id: newRoleId,
        },
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        window.location.href = "/";
      }
      throw new Error(error.response?.data?.message || "Failed to change role");
    }
  },
};

// =============================================
//  Auth Utils
// =============================================

export const authUtils = {
  saveAuth(loginData: LoginResponse): void {
    localStorage.setItem("access_token", loginData.access_token);
    localStorage.setItem("user", JSON.stringify(loginData.user));
  },

  logout(): void {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
  },

  getCurrentUser(): UserFull | null {
    try {
      const userStr = localStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    return Boolean(localStorage.getItem("access_token"));
  },

  getToken(): string | null {
    return localStorage.getItem("access_token");
  },
};
