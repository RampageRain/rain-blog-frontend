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
        <a href="#lasts-posts" class="hero-button primary">
          开始阅读
        </a>
        <a href="https://github.com/RampageRain" class="hero-button ghost" target="_blank"
           rel="noopener noreferrer">Github</a>
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
  min-width: 148px;
  height: 50px;
  padding: 0 32px;
  border-radius: 999px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  color: #ffffff;
  text-decoration: none;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 1px;

  transition: transform 0.2s,
  background 0.2s,
  box-shadow 0.2s;
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
