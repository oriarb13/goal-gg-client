import axios from "axios";
import { store } from "@/store/store";
import { logout } from "@/store/slices/userSlice";
import {
  type ClubCreate,
  type ClubFull,
  type ClubById,
  type ClubSearchFilters,
  type JoinClubResponse,
} from "@/types/clubTypes";

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

export const clubsApi = {
  // create new club
  async createClub(clubData: ClubCreate): Promise<ApiResponse<ClubFull>> {
    try {
      const response = await apiClient.post("/clubs/", clubData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Club creation failed");
    }
  },

  // search clubs
  async searchClubs(
    filters: ClubSearchFilters
  ): Promise<ApiResponse<ClubFull[]>> {
    try {
      const params = new URLSearchParams();

      if (filters.name) params.append("name", filters.name);
      if (filters.sport_category)
        params.append("sport_category", filters.sport_category);
      if (filters.is_private !== undefined)
        params.append("is_private", filters.is_private?.toString() || "");
      if (filters.sort_by) params.append("sort_by", filters.sort_by);
      if (filters.skip !== undefined)
        params.append("skip", filters.skip.toString());
      if (filters.limit !== undefined)
        params.append("limit", filters.limit.toString());

      const response = await apiClient.get(
        `/clubs/search?${params.toString()}`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to search clubs"
      );
    }
  },

  // get my clubs
  async getMyClubs(): Promise<ApiResponse<ClubFull[]>> {
    try {
      const response = await apiClient.get("/clubs/my-clubs");
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch my clubs"
      );
    }
  },

  // get club by id
  async getClubById(clubId: number): Promise<ApiResponse<ClubById>> {
    try {
      const response = await apiClient.get(`/clubs/${clubId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to fetch club");
    }
  },

  // join club
  async joinClub(clubId: number): Promise<ApiResponse<JoinClubResponse>> {
    try {
      const response = await apiClient.post(`/clubs/${clubId}/join`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to join club");
    }
  },

  // accept join request
  async acceptRequest(
    clubId: number,
    requestId: number
  ): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.post(
        `/clubs/${clubId}/accept-request/${requestId}`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to accept request"
      );
    }
  },

  // leave club
  async leaveClub(clubId: number, userId?: number): Promise<ApiResponse<any>> {
    try {
      const params = userId ? { user_id: userId } : {};
      const response = await apiClient.delete(`/clubs/${clubId}/leave`, {
        params,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to leave club");
    }
  },
};

// =============================================
// Club Utils
// =============================================

export const clubUtils = {
  // check if user is club admin
  isClubAdmin(club: ClubFull | ClubById, userId: number): boolean {
    return club.admin_id === userId;
  },

  // check if user is club captain
  isClubCaptain(club: ClubFull | ClubById, userId: number): boolean {
    return club.captains_ids?.includes(userId) || false;
  },

  // check if user is club member
  isClubMember(club: ClubFull | ClubById, userId: number): boolean {
    return club.members?.some((member) => member.user_id === userId) || false;
  },

  // check if user has pending request
  hasPendingRequest(club: ClubFull | ClubById, userId: number): boolean {
    return club.pending_requests?.includes(userId) || false;
  },

  // get members count
  getMembersCount(club: ClubFull | ClubById): number {
    return club.members?.length || 0;
  },

  // check if club is full
  isClubFull(club: ClubFull | ClubById): boolean {
    const membersCount = this.getMembersCount(club);
    return membersCount >= club.max_players;
  },
};
