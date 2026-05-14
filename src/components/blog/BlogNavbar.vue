<script setup lang="ts">
import { onUnmounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import { useAuthStore } from '@/stores/auth'

import catStarLogo from '@/assets/images/cat-star-logo.png'
import avatar from '@/assets/images/avart.jpg'
import mobileDrawerBg from '@/assets/images/intro-card-img.jpg'

const authStore = useAuthStore()
const route = useRoute()

const mobileMenuOpen = ref(false)

const publicMenus = [
  { label: '首页', path: '/', icon: 'home' },
  { label: '标签', path: '/tags', icon: 'tag' },
  { label: '分类', path: '/categories', icon: 'category' },
  { label: '归档', path: '/archives', icon: 'archive' },
  { label: '关于', path: '/about', icon: 'about' }
]

const mobileProfileStyle = {
  backgroundImage: `
    linear-gradient(
      135deg,
      rgba(15, 23, 42, 0.28),
      rgba(15, 23, 42, 0.48)
    ),
    url(${mobileDrawerBg})
  `
}

const emit = defineEmits<{
  refreshHome: []
}>()

function handleBrandClick() {
  emit('refreshHome')
  closeMobileMenu()
}

function isCurrentPath(path: string) {
  return route.path === path
}

function openMobileMenu() {
  mobileMenuOpen.value = true
}

function closeMobileMenu() {
  mobileMenuOpen.value = false
}

function handleSearchClick() {
  closeMobileMenu()
}

watch(mobileMenuOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
})

onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

<template>
  <header class="blog-navbar">
    <button
      type="button"
      class="mobile-menu-button"
      aria-label="打开菜单"
      @click="openMobileMenu"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M4 6.5h16v2H4v-2Zm0 4.5h16v2H4v-2Zm0 4.5h16v2H4v-2Z" />
      </svg>
    </button>

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
          <path fill="currentColor" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </svg>

        <svg v-else-if="item.icon === 'tag'" class="nav-icon" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M20.59 13.41 11.17 4H4v7.17l9.41 9.42a2 2 0 0 0 2.83 0l4.35-4.35a2 2 0 0 0 0-2.83ZM6.5 8A1.5 1.5 0 1 1 8 6.5 1.5 1.5 0 0 1 6.5 8Z"
          />
        </svg>

        <svg v-else-if="item.icon === 'category'" class="nav-icon" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M4 5a2 2 0 0 1 2-2h4l2 2h6a2 2 0 0 1 2 2v2H4V5Zm0 6h16v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6Z"
          />
        </svg>

        <svg v-else-if="item.icon === 'archive'" class="nav-icon" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M20.54 5.23 19.15 3.55A1.5 1.5 0 0 0 18 3H6a1.5 1.5 0 0 0-1.15.55L3.46 5.23A2 2 0 0 0 3 6.5V19a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.5a2 2 0 0 0-.46-1.27ZM5.12 5h13.76l.82 1H4.3l.82-1ZM5 8h14v11H5V8Zm4 3h6v2H9v-2Z"
          />
        </svg>

        <svg v-else-if="item.icon === 'about'" class="nav-icon" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M12 2a10 10 0 1 0 10 10A10.01 10.01 0 0 0 12 2Zm1 15h-2v-6h2v6Zm0-8h-2V7h2v2Z"
          />
        </svg>

        <span>{{ item.label }}</span>
      </RouterLink>

      <button type="button" class="nav-item" @click="handleSearchClick">
        <svg class="nav-icon" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M9.5 3A6.5 6.5 0 0 1 14.65 13.45l4.95 4.95-1.4 1.4-4.95-4.95A6.5 6.5 0 1 1 9.5 3Zm0 2A4.5 4.5 0 1 0 14 9.5 4.5 4.5 0 0 0 9.5 5Z"
          />
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
          <path
            fill="currentColor"
            d="M4 4h10v2H6v12h12v-8h2v10H4V4Zm14.7-.3 1.6 1.6a1 1 0 0 1 0 1.4l-8.9 8.9L8 16l.4-3.4 8.9-8.9a1 1 0 0 1 1.4 0ZM10.2 13.8l.9-.1 7.1-7.1-.8-.8-7.1 7.1-.1.9Z"
          />
        </svg>
        <span>后台</span>
      </RouterLink>
    </nav>

    <button
      type="button"
      class="mobile-search-button"
      aria-label="搜索"
      @click="handleSearchClick"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M9.5 3A6.5 6.5 0 0 1 14.65 13.45l4.95 4.95-1.4 1.4-4.95-4.95A6.5 6.5 0 1 1 9.5 3Zm0 2A4.5 4.5 0 1 0 14 9.5 4.5 4.5 0 0 0 9.5 5Z"
        />
      </svg>
    </button>

    <button
      type="button"
      class="mobile-menu-button"
      aria-label="打开菜单"
      @click="openMobileMenu"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M4 6.5h16v2H4v-2Zm0 4.5h16v2H4v-2Zm0 4.5h16v2H4v-2Z" />
      </svg>
    </button>

    <Teleport to="body">
      <Transition name="mobile-drawer">
        <div
          v-if="mobileMenuOpen"
          class="mobile-drawer-mask"
          @click="closeMobileMenu"
        >
          <aside class="mobile-drawer" @click.stop>
            <div class="mobile-profile" :style="mobileProfileStyle">
              <img class="mobile-avatar" :src="avatar" alt="Rain Blog" />

              <h2>Rain Blog</h2>

              <p>
                记录 Java 后端、Vue 前端与全栈成长
              </p>
            </div>

            <nav class="mobile-menu-list">
              <RouterLink
                v-for="item in publicMenus"
                :key="item.path"
                :to="item.path"
                class="mobile-menu-item"
                :class="{ 'mobile-active': isCurrentPath(item.path) }"
                @click="closeMobileMenu"
              >
                <svg v-if="item.icon === 'home'" class="mobile-menu-icon" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                </svg>

                <svg v-else-if="item.icon === 'tag'" class="mobile-menu-icon" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M20.59 13.41 11.17 4H4v7.17l9.41 9.42a2 2 0 0 0 2.83 0l4.35-4.35a2 2 0 0 0 0-2.83ZM6.5 8A1.5 1.5 0 1 1 8 6.5 1.5 1.5 0 0 1 6.5 8Z"
                  />
                </svg>

                <svg v-else-if="item.icon === 'category'" class="mobile-menu-icon" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M4 5a2 2 0 0 1 2-2h4l2 2h6a2 2 0 0 1 2 2v2H4V5Zm0 6h16v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6Z"
                  />
                </svg>

                <svg v-else-if="item.icon === 'archive'" class="mobile-menu-icon" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M20.54 5.23 19.15 3.55A1.5 1.5 0 0 0 18 3H6a1.5 1.5 0 0 0-1.15.55L3.46 5.23A2 2 0 0 0 3 6.5V19a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.5a2 2 0 0 0-.46-1.27ZM5.12 5h13.76l.82 1H4.3l.82-1ZM5 8h14v11H5V8Zm4 3h6v2H9v-2Z"
                  />
                </svg>

                <svg v-else-if="item.icon === 'about'" class="mobile-menu-icon" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12 2a10 10 0 1 0 10 10A10.01 10.01 0 0 0 12 2Zm1 15h-2v-6h2v6Zm0-8h-2V7h2v2Z"
                  />
                </svg>

                <span>{{ item.label }}</span>
              </RouterLink>

              <RouterLink
                v-if="authStore.isLogin"
                to="/studio/dashboard"
                class="mobile-menu-item"
                :class="{ 'mobile-active': isCurrentPath('/studio/dashboard') }"
                @click="closeMobileMenu"
              >
                <svg class="mobile-menu-icon" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M4 4h10v2H6v12h12v-8h2v10H4V4Zm14.7-.3 1.6 1.6a1 1 0 0 1 0 1.4l-8.9 8.9L8 16l.4-3.4 8.9-8.9a1 1 0 0 1 1.4 0ZM10.2 13.8l.9-.1 7.1-7.1-.8-.8-7.1 7.1-.1.9Z"
                  />
                </svg>
                <span>后台</span>
              </RouterLink>
            </nav>
          </aside>
        </div>
      </Transition>
    </Teleport>
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

  transition:
    background 0.22s ease,
    transform 0.22s ease;
}

.nav-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
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

.mobile-menu-button,
.mobile-search-button {
  display: none;
}

.mobile-drawer-mask {
  position: fixed;
  inset: 0;
  z-index: 9998;

  background: rgba(15, 23, 42, 0.08);
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
}

.mobile-drawer {
  width: min(64vw, 260px);
  height: 100%;

  color: #ffffff;

  background: rgba(15, 23, 42, 0.24);
  border-right: 1px solid rgba(255, 255, 255, 0.32);
  box-shadow:
    18px 0 48px rgba(15, 23, 42, 0.24),
    inset -1px 0 0 rgba(255, 255, 255, 0.08);
  -webkit-backdrop-filter: blur(16px) saturate(145%);
  backdrop-filter: blur(16px) saturate(145%);

  display: flex;
  flex-direction: column;

  overflow-y: auto;
}

.mobile-profile {
  position: relative;
  width: 100%;
  box-sizing: border-box;

  padding: 30px 18px 24px;
  text-align: center;

  background-size: 100% 100%, cover;
  background-position: center, center;
  background-repeat: no-repeat, no-repeat;

  overflow: hidden;

  border-bottom: 1px solid rgba(255, 255, 255, 0.22);
}

.mobile-menu-list {
  position: relative;
  flex: 1;

  padding: 12px 0;

  background: rgba(255, 255, 255, 0.1);
  -webkit-backdrop-filter: blur(16px);
  backdrop-filter: blur(16px);
}

.mobile-avatar {
  width: 74px;
  height: 74px;
  border-radius: 50%;

  display: block;
  margin: 0 auto;

  object-fit: cover;
  object-position: center;

  background: rgba(255, 255, 255, 0.82);
  border: 2px solid rgba(255, 255, 255, 0.86);
  box-shadow:
    0 10px 28px rgba(15, 23, 42, 0.38),
    0 0 0 4px rgba(255, 255, 255, 0.12);
}

.mobile-profile h2 {
  margin: 12px 0 0;

  color: rgba(255, 255, 255, 0.96);
  font-size: 20px;
  font-weight: 800;
}

.mobile-profile p {
  margin: 8px 0 0;

  color: rgba(255, 255, 255, 0.78);
  font-size: 12px;
  line-height: 1.7;
}

.mobile-menu-item {
  width: 100%;
  height: 46px;
  padding: 0 22px;
  border: none;

  display: flex;
  align-items: center;
  gap: 13px;

  color: rgba(255, 255, 255, 0.94);
  background: transparent;
  text-decoration: none;
  cursor: pointer;
  font-size: 15px;
  font-family: inherit;
  font-weight: 500;

  transition:
    background 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;
}

.mobile-menu-item:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.24);
  transform: translateX(2px);
}

.mobile-active,
.mobile-active:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.22);
  box-shadow: none;
  transform: translateX(2px);
}

.mobile-menu-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;

  opacity: 0.96;
}

.mobile-drawer-enter-active,
.mobile-drawer-leave-active {
  transition: opacity 0.22s ease;
}

.mobile-drawer-enter-from,
.mobile-drawer-leave-to {
  opacity: 0;
}

.mobile-drawer-enter-active .mobile-drawer,
.mobile-drawer-leave-active .mobile-drawer {
  transition: transform 0.22s ease;
}

.mobile-drawer-enter-from .mobile-drawer,
.mobile-drawer-leave-to .mobile-drawer {
  transform: translateX(-100%);
}

@media (max-width: 800px) {
  .blog-navbar {
    height: 60px;
    padding: 0;

    justify-content: center;
  }

  .brand {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);

    height: 60px;
    gap: 8px;

    font-size: 18px;
    white-space: nowrap;
  }

  .brand-logo {
    width: 32px;
    height: 32px;
  }

  .nav-menu {
    display: none;
  }

  .mobile-menu-button,
  .mobile-search-button {
    position: absolute;
    top: 0;

    width: 56px;
    height: 60px;
    border: none;

    display: flex;
    align-items: center;
    justify-content: center;

    color: #ffffff;
    background: transparent;
    cursor: pointer;
  }

  .mobile-menu-button {
    left: 0;
  }

  .mobile-search-button {
    right: 0;
  }

  .mobile-menu-button svg,
  .mobile-search-button svg {
    width: 24px;
    height: 24px;
  }
}
</style>
