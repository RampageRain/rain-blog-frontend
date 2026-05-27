<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'

import { useAuthStore } from '@/stores/auth'

import catStarLogo from '@/assets/images/cat-star-logo.png'
import avatar from '@/assets/images/avart.jpg'
import mobileDrawerBg from '@/assets/images/intro-card-img.jpg'

const authStore = useAuthStore()
const route = useRoute()

const mobileMenuOpen = ref(false)
type ImageFitMode = 'fill-width' | 'fill-height'

const mobileProfileCoverFitMode = ref<ImageFitMode>('fill-width')
const mobileProfileCrop = {
  x: '50%',
  y: '50%',
  scale: 1
}

const publicMenus = [
  { label: '首页', path: '/', icon: 'fa-solid:home' },
  { label: '标签', path: '/tags', icon: 'fa-solid:tags' },
  { label: '分类', path: '/categories', icon: 'fa-solid:bookmark' },
  { label: '归档', path: '/archives', icon: 'fa-solid:archive' },
  { label: '关于', path: '/about', icon: 'fa-solid:user-circle' }
]

function resolveImageFitMode(imageRatio: number, containerRatio: number): ImageFitMode {
  return imageRatio >= containerRatio ? 'fill-height' : 'fill-width'
}

function getElementRatio(selector: string, fallbackRatio: number) {
  if (typeof document === 'undefined') {
    return fallbackRatio
  }

  const element = document.querySelector<HTMLElement>(selector)
  if (!element) {
    return fallbackRatio
  }

  const { width, height } = element.getBoundingClientRect()
  if (!width || !height) {
    return fallbackRatio
  }

  return width / height
}

function loadImageRatio(imageUrl: string) {
  return new Promise<number>((resolve) => {
    const image = new Image()
    image.onload = () => {
      resolve(image.naturalWidth && image.naturalHeight ? image.naturalWidth / image.naturalHeight : 1)
    }
    image.onerror = () => resolve(1)
    image.src = imageUrl
  })
}

async function refreshMobileProfileCoverFit() {
  if (typeof window === 'undefined') {
    return
  }

  await nextTick()

  const profileRatio = getElementRatio('.mobile-profile', 1.6)
  const imageRatio = await loadImageRatio(mobileDrawerBg)
  mobileProfileCoverFitMode.value = resolveImageFitMode(imageRatio, profileRatio)
}

const mobileProfileCoverClass = computed(() => {
  return mobileProfileCoverFitMode.value === 'fill-height' ? 'is-fill-height' : 'is-fill-width'
})

const mobileProfileCoverStyle = computed(() => {
  return {
    top: mobileProfileCrop.y,
    left: mobileProfileCrop.x,
    transform: `translate(-50%, -50%) scale(${mobileProfileCrop.scale})`
  }
})

function handleWindowResize() {
  if (mobileMenuOpen.value) {
    void refreshMobileProfileCoverFit()
  }
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

  if (open) {
    void refreshMobileProfileCoverFit()
  }
})

onMounted(() => {
  window.addEventListener('resize', handleWindowResize)
})

onUnmounted(() => {
  document.body.style.overflow = ''
  window.removeEventListener('resize', handleWindowResize)
})
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
        <Icon class="nav-icon" :icon="item.icon" aria-hidden="true" />
        <span>{{ item.label }}</span>
      </RouterLink>

      <button type="button" class="nav-item" @click="handleSearchClick">
        <Icon class="nav-icon" icon="fa-solid:search" aria-hidden="true" />
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
        <Icon class="nav-icon" icon="fa-solid:edit" aria-hidden="true" />
        <span>后台</span>
      </RouterLink>
    </nav>

    <button
      type="button"
      class="mobile-search-button"
      aria-label="搜索"
      @click="handleSearchClick"
    >
      <Icon icon="fa-solid:search" aria-hidden="true" />
    </button>

    <button
      type="button"
      class="mobile-menu-button"
      aria-label="打开菜单"
      @click="openMobileMenu"
    >
      <Icon icon="fa-solid:bars" aria-hidden="true" />
    </button>

    <Teleport to="body">
      <Transition name="mobile-drawer">
        <div
          v-if="mobileMenuOpen"
          class="mobile-drawer-mask"
          @click="closeMobileMenu"
        >
          <aside class="mobile-drawer" @click.stop>
            <div class="mobile-profile">
              <img
                class="mobile-profile-cover"
                :class="mobileProfileCoverClass"
                :style="mobileProfileCoverStyle"
                :src="mobileDrawerBg"
                alt=""
                aria-hidden="true"
              />
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
                <Icon class="mobile-menu-icon" :icon="item.icon" aria-hidden="true" />
                <span>{{ item.label }}</span>
              </RouterLink>

              <RouterLink
                v-if="authStore.isLogin"
                to="/studio/dashboard"
                class="mobile-menu-item"
                :class="{ 'mobile-active': isCurrentPath('/studio/dashboard') }"
                @click="closeMobileMenu"
              >
                <Icon class="mobile-menu-icon" icon="fa-solid:edit" aria-hidden="true" />
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

  background-color: #0f172a;

  overflow: hidden;

  border-bottom: 1px solid rgba(255, 255, 255, 0.22);
}
.mobile-profile::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.28), rgba(15, 23, 42, 0.48));
}

.mobile-profile-cover {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 0;
  width: 100%;
  height: auto;
  min-height: 100%;
  display: block;
  object-fit: initial;
  object-position: center;
  transform: translate(-50%, -50%);
}

.mobile-profile-cover.is-fill-height {
  width: auto;
  height: 100%;
}

.mobile-profile-cover.is-fill-width {
  width: 100%;
  height: auto;
}

.mobile-avatar,
.mobile-profile h2,
.mobile-profile p {
  position: relative;
  z-index: 2;
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

    width: 50px;
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
    width: 19px;
    height: 19px;
  }
}
</style>
