import { computed, ref } from 'vue'

type BlogTheme = 'night' | 'light'
type BlogThemeMode = 'auto' | 'manual'

const DAY_START_HOUR = 6
const NIGHT_START_HOUR = 18
const THEME_SYNC_INTERVAL = 60 * 1000

function getSystemTheme(date = new Date()): BlogTheme {
  const hour = date.getHours()

  return hour >= DAY_START_HOUR && hour < NIGHT_START_HOUR ? 'light' : 'night'
}

const theme = ref<BlogTheme>(getSystemTheme())
const themeMode = ref<BlogThemeMode>('auto')

function syncThemeWithSystemTime() {
  if (themeMode.value === 'manual') {
    return
  }

  theme.value = getSystemTheme()
}

function setTheme(nextTheme: BlogTheme) {
  themeMode.value = 'manual'
  theme.value = nextTheme
}

function toggleTheme() {
  setTheme(theme.value === 'light' ? 'night' : 'light')
}

function resetThemeToSystem() {
  themeMode.value = 'auto'
  theme.value = getSystemTheme()
}

if (typeof window !== 'undefined') {
  syncThemeWithSystemTime()
  window.setInterval(syncThemeWithSystemTime, THEME_SYNC_INTERVAL)
}

export function useBlogTheme() {
  const isLightTheme = computed(() => {
    return theme.value === 'light'
  })

  return {
    theme,
    themeMode,
    isLightTheme,
    setTheme,
    toggleTheme,
    resetThemeToSystem
  }
}
