import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './languages/en.json'
import es from './languages/es.json'

const languages = ['en', 'es']

i18n
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    debug: true,
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: {
      en,
      es,
    },
  })

export { i18n, languages }
