import { selectCurrentUser } from "@/store/slices/userSlice";
import { useSelector } from "react-redux";
import Profile from "./profile";
import Stats from "./stats";
import { Card } from "@/ui/shadCN/card";
import { useTranslation } from "react-i18next";
import { Users } from "lucide-react";
const ProfilePageWidget = () => {
  const { t } = useTranslation();
  const user = useSelector(selectCurrentUser);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center mt-20">
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center">
              <Users className="h-8 w-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {t("profile.userNotFound")}
            </h2>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center justify-center mt-10">
      {/* Profile Content */}
      {/* Profile Card - Takes full width on mobile, 2/3 on desktop */}
      <div className="lg:col-span-2">
        <Profile user={user!} />
      </div>

      {/* Stats Card - Takes full width on mobile, 1/3 on desktop */}
      <div className="lg:col-span-1">
        <Stats user={user!} />
      </div>

      {/* Additional Actions */}
      <div className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <button className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
          {t("profile.editProfile")}
        </button>
        <button className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
          {t("profile.settings")}
        </button>
      </div>
    </div>
  );
};

export default ProfilePageWidget;
