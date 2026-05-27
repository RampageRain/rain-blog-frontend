<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'

import BlogNavbar from '@/components/blog/BlogNavbar.vue'
import BlogFooter from '@/components/blog/BlogFooter.vue'
import BackTop from '@/components/blog/BackTop.vue'
import ContactPopup from '@/components/blog/ContactPopup.vue'
import { getPostDetail, getPublishedPosts, type PostDetail, type PostListItem } from '@/api/posts'
import { findMockPostDetail, mergeMockPostListItems, mockPostListItems } from '@/data/mockPosts'
import { useBlogTheme } from '@/composables/useBlogTheme'

import postCover1 from '@/assets/images/home-bg-1.jpg'
import postCover2 from '@/assets/images/home-bg-2.jpg'
import postCover3 from '@/assets/images/home-bg-3.jpg'
import postCover4 from '@/assets/images/home-bg-4.jpg'
import postCover5 from '@/assets/images/home-bg-5.jpg'
import postCover6 from '@/assets/images/home-bg-6.jpg'
import postListBgLight from '@/assets/images/postlist-bg-light.jpg'
import postListBgNight from '@/assets/images/postlist-bg-night.jpg'
import qqQrCode from '@/assets/images/contact/qq-qrcode.png'
import wechatQrCode from '@/assets/images/contact/wechat-qrcode.png'

interface TocItem {
  id: string
  text: string
  level: number
}

interface AdjacentPost {
  id: number
  title: string
  summary: string
  date: string
  category: string
  views: number
  cover: string
}

interface NeighborEntry {
  slot: 'previous' | 'next' | 'current'
  label: '上一篇' | '下一篇' | '本篇'
  post: AdjacentPost
}

type ImageFitMode = 'fill-width' | 'fill-height'
type PaginationSlot = 'previous' | 'next'

const route = useRoute()
const { isLightTheme } = useBlogTheme()

const post = ref<PostDetail | null>(null)
const isLoading = ref(false)
const errorMessage = ref('')
const publishedPostCards = ref<AdjacentPost[]>([])
const activeTocId = ref('')
const typedSummary = ref('')
const copyToastVisible = ref(false)
const isTocVisible = ref(false)
const readingProgress = ref(0)
const articleHeadCoverFitMode = ref<ImageFitMode>('fill-width')
const paginationCoverFitModes = ref<Record<PaginationSlot, ImageFitMode>>({
  previous: 'fill-width',
  next: 'fill-width'
})
const commentModalVisible = ref(false)
const commentAuthor = ref('')
const commentContact = ref('')
const commentContent = ref('')
const commentNotice = ref('')
const contactPopupVisible = ref(false)
const contactPopup = ref({
  title: '',
  account: '',
  qrCode: ''
})
let headingObserver: IntersectionObserver | null = null
let summaryTypingTimer: number | undefined
let copyToastTimer: number | undefined
let commentNoticeTimer: number | undefined
const imageRatioCache = new Map<string, number>()

const postCoverMap: Record<string, string> = {
  'home-bg-1': postCover1,
  'home-bg-2': postCover2,
  'home-bg-3': postCover3,
  'home-bg-4': postCover4,
  'home-bg-5': postCover5,
  'home-bg-6': postCover6
}

const isMobileViewport = () => {
  return typeof window !== 'undefined' && window.innerWidth <= 768
}

const mobileArticleHeadCrop = {
  x: '50%',
  y: '50%',
  scale: 1
}

const mobilePaginationCoverCrop: Record<PaginationSlot, { x: string; y: string }> = {
  previous: {
    x: '50%',
    y: '80%'
  },
  next: {
    x: '50%',
    y: '80%'
  }
}

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

async function loadImageRatio(imageUrl: string) {
  if (!imageUrl) {
    return 1
  }

  const cachedRatio = imageRatioCache.get(imageUrl)
  if (cachedRatio) {
    return cachedRatio
  }

  return new Promise<number>((resolve) => {
    const image = new Image()
    image.onload = () => {
      const ratio = image.naturalWidth && image.naturalHeight ? image.naturalWidth / image.naturalHeight : 1
      imageRatioCache.set(imageUrl, ratio)
      resolve(ratio)
    }
    image.onerror = () => resolve(1)
    image.src = imageUrl
  })
}

async function refreshArticleHeadImageFit() {
  if (typeof window === 'undefined') {
    return
  }

  const headContainerRatio = getElementRatio(
    '.article-head',
    isMobileViewport() ? window.innerWidth / Math.max(window.innerHeight * 0.46, 300) : 16 / 9
  )
  const headImageRatio = await loadImageRatio(articleCoverImage.value)
  articleHeadCoverFitMode.value = resolveImageFitMode(headImageRatio, headContainerRatio)
}

async function refreshPaginationCoverFits() {
  if (typeof window === 'undefined') {
    return
  }

  if (!isMobileViewport()) {
    paginationCoverFitModes.value = {
      previous: 'fill-width',
      next: 'fill-width'
    }
    return
  }

  const paginationContainerRatio = getElementRatio('#pagination .prev-post', (window.innerWidth * 0.95) / 132)
  const previousImageRatio = await loadImageRatio(neighborEntries.value.previous.post.cover)
  const nextImageRatio = await loadImageRatio(neighborEntries.value.next.post.cover)

  paginationCoverFitModes.value = {
    previous: resolveImageFitMode(previousImageRatio, paginationContainerRatio),
    next: resolveImageFitMode(nextImageRatio, paginationContainerRatio)
  }
}

async function refreshResponsiveImageFits() {
  if (typeof window === 'undefined') {
    return
  }

  await nextTick()
  await Promise.all([refreshArticleHeadImageFit(), refreshPaginationCoverFits()])
}

const paginationCoverClass = (slot: PaginationSlot) => {
  return paginationCoverFitModes.value[slot] === 'fill-height' ? 'is-fill-height' : 'is-fill-width'
}

const articleHeadCoverClass = computed(() => {
  return articleHeadCoverFitMode.value === 'fill-height' ? 'is-fill-height' : 'is-fill-width'
})

const articleHeadCoverStyle = computed(() => {
  return {
    top: mobileArticleHeadCrop.y,
    left: mobileArticleHeadCrop.x,
    transform: `translate(-50%, -50%) scale(${mobileArticleHeadCrop.scale})`
  }
})

const paginationCoverStyle = (slot: PaginationSlot) => {
  const crop = mobilePaginationCoverCrop[slot]

  return {
    top: crop.y,
    left: crop.x
  }
}

function updateReadingProgress() {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return
  }

  const scrollingElement = document.scrollingElement || document.documentElement
  const maxScrollTop = scrollingElement.scrollHeight - scrollingElement.clientHeight

  if (maxScrollTop <= 0) {
    readingProgress.value = 0
    return
  }

  readingProgress.value = Math.min(
    100,
    Math.max(0, (scrollingElement.scrollTop / maxScrollTop) * 100)
  )
}

function createMockPostDetail(id: number | string): PostDetail {
  const mockPostDetail = findMockPostDetail(id)

  if (mockPostDetail) {
    return mockPostDetail
  }

  return {
    id: Number(id) || 1,
    title: '在雨声里写下第一篇博客',
    summary:
      '这是一篇用于预览文章详情页效果的本地假数据。它会先展示出来，方便你观察背景、卡片、标题、摘要和正文排版。',
    category: '前端随笔',
    coverKey: 'home-bg-1',
    date: '2026-05-25',
    views: 128,
    contentMd: `# 文章详情页效果预览

今天想先把文章详情页的视觉效果跑通：背景图跟随日夜间自动切换，文章主体卡片保持不透明，让文字阅读起来更加稳定。

## 为什么先用假数据

后端详情接口还没有完全接上时，前端页面很容易一直停留在加载失败状态。先准备一份本地数据，可以提前确认页面结构是否舒服。

### 前端可以先验证什么

- 标题、摘要、分类和元信息的位置
- Markdown 标题是否渲染成真正的 H1、H2、H3
- 代码块、引用、列表的阅读效果
- 右侧文章大纲是否能快速跳转

## 代码块效果

下面是一段 TypeScript 示例代码，用来观察代码块的背景、字体和间距：

\`\`\`ts
interface PostDetail {
  id: number
  title: string
  summary: string
  contentMd: string
}

function formatPostTitle(post: PostDetail) {
  return '文章：' + post.title
}
\`\`\`

也可以看看行内代码，例如 \`getPostDetail(id)\` 会请求文章详情接口。

## 引用效果

> 好的博客详情页不只是把文字展示出来，还要让读者能舒服地阅读、定位和回看重点。

## 下一步

等后端提供 \`GET /api/posts/{id}\` 之后，这份假数据可以删除，页面会直接展示接口返回的真实文章内容。

保持热爱，继续把博客一点点完善起来。`
  }
}

function toAdjacentPost(postItem: PostListItem): AdjacentPost {
  return {
    id: postItem.id,
    title: postItem.title,
    summary: postItem.summary,
    date: postItem.date,
    category: postItem.category,
    views: postItem.views,
    cover: postCoverMap[postItem.coverKey] || postCover1
  }
}

async function loadPublishedPostCards() {
  try {
    const response = await getPublishedPosts({
      current: 1,
      pageSize: 100
    })

    if (response.data.code === 200) {
      publishedPostCards.value = mergeMockPostListItems(response.data.data?.records ?? []).map(toAdjacentPost)
    }
  } catch {
    publishedPostCards.value = mockPostListItems.map(toAdjacentPost)
  }
}

const postId = computed(() => {
  const routeId = route.params.id
  return Array.isArray(routeId) ? routeId[0] : routeId
})

const pageStyle = computed(() => {
  const currentBackground = isLightTheme.value ? postListBgLight : postListBgNight
  const overlayStart = isLightTheme.value
    ? 'rgba(255, 255, 255, 0.18)'
    : 'rgba(0, 0, 0, 0.46)'
  const overlayEnd = isLightTheme.value
    ? 'rgba(255, 255, 255, 0.28)'
    : 'rgba(0, 0, 0, 0.56)'

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

const markdownContent = computed(() => {
  return post.value?.contentMd?.trim() || '暂无正文内容'
})

const wordCount = computed(() => {
  return countMarkdownWords(markdownContent.value)
})

const articleCoverImage = computed(() => {
  if (!post.value) {
    return postCover1
  }

  return postCoverMap[post.value.coverKey] || postCover1
})

const postPermalink = computed(() => {
  if (typeof window !== 'undefined') {
    return window.location.href.split('#')[0]
  }

  return `/posts/${postId.value || ''}`
})

const currentPostCard = computed<AdjacentPost>(() => {
  const currentPost = post.value

  return {
    id: currentPost?.id ?? Number(postId.value) ?? 1,
    title: currentPost?.title || '当前文章',
    summary: currentPost?.summary || '正在阅读的这篇文章。',
    date: currentPost?.date || '',
    category: currentPost?.category || '未分类',
    views: currentPost?.views ?? 0,
    cover: articleCoverImage.value
  }
})

const fallbackPostCards = computed<AdjacentPost[]>(() => {
  const currentId = currentPostCard.value.id

  return [
    {
      id: Math.max(currentId - 1, 1),
      title: 'ReentrantLock 使用笔记',
      summary: '从可重入锁、公平锁和条件队列几个角度复习并发编程基础。',
      date: '2026-05-24',
      category: 'Java并发',
      views: 96,
      cover: postCover2
    },
    currentPostCard.value,
    {
      id: currentId + 1,
      title: 'volatile 关键字整理',
      summary: '理解可见性、有序性以及 volatile 在并发场景中的边界。',
      date: '2026-05-26',
      category: 'Java并发',
      views: 142,
      cover: postCover3
    }
  ]
})

const orderedPostCards = computed(() => {
  return publishedPostCards.value.length ? publishedPostCards.value : fallbackPostCards.value
})

const neighborEntries = computed<Record<'previous' | 'next', NeighborEntry>>(() => {
  const currentId = currentPostCard.value.id
  const currentIndex = orderedPostCards.value.findIndex((item) => item.id === currentId)
  const safeIndex = currentIndex >= 0 ? currentIndex : 1
  const previousPost = orderedPostCards.value[safeIndex - 1]
  const nextPost = orderedPostCards.value[safeIndex + 1]

  return {
    previous: previousPost
      ? {
          slot: 'previous',
          label: '上一篇',
          post: previousPost
        }
      : {
          slot: 'current',
          label: '本篇',
          post: currentPostCard.value
        },
    next: nextPost
      ? {
          slot: 'next',
          label: '下一篇',
          post: nextPost
        }
      : {
          slot: 'current',
          label: '本篇',
          post: currentPostCard.value
        }
  }
})

const tocItems = computed<TocItem[]>(() => {
  const headings = markdownContent.value.match(/^#{1,3}\s+.+$/gm) || []

  return headings.map((heading, index) => {
    const marker = heading.match(/^#{1,3}/)?.[0] || '#'
    const text = heading.replace(/^#{1,3}\s+/, '').trim()

    return {
      id: createHeadingId(text, index),
      text,
      level: marker.length
    }
  })
})

function toggleTocVisible() {
  isTocVisible.value = !isTocVisible.value
}

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

function openCommentModal() {
  commentModalVisible.value = true
  commentNotice.value = ''
}

function closeCommentModal() {
  commentModalVisible.value = false
  commentNotice.value = ''
}

function submitComment() {
  if (!commentContent.value.trim()) {
    commentNotice.value = '请先填写评论内容。'
    return
  }

  commentNotice.value = '评论已提交，感谢你的留言。'
  commentAuthor.value = ''
  commentContact.value = ''
  commentContent.value = ''

  if (commentNoticeTimer !== undefined) {
    window.clearTimeout(commentNoticeTimer)
  }

  commentNoticeTimer = window.setTimeout(() => {
    commentModalVisible.value = false
    commentNotice.value = ''
    commentNoticeTimer = undefined
  }, 900)
}

function disconnectHeadingObserver() {
  headingObserver?.disconnect()
  headingObserver = null
}

function clearSummaryTypingTimer() {
  if (summaryTypingTimer !== undefined) {
    window.clearTimeout(summaryTypingTimer)
    summaryTypingTimer = undefined
  }
}

function showCopyToast() {
  copyToastVisible.value = true

  if (copyToastTimer !== undefined) {
    window.clearTimeout(copyToastTimer)
  }

  copyToastTimer = window.setTimeout(() => {
    copyToastVisible.value = false
    copyToastTimer = undefined
  }, 1600)
}

function startSummaryTyping(text: string) {
  clearSummaryTypingTimer()
  typedSummary.value = ''

  if (!text) {
    return
  }

  let nextIndex = 0
  const typeNextCharacter = () => {
    typedSummary.value = text.slice(0, nextIndex + 1)
    nextIndex += 1

    if (nextIndex < text.length) {
      summaryTypingTimer = window.setTimeout(typeNextCharacter, 58)
    } else {
      summaryTypingTimer = undefined
    }
  }

  summaryTypingTimer = window.setTimeout(typeNextCharacter, 180)
}

async function setupHeadingObserver() {
  await nextTick()
  disconnectHeadingObserver()

  if (!tocItems.value.length || typeof IntersectionObserver === 'undefined') {
    activeTocId.value = tocItems.value[0]?.id || ''
    return
  }

  headingObserver = new IntersectionObserver(
    (entries) => {
      const activeEntry = entries
        .filter((entry) => entry.isIntersecting)
        .sort((prev, next) => prev.boundingClientRect.top - next.boundingClientRect.top)[0]

      if (activeEntry?.target.id) {
        activeTocId.value = activeEntry.target.id
      }
    },
    {
      rootMargin: '-18% 0px -68% 0px',
      threshold: 0
    }
  )

  tocItems.value.forEach((item) => {
    const heading = document.getElementById(item.id)
    if (heading) {
      headingObserver?.observe(heading)
    }
  })

  activeTocId.value = tocItems.value[0]?.id || ''
}

function setActiveTocId(id: string) {
  activeTocId.value = id
}

const renderedMarkdown = computed(() => {
  return renderMarkdown(markdownContent.value)
})

function createHeadingId(text: string, index: number) {
  const normalizedText = text
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')

  return normalizedText ? `${normalizedText}-${index}` : `heading-${index}`
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function renderInlineMarkdown(value: string) {
  return escapeHtml(value).replace(/`([^`]+)`/g, '<code>$1</code>')
}

function renderMarkdownImage(alt: string, src: string) {
  const safeAlt = escapeHtml(alt)
  const safeSrc = escapeHtml(src)

  return `<figure><img src="${safeSrc}" alt="${safeAlt}" loading="lazy" decoding="async" />${
    safeAlt ? `<figcaption>${safeAlt}</figcaption>` : ''
  }</figure>`
}

function countMarkdownWords(markdown: string) {
  const plainText = markdown
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^>\s+/gm, '')
    .replace(/^[-*]\s+/gm, '')
    .trim()

  const chineseCharacters = plainText.match(/[\u4e00-\u9fa5]/g)?.length || 0
  const latinWords = plainText.replace(/[\u4e00-\u9fa5]/g, ' ').match(/[A-Za-z0-9]+(?:[-_][A-Za-z0-9]+)*/g)?.length || 0

  return chineseCharacters + latinWords
}

const copyIconSvg = '<svg viewBox="0 0 448 512" aria-hidden="true"><path fill="currentColor" d="M384 336H192c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16h140.1L400 115.9V320c0 8.8-7.2 16-16 16zM192 384h192c35.3 0 64-28.7 64-64V115.9c0-12.7-5.1-24.9-14.1-33.9L366.1 14.1C357.1 5.1 344.9 0 332.1 0H192c-35.3 0-64 28.7-64 64v256c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64v256c0 35.3 28.7 64 64 64h192c35.3 0 64-28.7 64-64v-32h-48v32c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192c0-8.8 7.2-16 16-16h32v-48H64z"/></svg>'
const collapseIconSvg = '<svg class="collapse-icon" viewBox="0 0 448 512" aria-hidden="true"><path fill="currentColor" d="M201.4 137.4c12.5-12.5 32.8-12.5 45.3 0l160 160c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L224 205.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l160-160z"/></svg>'
const expandIconSvg = '<svg class="expand-icon" viewBox="0 0 448 512" aria-hidden="true"><path fill="currentColor" d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"/></svg>'

function renderCodeLines(lines: string[]) {
  const targetLines = lines.length ? lines : ['']

  return targetLines
    .map((line, index) => {
      return `<span class="code-line"><span class="code-line-number">${index + 1}</span><span class="code-line-content">${escapeHtml(
        line
      )}</span></span>`
    })
    .join('')
}

function renderMarkdown(markdown: string) {
  const lines = markdown.split('\n')
  const htmlParts: string[] = []
  let headingIndex = 0
  let paragraphLines: string[] = []
  let listItems: string[] = []
  let isCodeBlock = false
  let codeLanguage = ''
  let codeLines: string[] = []

  function flushParagraph() {
    if (paragraphLines.length === 0) {
      return
    }

    htmlParts.push(`<p>${renderInlineMarkdown(paragraphLines.join(' '))}</p>`)
    paragraphLines = []
  }

  function flushList() {
    if (listItems.length === 0) {
      return
    }

    htmlParts.push(`<ul>${listItems.map((item) => `<li>${renderInlineMarkdown(item)}</li>`).join('')}</ul>`)
    listItems = []
  }

  function flushCodeBlock() {
    htmlParts.push(
      `<div class="code-block-wrapper"><div class="code-toolbar"><button class="code-action-button code-copy-button" type="button" aria-label="复制代码" title="复制代码">${copyIconSvg}</button><button class="code-action-button code-toggle-button" type="button" aria-label="收起代码" title="收起代码">${collapseIconSvg}${expandIconSvg}</button></div><pre class="code-block"><span class="code-language">${escapeHtml(
        codeLanguage || 'text'
      )}</span><code>${renderCodeLines(codeLines)}</code></pre></div>`
    )
    codeLines = []
    codeLanguage = ''
  }

  for (const line of lines) {
    const codeFence = line.match(/^```(\w+)?\s*$/)
    if (codeFence) {
      if (isCodeBlock) {
        flushCodeBlock()
        isCodeBlock = false
      } else {
        flushParagraph()
        flushList()
        isCodeBlock = true
        codeLanguage = codeFence[1] || ''
      }
      continue
    }

    if (isCodeBlock) {
      codeLines.push(line)
      continue
    }

    if (!line.trim()) {
      flushParagraph()
      flushList()
      continue
    }

    const heading = line.match(/^(#{1,3})\s+(.+)$/)
    if (heading) {
      flushParagraph()
      flushList()
      const level = heading[1]?.length || 1
      const text = heading[2]?.trim() || ''
      const id = createHeadingId(text, headingIndex)
      headingIndex += 1
      htmlParts.push(`<h${level} id="${id}">${renderInlineMarkdown(text)}</h${level}>`)
      continue
    }

    const quote = line.match(/^>\s+(.+)$/)
    if (quote) {
      flushParagraph()
      flushList()
      htmlParts.push(`<blockquote><p>${renderInlineMarkdown(quote[1] || '')}</p></blockquote>`)
      continue
    }

    const image = line.match(/^!\[([^\]]*)]\(([^)]+)\)$/)
    if (image) {
      flushParagraph()
      flushList()
      htmlParts.push(renderMarkdownImage(image[1] || '', image[2] || ''))
      continue
    }

    const listItem = line.match(/^[-*]\s+(.+)$/)
    if (listItem) {
      flushParagraph()
      listItems.push(listItem[1] || '')
      continue
    }

    flushList()
    paragraphLines.push(line.trim())
  }

  if (isCodeBlock) {
    flushCodeBlock()
  }

  flushParagraph()
  flushList()

  return htmlParts.join('')
}

function fallbackCopyText(text: string) {
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', 'true')
  textarea.style.position = 'fixed'
  textarea.style.top = '-9999px'
  textarea.style.left = '-9999px'
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand('copy')
  document.body.removeChild(textarea)
}

async function copyCodeText(text: string, button: HTMLButtonElement) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
    } else {
      fallbackCopyText(text)
    }

    button.setAttribute('title', '已复制')
    button.setAttribute('aria-label', '已复制')
    button.classList.add('is-copied')
    showCopyToast()
  } catch {
    button.setAttribute('title', '复制失败')
    button.setAttribute('aria-label', '复制失败')
    button.classList.add('is-failed')
  } finally {
    window.setTimeout(() => {
      button.setAttribute('title', '复制代码')
      button.setAttribute('aria-label', '复制代码')
      button.classList.remove('is-copied', 'is-failed')
    }, 1600)
  }
}

function handleArticleContentClick(event: MouseEvent) {
  const target = event.target
  if (!(target instanceof Element)) {
    return
  }

  const toggleButton = target.closest<HTMLButtonElement>('.code-toggle-button')
  if (toggleButton) {
    const wrapper = toggleButton.closest('.code-block-wrapper')
    wrapper?.classList.toggle('is-collapsed')
    const isCollapsed = wrapper?.classList.contains('is-collapsed') || false
    toggleButton.setAttribute('title', isCollapsed ? '展开代码' : '收起代码')
    toggleButton.setAttribute('aria-label', isCollapsed ? '展开代码' : '收起代码')
    return
  }

  const copyButton = target.closest<HTMLButtonElement>('.code-copy-button')
  if (!copyButton) {
    return
  }

  const codeText = Array.from(
    copyButton.closest('.code-block-wrapper')?.querySelectorAll('.code-line-content') || []
  )
    .map((line) => line.textContent || '')
    .join('\n')
  if (!codeText) {
    return
  }

  void copyCodeText(codeText, copyButton)
}

async function loadPost() {
  if (!postId.value) {
    post.value = null
    errorMessage.value = '文章不存在'
    return
  }

  isLoading.value = true
  errorMessage.value = ''
  post.value = createMockPostDetail(postId.value)
  isLoading.value = false

  try {
    const response = await getPostDetail(postId.value)
    if (response.data.code === 200 && response.data.data) {
      post.value = response.data.data
      return
    }

    post.value = createMockPostDetail(postId.value)
  } catch {
    post.value = createMockPostDetail(postId.value)
  } finally {
    isLoading.value = false
  }
}

void loadPublishedPostCards()

watch(postId, loadPost, { immediate: true })
watch(
  () => post.value?.summary || '',
  (summary) => startSummaryTyping(summary || '这篇文章还没有摘要。'),
  { immediate: true }
)
watch(
  renderedMarkdown,
  async () => {
    await setupHeadingObserver()
    await refreshResponsiveImageFits()
    updateReadingProgress()
  },
  { immediate: true }
)

watch(
  () => [articleCoverImage.value, neighborEntries.value.previous.post.cover, neighborEntries.value.next.post.cover],
  () => {
    void refreshResponsiveImageFits()
  },
  { immediate: true }
)

onMounted(() => {
  updateReadingProgress()
  void refreshResponsiveImageFits()
  window.addEventListener('scroll', updateReadingProgress, { passive: true })
  window.addEventListener('resize', updateReadingProgress)
  window.addEventListener('resize', refreshResponsiveImageFits)
})

onBeforeUnmount(() => {
  disconnectHeadingObserver()
  clearSummaryTypingTimer()
  window.removeEventListener('scroll', updateReadingProgress)
  window.removeEventListener('resize', updateReadingProgress)
  window.removeEventListener('resize', refreshResponsiveImageFits)
  if (copyToastTimer !== undefined) {
    window.clearTimeout(copyToastTimer)
  }
  if (commentNoticeTimer !== undefined) {
    window.clearTimeout(commentNoticeTimer)
  }
})
</script>

<template>
  <div
    class="post-detail-page"
    :class="{
      'is-light-theme': isLightTheme,
      'is-night-theme': !isLightTheme
    }"
    :style="pageStyle"
  >
    <BlogNavbar />

    <main class="post-detail-main">
      <RouterLink class="back-link" :to="{ path: '/', hash: '#home-posts' }">
        <Icon icon="fa-solid:arrow-left" aria-hidden="true" />
        返回文章列表
      </RouterLink>

      <section v-if="isLoading" class="post-state-card">
        正在加载文章...
      </section>

      <section v-else-if="errorMessage" class="post-state-card is-error">
        {{ errorMessage }}
      </section>

      <div
        v-else-if="post"
        class="article-layout"
        :class="{ 'is-toc-hidden': !tocItems.length || !isTocVisible }"
      >
        <div class="article-main-column">
          <article class="article-card">
            <header class="article-head">
              <img
                class="article-head-cover"
                :class="articleHeadCoverClass"
                :style="articleHeadCoverStyle"
                :src="articleCoverImage"
                alt="文章标题背景图"
              />

              <RouterLink
                class="article-chip"
                :to="`/tags/${encodeURIComponent(post.category || '未分类')}`"
              >
                {{ post.category || '未分类' }}
              </RouterLink>

              <div class="article-head-content">
                <h1>{{ post.title }}</h1>

                <p class="article-description">
                  {{ typedSummary }}
                </p>
              </div>

              <div class="article-meta">
                <span>
                  <Icon icon="fa-regular:calendar-minus" aria-hidden="true" />
                  发布日期：{{ post.date || '未知' }}
                </span>
                <span>
                  <Icon icon="fa-regular:file-word" aria-hidden="true" />
                  字数统计：{{ wordCount }}
                </span>
              </div>
            </header>

            <div class="mobile-article-card-shell">
              <section class="mobile-article-info" aria-label="文章信息">
                <div class="mobile-article-tag-row">
                  <RouterLink
                    class="mobile-article-chip"
                    :to="`/tags/${encodeURIComponent(post.category || '未分类')}`"
                  >
                    {{ post.category || '未分类' }}
                  </RouterLink>
                </div>

                <div class="mobile-article-meta">
                  <span>
                    <Icon icon="fa-regular:calendar-minus" aria-hidden="true" />
                    发布日期：{{ post.date || '未知' }}
                  </span>
                  <span>
                    <Icon icon="fa-regular:file-word" aria-hidden="true" />
                    字数统计：{{ wordCount }}
                  </span>
                </div>
              </section>

              <hr class="mobile-article-divider clearfix" />

              <section
                id="articleContent"
                class="article-content"
                @click="handleArticleContentClick"
                v-html="renderedMarkdown"
              ></section>

            <hr class="article-reprint-divider" />

            <section id="reprint-statement" class="reprint-card">
              <div class="reprint-row">
                <span class="reprint-meta">
                  <Icon
                    icon="fa-solid:user"
                    class="reprint-fa-icon"
                    aria-hidden="true"
                  />
                  文章作者：
                </span>
                <RouterLink class="reprint-info" to="/about">Rain</RouterLink>
              </div>

              <div class="reprint-row">
                <span class="reprint-meta">
                  <Icon
                    icon="fa-solid:link"
                    class="reprint-fa-icon"
                    aria-hidden="true"
                  />
                  文章链接：
                </span>
                <a class="reprint-info" :href="postPermalink">{{ postPermalink }}</a>
              </div>

              <div class="reprint-row">
                <span class="reprint-meta">
                  <Icon
                    icon="fa-solid:copyright"
                    class="reprint-fa-icon"
                    aria-hidden="true"
                  />
                  版权声明：
                </span>
                <span class="reprint-info">
                  本博客所有文章除特别声明外，均采用
                  <a href="https://creativecommons.org/licenses/by/4.0/deed.zh" target="_blank" rel="noopener noreferrer">CC BY 4.0</a>
                  许可协议。转载请注明来源
                  <RouterLink to="/about">Rain</RouterLink>。
                </span>
              </div>
            </section>

            <section class="tag-share-card" aria-label="联系方式和评论">
              <div class="post-contact-actions">
                <button
                  class="contact-circle contact-circle--qq"
                  type="button"
                  aria-label="查看 QQ 联系方式"
                  title="QQ 联系"
                  @click="openQQPopup"
                >
                  <Icon icon="fa-brands:qq" aria-hidden="true" />
                </button>

                <button
                  class="contact-circle contact-circle--wechat"
                  type="button"
                  aria-label="查看微信联系方式"
                  title="微信联系"
                  @click="openWechatPopup"
                >
                  <Icon icon="fa-brands:weixin" aria-hidden="true" />
                </button>

                <button
                  class="contact-circle contact-circle--comment"
                  type="button"
                  aria-label="发表评论"
                  title="评论"
                  @click="openCommentModal"
                >
                  <Icon icon="fa-regular:comment-dots" aria-hidden="true" />
                </button>
              </div>
            </section>
            </div>
          </article>

          <nav id="pagination" class="post-neighbors pagination-post" aria-label="上一篇和下一篇">
            <RouterLink
              class="pagination-related prev-post"
              :to="`/posts/${neighborEntries.previous.post.id}`"
              :title="neighborEntries.previous.post.title"
            >
              <img
                class="cover"
                :class="paginationCoverClass('previous')"
                :style="paginationCoverStyle('previous')"
                :src="neighborEntries.previous.post.cover"
                alt="上一篇文章封面"
              />

              <div class="info">
                <div class="info-1">
                  <div class="info-item-1">
                    <Icon
                      :icon="neighborEntries.previous.slot === 'current' ? 'fa-solid:circle-dot' : 'fa-solid:arrow-left'"
                      aria-hidden="true"
                    />
                    {{ neighborEntries.previous.label }}
                  </div>
                  <div class="info-item-2">{{ neighborEntries.previous.post.title }}</div>
                </div>

                <div class="info-2">
                  <div class="info-item-1">{{ neighborEntries.previous.post.summary || '暂无摘要' }}</div>
                </div>
              </div>
            </RouterLink>

            <RouterLink
              class="pagination-related next-post"
              :to="`/posts/${neighborEntries.next.post.id}`"
              :title="neighborEntries.next.post.title"
            >
              <img
                class="cover"
                :class="paginationCoverClass('next')"
                :style="paginationCoverStyle('next')"
                :src="neighborEntries.next.post.cover"
                alt="下一篇文章封面"
              />

              <div class="info text-right">
                <div class="info-1">
                  <div class="info-item-1">
                    {{ neighborEntries.next.label }}
                    <Icon
                      :icon="neighborEntries.next.slot === 'current' ? 'fa-solid:circle-dot' : 'fa-solid:arrow-right'"
                      aria-hidden="true"
                    />
                  </div>
                  <div class="info-item-2">{{ neighborEntries.next.post.title }}</div>
                </div>

                <div class="info-2">
                  <div class="info-item-1">{{ neighborEntries.next.post.summary || '暂无摘要' }}</div>
                </div>
              </div>
            </RouterLink>
          </nav>
        </div>

        <aside v-if="tocItems.length && isTocVisible" class="article-toc" aria-label="文章大纲">
          <div class="toc-card">
            <div class="toc-title">
              <Icon icon="fa-regular:list-alt" aria-hidden="true" />
              目录
            </div>

            <nav>
              <a
                v-for="item in tocItems"
                :key="item.id"
                :class="[
                  'toc-link',
                  `is-level-${item.level}`,
                  { 'is-active': activeTocId === item.id }
                ]"
                :href="`#${item.id}`"
                @click="setActiveTocId(item.id)"
              >
                {{ item.text }}
              </a>
            </nav>
          </div>
        </aside>
      </div>
    </main>

    <BlogFooter />
    <div class="progress-bar" :style="{ width: `${readingProgress}%` }" aria-hidden="true"></div>
    <button
      v-if="tocItems.length"
      class="floating-toc-button"
      type="button"
      :aria-label="isTocVisible ? '隐藏目录' : '显示目录'"
      :title="isTocVisible ? '隐藏目录' : '显示目录'"
      @click="toggleTocVisible"
    >
      <Icon icon="fa-solid:list-ul" aria-hidden="true" />
    </button>
    <BackTop />

    <Transition name="comment-modal-fade">
      <div
        v-if="commentModalVisible"
        class="comment-modal-backdrop"
        role="dialog"
        aria-modal="true"
        aria-labelledby="commentModalTitle"
        @click.self="closeCommentModal"
      >
        <section class="comment-modal-card">
          <button class="comment-modal-close" type="button" aria-label="关闭评论弹窗" @click="closeCommentModal">
            ×
          </button>
          <h2 id="commentModalTitle">发表评论</h2>
          <p>留下你对这篇文章的想法。</p>

          <label>
            昵称
            <input v-model="commentAuthor" type="text" placeholder="可选" />
          </label>
          <label>
            联系方式
            <input v-model="commentContact" type="text" placeholder="邮箱、QQ 或微信，方便我反馈交流" />
          </label>
          <label>
            评论
            <textarea v-model="commentContent" rows="5" placeholder="写下你的评论"></textarea>
          </label>

          <div class="comment-modal-actions">
            <span>{{ commentNotice }}</span>
            <button type="button" @click="submitComment">提交评论</button>
          </div>

          <div class="comment-modal-backup">
            <span>如果不方便留言，</span>
            <a class="comment-mail-link" href="mailto:18687419361@163.com?subject=Rain%20Blog%20文章交流">
              <Icon icon="fa-regular:envelope" aria-hidden="true" />
              也可以邮件交流
            </a>
          </div>
        </section>
      </div>
    </Transition>

    <ContactPopup
      :visible="contactPopupVisible"
      :title="contactPopup.title"
      :account="contactPopup.account"
      :qr-code="contactPopup.qrCode"
      @close="closeContactPopup"
    />

    <Transition name="copy-toast">
      <div v-if="copyToastVisible" class="copy-toast">已复制代码</div>
    </Transition>
  </div>
</template>

<style scoped>
.post-detail-page {
  --theme-text: #34495e;
  --theme-muted: #64748b;
  --theme-subtle: #64748b;
  --theme-card-bg: #ffffff;
  --theme-card-border: rgba(255, 255, 255, 0.72);
  --theme-divider: rgba(148, 163, 184, 0.24);
  --theme-state-bg: #ffffff;
  --theme-inline-code-bg: #f1f5f9;
  --theme-inline-code-text: #1d4ed8;
  --theme-code-bg: #272822;
  --theme-code-text: #e8eaf6;
  --theme-chip-bg: linear-gradient(to right, #0000CD 0%, #0f9d58 100%);
  --theme-muted-chip-bg: linear-gradient(to right, #0000FF 0%, #4169E1 100%);
  --theme-toc-bg: rgba(255, 255, 255, 0.96);
  --theme-card-shadow: 0 15px 35px rgba(50, 50, 93, 0.1),
    0 5px 15px rgba(0, 0, 0, 0.07);
  --theme-card-hover-shadow: 0 18px 38px rgba(50, 50, 93, 0.14),
    0 8px 18px rgba(0, 0, 0, 0.09);
  --theme-cover-tint: rgba(15, 23, 42, 0.2);
  --post-card-min-height: 360px;
  --matery-rem: 14px;
  --matery-body-font-family: Roboto, sans-serif;
  --matery-label-font-family: var(--matery-body-font-family);
  --theme-reprint-border: #eeeeee;
  --theme-reprint-hover-shadow: 0 0 10px 0 rgba(232, 237, 250, 0.6),
    0 4px 8px 0 rgba(232, 237, 250, 0.5);
  --theme-shadow: 0 10px 35px 2px rgba(0, 0, 0, 0.15), 0 5px 15px rgba(0, 0, 0, 0.07),
    0 2px 5px -5px rgba(0, 0, 0, 0.1);

  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;

  color: var(--theme-text);
  font-family: var(--blog-font-family);
  background-attachment: fixed;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  scroll-behavior: smooth;
}

.post-detail-page :deep(*) {
  font-family: var(--blog-font-family);
}

.post-detail-page :deep(code),
.post-detail-page :deep(pre),
.post-detail-page :deep(.code-language),
.post-detail-page :deep(.code-line-content) {
  font-family: Inconsolata, Monaco, Consolas, 'Courier New', monospace;
}

.post-detail-page.is-night-theme {
  --theme-text: rgba(248, 250, 252, 0.96);
  --theme-muted: rgba(203, 213, 225, 0.86);
  --theme-subtle: rgba(148, 163, 184, 0.82);
  --theme-card-bg: #0f172a;
  --theme-card-border: rgba(255, 255, 255, 0.12);
  --theme-divider: rgba(226, 232, 240, 0.16);
  --theme-state-bg: #0f172a;
  --theme-inline-code-bg: rgba(30, 41, 59, 0.92);
  --theme-inline-code-text: #93c5fd;
  --theme-code-bg: #020617;
  --theme-code-text: #dbeafe;
  --theme-chip-bg: linear-gradient(to right, #0000CD 0%, #0f9d58 100%);
  --theme-muted-chip-bg: linear-gradient(to right, #0000FF 0%, #4169E1 100%);
  --theme-toc-bg: rgba(15, 23, 42, 0.96);
  --theme-card-shadow: 0 18px 40px rgba(0, 0, 0, 0.24),
    inset 0 0 0 1px rgba(255, 255, 255, 0.1);
  --theme-card-hover-shadow: 0 22px 48px rgba(0, 0, 0, 0.3),
    inset 0 0 0 1px rgba(147, 197, 253, 0.18);
  --theme-cover-tint: rgba(2, 6, 23, 0.32);
  --theme-reprint-border: rgba(226, 232, 240, 0.16);
  --theme-reprint-hover-shadow: 0 0 10px 0 rgba(15, 23, 42, 0.36),
    0 4px 8px 0 rgba(0, 0, 0, 0.24);
  --theme-shadow: 0 20px 44px rgba(0, 0, 0, 0.3), inset 0 0 0 1px rgba(255, 255, 255, 0.08);
}

.post-detail-main {
  width: min(90%, 1180px);
  margin: 0 auto;
  padding: 122px 0 58px;
  flex: 1;
}

.back-link {
  margin-bottom: 18px;
  display: inline-flex;
  align-items: center;
  gap: 8px;

  color: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
  font-family: var(--matery-label-font-family);
  font-weight: 500;
  letter-spacing: normal;
  line-height: 1.5;
  text-decoration: none;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.back-link:hover {
  transform: translateX(-3px);
}

.back-link svg {
  width: 20px;
  height: 20px;
}

.copy-toast {
  position: fixed;
  left: 50%;
  bottom: 96px;
  z-index: 1200;
  padding: 10px 18px;

  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.86);
  box-shadow: 0 14px 34px rgba(15, 23, 42, 0.28);
  backdrop-filter: blur(12px);
  transform: translateX(-50%);
}

.floating-toc-button {
  position: fixed;
  right: 15px;
  bottom: 76px;
  z-index: 998;

  width: 48px;
  height: 48px;
  padding: 0;
  border: none;
  border-radius: 50%;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  color: #ffffff;
  background: linear-gradient(to right, #0000CD 0%, #0f9d58 100%);
  box-shadow: 0 12px 26px rgba(1, 1, 254, 0.24);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
}

.floating-toc-button:hover {
  transform: translateY(-3px);
  filter: brightness(1.04);
  box-shadow: 0 16px 32px rgba(1, 1, 254, 0.3);
}

.floating-toc-button svg {
  width: 18px;
  height: 18px;
}

.comment-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1300;
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(15, 23, 42, 0.46);
  backdrop-filter: blur(6px);
}

.comment-modal-card {
  position: relative;
  width: min(92vw, 520px);
  padding: 28px;
  color: var(--theme-text);
  border: 1px solid rgba(255, 255, 255, 0.68);
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.22),
    inset 0 1px 0 rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(20px);
}

.post-detail-page.is-night-theme .comment-modal-card {
  border-color: rgba(255, 255, 255, 0.14);
  background: rgba(15, 23, 42, 0.92);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.32),
    inset 0 1px 0 rgba(255, 255, 255, 0.12);
}

.comment-modal-card h2 {
  margin: 0;
  font-size: calc(var(--matery-rem) * 1.6);
  line-height: 1.4;
}

.comment-modal-card p {
  margin: 8px 0 18px;
  color: var(--theme-muted);
  font-size: var(--matery-rem);
}

.comment-mail-link {
  display: inline-flex;
  align-items: center;
  gap: 5px;

  color: #3b82f6;
  font-size: calc(var(--matery-rem) * 0.92);
  line-height: 1.5;
  text-decoration: none;
  transition: color 0.2s ease, text-decoration-color 0.2s ease;
}

.comment-mail-link:hover {
  color: #1d4ed8;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.comment-mail-link svg {
  width: 13px;
  height: 13px;
}

.comment-modal-backup {
  margin-top: 12px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 2px;

  color: var(--theme-muted);
  font-size: calc(var(--matery-rem) * 0.92);
  line-height: 1.5;
}

.comment-modal-card label {
  display: block;
  margin-top: 14px;
  color: var(--theme-text);
  font-size: var(--matery-rem);
  font-weight: 500;
}

.comment-modal-card input,
.comment-modal-card textarea {
  width: 100%;
  margin-top: 7px;
  padding: 10px 12px;
  color: var(--theme-text);
  border: 1px solid var(--theme-divider);
  border-radius: 8px;
  background: var(--theme-state-bg);
  outline: none;
  resize: vertical;
}

.comment-modal-card input:focus,
.comment-modal-card textarea:focus {
  border-color: #3b82f6;
}

.comment-modal-close {
  position: absolute;
  top: 12px;
  right: 14px;
  border: none;
  color: var(--theme-muted);
  font-size: 26px;
  line-height: 1;
  background: transparent;
  cursor: pointer;
}

.comment-modal-actions {
  margin-top: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.comment-modal-actions span {
  color: #3b82f6;
  font-size: var(--matery-rem);
}

.comment-modal-actions button {
  padding: 8px 18px;
  color: #ffffff;
  border: none;
  border-radius: 999px;
  background: linear-gradient(to right, #0000CD 0%, #0f9d58 100%);
  cursor: pointer;
}

.comment-modal-fade-enter-active,
.comment-modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.comment-modal-fade-enter-from,
.comment-modal-fade-leave-to {
  opacity: 0;
}

.copy-toast-enter-active,
.copy-toast-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.copy-toast-enter-from,
.copy-toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(10px);
}

.article-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 345px;
  align-items: start;
  gap: 24px;
  transition: grid-template-columns 0.25s ease;
}

.article-layout.is-toc-hidden {
  grid-template-columns: minmax(0, 980px);
  justify-content: center;
}

.article-main-column {
  width: 100%;
  min-width: 0;
}

.post-state-card,
.article-card,
.toc-card {
  overflow: hidden;

  background: var(--theme-card-bg);
  border: 1px solid var(--theme-card-border);
  border-radius: 14px;
  box-shadow: var(--theme-shadow);
}

.article-card {
  border: none;
}

.post-state-card {
  min-height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;

  color: var(--theme-muted);
  font-size: 16px;
  font-weight: 800;
  letter-spacing: 0.08em;
  background: var(--theme-state-bg);
}

.post-state-card.is-error {
  color: #ef4444;
}

.article-head {
  position: relative;
  overflow: hidden;
  isolation: isolate;
  aspect-ratio: 16 / 9;
  min-height: 0;
  padding: clamp(96px, 12vw, 150px) 38px clamp(64px, 8vw, 112px);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  background-color: transparent;
}

.article-head-cover {
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

.article-head-cover.is-fill-height {
  width: auto;
  height: 100%;
}

.article-head-cover.is-fill-width {
  width: 100%;
  height: auto;
}

.article-head::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4));
}

.article-head::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background: transparent;
}

.article-head-content {
  position: relative;
  z-index: 2;
  max-width: 820px;
  margin: 0 auto;
  color: #ffffff;
}

.article-chip {
  position: absolute;
  top: 26px;
  left: 28px;
  z-index: 3;

  display: inline-flex;
  align-items: center;
  padding: 8px 18px;

  color: #fff;
  font-size: 13px;
  font-weight: 400;
  letter-spacing: 0.08em;
  line-height: 1;
  text-decoration: none;
  border: 1px solid rgba(255, 255, 255, 0.48);
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.22);
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.24);
  backdrop-filter: blur(8px);
  transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
}

.article-chip:hover {
  color: #ffffff;
  border-color: rgba(226, 232, 240, 0.46);
  background: rgba(226, 232, 240, 0.18);
  box-shadow: 0 14px 34px rgba(15, 23, 42, 0.28);
  transform: translateY(-2px);
}

.article-head h1 {
  margin: 0;
  color: #ffffff;
  font-size: clamp(36px, 5vw, 58px);
  font-weight: 900;
  line-height: 1.15;
  letter-spacing: -0.04em;
  text-shadow: 0 4px 18px rgba(0, 0, 0, 0.42);
}

.article-description {
  max-width: 720px;
  margin: 22px auto 0;
  min-height: 1.9em;
  color: rgba(248, 250, 252, 0.9);
  font-size: 16px;
  font-weight: 400;
  line-height: 1.9;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.28);
}

.article-meta {
  position: absolute;
  right: 28px;
  bottom: 22px;
  z-index: 3;

  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px 18px;

  color: rgba(248, 250, 252, 0.88);
  font-size: 14px;
  font-weight: 400;
}

.article-meta span {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 0;

  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.28);
}

.article-meta svg {
  width: 18px;
  height: 18px;
}

.mobile-article-info {
  display: none;
}

.mobile-article-card-shell {
  display: contents;
}

.mobile-article-divider {
  display: none;
}

.progress-bar {
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 300;
  width: 0;
  height: 4px;
  opacity: 0.8;
  pointer-events: none;
  background: var(--theme-chip-bg);
}

.article-content {
  padding: 32px 38px 20px;
  color: var(--theme-text);
  font-family: var(--matery-body-font-family);
  font-size: var(--matery-rem);
  line-height: calc(var(--matery-rem) * 1.5);
}

.article-content :deep(*) {
  font-family: var(--matery-body-font-family);
}

.article-content :deep(code),
.article-content :deep(pre),
.article-content :deep(.code-language),
.article-content :deep(.code-line-content) {
  font-family: Inconsolata, Monaco, Consolas, 'Courier New', monospace;
}

.article-content :deep(h1),
.article-content :deep(h2),
.article-content :deep(h3),
.article-content :deep(h4),
.article-content :deep(h5),
.article-content :deep(h6) {
  color: var(--theme-text);
  font-weight: bold;
  scroll-margin-top: 96px;
}

.article-content :deep(h1) {
  margin: 48px 0 22px -5px;
  font-size: calc(var(--matery-rem) * 2);
  line-height: calc(var(--matery-rem) * 2);
}

.article-content :deep(h2) {
  margin: 42px 0 18px -5px;
  font-size: calc(var(--matery-rem) * 1.8);
  line-height: calc(var(--matery-rem) * 1.8);
}

.article-content :deep(h3) {
  margin: 38px 0 15px -4px;
  font-size: calc(var(--matery-rem) * 1.6);
  line-height: calc(var(--matery-rem) * 1.7);
}

.article-content :deep(h4) {
  margin: 32px 0 12px -4px;
  font-size: calc(var(--matery-rem) * 1.45);
  line-height: calc(var(--matery-rem) * 1.45);
}

.article-content :deep(h5) {
  margin: 28px 0 8px -4px;
  font-size: calc(var(--matery-rem) * 1.2);
  line-height: calc(var(--matery-rem) * 1.2);
}

.article-content :deep(h6) {
  margin: 22px 0 4px -4px;
  font-size: calc(var(--matery-rem) * 1.1);
  line-height: calc(var(--matery-rem) * 1.1);
}

.article-content :deep(p) {
  margin: 2px 2px 10px;
  font-size: calc(var(--matery-rem) * 1.05);
  line-height: calc(var(--matery-rem) * 1.85);
}

.article-content :deep(ul) {
  display: block;
  margin: 0 0 16px;
  padding-left: 2em !important;
  word-spacing: 0.05rem;
}

.article-content :deep(li) {
  display: list-item;
  margin: 0;
  font-size: var(--matery-rem);
  line-height: calc(var(--matery-rem) * 1.8);
}

.article-content :deep(ul li) {
  list-style-type: disc;
}

.article-content :deep(figure) {
  margin: 28px 0;
}

.article-content :deep(figure img) {
  width: 100%;
  max-height: 430px;
  display: block;
  object-fit: cover;
  border-radius: 14px;
  box-shadow: 0 14px 34px rgba(15, 23, 42, 0.16);
}

.article-content :deep(figcaption) {
  margin-top: 10px;
  color: var(--theme-muted);
  font-size: calc(var(--matery-rem) * 0.88);
  line-height: calc(var(--matery-rem) * 1.5);
  text-align: center;
}

.article-content :deep(blockquote) {
  margin: 24px 0;
  padding: 16px 18px;

  color: var(--theme-muted);
  border-left: 5px solid #3b82f6;
  border-radius: 8px;
  background: rgba(59, 130, 246, 0.1);
}

.article-content :deep(blockquote p) {
  margin: 0;
  line-height: calc(var(--matery-rem) * 1.85);
  text-indent: 0.2rem;
}

.article-content :deep(code) {
  padding: 2px 6px;
  color: var(--theme-inline-code-text);
  font-family: Inconsolata, Monaco, Consolas, 'Courier New', monospace;
  font-size: calc(var(--matery-rem) * 0.91);
  background: var(--theme-inline-code-bg);
  border-radius: 4px;
}

.article-content :deep(.code-block-wrapper) {
  position: relative;
  margin: 24px 0;
}

.article-content :deep(.code-toolbar) {
  position: absolute;
  top: 12px;
  right: 14px;
  z-index: 3;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.article-content :deep(.code-action-button) {
  width: 28px;
  height: 28px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  color: rgba(203, 213, 225, 0.8);
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.52);
  cursor: pointer;
  transition: color 0.2s ease, background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
}

.article-content :deep(.code-action-button:hover),
.article-content :deep(.code-action-button.is-copied) {
  color: #dbeafe;
  border-color: rgba(147, 197, 253, 0.36);
  background: rgba(30, 64, 175, 0.42);
  transform: translateY(-1px);
}

.article-content :deep(.code-action-button.is-failed) {
  color: #ffffff;
  border-color: rgba(248, 113, 113, 0.72);
  background: rgba(239, 68, 68, 0.72);
}

.article-content :deep(.code-action-button svg) {
  width: 16px;
  height: 16px;
  pointer-events: none;
}

.article-content :deep(.code-toggle-button .expand-icon),
.article-content :deep(.code-block-wrapper.is-collapsed .code-toggle-button .collapse-icon) {
  display: none;
}

.article-content :deep(.code-block-wrapper.is-collapsed .code-toggle-button .expand-icon) {
  display: block;
}

.article-content :deep(.code-block) {
  position: relative;
  margin: 0;
  padding: 42px 18px 18px 0;
  overflow-x: hidden;

  color: var(--theme-code-text);
  background: var(--theme-code-bg);
  border-radius: 10px;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.06);
}

.article-content :deep(.code-block-wrapper.is-collapsed .code-block) {
  max-height: 92px;
  overflow: hidden;
}

.article-content :deep(.code-block-wrapper.is-collapsed .code-block::after) {
  content: '';
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 42px;
  background: linear-gradient(rgba(2, 6, 23, 0), var(--theme-code-bg));
}

.article-content :deep(.code-block::before) {
  content: '';
  position: absolute;
  top: 15px;
  left: 16px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #ff5f56;
  box-shadow: 20px 0 #ffbd2e, 40px 0 #27c93f;
}

.article-content :deep(.code-block code) {
  display: block;
  padding: 0;
  color: inherit;
  background: transparent;
  border-radius: 0;
  font-size: 14px;
  line-height: 1.8;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.article-content :deep(.code-line) {
  display: grid;
  grid-template-columns: 56px minmax(0, 1fr);
  min-height: 25px;
  align-items: stretch;
}

.article-content :deep(.code-line-number) {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-right: 0;
  color: rgba(148, 163, 184, 0.62);
  user-select: none;
  text-align: center;
}

.article-content :deep(.code-line-content) {
  padding-right: 18px;
  padding-left: 18px;
  border-left: 1px solid rgba(148, 163, 184, 0.18);
  min-width: 0;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.article-content :deep(.code-language) {
  position: absolute;
  top: 12px;
  left: 72px;
  color: rgba(203, 213, 225, 0.68);
  font-family: Consolas, Monaco, monospace;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.article-reprint-divider {
  margin: 0 38px 20px;
  border: 0;
  border-top: 1px solid var(--theme-divider);
}

.reprint-card {
  margin: 15px 38px 42px;
  padding: 0.5rem 0.8rem;

  color: var(--theme-muted);
  font-size: var(--matery-rem);
  line-height: 2;
  border: 1px solid var(--theme-reprint-border);
  border-radius: 4px;
  background: var(--theme-card-bg);
  transition: box-shadow 0.3s ease-in-out;
}

.reprint-card:hover {
  box-shadow: var(--theme-reprint-hover-shadow);
}

.reprint-row {
  display: flex;
  gap: 8px;
}

.reprint-row + .reprint-row {
  margin-top: 2px;
}

.reprint-meta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex: 0 0 auto;

  color: var(--theme-text);
  font-family: var(--matery-label-font-family);
  font-size: var(--matery-rem);
  font-weight: bold;
  line-height: 2;
}

.reprint-fa-icon {
  width: 1em;
  height: 1em;
  flex: 0 0 auto;
  color: currentColor;
}

.reprint-info {
  min-width: 0;
  color: var(--theme-muted);
  font-size: var(--matery-rem);
  word-break: break-word;
}

.reprint-info a,
.reprint-card a {
  color: #3b82f6;
  font-size: calc(var(--matery-rem) * 1.05);
  font-weight: 500;
  text-decoration: none;
}

.tag-share-card {
  margin: -26px 38px 42px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.post-contact-actions {
  display: inline-flex;
  align-items: center;
  gap: 15px;
  transform: scale(0.8);
  transform-origin: right center;
}

.contact-circle {
  --contact-color: #3b82f6;
  --contact-shadow: rgba(59, 130, 246, 0.24);

  width: 36px;
  height: 36px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  color: var(--contact-color);
  border: 1px solid currentColor;
  border-radius: 50%;
  background: #ffffff;
  box-shadow: 0 6px 16px rgba(15, 23, 42, 0.08);
  cursor: pointer;
  text-decoration: none;
  transition: color 0.28s ease, background 0.28s ease, transform 0.28s ease, box-shadow 0.28s ease;
}

.post-detail-page.is-night-theme .contact-circle {
  background: rgba(15, 23, 42, 0.86);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.18);
}

.contact-circle--qq {
  --contact-color: #3b82f6;
  --contact-shadow: rgba(59, 130, 246, 0.26);
}

.contact-circle--wechat {
  --contact-color: #22c55e;
  --contact-shadow: rgba(34, 197, 94, 0.26);
}

.contact-circle--comment {
  --contact-color: #ef4444;
  --contact-shadow: rgba(239, 68, 68, 0.26);
}

.contact-circle:hover {
  color: #ffffff;
  background: var(--contact-color);
  box-shadow: 0 10px 22px var(--contact-shadow);
  transform: translateY(-2px);
}

.contact-circle svg {
  width: 18px;
  height: 18px;
}

.post-neighbors.pagination-post {
  width: 100%;
  margin-top: 40px;
  display: flex;
  overflow: hidden;
  border-radius: 6px;
  background: #000000;
}

.pagination-related {
  position: relative;
  min-width: 0;
  height: 150px;
  flex: 1;
  display: inline-block;
  overflow: hidden;
  color: #ffffff;
  background: #000000;
  text-decoration: none;
  vertical-align: bottom;
}

.pagination-related .cover {
  width: 100%;
  height: auto;
  min-height: 100%;
  display: block;
  object-fit: initial;
  object-position: center;
  transform: translateY(-10%);
  opacity: 0.4;
  filter: blur(0);
  transition: transform 0.6s ease, opacity 0.6s ease, filter 375ms ease-in 0.2s;
}

.pagination-related .info {
  position: absolute;
  inset: 0;
  z-index: 1;
  color: #ffffff;
}

.pagination-related.next-post .info,
.pagination-related .info.text-right {
  text-align: right;
}

.pagination-related .info .info-1,
.pagination-related .info .info-2 {
  position: absolute;
  top: 50%;
  width: 100%;
  padding: 20px 40px;
  color: #ffffff;
  box-sizing: border-box;
  transform: translate(0, -50%);
  transition: transform 0.3s, opacity 0.3s;
}

.pagination-related .info .info-1 .info-item-1 {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(229, 231, 235, 0.86);
  text-transform: uppercase;
  font-size: 90%;
}

.pagination-related.prev-post .info .info-1 .info-item-1 svg {
  position: absolute;
  right: calc(100% + 8px);
}

.pagination-related.next-post .info .info-1 .info-item-1 {
  justify-content: flex-end;
}

.pagination-related.next-post .info .info-1 .info-item-1 svg {
  position: absolute;
  left: calc(100% + 8px);
}

.pagination-related .info .info-1 .info-item-2 {
  margin-top: 6px;
  color: #ffffff;
  font-size: 1rem;
  font-weight: 500;
}

.pagination-related .info .info-2 {
  opacity: 0;
  transform: translate(0, 0);
}

.pagination-related .info .info-1 .info-item-2,
.pagination-related .info .info-2 .info-item-1 {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
}

.pagination-related .info .info-1 .info-item-2 {
  -webkit-line-clamp: 1;
}

.pagination-related .info .info-2 .info-item-1 {
  color: rgba(255, 255, 255, 0.92);
  font-size: 0.9rem;
  line-height: 1.6;
  -webkit-line-clamp: 2;
}

.pagination-related svg {
  width: 0.9em;
  height: 0.9em;
  flex: 0 0 auto;
}

@media (hover: hover) and (pointer: fine) {
  .pagination-related:hover .cover {
    opacity: 0.5;
    filter: blur(3px);
    transform: translateY(-20%) scale(1.08);
  }

  .pagination-related:hover .info-1 {
    opacity: 0;
    transform: translate(0, -100%);
  }

  .pagination-related:hover .info-2 {
    opacity: 1;
    transform: translate(0, -50%);
  }
}

.article-toc {
  position: sticky;
  top: 96px;
}

.toc-card {
  padding: 0 0 0 20px;
  background: var(--theme-toc-bg);
}

.toc-title {
  margin-bottom: 0;
  padding: 35px 0 15px 10px;
  display: flex;
  align-items: center;
  gap: 10px;

  color: var(--theme-text);
  font-size: 1.5rem;
  font-family: var(--matery-label-font-family);
  font-weight: bold;
  letter-spacing: normal;
  line-height: 1.5rem;
}

.toc-title svg {
  width: 24px;
  height: 24px;
}

.toc-card nav {
  padding: 0 0 30px 10px;
  overflow: auto;
}

.toc-link {
  display: block;
  padding: 1px 0;
  color: var(--theme-muted);
  font-size: 0.9rem;
  font-family: var(--matery-label-font-family);
  font-weight: 400;
  letter-spacing: normal;
  line-height: 1.55;
  text-decoration: none;
  transition: color 0.2s ease, text-decoration-color 0.2s ease;
}

.toc-link.is-active {
  color: #3b82f6;
  font-weight: 700;
}

.toc-link:hover {
  color: #3b82f6;
  font-weight: 700;
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 4px;
}

.toc-link.is-level-2 {
  padding-left: 10px;
}

.toc-link.is-level-3 {
  padding-left: 20px;
  font-size: 0.86rem;
}

@media (max-width: 1024px) {
  .article-layout {
    grid-template-columns: 1fr;
  }

  .article-toc {
    order: -1;
    position: static;
  }
}

@media (max-width: 768px) {
  .post-detail-main {
    width: 100%;
    padding: 0 0 34px;
  }

  .back-link {
    display: none;
  }

  .article-card {
    width: 100%;
    margin: 0 auto;
    overflow: visible;
    background: transparent;
    box-shadow: none;
    border-radius: 8px;
  }

  .mobile-article-card-shell {
    position: relative;
    z-index: 4;
    width: 95%;
    margin: -58px auto 0;
    display: block;
    overflow: hidden;
    background: var(--theme-card-bg);
    border-radius: 8px;
    box-shadow: 0 10px 35px 2px rgba(0, 0, 0, 0.15),
      0 5px 15px rgba(0, 0, 0, 0.07),
      0 2px 5px -5px rgba(0, 0, 0, 0.1);
  }

  .article-head {
    padding-right: 15px;
    padding-left: 15px;
  }

  .article-content {
    padding: 0 15px 20px 18px;
  }

  .mobile-article-info {
    display: block;
    padding: 15px 15px 1px 15px;
    margin-bottom: -5px;
    background: transparent;
  }

  .mobile-article-tag-row {
    padding-bottom: 15px;
  }

  .mobile-article-chip {
    display: inline-flex;
    align-items: center;
    height: 25px;
    margin-bottom: 2px;
    padding: 0 14px;
    color: #ffffff;
    font-size: var(--matery-rem);
    font-weight: 400;
    line-height: 24px;
    text-decoration: none;
    border-radius: 15px;
    background: linear-gradient(to right, #0000CD 0%, #0f9d58 100%);
  }

  .mobile-article-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 15px;
    color: var(--theme-muted);
    font-size: 13px;
    line-height: 1.6;
  }

  .mobile-article-meta span {
    display: inline-flex;
    align-items: center;
    gap: 7px;
  }

  .mobile-article-meta svg {
    width: 16px;
    height: 16px;
  }

  .mobile-article-divider {
    display: block;
    clear: left;
    margin: 20px 0;
    border: 0;
    border-top: 1px solid #ccc;
  }

  .article-reprint-divider,
  .reprint-card,
  .tag-share-card {
    margin-right: 15px;
    margin-left: 15px;
  }

  .tag-share-card {
    justify-content: flex-end;
    margin-bottom: 24px;
  }

  .post-neighbors.pagination-post {
    flex-direction: column;
    gap: 0;
    width: 95%;
    margin-top: 24px;
    margin-right: auto;
    margin-left: auto;
    overflow: hidden;
    border-radius: 8px;
    background: #000000;
    box-shadow: 0 10px 26px rgba(15, 23, 42, 0.18);
  }

  .pagination-related {
    width: 100%;
    height: 132px;
    flex: none;
    border-radius: 0;
    background: #000000;
    box-shadow: none;
  }

  .pagination-related + .pagination-related {
    position: relative;
    z-index: 1;
    margin-top: -4px;
    border-top: 0;
  }

  .pagination-related .cover {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    height: auto;
    min-height: 0;
    display: block;
    object-fit: initial;
    object-position: center;
    transform: translate(-50%, -50%);
    filter: blur(0);
  }

  .pagination-related .cover.is-fill-height {
    width: auto;
    height: 100%;
  }

  .pagination-related .cover.is-fill-width {
    width: 100%;
    height: auto;
  }

  .pagination-related:hover .cover,
  .pagination-related:focus .cover,
  .pagination-related:active .cover {
    opacity: 0.4;
    filter: blur(0);
    transform: translate(-50%, -50%);
  }

  .pagination-related:hover .info-1,
  .pagination-related:focus .info-1,
  .pagination-related:active .info-1 {
    opacity: 1;
    transform: translate(0, -50%);
  }

  .pagination-related:hover .info-2,
  .pagination-related:focus .info-2,
  .pagination-related:active .info-2 {
    opacity: 0;
    transform: translate(0, 0);
  }

  .pagination-related .info .info-1,
  .pagination-related .info .info-2 {
    padding: 18px 22px;
  }

  .pagination-related.next-post .info,
  .pagination-related .info.text-right {
    text-align: left;
  }

  .pagination-related.next-post .info .info-1 .info-item-1 {
    justify-content: flex-start;
  }

  .pagination-related.prev-post .info .info-1 .info-item-1 svg,
  .pagination-related.next-post .info .info-1 .info-item-1 svg {
    position: static;
  }

  .reprint-row {
    flex-direction: column;
    gap: 2px;
  }

  .article-head {
    width: 100vw;
    height: 46vh;
    min-height: 300px;
    margin: 0;
    aspect-ratio: auto;
    padding: 78px max(18px, 5vw) 92px;
    border-radius: 0;
  }

  .article-head-cover {
    object-position: center;
  }

  .article-chip {
    display: none;
  }

  .article-meta {
    display: none;
  }

  .article-content {
    position: relative;
    z-index: 3;
    margin: 0 auto;
    background: transparent;
    border-radius: 0;
    box-shadow: none;
  }

  .article-reprint-divider {
    display: block;
    margin-top: 4px;
    margin-bottom: 15px;
  }

  .reprint-card {
    margin-top: 0;
    margin-bottom: 32px;
  }

  .article-head h1 {
    font-size: clamp(1.85rem, 8vw, 2.45rem);
  }

  .article-description {
    margin-top: 14px;
    font-size: 14px;
    line-height: 1.7;
  }

  .floating-toc-button {
    display: none;
  }

  .comment-modal-card {
    padding: 24px 20px;
  }
}
</style>
