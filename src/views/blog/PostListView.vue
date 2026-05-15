<script setup lang="ts">
import {Icon} from '@iconify/vue'
import {computed, nextTick, onBeforeUnmount, onMounted, ref} from 'vue'

import BlogNavbar from '@/components/blog/BlogNavbar.vue'
import BlogFooter from '@/components/blog/BlogFooter.vue'
import BackTop from '@/components/blog/BackTop.vue'
import { useBlogTheme } from '@/composables/useBlogTheme'

import postCover1 from '@/assets/images/home-bg-1.jpg'
import postCover2 from '@/assets/images/home-bg-2.jpg'
import postCover3 from '@/assets/images/home-bg-3.jpg'
import postCover4 from '@/assets/images/home-bg-4.jpg'
import postCover5 from '@/assets/images/home-bg-5.jpg'
import postCover6 from '@/assets/images/home-bg-6.jpg'
import postListBgLight from '@/assets/images/postlist-bg-light.jpg'
import postListBgNight from '@/assets/images/postlist-bg-night.jpg'
import quoteBg from '@/assets/images/intro-card-img.jpg'
import avatar from '@/assets/images/avart.jpg'

interface Post {
  id: number
  title: string
  summary: string
  category: string
  tags: string[]
  date: string
  views: number
  cover: string
}

interface ProfileStat {
  type: 'article' | 'category' | 'tag' | 'view'
  label: string
  value: string
}

interface IntroMeta {
  type: 'location' | 'writing' | 'code'
  text: string
}

const props = withDefaults(
  defineProps<{
    embedded?: boolean
    sectionId?: string
  }>(),
  {
    embedded: false,
    sectionId: 'posts'
  }
)

const posts: Post[] = [
  {
    id: 1,
    title: 'Spring Boot 3.2 新特性探索',
    summary:
      '记录 Spring Boot 3.2 中的一些重要更新与实践，包括性能优化、Starter 配置变化等内容。',
    category: '后端开发',
    tags: ['Spring Boot', 'Java', '后端'],
    date: '2026-05-08',
    views: 1200,
    cover: postCover1
  },
  {
    id: 2,
    title: 'Vue 3 响应式原理理解',
    summary:
      '从 ref、computed、watch 到组件通信，系统梳理 Vue 3 响应式开发的核心概念。',
    category: '前端开发',
    tags: ['Vue 3', 'TypeScript', '前端'],
    date: '2026-05-08',
    views: 856,
    cover: postCover2
  },
  {
    id: 3,
    title: 'MySQL 索引优化实战',
    summary:
      '通过实际案例理解 MySQL 索引设计、执行计划分析和慢查询优化思路。',
    category: '数据库',
    tags: ['MySQL', '索引', '性能优化'],
    date: '2026-05-07',
    views: 1100,
    cover: postCover3
  },
  {
    id: 4,
    title: 'Redis 缓存在博客系统中的应用',
    summary:
      '记录 Redis 在访问统计、登录态保存、热门文章缓存等场景中的使用方式。',
    category: '缓存中间件',
    tags: ['Redis', '缓存', '中间件'],
    date: '2026-05-07',
    views: 732,
    cover: postCover4
  },
  {
    id: 5,
    title: 'Docker 入门到博客部署',
    summary:
      '从 Docker 基础概念到前后端分离项目部署，整理容器化部署的核心流程。',
    category: '运维部署',
    tags: ['Docker', '部署'],
    date: '2026-05-06',
    views: 645,
    cover: postCover5
  },
  {
    id: 6,
    title: '设计一个高并发博客系统',
    summary:
      '从系统设计角度思考个人博客如何支持高可用、可扩展和高并发访问。',
    category: '未分类',
    tags: [],
    date: '2026-05-05',
    views: 1500,
    cover: postCover6
  },
  {
    id: 7,
    title: 'Nginx Reverse Proxy Guide',
    summary:
      'Notes on Nginx reverse proxy, static cache strategy, and HTTPS certificate deployment for split frontend/backend apps.',
    category: 'Backend',
    tags: ['Nginx', 'HTTPS', 'Deploy'],
    date: '2026-05-04',
    views: 980,
    cover: postCover1
  },
  {
    id: 8,
    title: 'Pinia Store Patterns',
    summary:
      'Practical notes on module splitting, persistence, async actions, and type inference in Vue 3 projects.',
    category: 'Frontend',
    tags: ['Vue 3', 'Pinia', 'TypeScript'],
    date: '2026-05-04',
    views: 768,
    cover: postCover2
  },
  {
    id: 9,
    title: 'JWT Auth Flow Notes',
    summary:
      'A complete walkthrough from login, token issuing, token refresh, to API authorization in frontend/backend apps.',
    category: 'Backend',
    tags: ['JWT', 'Auth', 'Security'],
    date: '2026-05-03',
    views: 1124,
    cover: postCover3
  },
  {
    id: 10,
    title: 'Comment System Design',
    summary:
      'Design notes for comments, nested replies, sensitive word filtering, and notification workflows.',
    category: 'Design',
    tags: ['Comment', 'Design'],
    date: '2026-05-03',
    views: 689,
    cover: postCover4
  },
  {
    id: 11,
    title: 'Elasticsearch Search Integration',
    summary:
      'Implement full-text search for titles, summaries, and tags with index design, Chinese analysis, and highlights.',
    category: 'Search',
    tags: ['Elasticsearch', 'Search', 'Analyzer'],
    date: '2026-05-02',
    views: 834,
    cover: postCover5
  },
  {
    id: 12,
    title: 'Frontend Performance Checklist',
    summary:
      'A checklist for bundle splitting, image compression, lazy loading, cache strategy, and first screen rendering.',
    category: 'Frontend',
    tags: ['Performance', 'Vite', 'Lazy Load'],
    date: '2026-05-02',
    views: 1260,
    cover: postCover6
  },
  {
    id: 13,
    title: 'GitHub Actions Deployment',
    summary:
      'Use GitHub Actions to build frontend assets, upload artifacts, and publish to the server automatically.',
    category: 'DevOps',
    tags: ['GitHub Actions', 'CI/CD'],
    date: '2026-05-01',
    views: 705,
    cover: postCover1
  },
  {
    id: 14,
    title: 'API Rate Limiting Strategy',
    summary:
      'Compare IP, user, and route based rate limits with Redis counters and token bucket scenarios.',
    category: 'Backend',
    tags: ['Rate Limit', 'Redis', 'Security'],
    date: '2026-05-01',
    views: 903,
    cover: postCover2
  },
  {
    id: 15,
    title: 'Spring Security ??????',
    summary:
      '??????????????????????????????????',
    category: '????',
    tags: ['Spring Security', '??', '??'],
    date: '2026-04-30',
    views: 1018,
    cover: postCover3
  },
  {
    id: 16,
    title: 'Vue ?????????',
    summary:
      '??????????????props ?????????????????',
    category: '????',
    tags: ['Vue 3', '????', '??'],
    date: '2026-04-30',
    views: 876,
    cover: postCover4
  },
  {
    id: 17,
    title: '??????????',
    summary:
      '???????????????????????????????????',
    category: '????',
    tags: ['??', '??', '??'],
    date: '2026-04-29',
    views: 642,
    cover: postCover5
  }
]

const introMetas: IntroMeta[] = [
  {
    type: 'location',
    text: '中国'
  },
  {
    type: 'writing',
    text: '持续创作中'
  },
  {
    type: 'code',
    text: '代码即生活'
  }
]

const profileStats: ProfileStat[] = [
  {
    type: 'article',
    label: '文章',
    value: '6'
  },
  {
    type: 'category',
    label: '分类',
    value: '5'
  },
  {
    type: 'tag',
    label: '标签',
    value: '12'
  },
  {
    type: 'view',
    label: '访问',
    value: '1.2k'
  }
]

const quoteStyle = {
  backgroundImage: `url(${quoteBg})`
}

const { isLightTheme } = useBlogTheme()

const firstPagePostCount = 6
const otherPagePostCount = 9
const currentPage = ref(1)
const postsContainerRef = ref<HTMLElement | null>(null)

const isMobilePostList = ref(false)

const showIntroCard = computed(() => {
  return !isMobilePostList.value && currentPage.value === 1
})

const firstPageCapacity = computed(() => {
  return isMobilePostList.value ? otherPagePostCount : firstPagePostCount
})

const currentPageCapacity = computed(() => {
  return showIntroCard.value ? firstPagePostCount : otherPagePostCount
})

const totalPages = computed(() => {
  const remainingPosts = Math.max(0, posts.length - firstPageCapacity.value)

  return 1 + Math.ceil(remainingPosts / otherPagePostCount)
})

const paginatedPosts = computed(() => {
  if (currentPage.value === 1) {
    return posts.slice(0, firstPageCapacity.value)
  }

  const start = firstPageCapacity.value + (currentPage.value - 2) * otherPagePostCount

  return posts.slice(start, start + otherPagePostCount)
})

const postPlaceholders = computed(() => {
  return Array.from(
    { length: Math.max(0, currentPageCapacity.value - paginatedPosts.value.length) },
    (_, index) => index
  )
})

async function scrollToPostsContainer() {
  await nextTick()

  const targetElement = postsContainerRef.value

  if (!targetElement) {
    return
  }

  const navbarHeight = isMobilePostList.value ? 60 : 64
  const overlapOffset = isMobilePostList.value ? 28 : 24
  const targetTop =
    targetElement.getBoundingClientRect().top + window.scrollY - navbarHeight + overlapOffset

  window.scrollTo({
    top: targetTop,
    behavior: 'smooth'
  })
}

function setCurrentPage(page: number) {
  if (page < 1 || page > totalPages.value || page === currentPage.value) {
    return
  }

  currentPage.value = page
  void scrollToPostsContainer()
}

const pageStyle = computed(() => {
  const currentBackground = isLightTheme.value ? postListBgLight : postListBgNight
  const overlayStart = isLightTheme.value
    ? 'rgba(255, 255, 255, 0.18)'
    : 'rgba(0, 0, 0, 0.46)'
  const overlayEnd = isLightTheme.value
    ? 'rgba(255, 255, 255, 0.28)'
    : 'rgba(0, 0, 0, 0.58)'

  return {
    backgroundImage: `
      linear-gradient(
        ${overlayStart},
        ${overlayEnd}
      ),
      url(${currentBackground})
    `
  }
})

const signatureDisplayText = '保持热爱，奔赴山海；在代码的世界里，不断成长。'
const displayedSignature = ref('')
const isSignatureTyping = ref(false)

let signatureIntervalId: number | undefined
let mobilePostListMediaQuery: MediaQueryList | undefined

function startTypingSignature() {
  let index = 0

  isSignatureTyping.value = true

  signatureIntervalId = window.setInterval(() => {
    displayedSignature.value = signatureDisplayText.slice(0, index + 1)
    index++

    if (index === signatureDisplayText.length) {
      isSignatureTyping.value = false

      if (signatureIntervalId !== undefined) {
        window.clearInterval(signatureIntervalId)
        signatureIntervalId = undefined
      }
    }
  }, 120)
}

function handleMobilePostListChange(event: MediaQueryListEvent) {
  isMobilePostList.value = event.matches
}

onMounted(() => {
  mobilePostListMediaQuery = window.matchMedia('(max-width: 800px)')
  isMobilePostList.value = mobilePostListMediaQuery.matches
  mobilePostListMediaQuery.addEventListener('change', handleMobilePostListChange)

  startTypingSignature()
})

onBeforeUnmount(() => {
  if (signatureIntervalId !== undefined) {
    window.clearInterval(signatureIntervalId)
  }

  mobilePostListMediaQuery?.removeEventListener('change', handleMobilePostListChange)
})
</script>

<template>
  <div
    :id="props.sectionId"
    :class="[
      'posts-page',
      {
        'is-embedded': props.embedded,
        'is-light-theme': isLightTheme,
        'is-night-theme': !isLightTheme
      }
    ]"
    :style="pageStyle"
  >
    <BlogNavbar v-if="!props.embedded"/>

    <section class="posts-content">
      <section v-if="showIntroCard" class="intro-card" :style="quoteStyle">
        <div class="intro-layout">
          <div class="intro-info-panel">
            <div class="avatar-wrapper">
              <img class="intro-avatar" :src="avatar" alt="Rain Blog"/>
            </div>

            <div class="intro-basic">
              <h2>Rain</h2>

              <p class="intro-role">
                全栈开发者 · 技术记录者 · 探索者
              </p>

              <p class="intro-signature">
                记录 Java 后端、Vue 前端与全栈成长，分享学习心得和项目实践。
              </p>

              <div class="intro-meta">
          <span
            v-for="meta in introMetas"
            :key="meta.text"
            class="intro-meta-item"
          >
            <svg
              v-if="meta.type === 'location'"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 21s6-5.3 6-11a6 6 0 1 0-12 0c0 5.7 6 11 6 11z"/>
              <circle cx="12" cy="10" r="2.2"/>
            </svg>

            <svg
              v-else-if="meta.type === 'writing'"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M5 5.5h11.5a2.5 2.5 0 0 1 0 5H5z"/>
              <path d="M5 10.5h10.5a2.5 2.5 0 0 1 0 5H5z"/>
              <path d="M5 15.5h9a2.5 2.5 0 0 1 0 5H5z"/>
            </svg>

            <svg
              v-else
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="m9 7-5 5 5 5"/>
              <path d="m15 7 5 5-5 5"/>
              <path d="m13 5-2 14"/>
            </svg>

            <span>{{ meta.text }}</span>
          </span>
              </div>
            </div>

            <div class="profile-stats">
              <div
                v-for="stat in profileStats"
                :key="stat.label"
                class="profile-stat"
              >
          <span class="stat-icon">
            <Icon
              v-if="stat.type === 'article'"
              icon="solar:document-text-linear"
              aria-hidden="true"
            />
            <Icon
              v-else-if="stat.type === 'category'"
              icon="solar:layers-linear"
              aria-hidden="true"
            />
            <Icon
              v-else-if="stat.type === 'tag'"
              icon="solar:tag-linear"
              aria-hidden="true"
            />
            <Icon
              v-else
              icon="solar:eye-linear"
              aria-hidden="true"
            />
          </span>

                <div class="stat-content">
                  <strong>{{ stat.value }}</strong>
                  <span>{{ stat.label }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="intro-image-panel">
            <div class="intro-image-content">
              <span class="quote-mark">“</span>
              <p class="intro-quote-text">
                保持热爱，奔赴山海；在代码的世界里，不断成长。
                <span class="intro-quote-live">{{ displayedSignature }}</span><span
                v-if="isSignatureTyping" class="typing-cursor"></span></p>
            </div>
          </div>
        </div>
      </section>

      <section ref="postsContainerRef" class="posts-container">
        <article
          v-for="(post, index) in paginatedPosts"
          :key="post.id"
          class="post-card"
        >
          <div class="post-cover">
            <div class="post-cover-backdrop" aria-hidden="true">
              <img
                :src="post.cover"
                alt=""
                :loading="index < 2 ? 'eager' : 'lazy'"
                :fetchpriority="index === 0 ? 'high' : 'auto'"
                decoding="async"
              />
            </div>
            <img
              class="post-cover-image"
              :src="post.cover"
              :alt="post.title"
              :loading="index < 2 ? 'eager' : 'lazy'"
              :fetchpriority="index === 0 ? 'high' : 'auto'"
              decoding="async"
            />

            <div class="post-cover-mask">
              <h2 class="post-cover-title">
                {{ post.title }}
              </h2>
            </div>
          </div>

          <div class="post-content">
            <p class="post-summary">
              {{ post.summary }}
            </p>

            <div class="post-meta">
              <span>{{ post.date }}</span>
              <span>{{ post.views }} 阅读</span>
            </div>

            <div
              class="post-card-action"
              :class="{ 'is-empty': !post.category && post.tags.length === 0 }"
            >
              <div class="article-tags">
                <span
                  v-if="post.category"
                  class="chip bg-color"
                  :class="{ 'grey-chip': post.category === '未分类' }"
                >
                  {{ post.category }}
                </span>

                <span
                  v-for="tag in post.tags"
                  :key="tag"
                  class="chip bg-color"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </article>

        <article
          v-for="index in postPlaceholders"
          :key="`placeholder-${index}`"
          class="post-card post-card-placeholder"
          aria-hidden="true"
        ></article>
      </section>

      <section
        v-if="totalPages > 1"
        class="pagination-section"
        aria-label="Post pagination"
      >
        <div class="pagination-control pagination-control-prev">
          <button
            type="button"
            class="pagination-button pagination-prev"
            :disabled="currentPage === 1"
            aria-label="Previous page"
            @click="setCurrentPage(currentPage - 1)"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M15.4 6.2 10.8 12l4.6 5.8L13.8 19 8 12l5.8-7 1.6 1.2Z"
              />
            </svg>
          </button>
        </div>

        <div class="pagination-info">
          <span>{{ currentPage }}</span>
          <em>/</em>
          <span>{{ totalPages }}</span>
        </div>

        <div class="pagination-control pagination-control-next">
          <button
            type="button"
            class="pagination-button pagination-next"
            :disabled="currentPage === totalPages"
            aria-label="Next page"
            @click="setCurrentPage(currentPage + 1)"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M8.6 17.8 13.2 12 8.6 6.2 10.2 5 16 12l-5.8 7-1.6-1.2Z"
              />
            </svg>
          </button>
        </div>
      </section>
    </section>
    <BlogFooter/>
    <BackTop/>
  </div>
</template>

<style scoped>
.posts-page {
  --theme-intro-bg-color: #0f172a;
  --theme-intro-panel: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.76),
    rgba(255, 255, 255, 0.48)
  );
  --theme-text: #0f172a;
  --theme-muted: #64748b;
  --theme-soft-text: #475569;
  --theme-subtle: #94a3b8;
  --theme-accent: #0430f9;
  --theme-meta-stroke: rgba(15, 23, 42, 0.58);
  --theme-avatar-bg: rgba(226, 232, 240, 0.86);
  --theme-avatar-shadow: 0 14px 34px rgba(15, 23, 42, 0.16),
    inset 0 0 0 1px rgba(255, 255, 255, 0.85);
  --theme-online-dot: linear-gradient(135deg, #0430f9, #65368b);
  --theme-online-border: #ffffff;
  --theme-online-shadow: 0 4px 12px rgba(15, 23, 42, 0.2);
  --theme-stat-bg: rgba(248, 250, 252, 0.8);
  --theme-stat-shadow: inset 0 0 0 1px rgba(226, 232, 240, 0.9),
    0 10px 24px rgba(15, 23, 42, 0.06);
  --theme-stat-hover-shadow: inset 0 0 0 1px rgba(99, 102, 241, 0.22),
    0 14px 30px rgba(15, 23, 42, 0.1);
  --theme-stat-icon-color: #1d4ed8;
  --theme-stat-icon-bg: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.96),
    rgba(219, 234, 254, 0.86)
  );
  --theme-stat-icon-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.82),
    0 10px 22px rgba(37, 99, 235, 0.16);
  --theme-card-bg: rgba(255, 255, 255, 0.9);
  --theme-card-shadow: 0 15px 35px rgba(50, 50, 93, 0.1),
    0 5px 15px rgba(0, 0, 0, 0.07);
  --theme-card-hover-shadow: 0 18px 38px rgba(50, 50, 93, 0.14),
    0 8px 18px rgba(0, 0, 0, 0.09);
  --theme-cover-tint: rgba(15, 23, 42, 0.2);
  --theme-divider: rgb(139 139 139 / 0.2);
  --theme-chip-bg: linear-gradient(to right, #60d0df 0%, #0101fe 100%);
  --theme-muted-chip-bg: linear-gradient(to right, #60d0df 0%, #5454b6 100%);
  --theme-pagination-button-bg: linear-gradient(135deg, #60d0df 0%, #0101fe 100%);
  --theme-pagination-button-shadow: 0 14px 28px rgba(1, 1, 254, 0.22);
  --theme-pagination-disabled-bg: rgba(203, 213, 225, 0.82);
  --theme-pagination-disabled-color: rgba(100, 116, 139, 0.72);
  --theme-pagination-info-text: #475569;
  --post-card-min-height: 360px;

  position: relative;
  min-height: 100vh;
  padding-top: 96px;
  color: var(--theme-text);
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  transition: color 0.28s ease;
}

.posts-page.is-night-theme {
  --theme-intro-bg-color: #020617;
  --theme-intro-panel: linear-gradient(
    135deg,
    rgba(15, 23, 42, 0.82),
    rgba(30, 41, 59, 0.58)
  );
  --theme-text: rgba(248, 250, 252, 0.96);
  --theme-muted: rgba(203, 213, 225, 0.84);
  --theme-soft-text: rgba(226, 232, 240, 0.88);
  --theme-subtle: rgba(148, 163, 184, 0.82);
  --theme-accent: #93c5fd;
  --theme-meta-stroke: rgba(226, 232, 240, 0.72);
  --theme-avatar-bg: rgba(15, 23, 42, 0.78);
  --theme-avatar-shadow: 0 14px 34px rgba(0, 0, 0, 0.34),
    inset 0 0 0 1px rgba(255, 255, 255, 0.18);
  --theme-online-dot: linear-gradient(135deg, #38bdf8, #818cf8);
  --theme-online-border: rgba(15, 23, 42, 0.88);
  --theme-online-shadow: 0 4px 16px rgba(14, 165, 233, 0.28);
  --theme-stat-bg: rgba(15, 23, 42, 0.62);
  --theme-stat-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.12),
    0 12px 28px rgba(0, 0, 0, 0.22);
  --theme-stat-hover-shadow: inset 0 0 0 1px rgba(147, 197, 253, 0.28),
    0 16px 34px rgba(0, 0, 0, 0.28);
  --theme-stat-icon-color: #bfdbfe;
  --theme-stat-icon-bg: linear-gradient(
    135deg,
    rgba(30, 41, 59, 0.96),
    rgba(37, 99, 235, 0.34)
  );
  --theme-stat-icon-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.14),
    0 10px 22px rgba(14, 165, 233, 0.14);
  --theme-card-bg: rgba(15, 23, 42, 0.78);
  --theme-card-shadow: 0 18px 40px rgba(0, 0, 0, 0.24),
    inset 0 0 0 1px rgba(255, 255, 255, 0.1);
  --theme-card-hover-shadow: 0 22px 48px rgba(0, 0, 0, 0.3),
    inset 0 0 0 1px rgba(147, 197, 253, 0.18);
  --theme-cover-tint: rgba(2, 6, 23, 0.32);
  --theme-divider: rgba(226, 232, 240, 0.16);
  --theme-chip-bg: linear-gradient(to right, #38bdf8 0%, #2563eb 100%);
  --theme-muted-chip-bg: linear-gradient(to right, #38bdf8 0%, #475569 100%);
  --theme-pagination-button-bg: linear-gradient(135deg, #38bdf8 0%, #2563eb 100%);
  --theme-pagination-button-shadow: 0 14px 30px rgba(14, 165, 233, 0.2);
  --theme-pagination-disabled-bg: rgba(15, 23, 42, 0.54);
  --theme-pagination-disabled-color: rgba(203, 213, 225, 0.42);
  --theme-pagination-info-text: rgba(226, 232, 240, 0.9);
}

.posts-page.is-embedded {
  min-height: auto;
  padding-top: 36px;
}

.posts-page.is-embedded .posts-content {
  padding-bottom: 96px;
}

.posts-content {
  position: relative;
  z-index: 1;

  width: min(1180px, calc(100% - 48px));
  margin: 0 auto;
  padding-bottom: 15px;
}

.intro-card {
  width: 100%;
  margin-bottom: 34px;
  padding: 0;
  border-radius: 24px;

  overflow: hidden;

  background-color: var(--theme-intro-bg-color);
  background-size: cover;
  background-position: center 50%;
  background-repeat: no-repeat;
  box-shadow: 0 18px 48px rgba(15, 23, 42, 0.2);
}

.intro-layout {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(280px, 1fr);
  gap: 0;
  align-items: stretch;
}

.intro-info-panel {
  min-width: 0;
  padding: 42px 38px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  background: var(--theme-intro-panel);
  backdrop-filter: blur(12px);
  transition: background 0.28s ease;
}

.avatar-wrapper {
  position: relative;

  width: 132px;
  height: 132px;
  padding: 5px;
  border-radius: 50%;

  flex-shrink: 0;

  background: var(--theme-avatar-bg);
  box-shadow: var(--theme-avatar-shadow);
}

.avatar-wrapper::after {
  content: '';

  position: absolute;
  right: 12px;
  bottom: 12px;

  width: 18px;
  height: 18px;
  border-radius: 50%;

  background: var(--theme-online-dot);
  border: 3px solid var(--theme-online-border);
  box-shadow: var(--theme-online-shadow);
}

.intro-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;

  object-fit: cover;
  background: var(--theme-avatar-bg);
}

.intro-basic {
  margin-top: 18px;
  text-align: center;
}

.intro-basic h2 {
  margin: 0;

  color: var(--theme-text);
  font-size: 42px;
  font-weight: 900;
  letter-spacing: 0.5px;
}

.intro-role {
  margin: 10px 0 0;

  color: var(--theme-accent);
  font-size: 16px;
  font-weight: 700;
}

.intro-signature {
  max-width: 560px;
  margin: 16px auto 0;

  color: var(--theme-soft-text);
  font-size: 16px;
  line-height: 1.9;
}

.intro-meta {
  margin-top: 20px;

  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 14px;

  color: var(--theme-muted);
  font-size: 14px;
}

.intro-meta-item {
  display: inline-flex;
  align-items: center;
  gap: 7px;
}

.intro-meta-item svg {
  width: 16px;
  height: 16px;

  fill: none;
  stroke: var(--theme-meta-stroke);
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.profile-stats {
  width: 100%;
  margin-top: 30px;

  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
}

.profile-stat {
  min-height: 82px;
  padding: 16px 14px;
  border-radius: 16px;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  background: var(--theme-stat-bg);
  box-shadow: var(--theme-stat-shadow);

  transition:
    background 0.28s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.profile-stat:hover {
  transform: translateY(-2px);
  box-shadow: var(--theme-stat-hover-shadow);
}

.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 14px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  color: var(--theme-stat-icon-color);

  background: var(--theme-stat-icon-bg);
  box-shadow: var(--theme-stat-icon-shadow);
}

.stat-icon svg {
  width: 21px;
  height: 21px;

  fill: none;
  stroke: currentColor;
  stroke-width: 1.75;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.stat-content strong {
  color: var(--theme-text);
  font-size: 23px;
  font-weight: 900;
  line-height: 1;
}

.stat-content span {
  color: var(--theme-muted);
  font-size: 14px;
}

.intro-image-panel {
  min-height: 360px;
  padding: 34px 30px;

  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
}

.intro-image-content {
  width: min(100%, 280px);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.quote-mark {
  font-size: 0;
  line-height: 1;
}

.quote-mark::before {
  content: '“';
  color: rgba(255, 255, 255, 0.88);
  font-size: 54px;
  font-weight: 900;
  line-height: 1;
  text-shadow: 0 3px 10px rgba(15, 23, 42, 0.44),
  0 8px 20px rgba(15, 23, 42, 0.2);
}

.intro-quote-text {
  min-height: 3em;
  margin: 8px 0 0;
  font-size: 0;
  line-height: 1.9;
}

.intro-quote-live {
  color: rgba(255, 255, 255, 0.98);
  font-size: 17px;
  font-weight: 400;
  letter-spacing: 0;
  font-family: inherit;
  text-shadow: 0 2px 8px rgba(15, 23, 42, 0.5),
  0 6px 18px rgba(15, 23, 42, 0.34);
}

.typing-cursor {
  display: inline-block;
  width: 2px;
  height: 1em;
  margin-left: 6px;
  vertical-align: -2px;
  background: rgba(255, 255, 255, 0.92);
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

/* 统计卡片 */
.profile-stats {
  margin-top: 34px;

  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
}

.profile-stat {
  min-height: 92px;
  padding: 18px 18px 18px 16px;
  border-radius: 18px;

  display: grid;
  grid-template-columns: 52px minmax(0, 1fr);
  align-items: center;
  gap: 18px;

  background: var(--theme-stat-bg);
  box-shadow: var(--theme-stat-shadow);

  transition:
    background 0.28s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.profile-stat:hover {
  transform: translateY(-2px);
  box-shadow: var(--theme-stat-hover-shadow);
}

.stat-icon {
  width: 52px;
  height: 52px;
  border-radius: 16px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  color: var(--theme-stat-icon-color);

  background: var(--theme-stat-icon-bg);
  box-shadow: var(--theme-stat-icon-shadow);
}

.stat-icon :deep(svg) {
  width: 26px;
  height: 26px;
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 7px;
  min-width: 0;
  text-align: left;
}

.stat-content strong {
  color: var(--theme-text);
  font-size: 25px;
  font-weight: 900;
  line-height: 1;
}

.stat-content span {
  color: var(--theme-soft-text);
  font-size: 13px;
  letter-spacing: 0.08em;
}

/* 文章卡片 */
.posts-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
}

.post-card {
  overflow: hidden;
  border-radius: 8px;

  min-height: var(--post-card-min-height);

  display: flex;
  flex-direction: column;

  background: var(--theme-card-bg);
  box-shadow: var(--theme-card-shadow);
  backdrop-filter: blur(10px);

  transition:
    background 0.28s ease,
    transform 0.22s ease,
    box-shadow 0.22s ease;
}

.post-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--theme-card-hover-shadow);
}

.post-card-placeholder {
  min-height: var(--post-card-min-height);
  visibility: hidden;
  pointer-events: none;
}

.pagination-section {
  width: 100%;
  margin: 18px auto -80px;

  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-items: center;
  gap: 28px;
}

.pagination-control {
  display: flex;
  align-items: center;
}

.pagination-control-prev {
  justify-content: flex-start;
}

.pagination-control-next {
  justify-content: flex-end;
}

.pagination-button {
  width: 56px;
  height: 56px;
  border: none;
  border-radius: 50%;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  color: #ffffff;
  background: var(--theme-pagination-button-bg);
  box-shadow: var(--theme-pagination-button-shadow);
  cursor: pointer;

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    opacity 0.2s ease;
}

.pagination-button:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: var(--theme-pagination-button-shadow),
    0 10px 22px rgba(15, 23, 42, 0.12);
}

.pagination-button:disabled {
  color: var(--theme-pagination-disabled-color);
  background: var(--theme-pagination-disabled-bg);
  box-shadow: none;
  cursor: not-allowed;
}

.pagination-button svg {
  width: 28px;
  height: 28px;
}

.pagination-info {
  justify-self: center;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;

  color: var(--theme-pagination-info-text);
  font-size: 15px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-shadow: 0 2px 10px rgba(15, 23, 42, 0.12);
}

.pagination-info em {
  color: var(--theme-subtle);
  font-style: normal;
  font-weight: 600;
}

.post-cover {
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 8px 8px 0 0;
}

.post-cover-backdrop {
  position: absolute;
  inset: 0;

  transform: scale(1.08);
  filter: blur(16px);
}

.post-cover-backdrop img {
  width: 100%;
  height: 100%;
  display: block;

  object-fit: cover;
  object-position: center;
}

.post-cover-backdrop::after {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--theme-cover-tint);
}

.post-cover-image {
  position: relative;
  z-index: 1;

  width: 100%;
  height: 100%;
  display: block;

  object-fit: contain;
  object-position: center;

  transition: transform 0.3s ease;
}

.post-card:hover .post-cover-image {
  transform: scale(1.05);
}

.post-cover-mask {
  position: absolute;
  inset: auto 0 0;

  padding: 46px 18px 18px;

  background: linear-gradient(
    180deg,
    rgba(15, 23, 42, 0),
    rgba(15, 23, 42, 0.62) 42%,
    rgba(15, 23, 42, 0.86)
  );
}

.post-cover-title {
  margin: 0;

  color: #ffffff;
  font-size: 20px;
  font-weight: 800;
  line-height: 1.35;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.45);

  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.post-content {
  min-height: 0;
  padding: 15px 15px 14px 18px;

  display: flex;
  flex-direction: column;
}

.post-summary {
  min-height: 50px;
  margin: 0;

  color: var(--theme-muted);
  line-height: 1.8;
  font-size: 14px;
  word-break: break-all;

  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.post-meta {
  margin-top: 12px;

  display: flex;
  justify-content: space-between;

  color: var(--theme-subtle);
  font-size: 13px;
}

.post-card-action {
  position: relative;

  min-height: 0;
  margin-top: 6px;
  padding: 4px 0 0;

  display: flex;
  align-items: center;

  border-radius: 0 0 8px 8px !important;
  box-sizing: border-box;
}

/* 用伪元素画完整分割线，不受 padding 影响 */
.post-card-action::before {
  content: '';

  position: absolute;
  top: 0;
  left: -18px;
  right: -15px;

  height: 1px;
  background: var(--theme-divider);
}

.post-card-action.is-empty {
  visibility: hidden;
}

.article-tags {
  width: 100%;
  min-height: 0;
  margin-top: 10px;

  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;

  padding: 0;
}

.article-tags .chip {
  margin: 0;
  padding: 0 10px !important;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  min-height: 22px;
  height: 22px;
  line-height: 1 !important;
  border-radius: 10px;

  color: #fff;
  font-size: 0.8rem;
  font-weight: 400;
  white-space: nowrap;
}


.bg-color {
  background-image: var(--theme-chip-bg);
}

/* 未分类弱化，但仍保持 chip 形态 */
.grey-chip {

  background-image: var(--theme-muted-chip-bg) !important;
}

@media (max-width: 980px) {
  .intro-layout {
    grid-template-columns: 1fr;
  }

  .intro-image-panel {
    min-height: 220px;
  }

  .posts-page {
    --post-card-min-height: 340px;
  }

  .posts-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .posts-page {
    --post-card-min-height: 0px;

    padding-top: 84px;
  }

  .posts-page.is-embedded {
    padding-top: 24px;
  }

  .posts-content {
    width: min(100% - 32px, 1180px);
    padding-bottom: 15px;
  }

  .intro-info-panel {
    padding: 30px 22px;
  }

  .avatar-wrapper {
    width: 112px;
    height: 112px;
  }

  .intro-basic h2 {
    font-size: 34px;
  }

  .intro-meta {
    justify-content: center;
  }

  .profile-stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .profile-stat {
    min-height: 86px;
  }

  .posts-container {
    grid-template-columns: 1fr;
  }

  .post-card-placeholder {
    display: none;
  }

  .pagination-section {
    width: 100%;
    margin-top: 28px;
    grid-template-columns: 1fr auto 1fr;
  }

  .pagination-button {
    width: 52px;
    height: 52px;
  }

  .post-content {
    min-height: 0;
  }
}
</style>
