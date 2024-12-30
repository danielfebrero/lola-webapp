import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en/en.json";
import fr from "./locales/fr/fr.json";

const resources = {
  en: {
    translation: en,
  },
  fr: {
    translation: fr,
  },
};

i18n
  .use(LanguageDetector) // Détecte la langue de l'utilisateur
  .use(initReactI18next) // Intègre i18n avec React
  .init({
    resources,
    fallbackLng: "en", // Langue par défaut si la détection échoue
    debug: false, // Désactivez en production
    interpolation: {
      escapeValue: false, // React se charge déjà de l'échappement
    },
  });

export default i18n;
