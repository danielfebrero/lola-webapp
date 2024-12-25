import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguageDetector) // Détecte la langue de l'utilisateur
  .use(initReactI18next) // Intègre i18n avec React
  .init({
    fallbackLng: "en", // Langue par défaut si la détection échoue
    debug: true, // Désactivez en production
    interpolation: {
      escapeValue: false, // React se charge déjà de l'échappement
    },
  });

export default i18n;
