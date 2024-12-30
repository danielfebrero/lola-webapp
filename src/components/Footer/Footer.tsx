import { useTranslation } from "react-i18next";

const Footer: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="w-full text-center">
      {t("Lola is a storyteller. Everything is fictive.")}
    </div>
  );
};

export default Footer;
