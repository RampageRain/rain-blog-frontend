<script setup lang="ts">
import {Icon} from '@iconify/vue'
import {computed, nextTick, onBeforeUnmount, onMounted, ref} from 'vue'

import BlogNavbar from '@/components/blog/BlogNavbar.vue'
import BlogFooter from '@/components/blog/BlogFooter.vue'
import BlogSideActions from '@/components/blog/BlogSideActions.vue'
import PostCard from '@/components/blog/PostCard.vue'
import { useBlogTheme } from '@/composables/useBlogTheme'
import { getPublishedPosts, type PostListItem } from '@/api/posts'

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
  icon: string
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

const postCoverMap: Record<string, string> = {
  'home-bg-1': postCover1,
  'home-bg-2': postCover2,
  'home-bg-3': postCover3,
  'home-bg-4': postCover4,
  'home-bg-5': postCover5,
  'home-bg-6': postCover6
}

const defaultPostCover = postCover1

const postPageSize = 9
const currentPage = ref(1)
const totalPages = ref(1)
const totalPosts = ref(0)
const posts = ref<Post[]>([])
const isPostLoading = ref(false)
const postErrorMessage = ref('')

function toPost(post: PostListItem): Post {
  return {
    id: post.id,
    title: post.title,
    summary: post.summary,
    category: post.category,
    tags: [],
    date: post.date,
    views: post.views,
    cover: postCoverMap[post.coverKey] ?? defaultPostCover
  }
}

function setPostList(records: PostListItem[], total?: number, pages?: number, page = currentPage.value) {
  posts.value = records.map(toPost)

  totalPosts.value = Math.max(total ?? records.length, records.length)
  totalPages.value = Math.max(1, pages ?? Math.ceil(records.length / postPageSize))

  currentPage.value = Math.min(Math.max(1, page), totalPages.value)
}

async function loadPublishedPosts(page = currentPage.value) {
  isPostLoading.value = true
  postErrorMessage.value = ''

  try {
    const res = await getPublishedPosts({
      current: page,
      pageSize: postPageSize
    })

    if (res.data.code === 200) {
      const pageData = res.data.data
      setPostList(
        pageData?.records ?? [],
        pageData?.total,
        pageData?.pages,
        pageData?.current ?? page
      )
      return
    }

    postErrorMessage.value = res.data.message || '文章加载失败'
  } catch (error) {
    console.error('文章列表加载失败：', error)
    postErrorMessage.value = '文章加载失败，请稍后重试'
  } finally {
    isPostLoading.value = false
  }
}

const introMetas: IntroMeta[] = [
  {
    icon: 'fa-solid:map-marker-alt',
    text: '中国'
  },
  {
    icon: 'fa-solid:book',
    text: '持续创作中'
  },
  {
    icon: 'fa-solid:code',
    text: '代码即生活'
  }
]

const profileStatIcons: Record<ProfileStat['type'], string> = {
  article: 'fa-regular:file-alt',
  category: 'fa-solid:layer-group',
  tag: 'fa-solid:tags',
  view: 'fa-regular:eye'
}

function formatStatNumber(value: number) {
  if (value >= 10000) {
    return `${(value / 10000).toFixed(1).replace(/\.0$/, '')}w`
  }

  if (value >= 1000) {
    return `${(value / 1000).toFixed(1).replace(/\.0$/, '')}k`
  }

  return String(value)
}

const profileStats = computed<ProfileStat[]>(() => {
  const categories = posts.value
    .map((post) => post.category)
    .filter((category): category is string => Boolean(category))
  const tags = posts.value.flatMap((post) => post.tags)
  const views = posts.value.reduce((total, post) => total + post.views, 0)

  return [
    {
      type: 'article',
      label: '文章',
      value: String(totalPosts.value)
    },
    {
      type: 'category',
      label: '分类',
      value: String(new Set(categories).size)
    },
    {
      type: 'tag',
      label: '标签',
      value: String(new Set(tags).size)
    },
    {
      type: 'view',
      label: '访问',
      value: formatStatNumber(views)
    }
  ]
})

const quoteStyle = {
  backgroundImage: `url(${quoteBg})`
}

const { isLightTheme } = useBlogTheme()

const postsContainerRef = ref<HTMLElement | null>(null)
const isEmbeddedPostsActive = ref(false)

let postsVisibilityObserver: IntersectionObserver | undefined

const isMobilePostList = ref(false)

const showIntroCard = computed(() => {
  return !isMobilePostList.value && currentPage.value === 1
})

const paginatedPosts = computed(() => posts.value)

const postPlaceholders = computed(() => {
  if (paginatedPosts.value.length === 0) {
    return []
  }

  return Array.from(
    { length: Math.max(0, postPageSize - paginatedPosts.value.length) },
    (_, index) => index
  )
})

const showSideActions = computed(() => {
  return !props.embedded || isEmbeddedPostsActive.value
})

function setupPostsVisibilityObserver() {
  if (!props.embedded) {
    isEmbeddedPostsActive.value = true
    return
  }

  const targetElement = postsContainerRef.value

  if (!targetElement || typeof IntersectionObserver === 'undefined') {
    isEmbeddedPostsActive.value = false
    return
  }

  postsVisibilityObserver?.disconnect()
  postsVisibilityObserver = new IntersectionObserver(
    (entries) => {
      isEmbeddedPostsActive.value = entries.some((entry) => entry.isIntersecting)
    },
    {
      rootMargin: '-72px 0px -40% 0px',
      threshold: [0, 0.08, 0.16]
    }
  )
  postsVisibilityObserver.observe(targetElement)
}

function teardownPostsVisibilityObserver() {
  postsVisibilityObserver?.disconnect()
  postsVisibilityObserver = undefined
}

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

async function setCurrentPage(page: number) {
  if (page < 1 || page > totalPages.value || page === currentPage.value) {
    return
  }

  await loadPublishedPosts(page)
  await scrollToPostsContainer()
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
  void loadPublishedPosts()
  void nextTick(() => setupPostsVisibilityObserver())
})

onBeforeUnmount(() => {
  if (signatureIntervalId !== undefined) {
    window.clearInterval(signatureIntervalId)
  }

  mobilePostListMediaQuery?.removeEventListener('change', handleMobilePostListChange)
  teardownPostsVisibilityObserver()
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
            <Icon :icon="meta.icon" aria-hidden="true" />

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
            <Icon :icon="profileStatIcons[stat.type]" aria-hidden="true" />
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
        <div v-if="isPostLoading" class="post-list-state">
          文章加载中...
        </div>
        <div v-else-if="postErrorMessage" class="post-list-state is-error">
          {{ postErrorMessage }}
        </div>
        <div v-else-if="posts.length === 0" class="post-list-state">
          暂无文章
        </div>

        <template v-else>
          <PostCard
            v-for="(post, index) in paginatedPosts"
            :key="post.id"
            :post="post"
            :index="index"
          />
          <article
            v-for="index in postPlaceholders"
            :key="`placeholder-${index}`"
            class="post-card post-card-placeholder"
            aria-hidden="true"
          ></article>
        </template>
      </section>

      <section
        v-if="totalPages > 1 || (isMobilePostList && !isPostLoading && !postErrorMessage && posts.length > 0)"
        class="pagination-section paging"
        aria-label="Post pagination"
      >
        <div class="pagination-row row">
          <div class="pagination-control pagination-control-prev col s6 m4 l4">
            <button
              type="button"
              class="pagination-button pagination-prev left btn-floating btn-large waves-effect waves-light bg-color"
              :class="{ disabled: currentPage === 1 }"
              :disabled="currentPage === 1"
              aria-label="Previous page"
              @click="setCurrentPage(currentPage - 1)"
            >
              <Icon
                icon="fa-solid:angle-left"
                class="fas fa-angle-left pagination-fa-icon"
                aria-hidden="true"
              />
            </button>
          </div>

          <div class="pagination-info page-info col m4 l4">
            <div class="center-align b-text-gray">
              <span>{{ currentPage }}</span>
              <em>/</em>
              <span>{{ totalPages }}</span>
            </div>
          </div>

          <div class="pagination-control pagination-control-next col s6 m4 l4">
            <button
              type="button"
              class="pagination-button pagination-next right btn-floating btn-large waves-effect waves-light bg-color"
              :class="{ disabled: currentPage === totalPages }"
              :disabled="currentPage === totalPages"
              aria-label="Next page"
              @click="setCurrentPage(currentPage + 1)"
            >
              <Icon
                icon="fa-solid:angle-right"
                class="fas fa-angle-right pagination-fa-icon"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      </section>
    </section>
    <BlogFooter/>
    <BlogSideActions
      v-if="showSideActions"
      show-desktop-top
    />
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
  --theme-chip-bg: linear-gradient(to right, #0000CD 0%, #0f9d58 100%);
  --theme-muted-chip-bg: linear-gradient(to right, #0000FF 0%, #4169E1 100%);
  --theme-pagination-button-bg: linear-gradient(to right, #0000CD 0%, #0f9d58 100%);
  --theme-pagination-button-shadow: 0 14px 28px rgba(1, 1, 254, 0.22);
  --theme-pagination-disabled-bg: rgba(203, 213, 225, 0.82);
  --theme-pagination-disabled-color: rgba(100, 116, 139, 0.72);
  --theme-pagination-info-text: #0f172a;
  --post-card-min-height: 360px;
  --post-card-cover-height: 190px;
  --post-card-cover-height-mobile: 180px;

  position: relative;
  min-height: 100vh;
  min-height: 100dvh;
  padding-top: 96px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
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
  --theme-chip-bg: linear-gradient(to right, #0000CD 0%, #0f9d58 100%);
  --theme-muted-chip-bg: linear-gradient(to right, #0000FF 0%, #4169E1 100%);
  --theme-pagination-button-bg: linear-gradient(to right, #0000CD 0%, #0f9d58 100%);
  --theme-pagination-button-shadow: 0 14px 30px rgba(14, 165, 233, 0.2);
  --theme-pagination-disabled-bg: rgba(15, 23, 42, 0.54);
  --theme-pagination-disabled-color: rgba(203, 213, 225, 0.42);
  --theme-pagination-info-text: rgba(226, 232, 240, 0.9);
}

.posts-page.is-embedded {
  padding-top: 64px;
}

.posts-content {
  position: relative;
  z-index: 1;

  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;

  width: min(1180px, calc(100% - 48px));
  margin: 0 auto;
  padding-bottom: 15px;
}

.posts-page.is-embedded .posts-content {
  padding-bottom: 0;
}

.posts-page .pagination-section {
  margin-top: auto;
  margin-bottom: 15px;
  padding-top: 24px;
  width: 100%;
}

.paging .pagination-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  align-items: center;
  margin-left: 0;
  margin-right: 0;
}

.pagination-control-prev {
  display: flex;
  justify-content: flex-start;
}

.pagination-control-next {
  display: flex;
  justify-content: flex-end;
}

.pagination-button {
  width: 56px;
  height: 56px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 999px;
  color: #ffffff;
  font-size: 25px;
  line-height: 56px;
  background: var(--theme-pagination-button-bg);
  box-shadow: var(--theme-pagination-button-shadow);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
}

.pagination-button:not(:disabled):hover {
  transform: translateY(-1px);
  box-shadow: var(--theme-pagination-button-shadow), 0 10px 20px rgba(15, 23, 42, 0.12);
}

.pagination-button:disabled {
  color: var(--theme-pagination-disabled-color);
  background: var(--theme-pagination-disabled-bg);
  box-shadow: none;
  cursor: not-allowed;
}

.pagination-info {
  justify-content: center;
  display: inline-flex;
  align-items: center;
  padding-top: 1rem;
  color: var(--theme-pagination-info-text);
  font-size: 1.4rem;
  font-weight: 700;
  letter-spacing: 0;
}

.pagination-info .center-align {
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  text-align: center;
}

.pagination-button .pagination-fa-icon {
  color: currentColor;
  width: 40px;
  height: 40px;
}

.pagination-info em {
  font-style: normal;
  opacity: 0.62;
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
  color: var(--theme-meta-stroke);
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
  align-items: stretch;
  gap: 28px;
}

.post-list-state {
  grid-column: 1 / -1;

  min-height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;

  color: var(--theme-muted);
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.08em;

  background: var(--theme-card-bg);
  border-radius: 16px;
  box-shadow: var(--theme-card-shadow);
  backdrop-filter: blur(10px);
}

.post-list-state.is-error {
  color: #ef4444;
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
    --post-card-cover-height: 180px;
  }

  .posts-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .posts-page {
    --post-card-min-height: 0px;
    --post-card-cover-height-mobile: 178px;

    padding-top: 84px;
  }

  .posts-page.is-embedded {
    padding-top: 60px;
  }

  .posts-content {
    width: min(100% - 32px, 1180px);
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
  }

  .paging .pagination-row {
    grid-template-columns: 1fr auto 1fr;
  }

  .pagination-info {
    display: inline-flex;
    padding-top: 0;
  }

  .pagination-button {
    width: 48px;
    height: 48px;
  }

  .pagination-button .pagination-fa-icon {
    width: 34px;
    height: 34px;
  }

}
</style>
