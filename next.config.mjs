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
    localeDetection: false,
  },

  async rewrites() {
    return [
      {
        source: "/robots.txt",
        destination: "/api/robots",
      },
    ];
  },
};

export default nextConfig;
