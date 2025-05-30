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
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/shadCN/select";
import { Input } from "@/ui/shadCN/input";
import { Label } from "@/ui/shadCN/label";
import { Checkbox } from "@/ui/shadCN/checkbox";
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
          <Button
            variant={isFiltersOpen ? "default" : "outline"}
            className="gap-2"
            onClick={toggleFilters}
          >
            <Filter className="h-4 w-4" />
            {t("club.filters")}
          </Button>

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 p-3 bg-gray-50 rounded-lg">
            {/* Private Club Filter */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isPrivate"
                checked={filters.is_private || false}
                onCheckedChange={(checked) =>
                  onFiltersChange({ is_private: checked as boolean })
                }
              />
              <Label htmlFor="isPrivate" className="cursor-pointer">
                {t("club.privateOnly")}
              </Label>
            </div>

            {/* Sport Category Filter */}
            <div>
              <Label
                htmlFor="sportCategory"
                className="block mb-1 text-sm font-medium"
              >
                {t("club.sportCategory")}
              </Label>
              <Select
                value={filters.sport_category || ""}
                onValueChange={(value) =>
                  onFiltersChange({
                    sport_category: (value as SportCategoryEnum) || undefined,
                  })
                }
              >
                <SelectTrigger id="sportCategory" className="w-full">
                  <SelectValue placeholder={t("club.selectSport")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="">{t("club.any")}</SelectItem>
                    <SelectItem value={SportCategoryEnum.FOOTBALL}>
                      {t("club.football")}
                    </SelectItem>
                    <SelectItem value={SportCategoryEnum.BASKETBALL}>
                      {t("club.basketball")}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default SearchAndFilters;
