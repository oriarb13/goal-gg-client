export interface Phone {
  prefix?: string | null;
  number?: string | null;
}

export interface RoleInfo {
  id: number;
  name: string;
  max_clubs: number;
  max_players: number;
  cost: number;
}

export interface OwnedClubInfo {
  id: number;
  name: string;
  description: string;
  sport_category: string;
  max_players: number;
}

export interface MembershipInfo {
  id: number;
  club_id: number;
  club: OwnedClubInfo;
  total_goals: number;
  total_assists: number;
  total_games: number;
  skill_rating?: number;
  positions: string[];
}

export interface UserCreate {
  first_name: string;
  last_name: string;
  phone: Phone;
  email: string;
  password: string;
  sport_category: string;
  year_of_birth: number;
  country?: string;
  city?: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserFull {
  id: number;
  first_name: string;
  last_name: string;
  image: string;
  year_of_birth: number;
  memberships: MembershipInfo[];
  owned_clubs: OwnedClubInfo[];
  email: string;
  is_email_verified: boolean;
  phone: Record<string, string>;
  city?: string;
  country?: string;
  sport_category: string;
  positions: string[];
  cm?: number;
  kg?: number;
  strong_side?: string;
  avg_skill_rating: number;
  account_status: string;
  location: Record<string, number | null>;
  favorite_fields: number[];
  friends: number[];
  friend_requests: number[];
  club_requests: number[];
  total_games: number;
  total_points: number;
  total_assists: number;
  role_id: number;
  role: RoleInfo;
  subscription_start_date?: string;
  subscription_end_date?: string;
  created_at: string;
  updated_at?: string;
}
