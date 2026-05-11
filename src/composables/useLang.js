import { ref } from 'vue'
import en from '../i18n/en.js'
import bn from '../i18n/bn.js'

const lang = ref(localStorage.getItem('gpc-lang') || 'en')
const dicts = { en, bn }

export function useLang() {
  function t(key) {
    const parts = key.split('.')
    let v = dicts[lang.value]
    for (const p of parts) v = v?.[p]
    return v ?? key
  }
  function toggleLang() {
    lang.value = lang.value === 'en' ? 'bn' : 'en'
    localStorage.setItem('gpc-lang', lang.value)
  }
  return { lang, t, toggleLang }
}
