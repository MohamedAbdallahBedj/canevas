import { Suspense } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpApi from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import theme from "./theme/theme.jsx";
import { ThemeProvider } from "@mui/material";
import Loading from "./components/Loading/Loading.jsx";
import { ToastContainer } from "react-toastify";

// Create rtl cache
const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

i18n
  .use(HttpApi)
  .use(initReactI18next) // passes i18n down to react-i18next
  .use(LanguageDetector)

  .init({
    supportedLngs: ["ar", "fr"],
    fallbackLng: "ar",
    debug: false,
    // Options for language detector
    detection: {
      order: ["localStorage", "htmlTag"],
      caches: ["localStorage"],
    },
    backend: {
      loadPath: "/Translations/{{lng}}.json",
    },
    interpolation: {
      escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    },
  });

document.body.dir = theme.direction;
const is_rtl =
  localStorage.getItem("i18nextLng") === "ar" ||
  !localStorage.getItem("i18nextLng");

ReactDOM.createRoot(document.getElementById("root")).render(
  <Suspense fallback={<Loading />}>
    <ThemeProvider theme={theme}>
      {is_rtl ? (
        <CacheProvider value={cacheRtl}>
          <App />
        </CacheProvider>
      ) : (
        <App />
      )}
      <ToastContainer
        toastStyle={{
          fontSize: "14px",
          fontFamily: theme.typography.fontFamily,
        }}
        position={is_rtl ? "bottom-left" : "bottom-right"}
        rtl={is_rtl}
      />
    </ThemeProvider>
  </Suspense>
);
