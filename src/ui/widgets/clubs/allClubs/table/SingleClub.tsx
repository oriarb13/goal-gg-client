import { Card } from "@/ui/shadCN/card";
import { IClub, User } from "@/types/types";
import { Button } from "@/ui/shadCN/button";
import { ClubStatusEnum, SportCategoryEnum } from "@/types/enums";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/shadCN/avatar";
import { useTranslation } from "react-i18next";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { BasketballIcon } from "@/assets/icons/Basketball.icon";
import { FootballIcon } from "@/assets/icons/football.icon";
import {
  MapPinIcon,
  UsersIcon,
  InfoIcon,
  LogOutIcon,
  XIcon,
  UserPlusIcon,
} from "lucide-react";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { useEffect, useState, useMemo } from "react";

interface SingleClubProps {
  club: IClub;
  user: User;
}

const SingleClub = ({ club, user }: SingleClubProps) => {
  const { t } = useTranslation();
  const [userCoords, setUserCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [distance, setDistance] = useState<string | number>("לא צוין");
  const [isLoading, setIsLoading] = useState(true);

  // Determine the user's relationship with the club
  const clubRelationship = useMemo(() => {
    if (user?.clubs?.includes(club._id)) {
      return "member";
    } else if (user?.clubsRequests?.includes(club._id)) {
      return "pending";
    } else {
      return "none";
    }
  }, [user?.clubs, user?.clubsRequests, club._id]);

  // Get user location when component mounts
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setIsLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLoading(false);
        },
        { enableHighAccuracy: true }
      );
    } else {
      setIsLoading(false);
    }
  }, []);

  // Calculate distance when user coordinates are available
  useEffect(() => {
    if (userCoords && club?.location?.lat && club?.location?.lng) {
      // Haversine formula for more accurate distance calculation
      const calculateDistance = () => {
        const R = 6371; // Earth's radius in km
        const dLat = deg2rad(club.location?.lat - userCoords.lat);
        const dLon = deg2rad(club.location?.lng - userCoords.lng);
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(deg2rad(userCoords.lat)) *
            Math.cos(deg2rad(club.location?.lat)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Distance in km

        return distance.toFixed(1);
      };

      const deg2rad = (deg: number) => {
        return deg * (Math.PI / 180);
      };

      setDistance(calculateDistance());
    }
  }, [userCoords, club?.location?.lat, club?.location?.lng]);

  // Determine status text in Hebrew
  const getStatusText = () => {
    switch (club.status) {
      case ClubStatusEnum.ACTIVE:
        return t("club.active") || "פעיל";
      case ClubStatusEnum.INACTIVE:
        return t("club.inactive") || "לא פעיל";
      case ClubStatusEnum.FULL:
        return t("club.full") || "מלא";
      default:
        return club.status;
    }
  };

  // Render the appropriate action button based on the user's relationship with the club
  const renderActionButton = () => {
    switch (clubRelationship) {
      case "member":
        return (
          <Button
            className="bg-red-600 hover:bg-red-700 text-white px-4 rounded-full transition-all duration-300 transform hover:scale-105 flex items-center gap-1"
            onClick={() => console.log("Leave club", club._id)}
          >
            <LogOutIcon className="h-4 w-4" />
            {t("club.leave")}
          </Button>
        );
      case "pending":
        return (
          <Button
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 rounded-full transition-all duration-300 transform hover:scale-105 flex items-center gap-1"
            onClick={() => console.log("Cancel request", club._id)}
          >
            <XIcon className="h-4 w-4" />
            {t("club.cancelRequest")}
          </Button>
        );
      case "none":
        return (
          <Button
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 rounded-full transition-all duration-300 transform hover:scale-105 flex items-center gap-1"
            onClick={() => console.log("Join club", club._id)}
          >
            <UserPlusIcon className="h-4 w-4" />
            {t("club.join")}
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative mb-6">
      {/* Main Card with Gray Background */}
      <Card className="relative flex flex-row w-full p-6 bg-gray-800/70 shadow-lg overflow-hidden rounded-xl">
        {/* Centered White Card */}
        <Card className="w-full flex flex-row flex-wrap gap-4 justify-between items-center p-4 bg-white rounded-xl shadow-md mx-2">
          {/* Avatar and Club Name Section */}
          <div className="flex items-center gap-3">
            <div className="relative">
              {club.isPrivet && (
                <div className="absolute top-[-6px] right-[-10px] z-10 bg-yellow-500 text-xs text-white px-2 py-1 rounded-full">
                  {t("club.private")}
                </div>
              )}
              <Avatar className="h-14 w-14 bg-gray-100 border-2 border-emerald-500">
                <AvatarImage src={club.image || ""} />
                <AvatarFallback className="text-lg font-bold text-gray-700">
                  {club.name.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="flex flex-col">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex flex-row items-center cursor-pointer group text-gray-900">
                    <h2 className="text-lg font-bold mr-1">{club.name}</h2>
                    <InfoIcon className="h-4 w-4 text-emerald-600 opacity-70 group-hover:opacity-100" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <div className="flex flex-col gap-2 text-black bg-white p-3 rounded-md justify-center items-center shadow-md">
                      <div className="flex items-center gap-1 text-md font-bold text-emerald-700">
                        {t("club.description")}
                      </div>
                      <p className="text-sm text-gray-700 max-w-md">
                        {club.description}
                      </p>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Sport Type */}
          <div className="flex items-center gap-2">
            {club.sportCategory === SportCategoryEnum.FOOTBALL ? (
              <div className="bg-emerald-100 p-2 rounded-full flex items-center justify-center">
                <FootballIcon />
              </div>
            ) : (
              <div className="bg-orange-100 p-2 rounded-full flex items-center justify-center">
                <BasketballIcon />
              </div>
            )}
            <span className="text-sm font-medium text-gray-800">
              {club.sportCategory === SportCategoryEnum.FOOTBALL
                ? t("club.football")
                : t("club.basketball")}
            </span>
          </div>

          {/* Location and Distance */}
          <div className="flex items-center gap-2">
            <div className="bg-purple-100 p-2 rounded-full flex items-center justify-center">
              <MapPinIcon className="h-5 w-5 text-purple-700" />
            </div>
            <div className="text-sm">
              <div>
                <span className="font-medium">
                  {club?.location?.city || t("club.notSpecified")}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                {isLoading ? (
                  <span>{t("club.calculatingDistance")}...</span>
                ) : (
                  <span>
                    {typeof distance === "number" || !isNaN(Number(distance))
                      ? `${distance} ${t("club.km")}`
                      : t("club.unknownDistance")}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Status */}
          <div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                club.status === ClubStatusEnum.ACTIVE
                  ? "bg-green-100 text-green-800"
                  : club.status === ClubStatusEnum.INACTIVE
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {getStatusText()}
            </span>
          </div>

          {/* Members Count */}
          <div className="flex items-center gap-2">
            <div className="bg-blue-100 p-2 rounded-full flex items-center justify-center">
              <UsersIcon className="h-5 w-5 text-blue-700" />
            </div>
            <span className="text-sm">
              <span className="font-medium">{club?.members?.length || 0}</span>
              <span className="text-gray-500">/{club.maxPlayers}</span>
            </span>
          </div>

          {/* Dynamic Action Button */}
          {renderActionButton()}
        </Card>
      </Card>
    </div>
  );
};

export default SingleClub;
