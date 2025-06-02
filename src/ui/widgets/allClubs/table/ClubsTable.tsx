import { type ClubFull } from "@/types/clubTypes";
import { type UserFull } from "@/types/userTypes";
import { useTranslation } from "react-i18next";
import { Card } from "@/ui/shadCN/card";
import {
  MapPinIcon,
  UsersIcon,
  InfoIcon,
  ShieldIcon,
  ArrowRightIcon,
} from "lucide-react";
import { FootballIcon } from "@/assets/icons/football.icon";
import SingleClub from "./SingleClub";

interface ClubsTableProps {
  clubs: ClubFull[];
  user: UserFull;
}

const ClubsTable = ({ clubs, user }: ClubsTableProps) => {
  const { t } = useTranslation();
  console.log(clubs);
  console.log(user);

  return (
    <>
      {/* Column Headers */}
      <div className="relative mb-6 px-2">
        <Card className="w-full max-w-[1100px] flex flex-row flex-wrap gap-4 justify-between items-center p-8 bg-gray-800 rounded-xl shadow-md mx-2 text-white">
          {/* Club Image & Name */}
          <div className="flex items-center gap-3 w-60">
            <div className="flex items-center justify-center h-9 w-9 bg-gray-700 rounded-full">
              <InfoIcon className="h-5 w-5 text-gray-400" />
            </div>
            <span className="font-medium">{t("club.clubDetails")}</span>
          </div>

          {/* Sport Type */}
          <div className="flex items-center gap-2 w-28">
            <div className="flex items-center justify-center h-9 w-9 bg-gray-700 rounded-full">
              <FootballIcon />
            </div>
            <span className="font-medium">{t("club.sport")}</span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 w-40">
            <div className="flex items-center justify-center h-9 w-9 bg-gray-700 rounded-full">
              <MapPinIcon className="h-5 w-5 text-gray-400" />
            </div>
            <span className="font-medium">{t("club.location")}</span>
          </div>

          {/* Status */}
          <div className="flex items-center gap-2 w-24">
            <div className="flex items-center justify-center h-9 w-9 bg-gray-700 rounded-full">
              <ShieldIcon className="h-5 w-5 text-gray-400" />
            </div>
            <span className="font-medium">{t("club.status")}</span>
          </div>

          {/* Members */}
          <div className="flex items-center gap-2 w-24">
            <div className="flex items-center justify-center h-9 w-9 bg-gray-700 rounded-full">
              <UsersIcon className="h-5 w-5 text-gray-400" />
            </div>
            <span className="font-medium">{t("club.members")}</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 w-28">
            <div className="flex items-center justify-center h-9 w-9 bg-gray-700 rounded-full">
              <ArrowRightIcon className="h-5 w-5 text-gray-400" />
            </div>
            <span className="font-medium">{t("club.actions")}</span>
          </div>
        </Card>
      </div>

      {/* Club List */}
      <div className="space-y-4 w-full max-h-[60vh] overflow-y-auto">
        {clubs.length > 0 ? (
          clubs.map((club) => (
            <SingleClub key={club.id} club={club} user={user} />
          ))
        ) : (
          <div className="text-center p-8 bg-white/80 rounded-lg shadow">
            <p>{t("club.noClubsFound")}</p>
          </div>
        )}
      </div>
    </>
  );
};

export default ClubsTable;
