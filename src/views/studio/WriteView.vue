<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Icon, loadIcon } from '@iconify/vue'
import Vditor from 'vditor'
import 'vditor/dist/index.css'

import BlogNavbar from '@/components/blog/BlogNavbar.vue'
import { useBlogTheme } from '@/composables/useBlogTheme'
import { countMarkdownWords } from '@/utils/markdown'

import postListBgLight from '@/assets/images/postlist-bg-light.jpg'
import postListBgNight from '@/assets/images/postlist-bg-night.jpg'
import defaultCover from '@/assets/images/home-bg-1.jpg'

interface OutlineItem {
  index: number
  level: number
  text: string
}

const OPACITY_STORAGE_KEY = 'rain-blog-write-card-opacity'
const DRAFT_CACHE_ID = 'rain-blog-write-draft'

/* 工具栏图标统一替换为博客同款 Font Awesome（经由 @iconify/vue 加载）。 */
const TOOLBAR_FA_ICONS: Record<string, string> = {
  headings: 'fa-solid:heading',
  bold: 'fa-solid:bold',
  italic: 'fa-solid:italic',
  strike: 'fa-solid:strikethrough',
  quote: 'fa-solid:quote-right',
  list: 'fa-solid:list-ul',
  'ordered-list': 'fa-solid:list-ol',
  check: 'fa-regular:check-square',
  'save-draft': 'fa-regular:save',
  publish: 'fa-regular:paper-plane',
  code: 'fa-regular:file-code',
  'inline-code': 'fa-solid:code',
  link: 'fa-solid:link',
  'insert-image': 'fa-regular:image',
  table: 'fa-solid:table',
  line: 'fa-solid:minus',
  undo: 'fa-solid:undo',
  redo: 'fa-solid:redo',
  'edit-mode': 'fa-regular:edit',
}

async function buildToolbarIconSvgs(): Promise<Record<string, string>> {
  const entries = await Promise.all(
    Object.entries(TOOLBAR_FA_ICONS).map(async ([name, iconName]) => {
      try {
        const data = await loadIcon(iconName)
        const left = data.left ?? 0
        const top = data.top ?? 0
        const width = data.width ?? 16
        const height = data.height ?? 16
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${left} ${top} ${width} ${height}" width="13" height="13" fill="currentColor" aria-hidden="true">${data.body}</svg>`
        return [name, svg] as const
      } catch {
        return [name, ''] as const
      }
    }),
  )

  return Object.fromEntries(entries.filter(([, svg]) => svg))
}

const router = useRouter()
const { isLightTheme, toggleTheme } = useBlogTheme()

const sampleMarkdown = [
  '## 为什么选择 Markdown',
  '',
  'Markdown 是一种轻量级标记语言，以其简洁的语法和强大的表达能力，成为写作、笔记和文档管理的首选工具。',
  '',
  '### 优点',
  '',
  '- 简单易学',
  '- 专注内容',
  '- 跨平台兼容',
  '- 易于版本控制',
  '',
  '## 快速开始',
  '',
  '### 安装',
  '',
  '你可以通过以下方式快速安装：',
  '',
  '```bash',
  'npm install -g rain-blog',
  '```',
  '',
  '### 初始化配置',
  '',
  '运行初始化命令以创建配置文件：',
  '',
].join('\n')

const title = ref('为什么选择 Markdown 进行写作')
const summary = ref('Markdown 简洁易用，让专注内容创作成为可能。')
const markdown = ref(sampleMarkdown)
const category = ref('技术分享')
const categoryOptions = ['技术分享', '前端', 'Java', '建站', '数据库', '写作']
const tags = ref(['Markdown', '写作', '效率'])
const tagDraft = ref('')
const isTagComposerOpen = ref(false)
const isOutlineVisible = ref(true)
const isPublishOpen = ref(false)
const isOpacityPanelOpen = ref(false)
const autoSaveTime = ref('--:--:--')
const cardOpacity = ref(48)
const cover = defaultCover

const editorEl = ref<HTMLElement | null>(null)
const tagInputRef = ref<HTMLInputElement | null>(null)
const vditor = shallowRef<Vditor | null>(null)
const isEditorReady = ref(false)

const wordCount = computed(() => countMarkdownWords(markdown.value))
const readMinutes = computed(() => Math.max(1, Math.ceil(wordCount.value / 300)))

const outlineItems = computed<OutlineItem[]>(() => {
  let headingIndex = 0

  return markdown.value.split('\n').reduce<OutlineItem[]>((items, line) => {
    const heading = line.match(/^(#{1,6})\s+(.+)$/)

    if (heading) {
      items.push({
        index: headingIndex,
        level: heading[1]?.length || 1,
        text: (heading[2] || '').replace(/[*_~`[\]()]/g, '').trim(),
      })
      headingIndex += 1
    }

    return items
  }, [])
})

const pageStyle = computed(() => {
  const background = isLightTheme.value ? postListBgLight : postListBgNight
  const overlayStart = isLightTheme.value ? 'rgba(255, 255, 255, 0.18)' : 'rgba(0, 0, 0, 0.46)'
  const overlayEnd = isLightTheme.value ? 'rgba(255, 255, 255, 0.28)' : 'rgba(0, 0, 0, 0.56)'

  return {
    backgroundImage: `linear-gradient(${overlayStart}, ${overlayEnd}), url(${background})`,
  }
})

/* 透明度只联动内容填充与模糊：0% 时内容完全融入背景；
 * 边框、分隔线、阴影保持常驻（与登录卡风格一致）。 */
const cardStyle = computed(() => {
  const opacity = cardOpacity.value / 100
  const scaled = (alpha: number) => +(alpha * opacity).toFixed(3)
  const blur = `${Math.round(14 * opacity)}px`

  if (isLightTheme.value) {
    return {
      '--write-card-bg': `rgba(255, 255, 255, ${opacity.toFixed(2)})`,
      '--write-strip-bg': `rgba(255, 255, 255, ${scaled(0.32)})`,
      '--write-card-blur': blur,
    }
  }

  return {
    '--write-card-bg': `rgba(15, 23, 42, ${opacity.toFixed(2)})`,
    '--write-strip-bg': `rgba(15, 23, 42, ${scaled(0.35)})`,
    '--write-card-blur': blur,
  }
})

function touchAutoSave() {
  autoSaveTime.value = new Intl.DateTimeFormat('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(new Date())
}

function applyEditorTheme() {
  if (!vditor.value || !isEditorReady.value) {
    return
  }

  if (isLightTheme.value) {
    vditor.value.setTheme('classic', 'light', 'github')
  } else {
    vditor.value.setTheme('dark', 'dark', 'native')
  }
}

onMounted(async () => {
  const storedOpacity = Number.parseInt(window.localStorage.getItem(OPACITY_STORAGE_KEY) || '', 10)
  if (!Number.isNaN(storedOpacity) && storedOpacity >= 0 && storedOpacity <= 100) {
    cardOpacity.value = storedOpacity
  }

  const iconSvgs = await buildToolbarIconSvgs()

  if (!editorEl.value) {
    return
  }

  const withFaIcon = (name: string) => (iconSvgs[name] ? { name, icon: iconSvgs[name] } : name)

  vditor.value = new Vditor(editorEl.value, {
    after: () => {
      isEditorReady.value = true
      markdown.value = vditor.value?.getValue() ?? markdown.value
      applyEditorTheme()
    },
    cache: { enable: true, id: DRAFT_CACHE_ID },
    cdn: '/vditor',
    counter: { enable: false },
    icon: 'material',
    input: (value: string) => {
      markdown.value = value
      touchAutoSave()
    },
    minHeight: 460,
    mode: 'ir',
    placeholder: '开始写作，支持直接输入 Markdown 语法…',
    preview: {
      hljs: { lineNumber: false },
      theme: {
        current: isLightTheme.value ? 'light' : 'dark',
        path: '/vditor/dist/css/content-theme',
      },
    },
    toolbar: [
      withFaIcon('headings'),
      withFaIcon('bold'),
      withFaIcon('italic'),
      withFaIcon('strike'),
      '|',
      withFaIcon('quote'),
      withFaIcon('list'),
      withFaIcon('ordered-list'),
      withFaIcon('check'),
      withFaIcon('code'),
      withFaIcon('inline-code'),
      '|',
      withFaIcon('link'),
      {
        name: 'insert-image',
        tip: '插入图片',
        tipPosition: 's',
        icon:
          iconSvgs['insert-image'] ||
          '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="10" r="1.5"/><path d="m21 15-3.8-3.8a1.6 1.6 0 0 0-2.3 0L7 19"/></svg>',
        click: () => {
          vditor.value?.insertValue('![描述](图片地址)')
        },
      },
      withFaIcon('table'),
      withFaIcon('line'),
      '|',
      withFaIcon('undo'),
      withFaIcon('redo'),
      '|',
      withFaIcon('edit-mode'),
      {
        name: 'save-draft',
        tip: '保存草稿',
        tipPosition: 's',
        className: 'toolbar-item--right',
        icon: iconSvgs['save-draft'] || '<span>存</span>',
        click: () => {
          saveDraft()
        },
      },
      {
        name: 'publish',
        tip: '发布文章',
        tipPosition: 's',
        className: 'toolbar-item--publish',
        icon: iconSvgs['publish'] || '<span>发</span>',
        click: () => {
          openPublish()
        },
      },
    ],
    toolbarConfig: { pin: false },
    value: markdown.value,
  })
})

onBeforeUnmount(() => {
  vditor.value?.destroy()
  vditor.value = null
})

watch(isLightTheme, () => {
  applyEditorTheme()
})

watch(cardOpacity, (value) => {
  window.localStorage.setItem(OPACITY_STORAGE_KEY, String(value))
})

function goBack() {
  router.push('/studio/dashboard')
}

function saveDraft() {
  touchAutoSave()
}

function toggleOutline() {
  isOutlineVisible.value = !isOutlineVisible.value
}

function toggleOpacityPanel() {
  isOpacityPanelOpen.value = !isOpacityPanelOpen.value
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
  editorEl.value?.querySelector('.vditor-reset')?.scrollTo({ top: 0, behavior: 'smooth' })
}

function jumpToOutline(item: OutlineItem) {
  const root = editorEl.value?.querySelector('.vditor-ir .vditor-reset, .vditor-wysiwyg .vditor-reset')

  if (!root) {
    return
  }

  const headings = root.querySelectorAll('h1, h2, h3, h4, h5, h6')
  headings[item.index]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function selectCategory(nextCategory: string) {
  category.value = nextCategory
}

function addTagsFromDraft() {
  const nextTags = tagDraft.value
    .split(/[,\s，]+/)
    .map((tag) => tag.trim().replace(/^#/, ''))
    .filter(Boolean)

  if (nextTags.length === 0) {
    return
  }

  const merged = [...tags.value]
  nextTags.forEach((tag) => {
    if (!merged.some((item) => item.toLowerCase() === tag.toLowerCase())) {
      merged.push(tag)
    }
  })

  tags.value = merged
  tagDraft.value = ''
}

function removeTag(tag: string) {
  tags.value = tags.value.filter((item) => item !== tag)
}

async function openTagComposer() {
  isTagComposerOpen.value = true
  await nextTick()
  tagInputRef.value?.focus()
}

function closeTagComposer() {
  addTagsFromDraft()
  isTagComposerOpen.value = false
}

function onTagInputKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' || event.key === ',' || event.key === '，') {
    event.preventDefault()
    addTagsFromDraft()
    isTagComposerOpen.value = false
  }
}

function openPublish() {
  isPublishOpen.value = true
}

function closePublish() {
  isPublishOpen.value = false
}

function confirmPublish() {
  isPublishOpen.value = false
  window.alert(
    `发布功能待接入后端。\n标题：${title.value}\n分类：${category.value}\n标签：${tags.value.join('、')}`,
  )
}
</script>

<template>
  <main
    class="write-page"
    :class="{ 'is-light-theme': isLightTheme, 'is-night-theme': !isLightTheme }"
    :style="pageStyle"
  >
    <BlogNavbar />

    <section class="write-workspace" :style="cardStyle">
      <header class="workspace-bar">
        <button type="button" class="bar-back" @click="goBack">
          <Icon icon="fa-solid:arrow-left" aria-hidden="true" />
          <span>返回</span>
        </button>

        <span class="bar-spacer"></span>

        <span class="bar-save-state">
          <Icon icon="fa-regular:save" aria-hidden="true" />
          已保存 {{ autoSaveTime }}
        </span>
      </header>

      <div class="write-main" :class="{ 'is-outline-hidden': !isOutlineVisible }">
        <aside v-if="isOutlineVisible" class="outline-pane">
          <div class="outline-head">
            <span>大纲</span>
            <button type="button" title="收起大纲" aria-label="收起大纲" @click="toggleOutline">
              <Icon icon="fa-solid:angle-double-left" aria-hidden="true" />
            </button>
          </div>

          <nav class="outline-list" aria-label="文章大纲">
            <button
              v-for="item in outlineItems"
              :key="`${item.index}-${item.text}`"
              type="button"
              :class="['outline-link', `is-level-${Math.min(item.level, 3)}`]"
              @click="jumpToOutline(item)"
            >
              {{ item.text }}
            </button>
            <p v-if="outlineItems.length === 0" class="outline-empty">暂无大纲</p>
          </nav>
        </aside>

        <button
          v-else
          type="button"
          class="outline-expand"
          title="展开大纲"
          aria-label="展开大纲"
          @click="toggleOutline"
        >
          <Icon icon="fa-solid:angle-double-right" aria-hidden="true" />
        </button>

        <section class="editor-pane">
          <div class="doc-head">
            <input
              v-model="title"
              type="text"
              class="doc-title"
              placeholder="输入文章标题…"
              aria-label="文章标题"
            />
            <input
              v-model="summary"
              type="text"
              class="doc-summary"
              placeholder="输入副标题/摘要…"
              aria-label="文章摘要"
            />
          </div>

          <div ref="editorEl" class="editor-host"></div>
        </section>
      </div>

      <footer class="workspace-status">
        <span>
          <Icon icon="fa-regular:file-alt" aria-hidden="true" />
          字数 {{ wordCount }}
        </span>
        <span>
          <Icon icon="fa-regular:clock" aria-hidden="true" />
          预计阅读 {{ readMinutes }} 分钟
        </span>
        <span class="ok">
          <Icon icon="fa-solid:check" aria-hidden="true" />
          已保存
        </span>

        <span class="bar-spacer"></span>

        <button
          type="button"
          class="status-tool"
          :title="isLightTheme ? '切换夜间模式' : '切换日间模式'"
          :aria-label="isLightTheme ? '切换夜间模式' : '切换日间模式'"
          @click="toggleTheme"
        >
          <Icon :icon="isLightTheme ? 'fa-solid:moon' : 'fa-solid:sun'" aria-hidden="true" />
        </button>
        <button
          type="button"
          class="status-tool"
          :class="{ active: isOpacityPanelOpen }"
          title="卡片透明度"
          aria-label="卡片透明度"
          @click="toggleOpacityPanel"
        >
          <Icon icon="fa-solid:sliders-h" aria-hidden="true" />
        </button>
        <button
          type="button"
          class="status-tool"
          title="回到顶部"
          aria-label="回到顶部"
          @click="scrollToTop"
        >
          <Icon icon="fa-solid:arrow-up" aria-hidden="true" />
        </button>
      </footer>

      <div v-if="isOpacityPanelOpen" class="opacity-panel">
        <span class="opacity-label">卡片透明度</span>
        <input
          v-model.number="cardOpacity"
          type="range"
          min="0"
          max="100"
          step="1"
          aria-label="卡片透明度"
        />
        <strong>{{ cardOpacity }}%</strong>
      </div>
    </section>

    <div v-if="isPublishOpen" class="publish-overlay" @click.self="closePublish">
      <div class="publish-dialog" role="dialog" aria-modal="true" aria-label="发布文章">
        <header class="publish-head">
          <h2>发布文章</h2>
          <button type="button" title="关闭" aria-label="关闭" @click="closePublish">
            <Icon icon="fa-solid:times" aria-hidden="true" />
          </button>
        </header>

        <div class="publish-item">
          <span class="publish-label">分类</span>
          <div class="chip-row">
            <button
              v-for="item in categoryOptions"
              :key="item"
              type="button"
              class="chip"
              :class="{ active: category === item }"
              @click="selectCategory(item)"
            >
              {{ item }}
            </button>
          </div>
        </div>

        <div class="publish-item">
          <span class="publish-label">标签</span>
          <div class="chip-row">
            <button v-for="tag in tags" :key="tag" type="button" class="chip tag" @click="removeTag(tag)">
              <span>{{ tag }}</span>
              <Icon icon="fa-solid:times" aria-hidden="true" />
            </button>
            <button v-if="!isTagComposerOpen" type="button" class="chip tag-add" @click="openTagComposer">
              <Icon icon="fa-solid:plus" aria-hidden="true" />
              <span>添加标签</span>
            </button>
            <label v-else class="chip tag-compose">
              <Icon icon="fa-solid:plus" aria-hidden="true" />
              <input
                ref="tagInputRef"
                v-model="tagDraft"
                type="text"
                placeholder="标签名"
                aria-label="新增标签"
                @keydown="onTagInputKeydown"
                @keydown.esc.prevent="isTagComposerOpen = false"
                @blur="closeTagComposer"
              />
            </label>
          </div>
        </div>

        <div class="publish-item">
          <span class="publish-label">摘要</span>
          <textarea
            v-model="summary"
            rows="2"
            placeholder="在此填写文章摘要…"
            aria-label="文章摘要"
          ></textarea>
        </div>

        <div class="publish-grid">
          <div class="publish-item">
            <span class="publish-label">封面</span>
            <button type="button" class="cover-thumb" title="更换封面" aria-label="更换封面">
              <img :src="cover" alt="文章封面" />
              <span class="cover-mask">
                <Icon icon="fa-solid:upload" aria-hidden="true" />
                更换封面
              </span>
            </button>
          </div>
          <div class="publish-item">
            <span class="publish-label">发布时间</span>
            <div class="publish-time">立即发布</div>
          </div>
        </div>

        <footer class="publish-actions">
          <button type="button" class="bar-action draft" @click="closePublish">取消</button>
          <button type="button" class="bar-action publish wide" @click="confirmPublish">
            <Icon icon="fa-regular:paper-plane" aria-hidden="true" />
            确认发布
          </button>
        </footer>
      </div>
    </div>
  </main>
</template>

<style scoped>
.write-page {
  --write-card-bg: rgba(255, 255, 255, 0.48);
  --write-strip-bg: rgba(255, 255, 255, 0.32);
  --write-panel-bg: rgba(255, 255, 255, 0.94);
  --write-text: #0f172a;
  --write-body: #334155;
  --write-muted: #64748b;
  --write-subtle: #94a3b8;
  --write-divider: rgba(255, 255, 255, 0.45);
  --write-line: rgba(51, 65, 85, 0.2);
  --write-control-bg: rgba(255, 255, 255, 0.45);
  --write-control-border: rgba(255, 255, 255, 0.65);
  --write-chip-bg: linear-gradient(to right, #0000cd 0%, #0f9d58 100%);
  --write-tag-color: #64748b;
  --write-tag-bg: rgba(148, 163, 184, 0.16);
  --write-accent: #1d4ed8;
  --write-ok: #0a8f5b;
  --write-card-shadow: 0 15px 35px rgba(50, 50, 93, 0.16), 0 5px 15px rgba(0, 0, 0, 0.08);

  position: relative;
  min-height: 100vh;
  padding-top: 96px;
  color: var(--write-body);
  background-position: center top;
  background-size: cover;
  background-attachment: fixed;
}

.write-page.is-night-theme {
  --write-strip-bg: rgba(15, 23, 42, 0.35);
  --write-panel-bg: rgba(15, 23, 42, 0.94);
  --write-text: rgba(248, 250, 252, 0.96);
  --write-body: rgba(226, 232, 240, 0.88);
  --write-muted: rgba(203, 213, 225, 0.84);
  --write-subtle: rgba(148, 163, 184, 0.82);
  --write-divider: rgba(226, 232, 240, 0.14);
  --write-line: rgba(203, 213, 225, 0.24);
  --write-control-bg: rgba(15, 23, 42, 0.42);
  --write-control-border: rgba(148, 163, 184, 0.35);
  --write-tag-color: rgba(226, 232, 240, 0.86);
  --write-tag-bg: rgba(148, 163, 184, 0.18);
  --write-accent: #93c5fd;
  --write-ok: #34d399;
  --write-card-shadow: 0 18px 40px rgba(0, 0, 0, 0.32);
}

.write-workspace {
  position: relative;
  z-index: 1;
  width: min(1280px, calc(100% - 24px));
  min-height: calc(100vh - 130px);
  margin: 0 auto 34px;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  overflow: hidden;
  border: 1px solid var(--write-divider);
  border-radius: 8px;
  background: var(--write-card-bg);
  box-shadow: var(--write-card-shadow);
  backdrop-filter: blur(var(--write-card-blur, 14px));
  -webkit-backdrop-filter: blur(var(--write-card-blur, 14px));
  transition: background 0.25s ease;
}

.workspace-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 18px;
  border-bottom: 1px solid var(--write-divider);
  background: var(--write-strip-bg);
}

.bar-spacer {
  flex: 1;
}

.bar-back {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 0;
  padding: 4px 6px;
  color: var(--write-body);
  background: transparent;
  cursor: pointer;
  font: inherit;
  font-size: 13px;
  font-weight: 700;
  border-radius: 6px;
  transition: color 0.2s ease;
}

.bar-back:hover {
  color: var(--write-accent);
}

.bar-save-state {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: var(--write-muted);
  font-size: 12px;
  white-space: nowrap;
}

.bar-save-state svg {
  color: var(--write-ok);
}

.bar-action {
  height: 32px;
  padding: 0 16px;
  border: 1px solid var(--write-control-border);
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  cursor: pointer;
  font: inherit;
  font-size: 13px;
  font-weight: 700;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.bar-action.draft {
  color: var(--write-text);
  background: var(--write-control-bg);
}

.bar-action.publish {
  color: #ffffff;
  border-color: transparent;
  background: var(--write-chip-bg);
  box-shadow: 0 8px 18px rgba(1, 1, 254, 0.22);
}

.bar-action:hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.18);
}

.write-main {
  position: relative;
  min-height: 0;
  display: grid;
  grid-template-columns: 232px minmax(0, 1fr);
}

.write-main.is-outline-hidden {
  grid-template-columns: minmax(0, 1fr);
}

.outline-expand {
  position: absolute;
  left: 12px;
  top: 10px;
  z-index: 5;
  width: 26px;
  height: 26px;
  border: 0;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--write-subtle);
  background: transparent;
  cursor: pointer;
  font-size: 13px;
  transition: color 0.2s ease;
}

.outline-expand:hover {
  color: var(--write-accent);
}

.editor-host :deep(.toolbar-item--right) {
  margin-left: auto;
}

.editor-host :deep(.toolbar-item--publish svg),
.editor-host :deep(.toolbar-item--publish) {
  color: var(--write-accent);
}

.outline-pane {
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--write-divider);
  background: var(--write-strip-bg);
}

.outline-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 14px 10px 20px;
  color: var(--write-text);
  font-size: 13px;
  font-weight: 700;
}

.outline-head button {
  border: 0;
  padding: 4px;
  display: inline-flex;
  color: var(--write-subtle);
  background: transparent;
  cursor: pointer;
  border-radius: 6px;
  transition: color 0.2s ease;
}

.outline-head button:hover {
  color: var(--write-accent);
}

.outline-list {
  flex: 1;
  min-height: 0;
  padding: 0 14px 20px 20px;
  overflow: auto;
}

.outline-link {
  display: block;
  width: 100%;
  border: 0;
  padding: 3px 0;
  color: var(--write-muted);
  background: transparent;
  cursor: pointer;
  font-family: var(--blog-font-family);
  font-size: 0.86rem;
  line-height: 1.55;
  text-align: left;
  transition: color 0.2s ease;
}

.outline-link:hover {
  color: var(--write-accent);
}

.outline-link.is-level-2 {
  margin-left: 4px;
  padding-left: 10px;
  border-left: 1px solid var(--write-line);
}

.outline-link.is-level-3 {
  margin-left: 4px;
  padding-left: 22px;
  border-left: 1px solid var(--write-line);
  font-size: 0.82rem;
}

.outline-empty {
  margin: 0;
  color: var(--write-subtle);
  font-size: 0.86rem;
}

.editor-pane {
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.doc-head {
  width: min(820px, calc(100% - 48px));
  margin: 26px auto 0;
  padding-bottom: 18px;
  display: grid;
  gap: 6px;
}

.doc-title,
.doc-summary {
  width: 100%;
  border: 0;
  outline: none;
  background: transparent;
  font-family: var(--blog-font-family);
}

.doc-title {
  color: var(--write-text);
  font-size: 30px;
  font-weight: 800;
  line-height: 1.25;
}

.doc-summary {
  color: var(--write-muted);
  font-size: 15px;
  line-height: 1.5;
}

.doc-title::placeholder,
.doc-summary::placeholder {
  color: var(--write-subtle);
}

.editor-host {
  flex: 1;
  min-height: 0;
}

.editor-host :deep(.vditor) {
  height: 100%;
  border: 0;
  border-radius: 0;
  background: transparent;
}

.editor-host :deep(.vditor-toolbar) {
  padding: 0 18px !important;
  display: flex;
  justify-content: flex-start;
  border-bottom: 1px solid var(--write-divider);
  background: transparent;
}

.editor-host :deep(.vditor-toolbar__item) {
  padding: 0 2px;
}

.editor-host :deep(.vditor-content) {
  background: transparent;
}

.editor-host :deep(.vditor-reset) {
  max-width: 820px;
  margin: 0 auto;
  padding: 18px 24px 56px !important;
  background: transparent !important;
  color: var(--write-text);
  font-family: var(--blog-font-family);
  font-size: 15px;
}

.editor-host :deep(.vditor-ir),
.editor-host :deep(.vditor-wysiwyg),
.editor-host :deep(.vditor-sv) {
  background: transparent !important;
}

.editor-host :deep(.vditor--dark),
.editor-host :deep(.vditor--dark .vditor-toolbar),
.editor-host :deep(.vditor--dark .vditor-content) {
  background: transparent !important;
}

/* 去掉 Vditor 在标题左侧渲染的 H1~H6 等级提示（会被卡片边缘截断）。 */
.editor-host :deep(.vditor-ir .vditor-reset > h1:before),
.editor-host :deep(.vditor-ir .vditor-reset > h2:before),
.editor-host :deep(.vditor-ir .vditor-reset > h3:before),
.editor-host :deep(.vditor-ir .vditor-reset > h4:before),
.editor-host :deep(.vditor-ir .vditor-reset > h5:before),
.editor-host :deep(.vditor-ir .vditor-reset > h6:before),
.editor-host :deep(.vditor-wysiwyg > .vditor-reset > h1:before),
.editor-host :deep(.vditor-wysiwyg > .vditor-reset > h2:before),
.editor-host :deep(.vditor-wysiwyg > .vditor-reset > h3:before),
.editor-host :deep(.vditor-wysiwyg > .vditor-reset > h4:before),
.editor-host :deep(.vditor-wysiwyg > .vditor-reset > h5:before),
.editor-host :deep(.vditor-wysiwyg > .vditor-reset > h6:before) {
  content: none !important;
}

.workspace-status {
  display: flex;
  align-items: center;
  gap: 16px;
  min-height: 42px;
  padding: 0 14px 0 18px;
  border-top: 1px solid var(--write-divider);
  background: var(--write-strip-bg);
  color: var(--write-body);
  font-size: 12px;
}

.workspace-status > span {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  white-space: nowrap;
}

.workspace-status .ok {
  color: var(--write-ok);
}

.status-tool {
  width: 28px;
  height: 28px;
  border: 0;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--write-muted);
  background: transparent;
  cursor: pointer;
  font-size: 13px;
  transition:
    color 0.18s ease,
    background 0.18s ease;
}

.status-tool:hover,
.status-tool.active {
  color: var(--write-accent);
  background: rgba(148, 163, 184, 0.16);
}

.opacity-panel {
  position: absolute;
  right: 14px;
  bottom: 50px;
  z-index: 40;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 999px;
  background: var(--write-panel-bg);
  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.24);
  backdrop-filter: blur(12px);
}

.opacity-label {
  color: var(--write-muted);
  font-size: 12px;
  white-space: nowrap;
}

.opacity-panel input[type='range'] {
  width: 120px;
  accent-color: var(--write-accent);
}

.opacity-panel strong {
  min-width: 36px;
  color: var(--write-text);
  font-size: 12px;
  text-align: right;
}

.publish-overlay {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(3px);
}

.publish-dialog {
  width: min(420px, 100%);
  max-height: calc(100vh - 60px);
  overflow: auto;
  padding: 20px 22px;
  border-radius: 8px;
  background: var(--write-panel-bg);
  box-shadow: 0 22px 48px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(12px);
}

.publish-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.publish-head h2 {
  margin: 0;
  color: var(--write-text);
  font-size: 17px;
}

.publish-head button {
  border: 0;
  padding: 4px;
  display: inline-flex;
  color: var(--write-subtle);
  background: transparent;
  cursor: pointer;
  border-radius: 6px;
  transition: color 0.2s ease;
}

.publish-head button:hover {
  color: var(--write-accent);
}

.publish-item {
  display: grid;
  gap: 7px;
  margin-bottom: 14px;
}

.publish-label {
  color: var(--write-muted);
  font-size: 12px;
  font-weight: 700;
}

.chip-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 7px;
}

.chip {
  height: 26px;
  padding: 0 11px;
  border: 0;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: var(--write-tag-color);
  background: var(--write-tag-bg);
  cursor: pointer;
  font: inherit;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  transition:
    color 0.2s ease,
    background 0.2s ease,
    transform 0.2s ease;
}

.chip:hover {
  transform: translateY(-1px);
}

.chip.active,
.chip:hover,
.chip.tag-add {
  color: #ffffff;
  background: var(--write-chip-bg);
}

.chip.tag svg {
  width: 10px;
  height: 10px;
  opacity: 0.8;
}

.chip.tag-compose {
  width: min(132px, 100%);
  background: var(--write-tag-bg);
}

.chip.tag-compose input {
  min-width: 0;
  flex: 1;
  border: 0;
  outline: none;
  color: var(--write-text);
  background: transparent;
  font: inherit;
  font-size: 12px;
}

.chip.tag-compose input::placeholder {
  color: var(--write-subtle);
}

.publish-item textarea {
  resize: none;
  padding: 8px 10px;
  border: 1px solid var(--write-line);
  border-radius: 6px;
  outline: none;
  color: var(--write-text);
  background: transparent;
  font-family: var(--blog-font-family);
  font-size: 13px;
  line-height: 1.6;
}

.publish-item textarea:focus {
  border-color: var(--write-accent);
}

.publish-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.cover-thumb {
  position: relative;
  height: 64px;
  border: 0;
  border-radius: 6px;
  padding: 0;
  overflow: hidden;
  cursor: pointer;
  background: transparent;
}

.cover-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.cover-mask {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  color: #ffffff;
  background: rgba(15, 23, 42, 0.4);
  font-size: 12px;
  font-weight: 700;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.cover-thumb:hover .cover-mask {
  opacity: 1;
}

.publish-time {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--write-line);
  border-radius: 6px;
  color: var(--write-body);
  font-size: 13px;
}

.publish-actions {
  display: flex;
  gap: 10px;
  margin-top: 4px;
}

.publish-actions .bar-action {
  flex: 1;
  height: 38px;
}

.publish-actions .bar-action.wide {
  flex: 1.5;
}

@media (max-width: 960px) {
  .write-main {
    grid-template-columns: 200px minmax(0, 1fr);
  }
}

@media (max-width: 820px) {
  .write-page {
    padding-top: 78px;
  }

  .write-workspace {
    width: min(100% - 20px, 680px);
  }

  .write-main,
  .write-main.is-outline-hidden {
    grid-template-columns: minmax(0, 1fr);
  }

  .outline-pane {
    display: none;
  }

  .doc-head {
    width: calc(100% - 40px);
    margin-top: 20px;
  }

  .doc-title {
    font-size: 24px;
  }

  .workspace-status {
    flex-wrap: wrap;
    gap: 10px;
    padding: 8px 12px;
  }
}
</style>
