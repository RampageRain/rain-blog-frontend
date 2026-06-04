<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'

import BlogNavbar from '@/components/blog/BlogNavbar.vue'
import PostListView from '@/views/blog/PostListView.vue'
import ContactPopup from '@/components/blog/ContactPopup.vue'

import homeBg1 from '@/assets/images/home-bg-1.jpg'
import homeBg2 from '@/assets/images/home-bg-2.jpg'
import homeBg3 from '@/assets/images/home-bg-3.jpg'
import homeBg4 from '@/assets/images/home-bg-4.jpg'
import homeBg5 from '@/assets/images/home-bg-5.jpg'
import homeBg6 from '@/assets/images/home-bg-6.jpg'
import homeBg7 from '@/assets/images/home-bg-7.jpg'
import homeBg8 from '@/assets/images/home-bg-8.jpg'
import homeBg9 from '@/assets/images/home-bg-9.jpg'
import homeBgMobile1 from '@/assets/images/home-bg-mobile-1.jpg'
import loginBgMobile from '@/assets/images/login-bg-mobile.jpg'

import wechatQrCode from '@/assets/images/contact/wechat-qrcode.png'
import qqQrCode from '@/assets/images/contact/qq-qrcode.png'

const desktopBackgroundImages = [
  homeBg1,
  homeBg2,
  homeBg3,
  homeBg4,
  homeBg5,
  homeBg6,
  homeBg7,
  homeBg8,
  homeBg9
]

const mobileBackgroundImages = [
  loginBgMobile,
  homeBgMobile1
]

const desktopBackgroundStorageKey = 'rain_blog_home_bg_index'
const mobileBackgroundStorageKey = 'rain_blog_home_mobile_bg_index'
const heroMobileMedia = '(max-width: 800px)'
const route = useRoute()

function readIsMobileHero() {
  if (typeof window === 'undefined') {
    return false
  }

  return window.matchMedia(heroMobileMedia).matches
}

const isMobileHero = ref(readIsMobileHero())

const activeBackgroundImages = computed(() => {
  return isMobileHero.value ? mobileBackgroundImages : desktopBackgroundImages
})

function getBackgroundStorageKey() {
  return isMobileHero.value ? mobileBackgroundStorageKey : desktopBackgroundStorageKey
}

function readLastIndex(images: string[], storageKey: string) {
  const lastIndexText = sessionStorage.getItem(storageKey)
  const parsedLastIndex = Number(lastIndexText)

  return lastIndexText === null ||
    Number.isNaN(parsedLastIndex) ||
    parsedLastIndex < 0 ||
    parsedLastIndex >= images.length
    ? undefined
    : parsedLastIndex
}

function getRandomIndex(images: string[], excludeIndex?: number) {
  if (images.length <= 1) {
    return 0
  }

  let index = Math.floor(Math.random() * images.length)

  while (index === excludeIndex) {
    index = Math.floor(Math.random() * images.length)
  }

  return index
}

function persistCurrentBackgroundIndex() {
  sessionStorage.setItem(getBackgroundStorageKey(), String(currentIndex.value))
}

const initialImages = activeBackgroundImages.value
const currentIndex = ref(
  getRandomIndex(initialImages, readLastIndex(initialImages, getBackgroundStorageKey()))
)

const currentBackground = computed(() => {
  const images = activeBackgroundImages.value

  return images[currentIndex.value] ?? images[0]
})

persistCurrentBackgroundIndex()

const heroStyle = computed(() => {
  return {
    backgroundImage: `
      linear-gradient(
        rgba(0, 0, 0, 0.4),
        rgba(0, 0, 0, 0.4)
      ),
      url(${currentBackground.value})
    `
  }
})

function refreshHeroBackground() {
  currentIndex.value = getRandomIndex(activeBackgroundImages.value, currentIndex.value)
  persistCurrentBackgroundIndex()
}

function syncHeroBackgroundForViewport(matches: boolean) {
  if (isMobileHero.value === matches) {
    return
  }

  isMobileHero.value = matches

  const images = activeBackgroundImages.value
  const lastIndex = readLastIndex(images, getBackgroundStorageKey())

  currentIndex.value = getRandomIndex(images, lastIndex)
  persistCurrentBackgroundIndex()
}

async function scrollToPosts(behavior: ScrollBehavior | Event = 'smooth') {
  await nextTick()

  const postsElement = document.getElementById('home-posts')

  if (!postsElement) {
    return
  }

  const scrollBehavior = typeof behavior === 'string' ? behavior : 'smooth'
  const targetTop = postsElement.getBoundingClientRect().top + window.scrollY

  window.scrollTo({
    top: targetTop,
    behavior: scrollBehavior
  })
}

const subtitleText = '记录 Java 后端、Vue 前端与全栈成长'
const displayedSubtitle = ref('')
const isTyping = ref(false)

let subtitleIntervalId: number | undefined
let subtitlePauseTimeoutId: number | undefined
let heroMediaQuery: MediaQueryList | undefined

function clearTypingTimers() {
  if (subtitleIntervalId !== undefined) {
    window.clearInterval(subtitleIntervalId)
    subtitleIntervalId = undefined
  }

  if (subtitlePauseTimeoutId !== undefined) {
    window.clearTimeout(subtitlePauseTimeoutId)
    subtitlePauseTimeoutId = undefined
  }
}

function startTypingSubtitle() {
  let index = 0
  let deleting = false

  isTyping.value = true

  subtitleIntervalId = window.setInterval(() => {
    if (!deleting) {
      displayedSubtitle.value = subtitleText.slice(0, index + 1)
      index++

      if (index === subtitleText.length) {
        isTyping.value = false

        subtitlePauseTimeoutId = window.setTimeout(() => {
          deleting = true
          isTyping.value = true
        }, 1000)
      }

      return
    }

    displayedSubtitle.value = subtitleText.slice(0, index - 1)
    index--

    if (index === 0) {
      deleting = false

      subtitlePauseTimeoutId = window.setTimeout(() => {
        isTyping.value = true
      }, 600)
    }
  }, 110)
}

function handleHeroMediaChange(event: MediaQueryListEvent) {
  syncHeroBackgroundForViewport(event.matches)
}

onMounted(() => {
  heroMediaQuery = window.matchMedia(heroMobileMedia)
  syncHeroBackgroundForViewport(heroMediaQuery.matches)
  heroMediaQuery.addEventListener('change', handleHeroMediaChange)

  startTypingSubtitle()

  if (route.hash === '#home-posts') {
    void scrollToPosts('auto')
  }
})

watch(
  () => route.hash,
  (hash) => {
    if (hash === '#home-posts') {
      void scrollToPosts()
    }
  }
)

onBeforeUnmount(() => {
  clearTypingTimers()
  heroMediaQuery?.removeEventListener('change', handleHeroMediaChange)
})

const contactPopupVisible = ref(false)

const contactPopup = ref({
  title: '',
  account: '',
  qrCode: ''
})

function openWechatPopup() {
  contactPopup.value = {
    title: '微信联系',
    account: 'Rain119813',
    qrCode: wechatQrCode
  }

  contactPopupVisible.value = true
}

function openQQPopup() {
  contactPopup.value = {
    title: 'QQ 联系',
    account: '1192924906',
    qrCode: qqQrCode
  }

  contactPopupVisible.value = true
}

function closeContactPopup() {
  contactPopupVisible.value = false
}
</script>

<template>
  <main>
    <BlogNavbar @refresh-home="refreshHeroBackground" />

    <section class="hero" :style="heroStyle">
      <div class="hero-content">
        <h1>Rain Blog</h1>

        <p class="hero-subtitle">
          {{ displayedSubtitle }}<span v-if="isTyping" class="typing-cursor"></span>
        </p>

        <div class="hero-actions">
          <button type="button" class="hero-button primary" @click="scrollToPosts">
            <Icon class="hero-button-icon down-icon" icon="fa-solid:angle-double-down" aria-hidden="true" />
            <span>开始阅读</span>
          </button>

          <RouterLink to="/repositories" class="hero-button ghost">
            <Icon class="hero-button-icon fork-icon" icon="fa-solid:code-branch" aria-hidden="true" />
            <span>获取源码</span>
          </RouterLink>
        </div>

        <div class="hero-socials">
          <a
            class="social-link"
            href="https://github.com/RampageRain"
            target="_blank"
            rel="noopener noreferrer"
            data-tooltip="访问我的 GitHub"
            aria-label="访问我的 GitHub"
          >
            <Icon class="social-icon" icon="fa-brands:github" />
          </a>

          <a
            class="social-link"
            href="mailto:18687419361@163.com"
            data-tooltip="给我发送邮件"
            aria-label="给我发送邮件"
          >
            <Icon class="social-icon" icon="fa-solid:envelope-open" />
          </a>

          <button
            type="button"
            class="social-link"
            data-tooltip="查看微信联系方式"
            aria-label="查看微信联系方式"
            @click="openWechatPopup"
          >
            <Icon class="social-icon" icon="fa-brands:weixin" />
          </button>

          <button
            type="button"
            class="social-link"
            data-tooltip="查看 QQ 联系方式"
            aria-label="查看 QQ 联系方式"
            @click="openQQPopup"
          >
            <Icon class="social-icon qq-icon" icon="fa-brands:qq" />
          </button>

          <a
            class="social-link"
            href="/atom.xml"
            target="_blank"
            rel="noopener noreferrer"
            data-tooltip="订阅 RSS"
            aria-label="订阅 RSS"
          >
            <Icon class="social-icon" icon="fa-solid:rss" />
          </a>
        </div>
      </div>

      <button type="button" class="hero-scroll-down" aria-label="查看最新文章" @click="scrollToPosts">
        <Icon icon="fa-solid:angle-double-down" aria-hidden="true" />
      </button>
    </section>

    <PostListView embedded section-id="home-posts" />
    <ContactPopup
      :visible="contactPopupVisible"
      :title="contactPopup.title"
      :account="contactPopup.account"
      :qr-code="contactPopup.qrCode"
      @close="closeContactPopup"
    />
  </main>
</template>

<style scoped>
.hero {
  min-height: 100vh;
  min-height: 100dvh;

  position: relative;

  display: flex;
  justify-content: center;
  align-items: center;

  color: #ffffff;

  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.hero-content {
  width: min(92vw, 960px);

  display: flex;
  flex-direction: column;
  align-items: center;

  text-align: center;

  transform: translateY(clamp(96px, 20vh, 120px));
}

.hero h1 {
  margin: 0;
  font-size: clamp(42px, 5vw, 64px);
  line-height: 1.15;
}

.hero-subtitle {
  min-height: 1.8em;
  margin: clamp(18px, 2.6vh, 30px) 0 0;
  font-size: clamp(16px, 1.7vw, 20px);
}

.typing-cursor {
  display: inline-block;
  width: 2px;
  height: 1em;
  margin-left: 4px;
  vertical-align: -2px;
  background: rgba(255, 255, 255, 0.88);
  animation: cursorBlink 0.8s infinite;
}

@keyframes cursorBlink {
  0%,
  45% {
    opacity: 1;
  }

  46%,
  100% {
    opacity: 0;
  }
}

.hero-actions {
  display: flex;
  gap: clamp(24px, 3vw, 38px);
  margin-top: clamp(46px, 8vh, 92px);
}

.hero-button {
  min-width: clamp(150px, 14vw, 180px);
  height: 50px;
  padding: 0 clamp(28px, 3vw, 38px);
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.42);

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  color: #ffffff;
  background: rgba(15, 23, 42, 0.18);
  text-decoration: none;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 1px;
  line-height: 1;
  cursor: pointer;

  transition:
    transform 0.2s,
    background 0.2s,
    border-color 0.2s,
    box-shadow 0.2s;
}

.hero-button-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.down-icon,
.fork-icon {
  width: 18px;
  height: 18px;
}

.hero-button:hover {
  background: rgba(226, 232, 240, 0.18);
  border-color: rgba(226, 232, 240, 0.46);
  box-shadow: 0 14px 34px rgba(15, 23, 42, 0.28);
  transform: translateY(-2px);
}

.hero-socials {
  display: flex;
  gap: clamp(24px, 3vw, 34px);
  margin-top: clamp(90px, 16vh, 170px);
}

.hero-scroll-down {
  position: absolute;
  left: 50%;
  bottom: clamp(24px, 4vh, 42px);

  width: 42px;
  height: 42px;
  padding: 0;
  border: none;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  color: rgba(255, 255, 255, 0.82);
  background: transparent;
  cursor: pointer;

  transform: translateX(-50%);

  transition:
    color 0.2s,
    transform 0.2s,
    opacity 0.2s;
}

.hero-scroll-down svg {
  width: 28px;
  height: 28px;
}

.hero-scroll-down:hover {
  color: #ffffff;
  transform: translateX(-50%) translateY(4px);
}

.social-link {
  position: relative;

  width: 34px;
  height: 34px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  color: rgba(255, 255, 255, 0.88);
  background: transparent;
  border: none;
  border-radius: 0;
  backdrop-filter: none;

  text-decoration: none;
  cursor: pointer;
  padding: 0;

  transition:
    color 0.2s,
    transform 0.2s;
}

.social-icon {
  width: 21px;
  height: 21px;
  flex-shrink: 0;
}

.qq-icon {
  width: 20px;
  height: 20px;
}

.social-link:hover {
  color: #ffffff;
  transform: translateY(-2px);
}

.social-link::after {
  content: attr(data-tooltip);

  position: absolute;
  left: 50%;
  bottom: calc(100% + 10px);

  transform: translateX(-50%) translateY(6px);

  padding: 8px 12px;
  border-radius: 7px;

  color: rgba(255, 255, 255, 0.94);
  background: rgba(31, 41, 55, 0.92);
  border: 1px solid rgba(226, 232, 240, 0.24);
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.28);

  white-space: nowrap;
  font-size: 13px;
  letter-spacing: 0.3px;

  opacity: 0;
  pointer-events: none;

  transition:
    opacity 0.2s,
    transform 0.2s;
}

.social-link::before {
  content: '';

  position: absolute;
  left: 50%;
  bottom: calc(100% + 4px);

  transform: translateX(-50%) translateY(6px);

  border: 6px solid transparent;
  border-top-color: rgba(31, 41, 55, 0.92);

  opacity: 0;
  pointer-events: none;

  transition:
    opacity 0.2s,
    transform 0.2s;
}

.social-link:hover::after,
.social-link:hover::before {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

@media (max-width: 900px) {
  .hero-content {
    transform: translateY(clamp(64px, 14vh, 140px));
  }

  .hero-actions {
    margin-top: clamp(36px, 6vh, 58px);
  }

  .hero-socials {
    margin-top: clamp(70px, 12vh, 120px);
  }
}

@media (max-width: 600px) {
  .hero-content {
    width: min(90vw, 420px);
    transform: translateY(48px);
  }

  .hero h1 {
    font-size: 40px;
  }

  .hero p {
    margin-top: 16px;
    font-size: 16px;
    line-height: 1.7;
  }

  .hero-actions {
    flex-direction: column;
    gap: 14px;
    margin-top: 34px;
  }

  .hero-button {
    width: 180px;
  }

  .hero-socials {
    gap: 22px;
    margin-top: 72px;
  }
}
</style>
