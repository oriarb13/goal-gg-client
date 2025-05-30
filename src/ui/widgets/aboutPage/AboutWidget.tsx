import { useTranslation } from "react-i18next";
export default function AboutWidget() {
  const { t } = useTranslation();
  return (
    <div className="relative min-h-screen w-full">
      {/* Main content container */}
      <div className="max-w-6xl mx-auto pt-16 px-6 pb-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-pgreendarker mb-4">
            {t("about.title")}
          </h1>
          <div className="w-40 h-1 bg-pgreendarker mx-auto"></div>
        </div>

        {/* Content cards - Responsive grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto max-h-[65vh] pr-2 md:pr-0 lg:overflow-y-hidden overflow-x-hidden">
          {/* Card 1 */}
          <div className="bg-white bg-opacity-80 rounded-lg shadow-lg overflow-hidden text-center transform transition duration-300 hover:scale-105">
            <div className="h-3 bg-plime-dark"></div>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-plime mb-4">
                {t("about.whoWeAre.title")}
              </h2>
              <p className="text-gray-700">{t("about.whoWeAre.content")}</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white bg-opacity-80 rounded-lg shadow-lg overflow-hidden text-center transform transition duration-300 hover:scale-105">
            <div className="h-3 bg-plime-dark"></div>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-plime mb-4">
                {t("about.ourVision.title")}
              </h2>
              <p className="text-gray-700">{t("about.ourVision.content")}</p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white bg-opacity-80 rounded-lg shadow-lg overflow-hidden text-center transform transition duration-300 hover:scale-105">
            <div className="h-3 bg-plime-dark"></div>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-plime mb-4">
                {t("about.ourAchievements.title")}
              </h2>
              <p className="text-gray-700">
                {t("about.ourAchievements.content")}
              </p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white bg-opacity-80 rounded-lg shadow-lg text-center overflow-hidden transform transition duration-300 hover:scale-105">
            <div className="h-3 bg-plime-dark"></div>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-plime mb-4">
                {t("about.joinUs.title")}
              </h2>
              <p className="text-gray-700">{t("about.joinUs.content")}</p>
            </div>
          </div>

          {/* Card 5 */}
          <div className="bg-white bg-opacity-80 rounded-lg shadow-lg text-center overflow-hidden transform transition duration-300 hover:scale-105">
            <div className="h-3 bg-plime-dark"></div>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-plime mb-4">
                {t("about.ourValues.title")}
              </h2>
              <p className="text-gray-700">{t("about.ourValues.content")}</p>
            </div>
          </div>

          {/* Card 6 */}
          <div className="bg-white bg-opacity-80 rounded-lg shadow-lg text-center overflow-hidden transform transition duration-300 hover:scale-105">
            <div className="h-3 bg-plime-dark"></div>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-plime mb-4">
                {t("about.community.title")}
              </h2>
              <p className="text-gray-700">{t("about.community.content")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
