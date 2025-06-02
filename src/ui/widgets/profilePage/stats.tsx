import type { UserFull } from "@/types/userTypes";
import { Card, CardTitle } from "@/ui/shadCN/card";
import { CardHeader, CardContent } from "@/ui/shadCN/card";
import { Star, Users, Target, Trophy } from "lucide-react";
import { useTranslation } from "react-i18next";
const Stats = ({ user }: { user: UserFull }) => {
  const { t } = useTranslation();

  const stats = [
    {
      icon: Star,
      label: t("profile.avgSkillRating"),
      value: user.avg_skill_rating || "N/A",
      color: "text-yellow-600",
      bg: "bg-yellow-50",
      border: "border-yellow-200",
    },
    {
      icon: Users,
      label: t("profile.totalGames"),
      value: user.total_games || 0,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-200",
    },
    {
      icon: Target,
      label: t("profile.totalGoals"),
      value: user.total_points || 0,
      color: "text-green-600",
      bg: "bg-green-50",
      border: "border-green-200",
    },
    {
      icon: Trophy,
      label: t("profile.totalAssists"),
      value: user.total_assists || 0,
      color: "text-purple-600",
      bg: "bg-purple-50",
      border: "border-purple-200",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
          <Trophy className="h-5 w-5 md:h-6 md:w-6 text-emerald-600" />
          {t("profile.statistics")}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${stat.bg} ${stat.border} transition-transform hover:scale-105`}
            >
              <div className="flex flex-col items-center text-center gap-2">
                <stat.icon className={`h-6 w-6 md:h-8 md:w-8 ${stat.color}`} />
                <div>
                  <p className="text-xs md:text-sm text-gray-600 font-medium">
                    {stat.label}
                  </p>
                  <p className="text-lg md:text-2xl font-bold text-gray-800">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Stats;
