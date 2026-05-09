<script setup lang="ts">
import BlogNavbar from '@/components/blog/BlogNavbar.vue'
import homeBg1 from '@/assets/images/home-bg-1.jpg'
import homeBg2 from '@/assets/images/home-bg-2.jpg'
import homeBg3 from '@/assets/images/home-bg-3.jpg'
import homeBg4 from '@/assets/images/home-bg-4.jpg'
import homeBg5 from '@/assets/images/home-bg-5.jpg'
import homeBg6 from '@/assets/images/home-bg-6.jpg'
import homeBg7 from '@/assets/images/home-bg-7.jpg'
import homeBg8 from '@/assets/images/home-bg-8.jpg'
import {computed, ref} from "vue";

const backgroundImages = [homeBg1, homeBg2, homeBg3, homeBg4, homeBg5, homeBg6, homeBg7, homeBg8]

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
const lastIndex = lastIndexText === null ? undefined : Number(lastIndexText)

const currentIndex = ref(getRandomIndex(lastIndex))
const currentBackground = computed(() =>
  backgroundImages[currentIndex.value]
)

sessionStorage.setItem('rain_blog_home_bg_index', String(currentIndex.value))

const heroStyle = computed(() => {
  return {
    backgroundImage: `
    linear-gradient(
    rgba(0,0,0,0.4),
    rgba(0,0,0,0.4)
    ),
    url(${currentBackground.value})`
  }
})

function refreshHeroBackground() {
  currentIndex.value = getRandomIndex(currentIndex.value)
  sessionStorage.setItem('rain_blog_home_bg_index', String(currentIndex.value))
}
</script>

<template>
  <main>
    <BlogNavbar @refresh-home="refreshHeroBackground"/>
    <section class="hero" :style="heroStyle">
      <h1>Rain Blog</h1>
      <p>记录 Java 后端、Vue 前端与全栈成长</p>
      <div class="hero-actions">
        <div class="hero-actions">
          <a href="#latest-posts" class="hero-button primary">
            <svg class="hero-button-icon down-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M7.4 6.2 12 10.8l4.6-4.6L18 7.6l-6 6-6-6 1.4-1.4Zm0 5L12 15.8l4.6-4.6L18 12.6l-6 6-6-6 1.4-1.4Z"
              />
            </svg>
            <span>开始阅读</span>
          </a>

          <a
            href="https://github.com/RampageRain"
            class="hero-button ghost"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg class="hero-button-icon github-icon" viewBox="0 0 16 16" aria-hidden="true">
              <path
                fill="currentColor"
                d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38
        0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52
        -.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07
        -1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12
        0 0 .67-.21 2.2.82A7.65 7.65 0 0 1 8 3.87c.68.003 1.36.092 2 .27
        1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15
        0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48
        0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8Z"
              />
            </svg>
            <span>Github</span>
          </a>
        </div>
      </div>
      <div class="hero-socials">
        <a href="https://github.com/RampageRain" target="_blank">Github</a>
        <a href="mailto:18687419361@163.com">Email</a>
      </div>
    </section>
  </main>
</template>

<style scoped>
.hero {
  min-height: 100vh;
  min-height: 100dvh;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  color: #ffffff;

  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.hero h1 {
  margin: 0;
  font-size: 52px;
}

.hero p {
  margin-top: 16px;
  font-size: 18px;
}

.hero-actions {
  display: flex;
  gap: 34px;
  margin-top: 38px;
}

.hero-button {
  min-width: 160px;
  height: 50px;
  padding: 0 34px;
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
  box-shadow 0.2s;
}

.hero-button-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.down-icon {
  width: 19px;
  height: 19px;
}

.github-icon {
  width: 17px;
  height: 17px;
}

.hero-button.primary {
  background: rgba(255, 255, 255, 0.24);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.24);
}

.hero-button.ghost {
  border: 1px solid rgba(255, 255, 255, 0.46);
  background: rgba(15, 23, 42, 0.18);
}

.hero-button:hover {
  transform: translateY(-2px);
}

.hero-socials {
  display: flex;
  gap: 14px;
  margin-top: 24px;
}

.hero-socials a {
  width: 42px;
  height: 42px;
  border-radius: 50%;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  color: #ffffff;
  text-decoration: none;
  font-size: 12px;

  background: rgba(255, 255, 255, 0.16);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px);

  transition: background 0.2s,
  transform 0.2s;
}

.hero-socials a:hover {
  background: rgba(255, 255, 255, 0.28);
  transform: translateY(-2px);
}

@media (max-width: 600px) {
  .hero-actions {
    flex-direction: column;
    gap: 14px;
  }

  .hero-button {
    width: 180px;
  }
}
</style>
