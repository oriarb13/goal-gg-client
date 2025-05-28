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
  success: boolean;
  data?: T;
  message: string;
  status: number;
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  // withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const usersApi = {
  // register
  async register(userData: UserCreate): Promise<ApiResponse<UserFull>> {
    try {
      const response = await apiClient.post("/users/register", userData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Registration failed");
    }
  },

  // login
  async login(credentials: UserLogin): Promise<ApiResponse<LoginResponse>> {
    try {
      console.log("Login URL:", `/users/login`);
      console.log("Login Credentials:", credentials);

      const response = await apiClient.post("/users/login", credentials);
      console.log("response", response);

      const apiResponse = response.data;
      console.log("apiResponse", apiResponse);

      if (apiResponse.success && apiResponse.data) {
        return {
          success: apiResponse.success,
          data: apiResponse.data,
          message: apiResponse.message,
          status: apiResponse.status,
        };
      }

      return apiResponse;
    } catch (error: any) {
      console.error("Full error object:", error);
      console.error("Error response:", error.response);
      console.error("Error request:", error.request);

      if (error.response) {
        console.error("Error data:", error.response.data);
        console.error("Error status:", error.response.status);
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
      const response = await apiClient.get(
        `/users/?skip=${skip}&limit=${limit}`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to fetch users");
    }
  },

  // get user by id
  async getUserById(userId: number): Promise<ApiResponse<UserFull>> {
    try {
      const response = await apiClient.get(`/users/${userId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to fetch user");
    }
  },

  // change user role
  async changeRole(
    userId: number,
    newRoleId: number
  ): Promise<ApiResponse<UserFull>> {
    try {
      const response = await apiClient.put("/users/role", null, {
        params: {
          user_id: userId,
          new_role_id: newRoleId,
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to change role");
    }
  },
};

// =============================================
//  Auth
// =============================================

export const authUtils = {
  // save auth
  saveAuth(loginData: LoginResponse): void {
    localStorage.setItem("access_token", loginData.access_token);
    localStorage.setItem("user", JSON.stringify(loginData.user));
  },

  // logout
  logout(): void {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
  },

  // קבלת משתמש נוכחי מ-localStorage
  getCurrentUser(): UserFull | null {
    try {
      const userStr = localStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },

  // check if authenticated
  isAuthenticated(): boolean {
    return Boolean(localStorage.getItem("access_token"));
  },

  // get token
  getToken(): string | null {
    return localStorage.getItem("access_token");
  },
};
