import { useTranslation } from "react-i18next";
import friendsImage from "@/assets/images/friends.png";
import friendsbasketballImage from "@/assets/images/friendsbasketball.png";

import { Card } from "@/ui/shadCN/card";
const LandingPageWidget = () => {
  const { t } = useTranslation();

  return (
    <div className="relative h-screen w-full">
      <img
        src={friendsImage}
        alt="Friends"
        width={540}
        height={500}
        className="opacity-90 absolute top-10 left-20 object-cover z-0"
      />
      <img
        src={friendsbasketballImage}
        alt="Friends Basketball"
        width={880}
        height={800}
        className="opacity-60 absolute bottom-40 right-0 object-cover z-0"
      />

      <Card className="w-1/4 h-3/5 rounded-none absolute opacity-85 top-66 left-130 z-10 bg-[linear-gradient(168deg,#D6CE15_0%,#D6CE15_30%,#A4A71E_50%,#53900F_80%,#1F6521_100%)]">
        <div className="flex flex-col items-center text-slate-200 h-full mt-34">
          <h1 className=" text-4xl font-bold tracking-[0.6em] ">
            {t("index.friendly")}
          </h1>
          <h1 className=" text-3xl font-bold text-primary tracking-[0.05em] ">
            &
          </h1>
          <h1 className=" text-4xl font-bold tracking-[0.4em] ">
            {t("index.professional")}
          </h1>
          <p className=" text-xl font-bold  tracking-[0.05em] mt-10">
            {t("index.description")}
          </p>
          <h1 className=" text-4xl mt-6 font-bold t tracking-[0.6em]">
            GOAL GG
          </h1>
        </div>
      </Card>
      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        {/* <h1 className="text-grey text-4xl font-bold">{t("index.title")}</h1> */}
      </div>
    </div>
  );
};

export default LandingPageWidget;
