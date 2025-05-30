import { type SportCategoryEnum, type ClubStatusEnum } from "@/types/enums";

export interface Location {
  country?: string | null;
  city?: string | null;
  address?: string | null;
  lat?: number | null;
  lng?: number | null;
}

export interface UserInfo {
  id: number;
  first_name: string;
  last_name: string;
  image: string;
  email: string;
  phone: Record<string, string>;
}

export interface MemberInfo {
  id: number;
  user_id: number;
  user: UserInfo;
  total_goals: number;
  total_assists: number;
  total_games: number;
  skill_rating?: number | null;
  positions: string[];
}

// Create Club
export interface ClubCreate {
  name: string;
  description: string;
  image?: string;
  admin_id: number;
  sport_category: SportCategoryEnum;
  is_private?: boolean;
  max_players: number;
  status?: ClubStatusEnum;
  location: Location;
}

// Full Club
export interface ClubFull {
  id: number;
  name: string;
  description: string;
  image: string;
  admin_id: number;
  admin?: UserInfo | null;
  captains_ids?: number[];
  captains?: MemberInfo[];
  sport_category: SportCategoryEnum;
  is_private: boolean;
  max_players: number;
  status?: ClubStatusEnum | null;
  location?: Record<string, any> | null;
  pending_requests?: number[];
  created_at?: string | null;
  updated_at?: string | null;
  members?: MemberInfo[];
}

// For single club page
export interface ClubById {
  id: number;
  name: string;
  description: string;
  image: string;
  admin_id: number;
  admin?: UserInfo | null;
  captains_ids?: number[];
  captains?: MemberInfo[];
  sport_category: SportCategoryEnum;
  is_private: boolean;
  max_players: number;
  status?: ClubStatusEnum | null;
  location?: Record<string, any> | null;
  pending_requests?: number[];
  created_at?: string | null;
  updated_at?: string | null;
  members?: MemberInfo[];
}

// Search filters
export interface ClubSearchFilters {
  name?: string | null;
  sport_category?: SportCategoryEnum | null;
  is_private?: boolean | null;
  sort_by?: "name" | "created_at" | "members_count" | "distance";
  skip?: number;
  limit?: number;
}

// Join club response
export interface JoinClubResponse {
  request_status?: "pending" | "already_pending";
  message?: string;
}
