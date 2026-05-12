<script setup lang="ts">
import {computed, onMounted, ref} from 'vue'
import {RouterLink} from 'vue-router'
import {Icon} from '@iconify/vue'

import BlogNavbar from '@/components/blog/BlogNavbar.vue'

import homeBg1 from '@/assets/images/home-bg-1.jpg'
import homeBg2 from '@/assets/images/home-bg-2.jpg'
import homeBg3 from '@/assets/images/home-bg-3.jpg'
import homeBg4 from '@/assets/images/home-bg-4.jpg'
import homeBg5 from '@/assets/images/home-bg-5.jpg'
import homeBg6 from '@/assets/images/home-bg-6.jpg'
import homeBg7 from '@/assets/images/home-bg-7.jpg'
import homeBg8 from '@/assets/images/home-bg-8.jpg'

const backgroundImages = [
  homeBg1,
  homeBg2,
  homeBg3,
  homeBg4,
  homeBg5,
  homeBg6,
  homeBg7,
  homeBg8
]

function getRandomIndex(excludeIndex?: number) {
  if (backgroundImages.length <= 1) {
    return 0
  }

  let index = Math.floor(Math.random() * backgroundImages.length)

  while (index === excludeIndex) {
    index = Math.floor(Math.random() * backgroundImages.length)
  }

  return index
}

const lastIndexText = sessionStorage.getItem('rain_blog_home_bg_index')
const parsedLastIndex = Number(lastIndexText)
const lastIndex =
  lastIndexText === null || Number.isNaN(parsedLastIndex)
    ? undefined
    : parsedLastIndex

const currentIndex = ref(getRandomIndex(lastIndex))

const currentBackground = computed(() => {
  return backgroundImages[currentIndex.value]
})

sessionStorage.setItem('rain_blog_home_bg_index', String(currentIndex.value))

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
  currentIndex.value = getRandomIndex(currentIndex.value)
  sessionStorage.setItem('rain_blog_home_bg_index', String(currentIndex.value))
}

const subtitleText = '记录 Java 后端、Vue 前端与全栈成长'
const displayedSubtitle = ref('')
const isTyping = ref(false)

function startTypingSubtitle() {
  let index = 0
  let deleting = false

  isTyping.value = true

  window.setInterval(() => {
    if (!deleting) {
      displayedSubtitle.value = subtitleText.slice(0, index + 1)
      index++

      if (index === subtitleText.length) {
        isTyping.value = false

        window.setTimeout(() => {
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

      window.setTimeout(() => {
        isTyping.value = true
      }, 600)
    }
  }, 110)
}

onMounted(() => {
  startTypingSubtitle()
})
</script>

<template>
  <main>
    <BlogNavbar @refresh-home="refreshHeroBackground"/>

    <section class="hero" :style="heroStyle">
      <div class="hero-content">
        <h1>Rain Blog</h1>

        <p class="hero-subtitle">{{ displayedSubtitle }}<span v-if="isTyping"
                                                              class="typing-cursor"></span></p>

        <div class="hero-actions">
          <RouterLink to="/posts" class="hero-button primary">
            <svg class="hero-button-icon down-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M7.4 6.2 12 10.8l4.6-4.6L18 7.6l-6 6-6-6 1.4-1.4Zm0 5L12 15.8l4.6-4.6L18 12.6l-6 6-6-6 1.4-1.4Z"
              />
            </svg>
            <span>开始阅读</span>
          </RouterLink>

          <RouterLink to="/repositories" class="hero-button ghost">
            <svg class="hero-button-icon fork-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M7 3a3 3 0 0 1 1 5.83V10c0 1.1.9 2 2 2h4a4 4 0 0 0 4-4V6.83A3 3 0 1 1 20 6v2a6 6 0 0 1-6 6h-4c-.73 0-1.41-.2-2-.54v1.71a3 3 0 1 1-2 0V8.83A3 3 0 0 1 7 3Zm0 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm10-1a1 1 0 1 0 2 0 1 1 0 0 0-2 0ZM7 17a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z"
              />
            </svg>
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
            <Icon class="social-icon" icon="simple-icons:github"/>
          </a>

          <a
            class="social-link"
            href="mailto:18687419361@163.com"
            data-tooltip="给我发送邮件"
            aria-label="给我发送邮件"
          >
            <Icon class="social-icon" icon="mdi:email-outline"/>
          </a>

          <button
            type="button"
            class="social-link"
            data-tooltip="查看微信联系方式"
            aria-label="查看微信联系方式"
          >
            <Icon class="social-icon" icon="simple-icons:wechat"/>
          </button>

          <button
            type="button"
            class="social-link"
            data-tooltip="查看 QQ 联系方式"
            aria-label="查看 QQ 联系方式"
          >
            <Icon class="social-icon qq-icon" icon="simple-icons:tencentqq"/>
          </button>

          <a
            class="social-link"
            href="/atom.xml"
            target="_blank"
            rel="noopener noreferrer"
            data-tooltip="订阅 RSS"
            aria-label="订阅 RSS"
          >
            <Icon class="social-icon" icon="mdi:rss"/>
          </a>
        </div>
      </div>
      <RouterLink to="/posts" class="hero-scroll-down" aria-label="查看最新文章">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M7.4 6.2 12 10.8l4.6-4.6L18 7.6l-6 6-6-6 1.4-1.4Zm0 5L12 15.8l4.6-4.6L18 12.6l-6 6-6-6 1.4-1.4Z"
          />
        </svg>
      </RouterLink>
    </section>
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

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  color: #ffffff;
  text-decoration: none;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 1px;
  line-height: 1;

  transition: transform 0.2s,
  background 0.2s,
  border-color 0.2s,
  box-shadow 0.2s;
}

.hero-button-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.down-icon {
  width: 18px;
  height: 18px;
}

.fork-icon {
  width: 18px;
  height: 18px;
}

.hero-button.primary,
.hero-button.ghost {
  border: 1px solid rgba(255, 255, 255, 0.42);
  background: rgba(15, 23, 42, 0.18);
  box-shadow: none;
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

  display: inline-flex;
  align-items: center;
  justify-content: center;

  color: rgba(255, 255, 255, 0.82);
  text-decoration: none;

  transform: translateX(-50%);

  transition: color 0.2s,
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

  transition: color 0.2s,
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

  transition: opacity 0.2s,
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

  transition: opacity 0.2s,
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
