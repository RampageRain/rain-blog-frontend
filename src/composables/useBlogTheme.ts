import { computed, ref } from 'vue'

type BlogTheme = 'night' | 'light'

const STORAGE_KEY = 'rain_blog_theme'

const theme = ref<BlogTheme>(readTheme())

function readTheme(): BlogTheme {
  if (typeof window === 'undefined') {
    return 'night'
  }

  const savedTheme = window.localStorage.getItem(STORAGE_KEY)

  return savedTheme === 'light' ? 'light' : 'night'
}

function persistTheme(nextTheme: BlogTheme) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, nextTheme)
}

export function useBlogTheme() {
  const isLightTheme = computed(() => {
    return theme.value === 'light'
  })

  function setTheme(nextTheme: BlogTheme) {
    theme.value = nextTheme
    persistTheme(nextTheme)
  }

  function toggleTheme() {
    setTheme(theme.value === 'night' ? 'light' : 'night')
  }

  return {
    theme,
    isLightTheme,
    setTheme,
    toggleTheme
  }
}
