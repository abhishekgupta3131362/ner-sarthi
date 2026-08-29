
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import hi from "./locales/hi.json";
import as from "./locales/as.json";
import bn from "./locales/bn.json";
import brx from "./locales/brx.json";
import mni from "./locales/mni.json";
import kha from "./locales/kha.json";
import garo from "./locales/garo.json";
import mizo from "./locales/mizo.json";
import ne from "./locales/ne.json";
import kok from "./locales/kok.json";

const resources = {
  en: {
    translation: en,
  },

  hi: {
    translation: hi,
  },

  as: {
    translation: as,
  },

  bn: {
    translation: bn,
  },

  brx: {
    translation: brx,
  },

  mni: {
    translation: mni,
  },

  kha: {
    translation: kha,
  },

  garo: {
    translation: garo,
  },

  mizo: {
    translation: mizo,
  },

  ne: {
    translation: ne,
  },

  kok: {
    translation: kok,
  },
};

const savedLanguage =
  localStorage.getItem("language") || "en";

i18n
  .use(initReactI18next)
  .init({
    resources,

    lng: savedLanguage,

    fallbackLng: "en",

    interpolation: {
      escapeValue: false,
    },

    returnEmptyString: false,

    debug: false,
  });

export default i18n;