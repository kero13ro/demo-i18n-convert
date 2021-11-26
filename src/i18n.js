import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationEN from './locale/en/common.json';
import translationTW from './locale/tw/common.json';

i18n
.use(initReactI18next)
.init({
  lng: 'en',
  debug: true,
  resources: {
    en: { translation: translationEN },
    tw: { translation: translationTW }
  }
});

export default i18n;
