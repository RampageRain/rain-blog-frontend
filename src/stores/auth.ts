import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export interface AdminInfo {
  username: string
  nickname?: string
  avatar?: string | null
}

function readAdminInfo(): AdminInfo | null {
  const adminText = localStorage.getItem('rain_blog_admin')

  if (!adminText) {
    return null
  }

  try {
    return JSON.parse(adminText)
  } catch {
    return null
  }
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('rain_blog_token') || '')
  const admin = ref<AdminInfo | null>(readAdminInfo())

  const isLogin = computed(() => {
    return token.value !== ''
  })

  function setLogin(loginToken: string, adminInfo: AdminInfo) {
    token.value = loginToken
    admin.value = adminInfo

    localStorage.setItem('rain_blog_token', loginToken)
    localStorage.setItem('rain_blog_admin', JSON.stringify(adminInfo))
  }

  function loadFromStorage() {
    token.value = localStorage.getItem('rain_blog_token') || ''
    admin.value = readAdminInfo()
  }

  return {
    token,
    admin,
    isLogin,
    setLogin,
    loadFromStorage
  }
})
