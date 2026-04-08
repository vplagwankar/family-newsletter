import { createContext, useState, useEffect } from 'react'
import { storageService } from '../services/storageService.js'
import i18n from '../i18n/i18n.js'

export const LanguageContext = createContext(null)

const LANG_KEY = 'family_lang'

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => storageService.get(LANG_KEY, 'en'))

  // Sync i18n and <html lang> on mount and whenever lang changes
  useEffect(() => {
    i18n.changeLanguage(lang)
    document.documentElement.lang = lang
  }, [lang])

  const toggleLang = () => {
    const next = lang === 'en' ? 'kn' : 'en'
    setLang(next)
    storageService.set(LANG_KEY, next)
  }

  return (
    <LanguageContext.Provider value={{ lang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  )
}
