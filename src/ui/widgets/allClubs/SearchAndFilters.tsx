import { useState } from "react";
import { useTranslation } from "react-i18next";
import { SportCategoryEnum } from "@/types/enums";
import { Card } from "@/ui/shadCN/card";
import { Button } from "@/ui/shadCN/button";
import {
  Search,
  Filter,
  SortDesc,
  X,
  MapPin,
  Users,
  Calendar,
  AlignLeft,
  Check,
  Globe,
  Lock,
  ChevronDown,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/shadCN/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/ui/shadCN/dropdown-menu";
import { Input } from "@/ui/shadCN/input";
import { Label } from "@/ui/shadCN/label";
import { type ClubSearchFilters } from "@/types/clubTypes";

interface SearchAndFiltersProps {
  filters: ClubSearchFilters;
  onFiltersChange: (filters: Partial<ClubSearchFilters>) => void;
  onReset: () => void;
}

const SearchAndFilters = ({
  filters,
  onFiltersChange,
  onReset,
}: SearchAndFiltersProps) => {
  const { t } = useTranslation();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ name: e.target.value || undefined });
  };

  // Toggle filters visibility
  const toggleFilters = () => {
    setIsFiltersOpen(!isFiltersOpen);
  };

  // Handle sort change
  const handleSortChange = (sort_by: ClubSearchFilters["sort_by"]) => {
    onFiltersChange({ sort_by });
  };

  return (
    <Card className="p-4 mb-6 bg-white shadow-md rounded-xl">
      <div className="flex flex-col gap-4">
        {/* Search Section */}
        <div className="flex gap-2 items-center">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder={t("club.searchByName")}
              className="pl-10 py-2 w-full"
              value={filters.name || ""}
              onChange={handleSearchChange}
            />
          </div>

          {/* Filter Button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-48 justify-between">
                <span>{t("club.filters")}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
              <DropdownMenuLabel>{t("club.filterOptions")}</DropdownMenuLabel>
              <DropdownMenuSeparator />

              {/* Private Club Filter */}
              <DropdownMenuLabel className="text-xs text-gray-500">
                {t("club.clubType")}
              </DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => onFiltersChange({ is_private: undefined })}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  {t("club.any")}
                </div>
                {filters.is_private === undefined && (
                  <Check className="h-4 w-4" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onFiltersChange({ is_private: false })}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  {t("club.publicOnly")}
                </div>
                {filters.is_private === false && <Check className="h-4 w-4" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onFiltersChange({ is_private: true })}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  {t("club.privateOnly")}
                </div>
                {filters.is_private === true && <Check className="h-4 w-4" />}
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {/* Sport Category Filter */}
              <DropdownMenuLabel className="text-xs text-gray-500">
                {t("club.sportCategory")}
              </DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => onFiltersChange({ sport_category: undefined })}
                className="flex items-center justify-between"
              >
                <span>{t("club.any")}</span>
                {filters.sport_category === undefined && (
                  <Check className="h-4 w-4" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  onFiltersChange({
                    sport_category: SportCategoryEnum.FOOTBALL,
                  })
                }
                className="flex items-center justify-between"
              >
                <span>{t("club.football")}</span>
                {filters.sport_category === SportCategoryEnum.FOOTBALL && (
                  <Check className="h-4 w-4" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  onFiltersChange({
                    sport_category: SportCategoryEnum.BASKETBALL,
                  })
                }
                className="flex items-center justify-between"
              >
                <span>{t("club.basketball")}</span>
                {filters.sport_category === SportCategoryEnum.BASKETBALL && (
                  <Check className="h-4 w-4" />
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Sort Select */}
          <Select
            value={filters.sort_by || "created_at"}
            onValueChange={(value) =>
              handleSortChange(value as ClubSearchFilters["sort_by"])
            }
          >
            <SelectTrigger className="w-48">
              <SortDesc className="h-4 w-4 mr-2" />
              <SelectValue placeholder={t("club.sortBy")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="distance">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  {t("club.byDistance")}
                </div>
              </SelectItem>
              <SelectItem value="created_at">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  {t("club.byCreationDate")}
                </div>
              </SelectItem>
              <SelectItem value="name">
                <div className="flex items-center">
                  <AlignLeft className="h-4 w-4 mr-2" />
                  {t("club.byName")}
                </div>
              </SelectItem>
              <SelectItem value="members_count">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  {t("club.byMembersCount")}
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Reset Button */}
          <Button variant="ghost" onClick={onReset} className="gap-2">
            <X className="h-4 w-4" />
            {t("club.reset")}
          </Button>
        </div>

        {/* Filters Section (Collapsible) */}
        {isFiltersOpen && (
          <div className="mt-2 p-3 bg-gray-50 rounded-lg"></div>
        )}
      </div>
    </Card>
  );
};

export default SearchAndFilters;
