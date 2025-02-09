import { useTranslation } from "react-i18next";

const Footer: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="w-full text-center whitespace-nowrap overflow-y-scroll no-scrollbar">
      {t("Fabularius is a storyteller. Everything is fictional.")}
    </div>
  );
};

export default Footer;
