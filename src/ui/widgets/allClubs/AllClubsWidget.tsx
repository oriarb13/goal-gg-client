import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchClubs } from "@/service/clubs/clubsQuery";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/store/slices/userSlice";
import { Button } from "@/ui/shadCN/button";
import { PlusCircle } from "lucide-react";
import SearchAndFilters from "./SearchAndFilters";
import ClubsTable from "./table/ClubsTable";
import { type ClubSearchFilters } from "@/types/clubTypes";

const AllClubsWidget = () => {
  const { t } = useTranslation();
  const currentUser = useSelector(selectCurrentUser);

  const [filters, setFilters] = useState<ClubSearchFilters>({
    name: undefined,
    sport_category: undefined,
    is_private: undefined,
    sort_by: "created_at",
    skip: 0,
    limit: 20,
  });

  const { data: clubs, isLoading, error, refetch } = useSearchClubs(filters);

  const handleCreateClub = () => {
    console.log("Navigate to create club page");
    // In a real app, you would navigate to a create club page
    // navigate('/clubs/create');
  };

  const handleFiltersChange = (newFilters: Partial<ClubSearchFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleReset = () => {
    setFilters({
      name: undefined,
      sport_category: undefined,
      is_private: undefined,
      sort_by: "created_at",
      skip: 0,
      limit: 20,
    });
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
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onReset={handleReset}
        />

        {/* Loading State */}
        {isLoading && (
          <div className="text-center p-8">
            <p className="text-gray-500">{t("club.loading")}...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center p-8 bg-red-50 text-red-500 rounded-lg">
            <p>{t("club.errorLoadingClubs")}</p>
            <Button
              variant="outline"
              className="mt-2"
              onClick={() => refetch()}
            >
              {t("club.tryAgain")}
            </Button>
          </div>
        )}

        {/* No Results */}
        {!isLoading && !error && (!clubs || clubs.length === 0) && (
          <div className="text-center p-8 bg-white/80 rounded-lg shadow">
            <p>{t("club.noClubsMatchingFilters")}</p>
            <Button variant="outline" className="mt-2" onClick={handleReset}>
              {t("club.clearFilters")}
            </Button>
          </div>
        )}

        {/* Clubs Table */}
        {!isLoading && !error && clubs && clubs.length > 0 && (
          <ClubsTable clubs={clubs} user={currentUser!} />
        )}
      </div>
    </div>
  );
};

export default AllClubsWidget;
