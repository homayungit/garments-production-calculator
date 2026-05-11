import { ref } from 'vue'

const stored = localStorage.getItem('gpc-dark')
const dark = ref(stored !== null ? stored === 'true' : true)

function applyTheme() {
  document.documentElement.classList.toggle('dark', dark.value)
}
applyTheme()

export function useTheme() {
  const toggleDark = () => {
    dark.value = !dark.value
    localStorage.setItem('gpc-dark', String(dark.value))
    applyTheme()
  }
  return { dark, toggleDark }
}
