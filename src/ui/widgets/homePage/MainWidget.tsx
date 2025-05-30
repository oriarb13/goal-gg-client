import clubChoice from "@/assets/images/clubChoice.png";
import fieldChoice from "@/assets/images/fieldChoice.png";
import { Card } from "@/ui/shadCN/card";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

const MainWidget = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [screenSize, setScreenSize] = useState("large");

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setScreenSize("small");
      } else if (width < 768) {
        setScreenSize("medium");
      } else {
        setScreenSize("large");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const isMobile = screenSize === "small" || screenSize === "medium";
  const isSmallMobile = screenSize === "small";

  return (
    <div className="relative flex flex-col md:flex-row w-full h-screen justify-center items-center md:space-y-0 md:space-x-15 p-0 md:p-4">
      {/* Club Choice Image */}
      <div className="w-full md:w-2/5 h-full md:h-3/5 flex justify-center items-center relative">
        <div className="relative w-full h-full md:aspect-[540/500] md:max-w-[800px] md:max-h-[1200px] z-10 group">
          <Image
            src={clubChoice}
            alt="club choice"
            fill
            className="object-cover"
          />
          <div
            onClick={() => router.push("/clubs")}
            className="absolute top-0 left-0 w-full h-full bg-black/30 hover:bg-black/50 transition-all duration-300 cursor-pointer flex items-center justify-center"
          >
            {!isMobile && (
              <h1 className="text-2xl lg:text-3xl xl:text-4xl mt-80 font-bold text-white drop-shadow-lg transform group-hover:scale-105 transition-transform duration-300 text-center px-4">
                {t("main.playWithYourFriends")}
              </h1>
            )}
          </div>
        </div>
      </div>

      {/* Field Choice Image */}
      <div className="w-full md:w-2/5 h-full md:h-3/5 flex justify-center items-center relative">
        <div className="relative w-full h-full md:aspect-[540/500] md:max-w-[800px] md:max-h-[1200px] z-10 group">
          <Image
            src={fieldChoice}
            alt="field choice"
            fill
            className="object-cover"
          />
          <div
            onClick={() => router.push("/fields")}
            className="absolute top-0 left-0 w-full h-full bg-black/40 hover:bg-black/60 transition-all duration-300 cursor-pointer flex items-center justify-center"
          >
            {!isMobile && (
              <h1 className="text-2xl lg:text-3xl xl:text-4xl mt-80 font-bold text-white drop-shadow-lg transform group-hover:scale-105 transition-transform duration-300 text-center px-4">
                {t("main.fieldChoice")}
              </h1>
            )}
          </div>
        </div>
      </div>

      {/* Center Card */}
      <Card
        className={`
        absolute 
        ${isMobile ? "top-1/2" : "top-1/3"}
        left-1/2
        transform
        -translate-x-1/2
        -translate-y-1/2
        w-4/5
        sm:w-3/4
        md:w-1/3
        lg:w-1/4 
        rounded-none 
        opacity-90
        z-10 
        bg-gradient-to-b 
        from-slate-200 
        via-slate-300 
        to-slate-400
        shadow-2xl
        ${isMobile ? "py-3 px-2" : "p-6"}
        ${isSmallMobile ? "max-h-[140px]" : ""}
      `}
      >
        <div className="flex flex-col items-center justify-center text-slate-900 h-full">
          <h1
            onClick={() => isMobile && router.push("/clubs")}
            className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-[0.2em] sm:tracking-[0.3em] md:tracking-[0.4em] lg:tracking-[0.6em] text-center ${
              isMobile
                ? "cursor-pointer hover:scale-105 transition-transform duration-300"
                : ""
            }`}
          >
            {t("main.friends")}
          </h1>
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-emerald-700 tracking-[0.05em] my-1 sm:my-2">
            {t("main.or")}
          </h1>
          <h1
            onClick={() => isMobile && router.push("/fields")}
            className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-[0.2em] sm:tracking-[0.25em] md:tracking-[0.3em] lg:tracking-[0.4em] text-center ${
              isMobile
                ? "cursor-pointer hover:scale-105 transition-transform duration-300"
                : ""
            }`}
          >
            {t("main.fields")}
          </h1>
          {!isMobile && (
            <>
              <p className="text-sm md:text-base lg:text-xl font-bold tracking-[0.05em] mt-6 md:mt-8 lg:mt-10 text-center">
                {t("index.description")}
              </p>
              <h1 className="text-xl md:text-2xl lg:text-4xl mt-4 md:mt-5 lg:mt-6 font-bold tracking-[0.3em] md:tracking-[0.4em] lg:tracking-[0.6em] text-emerald-900">
                GOAL GG
              </h1>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

export default MainWidget;
