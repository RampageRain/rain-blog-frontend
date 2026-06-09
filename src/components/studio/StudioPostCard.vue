<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { Icon } from '@iconify/vue'

type PostStatus = 'published' | 'draft'
type ImageFitMode = 'fill-width' | 'fill-height'

interface StudioPostItem {
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

const props = defineProps<{
  post: StudioPostItem
  reversed?: boolean
}>()

const emit = defineEmits<{
  preview: [post: StudioPostItem]
  edit: [post: StudioPostItem]
  delete: [post: StudioPostItem]
}>()

const coverRef = ref<HTMLElement | null>(null)
const imageRef = ref<HTMLImageElement | null>(null)
const coverFitMode = ref<ImageFitMode>('fill-width')

let resizeObserver: ResizeObserver | undefined

const statusLabel: Record<PostStatus, string> = {
  published: '已发布',
  draft: '草稿',
}

function updateCoverFit() {
  const cover = coverRef.value
  const image = imageRef.value

  if (!cover || !image || !image.naturalWidth || !image.naturalHeight) {
    return
  }

  const coverRatio = cover.clientWidth && cover.clientHeight ? cover.clientWidth / cover.clientHeight : 44 / 26
  const imageRatio = image.naturalWidth / image.naturalHeight

  coverFitMode.value = imageRatio >= coverRatio ? 'fill-height' : 'fill-width'
}

onMounted(() => {
  resizeObserver = new ResizeObserver(updateCoverFit)

  if (coverRef.value) {
    resizeObserver.observe(coverRef.value)
  }

  void nextTick(updateCoverFit)
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
})
</script>

<template>
  <article class="studio-post-card">
    <div class="studio-post-card-surface">
      <div class="post-cover-section" :class="{ right: props.reversed }">
        <div ref="coverRef" class="post-cover">
          <RouterLink class="post-cover-link" :to="`/posts/${post.id}`" :title="post.title">
            <img
              ref="imageRef"
              class="post-cover-image"
              :class="`is-${coverFitMode}`"
              :src="post.cover"
              :alt="post.title"
              decoding="async"
              @load="updateCoverFit"
            />
          </RouterLink>

          <div class="post-actions-zone" :class="{ right: props.reversed }">
            <div class="post-actions" aria-label="文章操作">
              <span class="action-boundary">
                <button
                  type="button"
                  class="preview"
                  title="预览"
                  aria-label="预览文章"
                  @click="emit('preview', post)"
                >
                  <Icon icon="fa-regular:eye" aria-hidden="true" />
                  <span>预览</span>
                </button>
              </span>

              <span class="action-boundary">
                <button type="button" class="edit" title="编辑" aria-label="编辑文章" @click="emit('edit', post)">
                  <Icon icon="fa-solid:pen" aria-hidden="true" />
                  <span>编辑</span>
                </button>
              </span>

              <span class="action-boundary">
                <button
                  type="button"
                  class="danger"
                  title="删除"
                  aria-label="删除文章"
                  @click="emit('delete', post)"
                >
                  <Icon icon="fa-regular:trash-alt" aria-hidden="true" />
                  <span>删除</span>
                </button>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="post-info-section">
        <div class="post-info">
          <div class="title-hover-boundary">
            <RouterLink class="article-title" :to="`/posts/${post.id}`">
              {{ post.title }}
            </RouterLink>
          </div>

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
      </div>
    </div>
  </article>
</template>

<style scoped>
.studio-post-card {
  position: relative;
  overflow: hidden;
  min-height: 220px;
  display: flex;
  border-radius: 8px;
  contain: paint;
}

.studio-post-card-surface {
  overflow: hidden;
  width: 100%;
  min-width: 0;
  min-height: 220px;
  display: flex;
  align-items: stretch;
  flex: 1;
  border-radius: 8px;
  background: var(--studio-card-bg);
  box-shadow: none;
  transition:
    background 0.28s ease,
    transform 0.24s ease;
  isolation: isolate;
}

.studio-post-card:hover .studio-post-card-surface {
  transform: translateY(-3px);
}

.post-cover-section {
  position: relative;
  width: 44%;
  min-height: 220px;
  flex: 0 0 44%;
  align-self: stretch;
  overflow: hidden;
  background: var(--studio-cover-bg);
}

.post-cover-section.right {
  order: 2;
}

.post-cover {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 220px;
  overflow: hidden;
}

.post-cover-link {
  position: absolute;
  inset: 0;
  z-index: 1;
  display: block;
  overflow: hidden;
}

.post-cover-image {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 1;
  display: block;
  max-width: none;
  max-height: none;
  transform: translate(-50%, -50%) scale(1);
  transform-origin: center;
  transition: transform 0.3s ease;
}

.studio-post-card:hover .post-cover-image {
  transform: translate(-50%, -50%) scale(1.035);
}

.post-cover-image.is-fill-width {
  width: 100%;
  height: auto;
}

.post-cover-image.is-fill-height {
  width: auto;
  height: 100%;
}

.post-actions-zone {
  position: absolute;
  left: 16px;
  right: 16px;
  bottom: 16px;
  z-index: 2;
  display: flex;
  justify-content: flex-start;
  overflow: hidden;
  pointer-events: none;
}

.post-actions-zone.right {
  justify-content: flex-end;
}

.post-actions {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  overflow: hidden;
  border-radius: 999px;
  pointer-events: auto;
}

.action-boundary {
  width: 42px;
  height: 42px;
  overflow: hidden;
  flex: 0 0 auto;
  border-radius: 999px;
  display: inline-flex;
}

.post-actions button {
  width: 42px;
  height: 42px;
  padding: 0;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  background: rgba(15, 23, 42, 0.22);
  box-shadow: none;
  cursor: pointer;
  font: inherit;
  font-size: 16px;
  line-height: 1;
  transition:
    color 0.2s ease,
    background 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;
}

.action-boundary:hover .preview {
  color: #34d399;
  background: rgba(15, 23, 42, 0.5);
  border-color: #22c55e;
}

.action-boundary:hover .edit {
  color: #60a5fa;
  background: rgba(15, 23, 42, 0.5);
  border-color: #3b82f6;
}

.action-boundary:hover .danger {
  color: #f87171;
  background: rgba(15, 23, 42, 0.5);
  border-color: #ef4444;
}

.action-boundary:hover :deep(svg) {
  transform: scale(1.18);
}

.post-actions button :deep(svg) {
  width: 1em;
  height: 1em;
  display: block;
  flex: 0 0 auto;
  transition: transform 0.2s ease;
}

.post-actions button span {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
}

.post-info-section {
  min-width: 0;
  flex: 1;
  overflow: hidden;
  display: flex;
}

.post-info {
  width: 100%;
  min-width: 0;
  padding: 24px 32px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.title-hover-boundary {
  overflow: hidden;
  border-radius: 8px;
}

.article-title {
  min-width: 0;
  width: 100%;
  padding: 3px 0;
  color: var(--studio-text);
  text-decoration: none;
  font-size: 23px;
  font-weight: 800;
  line-height: 1.34;
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  transition: color 0.2s ease;
}

.title-hover-boundary:hover .article-title {
  color: var(--studio-title-hover);
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
  border-left: 3px solid var(--studio-quote-border);
  color: var(--studio-body);
  font-size: 15px;
  line-height: 1.66;
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
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
  color: var(--studio-tag-color);
  background: var(--studio-tag-bg);
  font-size: 12px;
  font-weight: 500;
  line-height: 22px;
}

@media (max-width: 720px) {
  .studio-post-card-surface {
    display: block;
  }

  .post-cover-section,
  .post-cover-section.right {
    width: 100%;
    height: 180px;
    min-height: 180px;
    flex-basis: auto;
    order: initial;
  }

  .post-cover {
    min-height: 180px;
  }

  .post-actions-zone,
  .post-actions-zone.right {
    left: 12px;
    right: 12px;
    bottom: 12px;
    justify-content: flex-start;
  }

  .post-actions {
    gap: 6px;
  }

  .action-boundary,
  .post-actions button {
    width: 36px;
    height: 36px;
  }

  .post-actions button {
    font-size: 14px;
  }

  .post-info {
    padding: 22px 20px;
  }
}
</style>
