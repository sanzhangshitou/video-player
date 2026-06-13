import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'react-native-localize';
import { en, zhHans, zhHant, ja, ko } from './resources';

const resources = {
  en: { translation: en },
  'zh-Hans': { translation: zhHans },
  'zh-Hant': { translation: zhHant },
  ja: { translation: ja },
  ko: { translation: ko },
};

function getBestLanguage(): string {
  try {
    const locales = getLocales();
    for (const locale of locales) {
      const tag = locale.languageTag;
      if (tag in resources) {
        return tag;
      }
      const lang = locale.languageCode;
      if (lang === 'zh') {
        return locale.languageTag.includes('Hant') ? 'zh-Hant' : 'zh-Hans';
      }
      if (lang in resources) {
        return lang;
      }
    }
  } catch (e) {
    console.warn('[i18n] Failed to detect device language, falling back to en:', e);
  }
  return 'en';
}

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  resources,
  lng: getBestLanguage(),
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

export default i18n;
