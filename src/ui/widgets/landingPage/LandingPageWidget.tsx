import { useTranslation } from "react-i18next";
import friendsImage from "@/assets/images/friends.png";
import friendsbasketballImage from "@/assets/images/friendsbasketball.png";

import { Card } from "@/ui/shadCN/card";
const LandingPageWidget = () => {
  const { t } = useTranslation();

  return (
    <div className="relative h-screen w-full flex items-center justify-center">
      <img
        src={friendsImage}
        alt="Friends"
        className="opacity-90 absolute top-1/9 left-10 object-cover z-0 w-[40%] h-[90%]  hidden  md:block"
      />
      <img
        src={friendsbasketballImage}
        alt="Friends Basketball"
        className="opacity-60 right-6 absolute bottom-20 object-cover z-1 w-[60%] h-[75%] hidden md:block "
      />

      <Card className="w-[90%] md:w-[70%] lg:w-[30%] h-[70%] md:h-[70%] lg:h-[70%] rounded-none absolute opacity-85 top-1/2 left-1/2 md:left-2/5 transform -translate-y-1/2 -translate-x-1/2 z-10 bg-[linear-gradient(168deg,#D6CE15_0%,#D6CE15_30%,#A4A71E_50%,#53900F_80%,#1F6521_100%)]">
        <div className="z-10 flex flex-col items-center justify-center text-slate-200 h-full p-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold tracking-widest break-words w-full">
            {t("index.friendly")}
          </h1>
          <h1 className="text-2xl md:text-3xl font-bold text-primary tracking-wider">
            &
          </h1>
          <h1 className="text-3xl md:text-4xl font-bold tracking-widest break-words w-full">
            {t("index.professional")}
          </h1>
          <p className="text-base md:text-xl font-bold tracking-wider mt-4 md:mt-10 break-words w-full px-4">
            {t("index.description")}
          </p>
          <h1 className="text-3xl md:text-4xl mt-4 md:mt-6 font-bold tracking-widest">
            GOAL GG
          </h1>
        </div>
      </Card>
    </div>
  );
};

export default LandingPageWidget;
