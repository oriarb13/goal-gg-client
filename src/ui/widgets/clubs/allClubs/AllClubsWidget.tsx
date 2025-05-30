import { useState, useEffect } from "react";
import { SportCategoryEnum, ClubStatusEnum } from "@/types/enums";
import { IClub } from "@/types/types";
import { useTranslation } from "react-i18next";
import ClubsTable from "./table/ClubsTable";
import { useAppSelector } from "@/store/store";
import { useClubs } from "./useClubs";
import SearchAndFilters from "./SearchAndFilters";
import { Button } from "@/ui/shadCN/button";
import { PlusCircle } from "lucide-react";

const AllClubsWidget = () => {
  const { t } = useTranslation();
  const { user } = useAppSelector((state) => state.user);

  // Initial clubs data - in a real app this would be empty and fetched from API
  const [initialClubs, setInitialClubs] = useState<IClub[]>([
    {
      _id: "1",
      name: "מועדון 1",
      description: "תיאור של מועדון 1",
      admin: "1",
      captains: ["1", "2"],
      members: [{ userId: "1", skillRating: 10, positions: ["1", "2"] }],
      pendingRequests: [{ userId: "1", role: "1" }],
      sportCategory: SportCategoryEnum.FOOTBALL,
      image: "/default-profile.jpg",
      status: ClubStatusEnum.ACTIVE,
      isPrivet: true,
      maxPlayers: 10,
      location: {
        country: "ישראל",
        city: "תל אביב",
        address: "רחוב אלנבי 1",
        lat: 32.0853,
        lng: 34.7818,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: "2",
      name: "מועדון 2",
      description: "תיאור של מועדון 2",
      admin: "2",
      captains: ["2", "3"],
      members: [{ userId: "2", skillRating: 8, positions: ["2", "3"] }],
      pendingRequests: [],
      sportCategory: SportCategoryEnum.BASKETBALL,
      image: "/default-profile.jpg",
      status: ClubStatusEnum.ACTIVE,
      isPrivet: false,
      maxPlayers: 15,
      location: {
        country: "ישראל",
        city: "ירושלים",
        address: "רחוב יפו 10",
        lat: 31.7857,
        lng: 35.2007,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: "3",
      name: "מכבי חיפה",
      description: "מועדון כדורגל בחיפה",
      admin: "3",
      captains: ["3", "4"],
      members: [
        { userId: "3", skillRating: 9, positions: ["3", "4"] },
        { userId: "4", skillRating: 7, positions: ["2"] },
        { userId: "5", skillRating: 8, positions: ["1"] },
      ],
      pendingRequests: [],
      sportCategory: SportCategoryEnum.FOOTBALL,
      image: "/default-profile.jpg",
      status: ClubStatusEnum.ACTIVE,
      isPrivet: false,
      maxPlayers: 25,
      location: {
        country: "ישראל",
        city: "חיפה",
        address: "רחוב הנמל 5",
        lat: 32.794,
        lng: 34.9896,
      },
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      updatedAt: new Date(),
    },
    {
      _id: "4",
      name: "הפועל באר שבע",
      description: "מועדון כדורגל בבאר שבע",
      admin: "5",
      members: [{ userId: "6", skillRating: 7, positions: ["1"] }],
      pendingRequests: [],
      sportCategory: SportCategoryEnum.FOOTBALL,
      image: "/default-profile.jpg",
      status: ClubStatusEnum.FULL,
      isPrivet: false,
      maxPlayers: 25,
      location: {
        country: "ישראל",
        city: "באר שבע",
        address: "רחוב הדסה 10",
        lat: 31.243,
        lng: 34.7928,
      },
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      updatedAt: new Date(),
    },
  ]);

  // Use our custom hook for clubs data, filtering, and sorting
  const {
    clubs,
    loading,
    error,
    search,
    filters,
    sortBy,
    updateSearch,
    updateFilters,
    updateSortBy,
    resetFilters,
    refreshClubs,
  } = useClubs(initialClubs);

  // For a real application, fetch clubs from an API
  useEffect(() => {
    // Example of how to fetch clubs from an API:
    // const fetchClubs = async () => {
    //   try {
    //     const response = await fetch('/api/clubs');
    //     const data = await response.json();
    //     setInitialClubs(data);
    //   } catch (error) {
    //     console.error('Error fetching clubs:', error);
    //   }
    // };
    //
    // fetchClubs();
  }, []);

  // Handle creating a new club
  const handleCreateClub = () => {
    console.log("Navigate to create club page");
    // In a real app, you would navigate to a create club page
    // navigate('/clubs/create');
  };

  return (
    <div className="flex flex-col items-center p-4 relative z-10 min-h-screen">
      <div className="w-full max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-center">
            {t("club.allClubs")}
          </h1>
          <Button
            onClick={handleCreateClub}
            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full flex items-center gap-2"
          >
            <PlusCircle className="h-5 w-5" />
            {t("club.createClub")}
          </Button>
        </div>

        <p className="text-sm mb-6 text-center text-gray-400">
          {t("club.chooseOrCreateClub")}
        </p>

        {/* Search and Filters Component */}
        <SearchAndFilters
          onSearchChange={updateSearch}
          onFiltersChange={updateFilters}
          onSortChange={updateSortBy}
          onReset={resetFilters}
          search={search}
          filters={filters}
          sortBy={sortBy}
        />

        {/* Loading State */}
        {loading && (
          <div className="text-center p-8">
            <p className="text-gray-500">{t("club.loading")}...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center p-8 bg-red-50 text-red-500 rounded-lg">
            <p>{error}</p>
            <Button variant="outline" className="mt-2" onClick={refreshClubs}>
              {t("club.tryAgain")}
            </Button>
          </div>
        )}

        {/* No Results */}
        {!loading && !error && clubs.length === 0 && (
          <div className="text-center p-8 bg-white/80 rounded-lg shadow">
            <p>{t("club.noClubsMatchingFilters")}</p>
            <Button variant="outline" className="mt-2" onClick={resetFilters}>
              {t("club.clearFilters")}
            </Button>
          </div>
        )}

        {/* Clubs Table */}
        {!loading && !error && clubs.length > 0 && (
          <ClubsTable clubs={clubs} user={user!} />
        )}
      </div>
    </div>
  );
};

export default AllClubsWidget;
