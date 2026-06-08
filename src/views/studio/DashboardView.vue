<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'

import BlogNavbar from '@/components/blog/BlogNavbar.vue'
import BlogFooter from '@/components/blog/BlogFooter.vue'
import BlogSideActions from '@/components/blog/BlogSideActions.vue'
import { useBlogTheme } from '@/composables/useBlogTheme'

import avatar from '@/assets/images/avart.jpg'
import headerBg from '@/assets/images/intro-card-img.jpg'
import postCover1 from '@/assets/images/home-bg-1.jpg'
import postCover2 from '@/assets/images/home-bg-2.jpg'
import postCover3 from '@/assets/images/home-bg-3.jpg'
import postListBgLight from '@/assets/images/postlist-bg-light.jpg'
import postListBgNight from '@/assets/images/postlist-bg-night.jpg'

type PostStatus = 'published' | 'draft'
type ImageFitMode = 'fill-width' | 'fill-height'

interface PostItem {
  id: number
  title: string
  summary: string
  category: string
  tags: string[]
  status: PostStatus
  date: string
  updatedAt: string
  cover: string
  words: number
  views: number
}

const router = useRouter()
const { isLightTheme } = useBlogTheme()

const posts = ref<PostItem[]>([
  {
    id: 1,
    title: '深入理解 JavaScript 执行机制',
    summary: '从调用栈、事件循环、宏任务和微任务角度，重新理解 JS 的执行过程。',
    category: '前端',
    tags: ['JavaScript', '浏览器'],
    status: 'published',
    date: '2026-06-01',
    updatedAt: '2026-06-04',
    cover: postCover1,
    words: 3200,
    views: 1268,
  },
  {
    id: 2,
    title: 'Java 集合专题复习',
    summary: 'ArrayList、LinkedList、HashMap 等集合的底层结构和常见面试点。',
    category: 'Java',
    tags: ['Java', '集合'],
    status: 'draft',
    date: '2026-06-04',
    updatedAt: '2026-06-04',
    cover: postCover2,
    words: 2100,
    views: 0,
  },
  {
    id: 3,
    title: '如何搭建一个属于自己的博客',
    summary: '从前端页面、后端接口、登录鉴权到部署上线的完整记录。',
    category: '建站',
    tags: ['博客', 'Vue'],
    status: 'published',
    date: '2026-05-28',
    updatedAt: '2026-06-02',
    cover: postCover3,
    words: 4500,
    views: 2405,
  },
  {
    id: 4,
    title: 'Spring Boot 接口设计实践',
    summary: '整理 RESTful 接口、参数校验、统一响应和异常处理的后台开发实践。',
    category: 'Java',
    tags: ['Spring Boot', 'RESTful'],
    status: 'published',
    date: '2026-05-24',
    updatedAt: '2026-06-01',
    cover: postCover1,
    words: 3800,
    views: 986,
  },
  {
    id: 5,
    title: 'Vue 组件状态拆分记录',
    summary: '从页面状态、组件 props、组合式函数三个层面整理前端状态维护方式。',
    category: '前端',
    tags: ['Vue', '组件'],
    status: 'published',
    date: '2026-05-20',
    updatedAt: '2026-05-30',
    cover: postCover2,
    words: 2900,
    views: 1582,
  },
  {
    id: 6,
    title: 'MySQL 索引与慢查询排查',
    summary: '记录 EXPLAIN、联合索引、覆盖索引和慢查询日志在项目中的实际使用。',
    category: '数据库',
    tags: ['MySQL', '索引'],
    status: 'draft',
    date: '2026-05-16',
    updatedAt: '2026-05-26',
    cover: postCover3,
    words: 2600,
    views: 0,
  },
  {
    id: 7,
    title: '前端页面暗色模式适配',
    summary: '围绕主题变量、背景图遮罩、卡片透明度和移动端细节做一次完整复盘。',
    category: '前端',
    tags: ['CSS', '主题'],
    status: 'published',
    date: '2026-05-12',
    updatedAt: '2026-05-22',
    cover: postCover1,
    words: 3400,
    views: 1124,
  },
  {
    id: 8,
    title: '博客部署流程整理',
    summary: '从本地构建、静态资源检查、服务器同步到回滚策略的部署流程记录。',
    category: '建站',
    tags: ['部署', 'Vite'],
    status: 'published',
    date: '2026-05-08',
    updatedAt: '2026-05-18',
    cover: postCover2,
    words: 3100,
    views: 876,
  },
  {
    id: 9,
    title: 'Markdown 写作规范',
    summary: '整理标题层级、代码块、图片资源、摘要和标签的个人博客写作规范。',
    category: '写作',
    tags: ['Markdown', '规范'],
    status: 'published',
    date: '2026-05-02',
    updatedAt: '2026-05-15',
    cover: postCover3,
    words: 1800,
    views: 653,
  },
  {
    id: 10,
    title: 'Pinia 鉴权状态管理',
    summary: '记录登录态持久化、路由守卫、请求拦截和后台权限入口的实现方式。',
    category: '前端',
    tags: ['Pinia', '鉴权'],
    status: 'draft',
    date: '2026-04-28',
    updatedAt: '2026-05-10',
    cover: postCover1,
    words: 2400,
    views: 0,
  },
])

const pageStyle = computed(() => {
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

const workspaceHeadStyle = computed(() => ({
  backgroundImage: `
    linear-gradient(135deg, rgba(15, 23, 42, 0.22), rgba(15, 23, 42, 0.52)),
    url(${headerBg})
  `,
}))

const publishedCount = computed(
  () => posts.value.filter((item) => item.status === 'published').length,
)
const draftCount = computed(() => posts.value.filter((item) => item.status === 'draft').length)
const totalWords = computed(() => posts.value.reduce((sum, item) => sum + item.words, 0))
const totalViews = computed(() => posts.value.reduce((sum, item) => sum + item.views, 0))
const recentPosts = computed(() => posts.value.slice(0, 3))
const pageSize = 6
const currentPage = ref(1)
const totalPages = computed(() => Math.max(1, Math.ceil(posts.value.length / pageSize)))
const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return posts.value.slice(start, start + pageSize)
})
const coverFitModes = ref<Record<number, ImageFitMode>>({})
const recentCoverFitModes = ref<Record<number, ImageFitMode>>({})

const categoryStats = computed(() => {
  const stats = new Map<string, number>()
  posts.value.forEach((post) => {
    stats.set(post.category, (stats.get(post.category) ?? 0) + 1)
  })

  return Array.from(stats.entries()).map(([name, count]) => ({ name, count }))
})

const tagStats = computed(() => {
  const stats = new Map<string, number>()
  posts.value.forEach((post) => {
    post.tags.forEach((tag) => {
      stats.set(tag, (stats.get(tag) ?? 0) + 1)
    })
  })

  return Array.from(stats.entries()).map(([name, count]) => ({ name, count }))
})

const archiveStats = computed(() => {
  const stats = new Map<string, number>()
  posts.value.forEach((post) => {
    const month = post.date.slice(0, 7)
    stats.set(month, (stats.get(month) ?? 0) + 1)
  })

  return Array.from(stats.entries())
    .sort(([current], [next]) => next.localeCompare(current))
    .map(([month, count]) => ({ month, count }))
})

const statusLabel: Record<PostStatus, string> = {
  published: '已发布',
  draft: '草稿',
}

const logout = () => {
  localStorage.removeItem('rain_blog_token')
  localStorage.removeItem('rain_blog_admin')
  router.push('/')
}

const resolveImageFitMode = (
  image: HTMLImageElement,
  cover: HTMLElement | null,
  fallbackRatio: number,
) => {
  const coverRatio =
    cover && cover.clientWidth && cover.clientHeight
      ? cover.clientWidth / cover.clientHeight
      : fallbackRatio
  const imageRatio = image.naturalWidth / image.naturalHeight

  return imageRatio >= coverRatio ? 'fill-height' : 'fill-width'
}

const updatePostCoverFit = (post: PostItem, event: Event) => {
  const image = event.target
  if (!(image instanceof HTMLImageElement) || !image.naturalWidth || !image.naturalHeight) {
    return
  }

  coverFitModes.value[post.id] = resolveImageFitMode(image, image.parentElement, 44 / 26)
}

const updateRecentCoverFit = (post: PostItem, event: Event) => {
  const image = event.target
  if (!(image instanceof HTMLImageElement) || !image.naturalWidth || !image.naturalHeight) {
    return
  }

  const cover = image.closest('.recent-thumb')
  recentCoverFitModes.value[post.id] = resolveImageFitMode(
    image,
    cover instanceof HTMLElement ? cover : image.parentElement,
    112 / 72,
  )
}

const previewPost = (post: PostItem) => {
  router.push(`/posts/${post.id}`)
}

const editPost = (post: PostItem) => {
  window.alert(`编辑功能待接入：${post.title}`)
}

const deletePost = (post: PostItem) => {
  const confirmed = window.confirm(`确定删除《${post.title}》吗？`)
  if (!confirmed) {
    return
  }

  posts.value = posts.value.filter((item) => item.id !== post.id)
  currentPage.value = Math.min(currentPage.value, totalPages.value)
}

const createPost = () => {
  window.alert('创建文章功能待接入')
}

const importMarkdown = () => {
  window.alert('导入 MD 功能待接入')
}

const goToPage = (page: number) => {
  currentPage.value = Math.min(Math.max(page, 1), totalPages.value)
}
</script>

<template>
  <main
    class="studio-page"
    :class="{ 'is-light-theme': isLightTheme, 'is-night-theme': !isLightTheme }"
    :style="pageStyle"
  >
    <BlogNavbar />

    <section class="studio-layout">
      <aside class="studio-aside">
        <section class="profile-card">
          <img :src="avatar" alt="Rain Blog" />
          <h2>Rain Blog</h2>
          <p>后台管理中</p>

          <div class="profile-stats">
            <div>
              <span>文章</span>
              <strong>{{ posts.length }}</strong>
            </div>
            <div>
              <span>发布</span>
              <strong>{{ publishedCount }}</strong>
            </div>
            <div>
              <span>草稿</span>
              <strong>{{ draftCount }}</strong>
            </div>
          </div>

          <button type="button" class="logout-button" @click="logout">
            <Icon icon="fa-solid:sign-out-alt" aria-hidden="true" />
            <span>退出登录</span>
          </button>
        </section>

        <section class="side-card">
          <h3>
            <Icon icon="fa-solid:chart-line" aria-hidden="true" />
            <span>内容概览</span>
          </h3>
          <div class="info-list">
            <div>
              <span>总字数</span>
              <strong>{{ totalWords.toLocaleString() }}</strong>
            </div>
            <div>
              <span>总阅读</span>
              <strong>{{ totalViews.toLocaleString() }}</strong>
            </div>
            <div>
              <span>分类数目</span>
              <strong>{{ categoryStats.length }}</strong>
            </div>
            <div>
              <span>标签数目</span>
              <strong>{{ tagStats.length }}</strong>
            </div>
            <div>
              <span>最后更新</span>
              <strong>{{ recentPosts[0]?.updatedAt ?? '-' }}</strong>
            </div>
          </div>
        </section>

        <section class="side-card">
          <h3>
            <Icon icon="fa-solid:history" aria-hidden="true" />
            <span>最近文章</span>
          </h3>

          <div class="recent-list">
            <RouterLink v-for="post in recentPosts" :key="post.id" :to="`/posts/${post.id}`">
              <span class="recent-thumb">
                <img
                  class="recent-cover"
                  :class="`is-${recentCoverFitModes[post.id] ?? 'fill-width'}`"
                  :src="post.cover"
                  :alt="post.title"
                  @load="updateRecentCoverFit(post, $event)"
                />
              </span>
              <span>
                <strong>{{ post.title }}</strong>
                <time>{{ post.updatedAt }}</time>
              </span>
            </RouterLink>
          </div>
        </section>

        <section class="side-card">
          <h3>
            <Icon icon="fa-solid:folder-open" aria-hidden="true" />
            <span>分类</span>
          </h3>

          <div class="taxonomy-list">
            <a v-for="item in categoryStats" :key="item.name" href="#" @click.prevent>
              <span>{{ item.name }}</span>
              <strong>{{ item.count }}</strong>
            </a>
          </div>
        </section>

        <section class="side-card">
          <h3>
            <Icon icon="fa-solid:tags" aria-hidden="true" />
            <span>标签</span>
          </h3>

          <div class="tag-cloud">
            <a v-for="item in tagStats" :key="item.name" href="#" @click.prevent>
              {{ item.name }}
              <sup>{{ item.count }}</sup>
            </a>
          </div>
        </section>

        <section class="side-card">
          <h3>
            <Icon icon="fa-solid:archive" aria-hidden="true" />
            <span>归档</span>
          </h3>

          <div class="archive-list">
            <a v-for="item in archiveStats" :key="item.month" href="#" @click.prevent>
              <time>{{ item.month }}</time>
              <strong>{{ item.count }}</strong>
            </a>
          </div>
        </section>

      </aside>

      <main class="workspace">
        <header class="workspace-head" :style="workspaceHeadStyle">
          <div>
            <p class="kicker">Rain Studio</p>
            <h1>写作工作台</h1>
            <p class="head-copy">保留博客阅读感，只放必要的管理入口。</p>
          </div>

          <div class="workspace-actions" aria-label="文章操作">
            <button
              type="button"
              class="primary"
              title="创建文章"
              aria-label="创建文章"
              @click="createPost"
            >
              <Icon icon="fa-solid:plus" aria-hidden="true" />
              <span>创建</span>
            </button>
            <button
              type="button"
              class="secondary"
              title="导入 MD"
              aria-label="导入 MD"
              @click="importMarkdown"
            >
              <Icon icon="fa-solid:file-import" aria-hidden="true" />
              <span>导入 MD</span>
            </button>
          </div>
        </header>

        <section class="post-list" aria-label="文章列表">
          <article v-for="(post, index) in paginatedPosts" :key="post.id" class="post-row">
            <div class="post-cover-panel" :class="{ right: index % 2 === 1 }">
              <RouterLink class="post-cover" :to="`/posts/${post.id}`" :title="post.title">
                <img
                  class="post-cover-image"
                  :class="`is-${coverFitModes[post.id] ?? 'fill-width'}`"
                  :src="post.cover"
                  :alt="post.title"
                  @load="updatePostCoverFit(post, $event)"
                />
              </RouterLink>

              <div class="post-actions" aria-label="文章操作">
                <button
                  type="button"
                  class="preview"
                  title="预览"
                  aria-label="预览文章"
                  @click="previewPost(post)"
                >
                  <Icon icon="fa-regular:eye" aria-hidden="true" />
                  <span>预览</span>
                </button>
                <button
                  type="button"
                  class="edit"
                  title="编辑"
                  aria-label="编辑文章"
                  @click="editPost(post)"
                >
                  <Icon icon="fa-solid:pen" aria-hidden="true" />
                  <span>编辑</span>
                </button>
                <button
                  type="button"
                  class="danger"
                  title="删除"
                  aria-label="删除文章"
                  @click="deletePost(post)"
                >
                  <Icon icon="fa-regular:trash-alt" aria-hidden="true" />
                  <span>删除</span>
                </button>
              </div>
            </div>

            <div class="post-info">
              <RouterLink class="article-title" :to="`/posts/${post.id}`">
                {{ post.title }}
              </RouterLink>

              <div class="article-meta">
                <span :class="['status-pill', post.status]">{{ statusLabel[post.status] }}</span>
                <span>
                  <Icon icon="fa-regular:calendar-alt" aria-hidden="true" />
                  {{ post.date }}
                </span>
                <span>
                  <Icon icon="fa-solid:folder-open" aria-hidden="true" />
                  {{ post.category }}
                </span>
                <span>
                  <Icon icon="fa-regular:eye" aria-hidden="true" />
                  {{ post.views.toLocaleString() }}
                </span>
              </div>

              <p>{{ post.summary }}</p>

              <div class="tag-row">
                <span v-for="tag in post.tags" :key="tag">{{ tag }}</span>
              </div>
            </div>
          </article>
        </section>

        <nav class="studio-pagination" aria-label="文章分页">
          <button type="button" :disabled="currentPage === 1" @click="goToPage(currentPage - 1)">
            <Icon icon="fa-solid:angle-left" aria-hidden="true" />
          </button>
          <button
            v-for="page in totalPages"
            :key="page"
            type="button"
            :class="{ active: page === currentPage }"
            @click="goToPage(page)"
          >
            {{ page }}
          </button>
          <button
            type="button"
            :disabled="currentPage === totalPages"
            @click="goToPage(currentPage + 1)"
          >
            <Icon icon="fa-solid:angle-right" aria-hidden="true" />
          </button>
        </nav>
      </main>
    </section>

    <BlogFooter />
    <BlogSideActions :show-desktop-top="false" />
  </main>
</template>

<style scoped>
.studio-page {
  --studio-card-bg: rgba(255, 255, 255, 0.9);
  --studio-card-shadow: 0 15px 35px rgba(50, 50, 93, 0.1), 0 5px 15px rgba(0, 0, 0, 0.07);
  --studio-card-hover-shadow: 0 18px 38px rgba(50, 50, 93, 0.14), 0 8px 18px rgba(0, 0, 0, 0.09);
  --studio-text: #0f172a;
  --studio-body: #475569;
  --studio-muted: #64748b;
  --studio-cover-bg: rgba(226, 232, 240, 0.86);
  --studio-chip-bg: linear-gradient(to right, #0000cd 0%, #0f9d58 100%);
  --studio-muted-chip-bg: linear-gradient(to right, #0000ff 0%, #4169e1 100%);

  position: relative;
  min-height: 100vh;
  padding-top: 96px;
  color: var(--studio-body);
  background-position: center top;
  background-size: cover;
  background-attachment: fixed;
}

.studio-page::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  z-index: 49;
  width: 100%;
  height: 64px;
  pointer-events: none;
  background: inherit;
  background-position: center top;
  background-size: cover;
  background-attachment: fixed;
}

.studio-page.is-night-theme {
  --studio-card-bg: rgba(15, 23, 42, 0.78);
  --studio-card-shadow: 0 18px 40px rgba(0, 0, 0, 0.24), inset 0 0 0 1px rgba(255, 255, 255, 0.1);
  --studio-card-hover-shadow:
    0 22px 48px rgba(0, 0, 0, 0.3), inset 0 0 0 1px rgba(147, 197, 253, 0.18);
  --studio-text: rgba(248, 250, 252, 0.96);
  --studio-body: rgba(226, 232, 240, 0.88);
  --studio-muted: rgba(203, 213, 225, 0.84);
  --studio-cover-bg: rgba(15, 23, 42, 0.72);
}

.studio-layout {
  width: min(1280px, calc(100% - 32px));
  margin: 0 auto;
  padding-bottom: 46px;
  display: grid;
  grid-template-columns: 340px minmax(0, 1fr);
  gap: 24px;
  align-items: start;
}

.workspace {
  min-width: 0;
  display: grid;
  gap: 20px;
}

.workspace-head,
.post-row,
.profile-card,
.side-card {
  border-radius: 8px;
  background: var(--studio-card-bg);
  box-shadow: var(--studio-card-shadow);
  backdrop-filter: blur(10px);
  transition:
    box-shadow 0.3s ease,
    transform 0.3s ease;
}

.workspace-head:hover,
.profile-card:hover,
.side-card:hover {
  box-shadow: var(--studio-card-hover-shadow);
}

.workspace-head {
  min-height: 176px;
  padding: 32px 36px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  overflow: hidden;
  color: #ffffff;
  background-position: center;
  background-size: cover;
}

.kicker {
  margin: 0 0 8px;
  color: rgba(255, 255, 255, 0.82);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.workspace-head h1 {
  margin: 0;
  color: #ffffff;
  font-size: 34px;
  text-shadow: 0 3px 12px rgba(15, 23, 42, 0.36);
}

.head-copy {
  margin: 10px 0 0;
  color: rgba(255, 255, 255, 0.82);
  line-height: 1.7;
}

.logout-button {
  border: 0;
  font: inherit;
  cursor: pointer;
}

.workspace-actions {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.workspace-actions button {
  height: 38px;
  padding: 0 14px;
  border: 1px solid rgba(255, 255, 255, 0.46);
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  color: #ffffff;
  background: rgba(15, 23, 42, 0.2);
  box-shadow: 0 12px 26px rgba(15, 23, 42, 0.18);
  backdrop-filter: blur(10px);
  cursor: pointer;
  font: inherit;
  font-size: 13px;
  font-weight: 700;
  line-height: 1;
  transition:
    transform 0.2s ease,
    background 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.workspace-actions button.primary {
  color: #0f172a;
  border-color: rgba(255, 255, 255, 0.76);
  background: rgba(255, 255, 255, 0.88);
}

.workspace-actions button.secondary {
  color: #ffffff;
}

.workspace-actions button:hover {
  border-color: rgba(255, 255, 255, 0.78);
  box-shadow: 0 16px 34px rgba(15, 23, 42, 0.28);
  transform: translateY(-2px);
}

.workspace-actions button.primary:hover {
  background: #ffffff;
}

.workspace-actions button.secondary:hover {
  background: rgba(226, 232, 240, 0.2);
}

.workspace-actions svg {
  width: 13px;
  height: 13px;
  flex: 0 0 auto;
}

.post-list {
  display: grid;
  gap: 16px;
}

.post-row {
  display: flex;
  align-items: stretch;
  overflow: hidden;
}

.post-actions {
  position: absolute;
  bottom: 16px;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.post-cover-panel:not(.right) .post-actions {
  left: 16px;
}

.post-cover-panel.right .post-actions {
  right: 16px;
}

.post-actions button {
  width: 42px;
  height: 42px;
  padding: 0;
  border: 1px solid rgba(255, 255, 255, 0.42);
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  background: rgba(15, 23, 42, 0.18);
  box-shadow: 0 10px 26px rgba(15, 23, 42, 0.2);
  backdrop-filter: blur(12px);
  cursor: pointer;
  font: inherit;
  font-size: 16px;
  line-height: 1;
  transition:
    transform 0.2s,
    background 0.2s,
    border-color 0.2s,
    box-shadow 0.2s;
}

.post-actions button:hover {
  background: rgba(226, 232, 240, 0.18);
  border-color: rgba(226, 232, 240, 0.46);
  box-shadow: 0 14px 34px rgba(15, 23, 42, 0.28);
  transform: translateY(-2px);
}

.post-actions button svg {
  transition: color 0.2s ease;
}

.post-actions button.preview:hover svg {
  color: #22c55e;
}

.post-actions button.edit:hover svg {
  color: #3b82f6;
}

.post-actions button.danger:hover {
  background: rgba(226, 232, 240, 0.18);
  border-color: rgba(226, 232, 240, 0.46);
  box-shadow: 0 14px 34px rgba(15, 23, 42, 0.28);
}

.post-actions button.danger:hover svg {
  color: #ef4444;
}

.post-actions button span {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
}

.post-cover-panel {
  position: relative;
  width: 44%;
  height: 220px;
  flex: 0 0 44%;
  overflow: hidden;
  background: var(--studio-cover-bg);
}

.post-cover-panel.right {
  order: 2;
}

.post-cover {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.post-cover-image {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 1;
  display: block;
  transform: translate(-50%, -50%) scale(1);
  transform-origin: center;
  transition: transform 0.6s ease;
}

.post-cover-image.is-fill-width {
  width: 100%;
  height: auto;
}

.post-cover-image.is-fill-height {
  width: auto;
  height: 100%;
}

.post-row:hover .post-cover-image {
  transform: translate(-50%, -50%) scale(1.06);
}

.studio-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}

.studio-pagination button {
  min-width: 34px;
  height: 34px;
  padding: 0 10px;
  border: 1px solid rgba(148, 163, 184, 0.22);
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--studio-body);
  background: var(--studio-card-bg);
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.08);
  cursor: pointer;
  font: inherit;
  font-size: 13px;
  font-weight: 700;
  transition:
    color 0.2s ease,
    background 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;
}

.studio-pagination button:hover:not(:disabled),
.studio-pagination button.active {
  color: #ffffff;
  border-color: transparent;
  background: rgba(29, 78, 216, 0.88);
  transform: translateY(-1px);
}

.studio-pagination button:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

.studio-pagination svg {
  width: 12px;
  height: 12px;
}

.studio-page :deep(.blog-footer) {
  margin-top: 8px;
  background: rgba(15, 23, 42, 0.2);
  border-top: 0;
}

.post-info {
  flex: 1;
  min-width: 0;
  padding: 24px 32px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.article-title {
  color: var(--studio-text);
  font-size: 23px;
  font-weight: 800;
  line-height: 1.34;
  text-decoration: none;
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  transition: color 0.2s ease;
}

.article-title:hover {
  color: #1d4ed8;
}

.studio-page.is-night-theme .article-title:hover {
  color: #93c5fd;
}

.article-meta {
  margin-top: 15px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 7px 15px;
  color: var(--studio-muted);
  font-size: 13px;
  line-height: 1;
}

.article-meta span {
  min-height: 18px;
  padding: 0;
  border-radius: 0;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  box-sizing: border-box;
}

.studio-page.is-night-theme .article-meta span {
  background: transparent;
}

.article-meta svg {
  width: 14px;
  height: 14px;
  color: #3b82f6;
  flex: 0 0 auto;
}

.status-pill {
  min-height: 22px;
  padding: 0 9px !important;
  border-radius: 999px;
  color: #ffffff;
  font-size: 12px;
  font-weight: 600;
  line-height: 22px;
}

.status-pill.published {
  background: var(--studio-chip-bg);
}

.status-pill.draft {
  background: var(--studio-muted-chip-bg);
}

.post-info p {
  margin: 14px 0 0;
  padding-left: 12px;
  border-left: 3px solid rgba(59, 130, 246, 0.28);
  color: var(--studio-body);
  font-size: 15px;
  line-height: 1.66;
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.studio-page.is-night-theme .post-info p {
  border-left-color: rgba(147, 197, 253, 0.34);
}

.tag-row {
  margin-top: 18px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag-row span {
  min-height: 22px;
  padding: 0 9px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  color: var(--studio-muted);
  background: rgba(148, 163, 184, 0.12);
  font-size: 12px;
  font-weight: 500;
  line-height: 22px;
}

.studio-page.is-night-theme .tag-row span {
  color: rgba(226, 232, 240, 0.86);
  background: rgba(148, 163, 184, 0.16);
}

.studio-aside {
  position: sticky;
  top: 84px;
  display: grid;
  gap: 20px;
}

.profile-card,
.side-card {
  padding: 22px 24px;
}

.profile-card {
  text-align: center;
}

.profile-card img {
  width: 104px;
  height: 104px;
  border-radius: 50%;
  object-fit: cover;
  background: var(--studio-cover-bg);
  box-shadow:
    0 14px 34px rgba(15, 23, 42, 0.16),
    inset 0 0 0 1px rgba(255, 255, 255, 0.85);
}

.studio-page.is-night-theme .profile-card img {
  box-shadow:
    0 14px 34px rgba(0, 0, 0, 0.34),
    inset 0 0 0 1px rgba(255, 255, 255, 0.18);
}

.profile-card h2 {
  margin: 12px 0 0;
  color: var(--studio-text);
  font-size: 22px;
}

.profile-card p {
  margin: 6px 0 0;
  color: var(--studio-muted);
  font-size: 14px;
}

.profile-stats {
  margin: 20px 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.profile-stats div {
  display: grid;
  gap: 5px;
}

.profile-stats span {
  color: var(--studio-muted);
  font-size: 13px;
}

.profile-stats strong {
  color: var(--studio-text);
  font-size: 20px;
}

.logout-button {
  width: 100%;
  height: 38px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #ffffff;
  background: var(--studio-chip-bg);
  box-shadow: 0 14px 28px rgba(1, 1, 254, 0.18);
}

.side-card h3 {
  margin: 0 0 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--studio-text);
  font-size: 16px;
}

.info-list {
  display: grid;
  gap: 10px;
}

.info-list div {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  color: var(--studio-body);
  font-size: 14px;
}

.recent-list {
  display: grid;
  gap: 14px;
}

.recent-list a {
  position: relative;
  display: grid;
  grid-template-columns: 112px 1fr;
  gap: 14px;
  align-items: center;
  overflow: hidden;
  color: inherit;
  text-decoration: none;
}

.recent-thumb {
  position: relative;
  width: 112px;
  height: 72px;
  display: block;
  overflow: hidden;
  border-radius: 6px;
  background: var(--studio-cover-bg);
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.12);
}

.recent-cover {
  position: absolute;
  top: 50%;
  left: 50%;
  min-width: 100%;
  min-height: 100%;
  display: block;
  transform: translate(-50%, -50%) scale(1);
  transform-origin: center;
  transition: transform 0.3s ease;
}

.recent-cover.is-fill-width {
  width: 100%;
  height: auto;
}

.recent-cover.is-fill-height {
  width: auto;
  height: 100%;
}

.recent-list a:hover .recent-cover {
  transform: translate(-50%, -50%) scale(1.035);
}

.recent-list a > span:not(.recent-thumb) {
  min-width: 0;
  display: grid;
  gap: 7px;
}

.recent-list strong {
  color: var(--studio-text);
  font-size: 14px;
  line-height: 1.45;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.recent-list time {
  color: var(--studio-muted);
  font-size: 12px;
}

.taxonomy-list,
.archive-list {
  display: grid;
  gap: 10px;
}

.taxonomy-list a,
.archive-list a {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: var(--studio-body);
  text-decoration: none;
  font-size: 14px;
}

.taxonomy-list a:hover,
.archive-list a:hover {
  color: #1d4ed8;
}

.studio-page.is-night-theme .taxonomy-list a:hover,
.studio-page.is-night-theme .archive-list a:hover {
  color: #93c5fd;
}

.taxonomy-list strong,
.archive-list strong {
  color: var(--studio-text);
  font-size: 13px;
  font-weight: 700;
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-cloud a {
  min-height: 24px;
  padding: 0 9px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: var(--studio-muted);
  background: rgba(148, 163, 184, 0.12);
  text-decoration: none;
  font-size: 12px;
  line-height: 24px;
  transition:
    color 0.2s ease,
    background 0.2s ease,
    transform 0.2s ease;
}

.tag-cloud a:hover {
  color: #ffffff;
  background: var(--studio-chip-bg);
  transform: translateY(-1px);
}

.tag-cloud sup {
  color: inherit;
  font-size: 10px;
  line-height: 1;
}

@media (max-width: 980px) {
  .studio-layout {
    grid-template-columns: 1fr;
  }

  .studio-aside {
    position: static;
  }

  .recent-list a {
    grid-template-columns: 128px 1fr;
  }

  .recent-thumb {
    width: 128px;
    height: 78px;
  }
}

@media (max-width: 720px) {
  .studio-page {
    padding-top: 78px;
  }

  .studio-page::before {
    height: 60px;
  }

  .studio-layout {
    width: min(100% - 24px, 1280px);
  }

  .workspace-head {
    flex-direction: column;
    align-items: flex-start;
  }

  .workspace-actions button {
    height: 36px;
    padding: 0 12px;
  }

  .recent-list a {
    grid-template-columns: 104px 1fr;
    gap: 12px;
  }

  .recent-thumb {
    width: 104px;
    height: 66px;
  }

  .post-row {
    display: block;
  }

  .post-cover-panel,
  .post-cover-panel.right {
    width: 100%;
    height: 180px;
    flex-basis: auto;
    order: initial;
  }

  .post-actions {
    bottom: 12px;
    left: 12px;
    right: auto;
    gap: 6px;
  }

  .post-cover-panel.right .post-actions {
    right: 12px;
    left: auto;
  }

  .post-actions button {
    width: 36px;
    height: 36px;
    font-size: 14px;
  }

  .post-info {
    padding: 22px 20px;
  }

  .article-title {
    font-size: 20px;
    -webkit-line-clamp: 2;
  }
}
</style>
