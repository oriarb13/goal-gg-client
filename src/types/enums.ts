// Sport Categories
export enum SportCategoryEnum {
  FOOTBALL = "football",
  BASKETBALL = "basketball",
}

// User Roles
export enum UserRoleEnum {
  USER = "user",
  SILVER = "silver",
  GOLD = "gold",
  PREMIUM = "premium",
  SUPER_ADMIN = "super_admin",
}

// Strong Side
export enum StrongSideEnum {
  LEFT = "left",
  RIGHT = "right",
  BOTH = "both",
}

// Football Positions
export enum FootballPositionsEnum {
  GK = "gk", // Goalkeeper
  CB = "cb", // Center Back
  RB = "rb", // Right Back
  LB = "lb", // Left Back
  CDM = "cdm", // Central Defensive Midfielder
  CM = "cm", // Central Midfielder
  CAM = "cam", // Central Attacking Midfielder
  LM = "lm", // Left Midfielder
  RM = "rm", // Right Midfielder
  CF = "cf", // Center Forward
  LW = "lw", // Left Winger
  RW = "rw", // Right Winger
  ST = "st", // Striker
}

// Basketball Positions
export enum BasketballPositionsEnum {
  PG = "pg", // Point Guard
  SG = "sg", // Shooting Guard
  SF = "sf", // Small Forward
  PF = "pf", // Power Forward
  C = "c", // Center
}

// Account Status
export enum AccountStatusEnum {
  ACTIVE = "active",
  INACTIVE = "inactive",
  SUSPENDED = "suspended",
  LOCKED = "locked",
  PENDING_VERIFICATION = "pending_verification",
}

// Request Status
export enum RequestStatusEnum {
  PENDING = "pending",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
}

// Club Status
export enum ClubStatusEnum {
  ACTIVE = "active",
  INACTIVE = "inactive",
  FULL = "full",
}

// Event Status
export enum EventStatusEnum {
  UPCOMING = "upcoming",
  FULL = "full",
  ONGOING = "ongoing",
  COMPLETED = "completed",
}
