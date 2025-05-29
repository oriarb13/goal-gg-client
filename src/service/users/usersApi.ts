import axios from "axios";
import { store } from "@/store/store";
import { logout } from "@/store/slices/userSlice";
import {
  type UserCreate,
  type UserFull,
  type UserLogin,
} from "@/types/userTypes";

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

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// add auto token
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

// handle 401 disconnect
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch(logout());
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export const usersApi = {
  // auth check - return current user
  async auth(): Promise<ApiResponse<UserFull>> {
    try {
      const response = await apiClient.get("/users/auth");
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Auth check failed");
    }
  },

  // register new user
  async register(userData: UserCreate): Promise<ApiResponse<UserFull>> {
    try {
      const response = await apiClient.post("/users/register", userData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Registration failed");
    }
  },

  // login
  async login(body: UserLogin): Promise<ApiResponse<LoginResponse>> {
    try {
      const response = await apiClient.post("/users/login", body);
      return response.data;
    } catch (error: any) {
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
      return response.data; // { status: 200, message: "User retrieved successfully", data: UserFull }
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
// Auth Utils
// =============================================

export const authUtils = {
  // check if authenticated (from localStorage)
  isAuthenticated(): boolean {
    return Boolean(localStorage.getItem("access_token"));
  },

  // get current user (from Redux)
  getCurrentUser(): UserFull | null {
    const state = store.getState();
    return state.user.currentUser;
  },

  // get token (from localStorage)
  getToken(): string | null {
    return localStorage.getItem("access_token");
  },

  // logout (from Redux)
  logout(): void {
    store.dispatch(logout());
  },
};
