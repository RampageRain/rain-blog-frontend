<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'

import BlogNavbar from '@/components/blog/BlogNavbar.vue'
import BlogFooter from '@/components/blog/BlogFooter.vue'
import BlogSideActions from '@/components/blog/BlogSideActions.vue'
import { useBlogTheme } from '@/composables/useBlogTheme'

import avatar from '@/assets/images/optimized/avart.webp'
import homeBg1 from '@/assets/images/optimized/home-bg-1.webp'
import homeBg2 from '@/assets/images/optimized/home-bg-2.webp'
import homeBg3 from '@/assets/images/optimized/home-bg-3.webp'
import homeBg4 from '@/assets/images/optimized/home-bg-4.webp'
import homeBg5 from '@/assets/images/optimized/home-bg-5.webp'
import homeBg6 from '@/assets/images/optimized/home-bg-6.webp'
import homeBg7 from '@/assets/images/optimized/home-bg-7.webp'
import homeBg8 from '@/assets/images/optimized/home-bg-8.webp'
import homeBg9 from '@/assets/images/optimized/home-bg-9.webp'
import homeBgMobile1 from '@/assets/images/optimized/home-bg-mobile-1.webp'
import loginBgMobile from '@/assets/images/optimized/login-bg-mobile.webp'
import postListBgLight from '@/assets/images/optimized/postlist-bg-light.webp'
import postListBgNight from '@/assets/images/optimized/postlist-bg-night.webp'

interface EChartsInstance {
  setOption: (option: unknown) => void
  resize: () => void
  dispose: () => void
}

interface EChartsGlobal {
  init: (element: HTMLElement) => EChartsInstance
}

declare global {
  interface Window {
    echarts?: EChartsGlobal
  }
}

const router = useRouter()
const { isLightTheme } = useBlogTheme()
const avatarClickCount = ref(0)
const publishChartRef = ref<HTMLElement | null>(null)
const categoryChartRef = ref<HTMLElement | null>(null)
const topPostChartRef = ref<HTMLElement | null>(null)

let avatarClickTimer: number | undefined
let chartInstances: EChartsInstance[] = []
let aboutCoverMediaQuery: MediaQueryList | undefined

const desktopCoverImages = [
  homeBg1,
  homeBg2,
  homeBg3,
  homeBg4,
  homeBg5,
  homeBg6,
  homeBg7,
  homeBg8,
  homeBg9,
]

const mobileCoverImages = [loginBgMobile, homeBgMobile1]

const coverMobileMedia = '(max-width: 800px)'
const desktopCoverStorageKey = 'rain_blog_about_cover_bg_index'
const mobileCoverStorageKey = 'rain_blog_about_cover_mobile_bg_index'

function readIsMobileCover() {
  if (typeof window === 'undefined') {
    return false
  }

  return window.matchMedia(coverMobileMedia).matches
}

const isMobileCover = ref(readIsMobileCover())

const activeCoverImages = computed(() => {
  return isMobileCover.value ? mobileCoverImages : desktopCoverImages
})

function getCoverStorageKey() {
  return isMobileCover.value ? mobileCoverStorageKey : desktopCoverStorageKey
}

function readLastCoverIndex(images: string[], storageKey: string) {
  const lastIndexText = sessionStorage.getItem(storageKey)
  const parsedLastIndex = Number(lastIndexText)

  return lastIndexText === null ||
    Number.isNaN(parsedLastIndex) ||
    parsedLastIndex < 0 ||
    parsedLastIndex >= images.length
    ? undefined
    : parsedLastIndex
}

function getRandomCoverIndex(images: string[], excludeIndex?: number) {
  if (images.length <= 1) {
    return 0
  }

  let index = Math.floor(Math.random() * images.length)

  while (index === excludeIndex) {
    index = Math.floor(Math.random() * images.length)
  }

  return index
}

function persistCurrentCoverIndex() {
  sessionStorage.setItem(getCoverStorageKey(), String(currentCoverIndex.value))
}

const initialCoverImages = activeCoverImages.value
const currentCoverIndex = ref(
  getRandomCoverIndex(
    initialCoverImages,
    readLastCoverIndex(initialCoverImages, getCoverStorageKey()),
  ),
)

const currentCoverBackground = computed(() => {
  const images = activeCoverImages.value

  return images[currentCoverIndex.value] ?? images[0]
})

persistCurrentCoverIndex()

const coverStyle = computed(() => {
  return {
    backgroundImage: `
      linear-gradient(
        rgba(0, 0, 0, 0.4),
        rgba(0, 0, 0, 0.4)
      ),
      url(${currentCoverBackground.value})
    `,
  }
})

function syncCoverBackgroundForViewport(matches: boolean) {
  if (isMobileCover.value === matches) {
    return
  }

  isMobileCover.value = matches

  const images = activeCoverImages.value
  const lastIndex = readLastCoverIndex(images, getCoverStorageKey())

  currentCoverIndex.value = getRandomCoverIndex(images, lastIndex)
  persistCurrentCoverIndex()
}

function handleCoverMediaChange(event: MediaQueryListEvent) {
  syncCoverBackgroundForViewport(event.matches)
}

const contentStyle = computed(() => {
  const currentBackground = isLightTheme.value ? postListBgLight : postListBgNight
  const overlayStart = isLightTheme.value ? 'rgba(255, 255, 255, 0.18)' : 'rgba(0, 0, 0, 0.46)'
  const overlayEnd = isLightTheme.value ? 'rgba(255, 255, 255, 0.28)' : 'rgba(0, 0, 0, 0.58)'

  return {
    backgroundImage: `
      linear-gradient(
        ${overlayStart},
        ${overlayEnd}
      ),
      url(${currentBackground})
    `,
  }
})

const postStats = [
  { name: '文章', count: '12' },
  { name: '分类', count: '6' },
  { name: '标签', count: '18' },
  { name: '访问', count: '8.6k' },
]

const publishStats = [
  ['1月', 2],
  ['2月', 3],
  ['3月', 5],
  ['4月', 4],
  ['5月', 8],
  ['6月', 6],
]

const categoryStats = [
  { name: '后端开发', value: 34 },
  { name: '前端开发', value: 28 },
  { name: '数据库', value: 18 },
  { name: '部署运维', value: 12 },
  { name: '生活随笔', value: 8 },
]

const topPosts = [
  { name: 'Spring Boot分页', views: 1280 },
  { name: 'MySQL索引优化', views: 1100 },
  { name: 'Redis缓存设计', views: 980 },
  { name: 'Vue详情页', views: 920 },
  { name: 'Docker部署', views: 850 },
  { name: 'TS类型体操', views: 760 },
  { name: 'OOM排查', views: 690 },
  { name: 'REST API', views: 610 },
  { name: 'Git工作流', views: 540 },
  { name: 'CSS Grid', views: 480 },
]

function handleAvatarClick() {
  avatarClickCount.value += 1

  if (avatarClickTimer !== undefined) {
    window.clearTimeout(avatarClickTimer)
  }

  if (avatarClickCount.value >= 5) {
    avatarClickCount.value = 0
    void router.push('/studio/login')
    return
  }

  avatarClickTimer = window.setTimeout(() => {
    avatarClickCount.value = 0
    avatarClickTimer = undefined
  }, 1600)
}

function loadECharts() {
  if (window.echarts) {
    return Promise.resolve(window.echarts)
  }

  return new Promise<EChartsGlobal>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>('script[data-rain-echarts]')
    if (existingScript) {
      existingScript.addEventListener('load', () => {
        if (window.echarts) {
          resolve(window.echarts)
        } else {
          reject(new Error('ECharts loaded without global object'))
        }
      })
      existingScript.addEventListener('error', () => reject(new Error('Failed to load ECharts')))
      return
    }

    const script = document.createElement('script')
    script.src = '/libs/echarts/echarts.min.js'
    script.async = true
    script.dataset.rainEcharts = 'true'
    script.onload = () => {
      if (window.echarts) {
        resolve(window.echarts)
      } else {
        reject(new Error('ECharts loaded without global object'))
      }
    }
    script.onerror = () => reject(new Error('Failed to load ECharts'))
    document.head.appendChild(script)
  })
}

function initCharts(echarts: EChartsGlobal) {
  chartInstances.forEach((chart) => chart.dispose())
  chartInstances = []
  const chartTextColor = isLightTheme.value ? '#64748b' : 'rgba(203, 213, 225, 0.86)'
  const chartTitleColor = isLightTheme.value ? '#34495e' : 'rgba(226, 232, 240, 0.9)'
  const chartAxisColor = isLightTheme.value ? '#cbd5e1' : 'rgba(148, 163, 184, 0.32)'
  const chartSplitColor = isLightTheme.value ? '#edf2f7' : 'rgba(226, 232, 240, 0.12)'

  if (publishChartRef.value) {
    const chart = echarts.init(publishChartRef.value)
    chart.setOption({
      color: ['#4169e1'],
      tooltip: { trigger: 'axis' },
      grid: { top: 38, right: 18, bottom: 34, left: 42 },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: publishStats.map((item) => item[0]),
        axisLine: { lineStyle: { color: chartAxisColor } },
        axisLabel: { color: chartTextColor },
      },
      yAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: chartSplitColor } },
        axisLabel: { color: chartTextColor },
      },
      series: [
        {
          name: '发布文章',
          type: 'line',
          smooth: true,
          symbolSize: 8,
          lineStyle: { width: 3 },
          areaStyle: { color: 'rgba(65, 105, 225, 0.14)' },
          data: publishStats.map((item) => item[1]),
        },
      ],
    })
    chartInstances.push(chart)
  }

  if (categoryChartRef.value) {
    const chart = echarts.init(categoryChartRef.value)
    chart.setOption({
      color: ['#4169e1', '#0000ff', '#60a5fa', '#7c3aed', '#cbd5e1'],
      tooltip: { trigger: 'item', formatter: '{b}: {c}%' },
      series: [
        {
          name: '文章分类',
          type: 'pie',
          radius: '68%',
          center: ['50%', '52%'],
          label: {
            formatter: '{b}',
            color: chartTitleColor,
            fontSize: 12,
          },
          labelLine: {
            length: 12,
            length2: 8,
          },
          data: categoryStats,
        },
      ],
    })
    chartInstances.push(chart)
  }

  if (topPostChartRef.value) {
    const chart = echarts.init(topPostChartRef.value)
    chart.setOption({
      color: ['#4169e1'],
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      grid: { top: 30, right: 12, bottom: 78, left: 48 },
      xAxis: {
        type: 'category',
        data: topPosts.map((post) => post.name),
        axisLine: { lineStyle: { color: chartAxisColor } },
        axisLabel: {
          color: chartTextColor,
          interval: 0,
          rotate: 42,
          fontSize: 10,
        },
      },
      yAxis: {
        type: 'value',
        name: '阅读量',
        nameTextStyle: { color: chartTextColor },
        splitLine: { lineStyle: { color: chartSplitColor } },
        axisLabel: { color: chartTextColor },
      },
      series: [
        {
          name: '阅读量',
          type: 'bar',
          barMaxWidth: 18,
          data: topPosts.map((post) => post.views),
        },
      ],
    })
    chartInstances.push(chart)
  }
}

function resizeCharts() {
  chartInstances.forEach((chart) => chart.resize())
}

watch(isLightTheme, async () => {
  await nextTick()
  if (window.echarts) {
    initCharts(window.echarts)
  }
})

onMounted(async () => {
  aboutCoverMediaQuery = window.matchMedia(coverMobileMedia)
  syncCoverBackgroundForViewport(aboutCoverMediaQuery.matches)
  aboutCoverMediaQuery.addEventListener('change', handleCoverMediaChange)

  await nextTick()
  const echarts = await loadECharts()
  initCharts(echarts)
  window.addEventListener('resize', resizeCharts)
})

onBeforeUnmount(() => {
  if (avatarClickTimer !== undefined) {
    window.clearTimeout(avatarClickTimer)
  }
  aboutCoverMediaQuery?.removeEventListener('change', handleCoverMediaChange)
  window.removeEventListener('resize', resizeCharts)
  chartInstances.forEach((chart) => chart.dispose())
  chartInstances = []
})
</script>

<template>
  <main
    class="about-page"
    :class="{
      'is-light-theme': isLightTheme,
      'is-night-theme': !isLightTheme,
    }"
  >
    <BlogNavbar />

    <section class="about-cover" :style="coverStyle"></section>

    <section class="about-content" :style="contentStyle">
      <section id="aboutme" class="about-container card">
        <article class="profile-card">
          <div class="profile">
            <button
              type="button"
              class="avatar-button"
              aria-label="Rain avatar"
              @click="handleAvatarClick"
            >
              <img class="avatar-img" :src="avatar" alt="Rain" />
            </button>

            <div class="author">
              <h2 class="title">Rain</h2>
              <p class="career">全栈开发者 / 技术记录者 / 持续创作者</p>

              <div class="post-statis">
                <span v-for="stat in postStats" :key="stat.name" class="statis">
                  <strong class="count">{{ stat.count }}</strong>
                  <span class="name">{{ stat.name }}</span>
                </span>
              </div>
            </div>
          </div>

          <div class="social-link">
            <a
              href="https://github.com/RampageRain"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <Icon icon="fa-brands:github" aria-hidden="true" />
            </a>
            <a href="mailto:18687419361@163.com" aria-label="Email">
              <Icon icon="fa-solid:envelope-open" aria-hidden="true" />
            </a>
            <a href="/atom.xml" target="_blank" rel="noopener noreferrer" aria-label="RSS">
              <Icon icon="fa-solid:rss" aria-hidden="true" />
            </a>
          </div>

          <p class="introduction">
            这里是 Rain
            Blog。这个博客用于沉淀技术实践、项目复盘和日常学习笔记。希望内容能保持清晰、真实、可复用，也让写作本身成为整理思路的一部分。
          </p>
        </article>

        <section class="post-charts">
          <h2 class="title">文章统计图</h2>

          <div class="chart-grid">
            <article class="chart-card">
              <h3>文章发布统计图</h3>
              <div ref="publishChartRef" class="echart-box"></div>
            </article>

            <article class="chart-card">
              <h3>文章分类统计图</h3>
              <div ref="categoryChartRef" class="echart-box"></div>
            </article>

            <article class="chart-card">
              <h3>TOP10 文章阅读量</h3>
              <div ref="topPostChartRef" class="echart-box"></div>
            </article>
          </div>
        </section>
      </section>

      <BlogFooter />
    </section>
    <BlogSideActions show-desktop-top />
  </main>
</template>

<style scoped>
.about-page {
  min-height: 100vh;
  min-height: 100dvh;
  color: #34495e;
  transition: color 0.28s ease;
}

.about-page.is-night-theme {
  color: rgba(248, 250, 252, 0.96);
}

.about-cover {
  min-height: 100vh;
  min-height: 100dvh;
  padding: 116px 24px 220px;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}

.about-content {
  padding-bottom: 1px;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
}

.about-container {
  width: 90%;
  max-width: 1225px;
  margin: -220px auto 42px;
}

.card {
  border-radius: 8px;
  background: #ffffff;
  box-shadow:
    0 10px 35px 2px rgba(0, 0, 0, 0.15),
    0 5px 15px rgba(0, 0, 0, 0.07),
    0 2px 5px -5px rgba(0, 0, 0, 0.1);
}

.about-page.is-night-theme .card {
  background: #0f172a;
  box-shadow:
    0 20px 44px rgba(0, 0, 0, 0.3),
    inset 0 0 0 1px rgba(255, 255, 255, 0.08);
}

.profile-card {
  padding: 0 24px 0;
  text-align: center;
}

.avatar-button {
  width: min(160px, 42vw);
  aspect-ratio: 1;
  margin: 0 auto;
  padding: 5px;
  border: 0;
  border-radius: 50%;
  display: block;
  background: #ffffff;
  box-shadow:
    0 14px 34px rgba(15, 23, 42, 0.16),
    inset 0 0 0 1px rgba(255, 255, 255, 0.85);
  cursor: default;
  transform: translate3d(0, -65%, 0);
}

.about-page.is-night-theme .avatar-button {
  background: #ffffff;
  box-shadow:
    0 14px 34px rgba(0, 0, 0, 0.34),
    inset 0 0 0 1px rgba(255, 255, 255, 0.18);
}

.profile .avatar-img {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  display: block;
  border-radius: 50%;
  object-fit: cover;
}

.profile .author {
  margin-top: -80px;
}

.profile .author .title {
  margin: 0 0 0.1rem;
  color: #3c4858;
  font-size: 1.8rem;
  font-weight: 500;
}

.about-page.is-night-theme .profile .author .title {
  color: rgba(248, 250, 252, 0.96);
}

.profile .author .career {
  margin: 8px 0;
  color: #777;
  font-size: 0.9rem;
  font-weight: 400;
}

.about-page.is-night-theme .profile .author .career,
.about-page.is-night-theme .post-statis .name {
  color: rgba(203, 213, 225, 0.86);
}

.post-statis {
  margin: 0.5rem 0 1.4rem;
  text-align: center;
}

.post-statis .statis {
  display: inline-block;
  padding: 0.3rem 0.8rem;
  text-align: center;
  letter-spacing: 0.03rem;
}

.post-statis .count {
  display: block;
  color: #0000cd;
  font-size: 1.3rem;
  font-weight: bold;
  text-decoration: underline;
}

.about-page.is-night-theme .post-statis .count {
  color: #93c5fd;
}

.post-statis .name {
  color: #777;
  font-size: 0.9rem;
}

#aboutme .social-link {
  margin: 1.5rem 0 0.8rem;
  text-align: center;
}

#aboutme .social-link a {
  width: 2.3rem;
  height: 2.3rem;
  margin: 0 0.5rem;
  border: 1px solid #4169e1;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  background: radial-gradient(#0000ff, #4169e1);
  box-shadow:
    0 4px 6px rgba(50, 50, 93, 0.21),
    0 2px 3px rgba(0, 0, 0, 0.1);
}

#aboutme .introduction {
  max-width: 600px;
  margin: 1.5rem auto 3rem;
  color: #777;
  font-size: 15px;
  line-height: 1.9;
}

.about-page.is-night-theme #aboutme .introduction {
  color: rgba(203, 213, 225, 0.86);
}

.post-charts {
  padding: 3.8rem 1.5rem 0.8rem;
}

.post-charts .title {
  margin: 0 0 2.25rem;
  color: #3c4858;
  font-size: 2rem;
  font-weight: 500;
  text-align: center;
}

.about-page.is-night-theme .post-charts .title {
  color: rgba(248, 250, 252, 0.96);
}

.chart-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
  align-items: start;
}

.chart-card {
  min-width: 0;
  padding: 0 10px;
  background: transparent;
}

.chart-card h3 {
  margin: 0 0 1rem;
  color: #34495e;
  font-size: 1.1rem;
  font-weight: 500;
  text-align: center;
}

.about-page.is-night-theme .chart-card h3 {
  color: rgba(226, 232, 240, 0.9);
}

.echart-box {
  width: 100%;
  height: 290px;
}

@media (max-width: 900px) {
  .chart-grid {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  .about-container {
    width: 95%;
  }
}

@media (max-width: 640px) {
  .about-cover {
    min-height: 100vh;
    min-height: 100dvh;
    padding: 98px 20px 170px;
  }

  .profile-card {
    padding-right: 16px;
    padding-left: 16px;
  }
}
</style>
