import { useState, useEffect, useMemo } from "react";
import { IClub } from "@/types/types";

// Search type for determining search mode
export type SearchType = "name" | "id";

// Filter options interface
export interface ClubFilters {
  isPrivate?: boolean;
  maxPlayers?: number;
  maxDistance?: number;
  sportCategory?: string;
}

// Sort options
export type SortOption = "distance" | "createdAt" | "name";

export const useClubs = (initialClubs: IClub[] = []) => {
  // States for clubs data and loading
  const [clubs, setClubs] = useState<IClub[]>(initialClubs);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // States for search, filters, and sorting
  const [search, setSearch] = useState<{ text: string; type: SearchType }>({
    text: "",
    type: "name",
  });
  const [filters, setFilters] = useState<ClubFilters>({
    isPrivate: undefined,
    maxPlayers: undefined,
    maxDistance: undefined,
    sportCategory: undefined,
  });
  const [sortBy, setSortBy] = useState<SortOption>("distance");

  // User coordinates for distance calculation
  const [userCoords, setUserCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // Get user location when component mounts
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        },
        { enableHighAccuracy: true }
      );
    }
  }, []);

  // Function to fetch clubs from API
  const fetchClubs = async () => {
    setLoading(true);
    setError(null);
    try {
      // In a real application, this would be an API call with query parameters
      // Example:
      // const response = await fetch(`/api/clubs?search=${search.text}&type=${search.type}&...`);
      // const data = await response.json();
      // setClubs(data);

      // For now, we're just using the initialClubs
      // Simulating API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      setClubs(initialClubs);
    } catch (err) {
      setError("Failed to fetch clubs");
      console.error("Error fetching clubs:", err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate distance between user and club
  const calculateDistance = (club: IClub): number => {
    if (!userCoords || !club?.location?.lat || !club?.location?.lng) {
      return Infinity; // Return a large value for clubs without location
    }

    const R = 6371; // Earth's radius in km
    const dLat = deg2rad(club.location.lat - userCoords.lat);
    const dLon = deg2rad(club.location.lng - userCoords.lng);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(userCoords.lat)) *
        Math.cos(deg2rad(club.location.lat)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180);
  };

  // Fetch clubs when component mounts
  useEffect(() => {
    fetchClubs();
  }, []);

  // Filter and sort clubs based on search, filters, and sortBy
  const filteredClubs = useMemo(() => {
    if (!clubs.length) return [];

    // First apply search
    let result = [...clubs];

    if (search.text) {
      if (search.type === "id") {
        // Search by ID (exact match)
        result = result.filter((club) => club._id === search.text);
      } else {
        // Search by name (partial match)
        const searchLower = search.text.toLowerCase();
        result = result.filter((club) =>
          club.name.toLowerCase().includes(searchLower)
        );
      }
    }

    // Then apply filters
    if (filters.isPrivate !== undefined) {
      result = result.filter((club) => club.isPrivet === filters.isPrivate);
    }

    if (filters.maxPlayers) {
      result = result.filter(
        (club) =>
          club.maxPlayers !== undefined && club.maxPlayers <= filters.maxPlayers
      );
    }

    if (filters.maxDistance && userCoords) {
      result = result.filter((club) => {
        const distance = calculateDistance(club);
        return distance <= filters.maxDistance!;
      });
    }

    if (filters.sportCategory) {
      result = result.filter(
        (club) => club.sportCategory === filters.sportCategory
      );
    }

    // Finally sort the results
    result.sort((a, b) => {
      switch (sortBy) {
        case "distance":
          return calculateDistance(a) - calculateDistance(b);
        case "createdAt":
          return (
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
          );
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return result;
  }, [clubs, search, filters, sortBy, userCoords]);

  // Update search parameters
  const updateSearch = (text: string, type: SearchType) => {
    setSearch({ text, type });
  };

  // Update filters
  const updateFilters = (newFilters: Partial<ClubFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // Update sort option
  const updateSortBy = (option: SortOption) => {
    setSortBy(option);
  };

  // Reset all search parameters and filters
  const resetFilters = () => {
    setSearch({ text: "", type: "name" });
    setFilters({
      isPrivate: undefined,
      maxPlayers: undefined,
      maxDistance: undefined,
      sportCategory: undefined,
    });
    setSortBy("distance");
  };

  // Refresh clubs data
  const refreshClubs = () => {
    fetchClubs();
  };

  return {
    clubs: filteredClubs,
    loading,
    error,
    search,
    filters,
    sortBy,
    userCoords,
    updateSearch,
    updateFilters,
    updateSortBy,
    resetFilters,
    refreshClubs,
  };
};
