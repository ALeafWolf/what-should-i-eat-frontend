import process from "node:process";
import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2026-04-01",
  devtools: { enabled: true },
  modules: ["@nuxtjs/i18n"],
  css: ["~/assets/css/main.css"],
  vite: {
    optimizeDeps: {
      include: [
        "lucide-vue-next",
        ...(process.env.NODE_ENV === "development"
          ? ["@vue/devtools-core", "@vue/devtools-kit"]
          : []),
      ],
    },
    plugins: [tailwindcss()],
  },
  nitro: {
    devProxy: {
      "/api": { target: "http://localhost:3001/api", changeOrigin: true },
    },
  },
  i18n: {
    locales: [
      { code: "en", language: "en-US", file: "en.json" },
      { code: "zh", language: "zh-CN", file: "zh.json" },
    ],
    defaultLocale: "en",
    langDir: "locales/",
    strategy: "no_prefix",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_locale",
      redirectOn: "root",
      fallbackLocale: "en",
    },
  },
});
