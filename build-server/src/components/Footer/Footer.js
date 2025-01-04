import { jsx as _jsx } from "react/jsx-runtime";
import { useTranslation } from "react-i18next";
const Footer = () => {
    const { t } = useTranslation();
    return (_jsx("div", { className: "w-full text-center", children: t("Lola is a storyteller. Everything is fictive.") }));
};
export default Footer;
