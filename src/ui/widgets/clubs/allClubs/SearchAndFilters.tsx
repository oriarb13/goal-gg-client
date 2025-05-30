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
  CheckSquare,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/ui/shadCN/dropdown-menu";
import { Input } from "@/ui/shadCN/input";
import { Label } from "@/ui/shadCN/label";
import { Checkbox } from "@/ui/shadCN/checkbox";
import { SearchType, ClubFilters, SortOption } from "./useClubs";

interface SearchAndFiltersProps {
  onSearchChange: (text: string, type: SearchType) => void;
  onFiltersChange: (filters: Partial<ClubFilters>) => void;
  onSortChange: (option: SortOption) => void;
  onReset: () => void;
  search: { text: string; type: SearchType };
  filters: ClubFilters;
  sortBy: SortOption;
}

const SearchAndFilters = ({
  onSearchChange,
  onFiltersChange,
  onSortChange,
  onReset,
  search,
  filters,
  sortBy,
}: SearchAndFiltersProps) => {
  const { t } = useTranslation();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value, search.type);
  };

  // Handle search type change
  const handleSearchTypeChange = (type: SearchType) => {
    onSearchChange(search.text, type);
  };

  // Toggle filters visibility
  const toggleFilters = () => {
    setIsFiltersOpen(!isFiltersOpen);
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
              placeholder={
                search.type === "id"
                  ? t("club.searchById")
                  : t("club.searchByName")
              }
              className="pl-10 pr-20 py-2 w-full"
              value={search.text}
              onChange={handleSearchChange}
            />
            <div className="absolute inset-y-0 right-0 flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-8 px-2 text-sm text-gray-500"
                  >
                    {search.type === "id" ? t("club.byId") : t("club.byName")}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem
                    onClick={() => handleSearchTypeChange("name")}
                  >
                    {t("club.byName")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleSearchTypeChange("id")}
                  >
                    {t("club.byId")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
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

          {/* Sort Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <SortDesc className="h-4 w-4" />
                {t("club.sortBy")}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                className={sortBy === "distance" ? "bg-gray-100" : ""}
                onClick={() => onSortChange("distance")}
              >
                <MapPin className="h-4 w-4 mr-2" />
                {t("club.byDistance")}
              </DropdownMenuItem>
              <DropdownMenuItem
                className={sortBy === "createdAt" ? "bg-gray-100" : ""}
                onClick={() => onSortChange("createdAt")}
              >
                <Calendar className="h-4 w-4 mr-2" />
                {t("club.byCreationDate")}
              </DropdownMenuItem>
              <DropdownMenuItem
                className={sortBy === "name" ? "bg-gray-100" : ""}
                onClick={() => onSortChange("name")}
              >
                <AlignLeft className="h-4 w-4 mr-2" />
                {t("club.byName")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Reset Button */}
          <Button variant="ghost" onClick={onReset} className="gap-2">
            <X className="h-4 w-4" />
            {t("club.reset")}
          </Button>
        </div>

        {/* Filters Section (Collapsible) */}
        {isFiltersOpen && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2 p-3 bg-gray-50 rounded-lg">
            {/* Private Club Filter */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isPrivate"
                checked={filters.isPrivate}
                onCheckedChange={(checked) =>
                  onFiltersChange({ isPrivate: checked as boolean })
                }
              />
              <Label htmlFor="isPrivate" className="cursor-pointer">
                {t("club.privateOnly")}
              </Label>
            </div>

            {/* Max Players Filter */}
            <div>
              <Label
                htmlFor="maxPlayers"
                className="block mb-1 text-sm font-medium"
              >
                {t("club.maxPlayers")}
              </Label>
              <Select
                value={filters.maxPlayers?.toString() || ""}
                onValueChange={(value) =>
                  onFiltersChange({
                    maxPlayers: value ? parseInt(value) : undefined,
                  })
                }
              >
                <SelectTrigger id="maxPlayers" className="w-full">
                  <SelectValue placeholder={t("club.selectMaxPlayers")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="">{t("club.any")}</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Max Distance Filter */}
            <div>
              <Label
                htmlFor="maxDistance"
                className="block mb-1 text-sm font-medium"
              >
                {t("club.maxDistance")}
              </Label>
              <Select
                value={filters.maxDistance?.toString() || ""}
                onValueChange={(value) =>
                  onFiltersChange({
                    maxDistance: value ? parseInt(value) : undefined,
                  })
                }
              >
                <SelectTrigger id="maxDistance" className="w-full">
                  <SelectValue placeholder={t("club.selectMaxDistance")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="">{t("club.any")}</SelectItem>
                    <SelectItem value="5">5 {t("club.km")}</SelectItem>
                    <SelectItem value="10">10 {t("club.km")}</SelectItem>
                    <SelectItem value="20">20 {t("club.km")}</SelectItem>
                    <SelectItem value="50">50 {t("club.km")}</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
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
                value={filters.sportCategory || ""}
                onValueChange={(value) =>
                  onFiltersChange({ sportCategory: value || undefined })
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
