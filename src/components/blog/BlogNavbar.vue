<script setup lang="ts">
import {RouterLink, useRoute} from 'vue-router'

import {useBlogTheme} from '@/composables/useBlogTheme'
import {useAuthStore} from '@/stores/auth'
import catStarLogo from '@/assets/images/cat-star-logo.png'

const authStore = useAuthStore()
const route = useRoute()
const {isLightTheme, toggleTheme} = useBlogTheme()

const publicMenus = [
  {label: '首页', path: '/', icon: 'home'},
  {label: '标签', path: '/tags', icon: 'tag'},
  {label: '分类', path: '/categories', icon: 'category'},
  {label: '归档', path: '/archives', icon: 'archive'},
  {label: '关于', path: '/about', icon: 'about'}
]

const emit = defineEmits<{
  refreshHome: []
}>()

function handleBrandClick() {
  emit('refreshHome')
}

function isCurrentPath(path: string) {
  return route.path === path
}
</script>

<template>
  <header class="blog-navbar">
    <RouterLink class="brand" to="/" @click="handleBrandClick">
      <img
        class="brand-logo"
        :src="catStarLogo"
        alt="Rain Blog Logo"
      />
      <span>Rain Blog</span>
    </RouterLink>

    <nav class="nav-menu">
      <RouterLink
        v-for="item in publicMenus"
        :key="item.path"
        :to="item.path"
        class="nav-item"
        :class="{ 'nav-active': isCurrentPath(item.path) }"
        active-class=""
        exact-active-class=""
      >
        <svg v-if="item.icon === 'home'" class="nav-icon" viewBox="0 0 24 24">
          <path fill="currentColor" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
        </svg>

        <svg v-else-if="item.icon === 'tag'" class="nav-icon" viewBox="0 0 24 24">
          <path fill="currentColor"
                d="M20.59 13.41 11.17 4H4v7.17l9.41 9.42a2 2 0 0 0 2.83 0l4.35-4.35a2 2 0 0 0 0-2.83ZM6.5 8A1.5 1.5 0 1 1 8 6.5 1.5 1.5 0 0 1 6.5 8Z"/>
        </svg>

        <svg v-else-if="item.icon === 'category'" class="nav-icon" viewBox="0 0 24 24">
          <path fill="currentColor"
                d="M4 5a2 2 0 0 1 2-2h4l2 2h6a2 2 0 0 1 2 2v2H4V5Zm0 6h16v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6Z"/>
        </svg>

        <svg v-else-if="item.icon === 'archive'" class="nav-icon" viewBox="0 0 24 24">
          <path fill="currentColor"
                d="M20.54 5.23 19.15 3.55A1.5 1.5 0 0 0 18 3H6a1.5 1.5 0 0 0-1.15.55L3.46 5.23A2 2 0 0 0 3 6.5V19a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.5a2 2 0 0 0-.46-1.27ZM5.12 5h13.76l.82 1H4.3l.82-1ZM5 8h14v11H5V8Zm4 3h6v2H9v-2Z"/>
        </svg>

        <svg v-else-if="item.icon === 'about'" class="nav-icon" viewBox="0 0 24 24">
          <path fill="currentColor"
                d="M12 2a10 10 0 1 0 10 10A10.01 10.01 0 0 0 12 2Zm1 15h-2v-6h2v6Zm0-8h-2V7h2v2Z"/>
        </svg>

        <span>{{ item.label }}</span>
      </RouterLink>

      <button type="button" class="nav-item">
        <svg class="nav-icon" viewBox="0 0 24 24">
          <path fill="currentColor"
                d="M9.5 3A6.5 6.5 0 0 1 14.65 13.45l4.95 4.95-1.4 1.4-4.95-4.95A6.5 6.5 0 1 1 9.5 3Zm0 2A4.5 4.5 0 1 0 14 9.5 4.5 4.5 0 0 0 9.5 5Z"/>
        </svg>
        <span>搜索</span>
      </button>

      <RouterLink
        v-if="authStore.isLogin"
        to="/studio/dashboard"
        class="nav-item"
        :class="{ 'nav-active': isCurrentPath('/studio/dashboard') }"
        active-class=""
        exact-active-class=""
      >
        <svg class="nav-icon" viewBox="0 0 24 24">
          <path fill="currentColor"
                d="M4 4h10v2H6v12h12v-8h2v10H4V4Zm14.7-.3 1.6 1.6a1 1 0 0 1 0 1.4l-8.9 8.9L8 16l.4-3.4 8.9-8.9a1 1 0 0 1 1.4 0ZM10.2 13.8l.9-.1 7.1-7.1-.8-.8-7.1 7.1-.1.9Z"/>
        </svg>
        <span>后台</span>
      </RouterLink>

      <button
        type="button"
        class="nav-item theme-toggle"
        :class="{ 'nav-active': isLightTheme }"
        @click="toggleTheme"
        :aria-label="isLightTheme ? '切换到夜间模式' : '切换到日间模式'"
        :title="isLightTheme ? '切换到夜间模式' : '切换到日间模式'"
      >
        <!-- 日间模式：太阳 -->
        <svg
          v-if="isLightTheme"
          class="nav-icon theme-icon"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            fill="currentColor"
            d="M12 7.2a4.8 4.8 0 1 1 0 9.6 4.8 4.8 0 0 1 0-9.6Zm0-5.2a1 1 0 0 1 1 1v2.1h-2V3a1 1 0 0 1 1-1Zm0 16.9h1V21a1 1 0 1 1-2 0v-2.1h1ZM3 11h2.1v2H3a1 1 0 1 1 0-2Zm15.9 0H21a1 1 0 1 1 0 2h-2.1v-2ZM4.22 5.64a1 1 0 0 1 1.42 0l1.48 1.49-1.41 1.41-1.49-1.48a1 1 0 0 1 0-1.42Zm12.66 12.66 1.41-1.42 1.49 1.49a1 1 0 1 1-1.42 1.41l-1.48-1.48ZM18.36 4.22a1 1 0 1 1 1.42 1.42l-1.49 1.48-1.41-1.41 1.48-1.49ZM5.64 19.78a1 1 0 0 1-1.42-1.41l1.49-1.49 1.41 1.42-1.48 1.48Z"
          />
        </svg>

        <!-- 夜间模式：弦月 -->
        <svg
          v-else
          class="nav-icon theme-icon moon-icon"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            fill="currentColor"
            d="M13.3 3.1a8.4 8.4 0 0 0 7.6 11.5A9.6 9.6 0 1 1 13.3 3.1Z"
          />
        </svg>
      </button>
    </nav>
  </header>
</template>

<style scoped>
.blog-navbar {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 50;

  width: 100%;
  height: 64px;

  padding: 0 0 0 56px;

  display: flex;
  align-items: center;

  color: #ffffff;
  background: rgba(15, 23, 42, 0.24);
  border-bottom: 1px solid rgba(255, 255, 255, 0.32);
  box-shadow: 0 1px 12px rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(16px);
}

.brand {
  height: 64px;

  display: flex;
  align-items: center;
  gap: 12px;

  color: #ffffff;
  text-decoration: none;
  font-size: 22px;
  font-weight: 700;
}

.brand-logo {
  width: 38px;
  height: 38px;

  object-fit: contain;
  flex-shrink: 0;

  filter: drop-shadow(0 2px 8px rgba(255, 255, 255, 0.18));
}

.nav-menu {
  height: 64px;
  margin-left: auto;

  display: flex;
  align-items: stretch;
  gap: 0;
}

.nav-item {
  height: 64px;
  padding: 0 28px;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;

  color: #ffffff;
  background: transparent;
  border: none;
  border-radius: 0;
  outline: none;

  text-decoration: none;
  cursor: pointer;
  font-size: 15px;
  font-family: inherit;
  line-height: 64px;

  transition: background 0.22s ease,
  transform 0.22s ease;
}

.nav-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.theme-icon {
  width: 18px;
  height: 18px;
  display: block;
  transition: transform 0.25s ease, opacity 0.25s ease;
}

.moon-icon {
  transform: scale(0.95) translateX(0.5px);
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.24);
  transform: translateY(-1px);
}

.nav-active {
  background: rgba(255, 255, 255, 0.22);
}

.nav-menu:hover .nav-active {
  background: transparent;
}

.nav-menu:hover .nav-item:hover {
  background: rgba(255, 255, 255, 0.24);
}
</style>
