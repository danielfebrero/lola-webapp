/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: [
      "ar",
      "de",
      "en",
      "es",
      "fr",
      "hi",
      "ja",
      "pt",
      "ru",
      "sv",
      "tr",
      "uk",
    ],
    defaultLocale: "en",
    localeDetection: true,
  },
};

export default nextConfig;
