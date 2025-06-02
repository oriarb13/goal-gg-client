import { CardHeader, CardTitle, CardContent } from "@/ui/shadCN/card";
import { useTranslation } from "react-i18next";
import { Card } from "@/ui/shadCN/card";
import type { UserFull } from "@/types/userTypes";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/shadCN/avatar";
import { Phone, Mail } from "lucide-react";

// Profile Component
const Profile = ({ user }: { user: UserFull }) => {
  const { t } = useTranslation();

  const roleDesignation = () => {
    switch (user.role.id) {
      case 10:
        return (
          <div className="absolute -top-2 -right-2 px-2 py-1 rounded-full bg-gray-200 text-black text-xs font-medium">
            {t("profile.user")}
          </div>
        );
      case 2:
        return (
          <div className="absolute -top-2 -right-2 px-2 py-1 rounded-full bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 text-gray-800 text-xs font-medium shadow-md">
            {t("profile.silver")}
          </div>
        );
      case 3:
        return (
          <div className="absolute -top-2 -right-2 px-2 py-1 rounded-full bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-300 text-yellow-900 text-xs font-medium shadow-md">
            {t("profile.gold")}
          </div>
        );
      case 1:
        return (
          <div className="absolute -top-2 -right-2 px-2 py-1 rounded-full bg-gradient-to-r from-amber-300 via-yellow-500 to-amber-400 text-amber-900 text-xs font-medium shadow-lg border border-yellow-400 animate-pulse">
            {t("profile.platinum")}
          </div>
        );
      case 5:
        return (
          <div className="absolute -top-2 -right-2 px-2 py-1 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 via-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 text-white text-xs font-bold shadow-lg animate-pulse">
            {t("profile.superAdmin")}
          </div>
        );
      default:
        return (
          <div className="absolute -top-2 -right-2 px-2 py-1 rounded-full bg-gray-200 text-black text-xs font-medium">
            {t("profile.user")}
          </div>
        );
    }
  };

  return (
    <Card className="relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-teal-500 to-blue-600 opacity-10" />

      <CardHeader className="relative z-10 pb-6">
        <CardTitle className="flex flex-col items-center gap-4">
          <div className="relative">
            <Avatar className="h-20 w-20 md:h-24 md:w-24 bg-gray-100 border-4 border-white shadow-lg">
              <AvatarImage src={user.image} className="object-cover" />
              <AvatarFallback className="text-xl md:text-2xl font-bold text-gray-700 bg-gradient-to-br from-emerald-100 to-teal-100">
                {user.first_name.charAt(0)}
                {user.last_name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {roleDesignation()}
          </div>

          <div className="text-center">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">
              {user.first_name} {user.last_name}
            </h1>
            <p className="text-sm md:text-base text-gray-600 mt-1">
              {t("profile.memberSince")} {new Date().getFullYear()}
            </p>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="relative z-10 pt-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg border border-gray-100">
            <Phone className="h-5 w-5 text-emerald-600 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                {t("profile.phone")}
              </p>
              <p className="text-sm font-semibold text-gray-800 truncate">
                {user.phone.prefix}-{user.phone.number}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg border border-gray-100">
            <Mail className="h-5 w-5 text-blue-600 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                {t("profile.email")}
              </p>
              <p className="text-sm font-semibold text-gray-800 truncate">
                {user.email}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Profile;
