import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en/en.json";
import fr from "./locales/fr/fr.json";
import de from "./locales/de/de.json";
import es from "./locales/es/es.json";
import hi from "./locales/hi/hi.json";
import pt from "./locales/pt/pt.json";
import ru from "./locales/ru/ru.json";
import ar from "./locales/ar/ar.json";
import sv from "./locales/sv/sv.json";
import tr from "./locales/tr/tr.json";
import ja from "./locales/ja/ja.json";
import uk from "./locales/uk/uk.json";
import it from "./locales/it/it.json";

const resources = {
  en: {
    translation: en,
  },
  fr: {
    translation: fr,
  },
  de: {
    translation: de,
  },
  es: {
    translation: es,
  },
  hi: {
    translation: hi,
  },
  pt: {
    translation: pt,
  },
  ru: {
    translation: ru,
  },
  ar: {
    translation: ar,
  },
  sv: {
    translation: sv,
  },
  tr: {
    translation: tr,
  },
  ja: {
    translation: ja,
  },
  uk: {
    translation: uk,
  },
  it: {
    translation: it,
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
    detection: {
      order: ["navigator"],
    },
  });

export default i18n;
