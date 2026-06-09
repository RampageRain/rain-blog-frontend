<script setup lang="ts">
import { ref } from 'vue'
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
const coverFitMode = ref<ImageFitMode>('fill-width')

const statusLabel: Record<PostStatus, string> = {
  published: '已发布',
  draft: '草稿',
}

function updateCoverFit(event: Event) {
  const image = event.target
  if (!(image instanceof HTMLImageElement) || !image.naturalWidth || !image.naturalHeight) {
    return
  }

  const cover = coverRef.value
  const coverRatio =
    cover && cover.clientWidth && cover.clientHeight ? cover.clientWidth / cover.clientHeight : 44 / 26
  const imageRatio = image.naturalWidth / image.naturalHeight

  coverFitMode.value = imageRatio >= coverRatio ? 'fill-height' : 'fill-width'
}
</script>

<template>
  <article class="studio-post-card">
    <div class="studio-post-card-surface">
      <div class="post-cover-section" :class="{ right: props.reversed }">
        <div ref="coverRef" class="post-cover">
          <RouterLink class="post-cover-link" :to="`/posts/${post.id}`" :title="post.title">
            <img
              class="post-cover-image"
              :class="`is-${coverFitMode}`"
              :src="post.cover"
              :alt="post.title"
              @load="updateCoverFit"
            />
          </RouterLink>

          <div class="post-actions-zone">
            <div class="post-actions-boundary">
              <div class="post-actions" aria-label="文章操作">
                <div class="action-boundary">
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
                </div>

                <div class="action-boundary">
                  <button
                    type="button"
                    class="edit"
                    title="编辑"
                    aria-label="编辑文章"
                    @click="emit('edit', post)"
                  >
                    <Icon icon="fa-solid:pen" aria-hidden="true" />
                    <span>编辑</span>
                  </button>
                </div>

                <div class="action-boundary">
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
                </div>
              </div>
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
  overflow: clip;
  display: flex;
  border-radius: 8px;
  contain: paint;
  isolation: isolate;
}

.studio-post-card-surface {
  overflow: hidden;
  overflow: clip;
  width: 100%;
  display: flex;
  align-items: stretch;
  flex: 1;
  border-radius: 8px;
  background: var(--studio-card-bg);
  box-shadow: none;
  isolation: isolate;
}

.post-cover-section {
  position: relative;
  width: 44%;
  height: 220px;
  flex: 0 0 44%;
  overflow: hidden;
  overflow: clip;
  isolation: isolate;
}

.post-cover-section.right {
  order: 2;
}

.post-cover {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  overflow: clip;
  background: var(--studio-cover-bg);
  isolation: isolate;
}

.post-cover-link {
  position: absolute;
  inset: 0;
  z-index: 1;
  overflow: hidden;
  overflow: clip;
  display: block;
}

.post-cover-image {
  position: absolute;
  top: 50%;
  left: 50%;
  display: block;
  min-width: 100%;
  min-height: 100%;
  max-width: none;
  transform: translate(-50%, -50%) scale(1);
  transform-origin: center;
  transition: transform 0.3s ease;
}

.post-cover:hover .post-cover-image {
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
  overflow: clip;
  pointer-events: none;
  isolation: isolate;
}

.post-cover-section.right .post-actions-zone {
  justify-content: flex-end;
}

.post-actions-boundary {
  overflow: hidden;
  overflow: clip;
  border-radius: 999px;
  pointer-events: auto;
  isolation: isolate;
}

.post-actions {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.action-boundary {
  width: 42px;
  height: 42px;
  overflow: hidden;
  overflow: clip;
  flex: 0 0 auto;
  border-radius: 999px;
  isolation: isolate;
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
  box-shadow: none;
  cursor: pointer;
  font: inherit;
  font-size: 16px;
  line-height: 1;
  transition:
    color 0.2s ease,
    background 0.2s ease;
}

.post-actions button :deep(svg) {
  width: 1em;
  height: 1em;
  display: block;
  flex: 0 0 auto;
}

.action-boundary:hover .preview {
  color: #22c55e;
  background: rgba(15, 23, 42, 0.24);
}

.action-boundary:hover .edit {
  color: #60a5fa;
  background: rgba(15, 23, 42, 0.24);
}

.action-boundary:hover .danger {
  color: #ef4444;
  background: rgba(15, 23, 42, 0.24);
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
  overflow: clip;
  display: flex;
  isolation: isolate;
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
  overflow: clip;
  border-radius: 8px;
  isolation: isolate;
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
  transition:
    color 0.2s ease,
    background 0.2s ease,
    padding-left 0.2s ease;
}

.title-hover-boundary:hover .article-title {
  padding-left: 10px;
  color: #1d4ed8;
  background: rgba(59, 130, 246, 0.08);
}

:global(.studio-page.is-night-theme) .title-hover-boundary:hover .article-title {
  color: #93c5fd;
  background: rgba(147, 197, 253, 0.1);
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
  border-left: 3px solid rgba(59, 130, 246, 0.28);
  color: var(--studio-body);
  font-size: 15px;
  line-height: 1.66;
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

:global(.studio-page.is-night-theme) .post-info p {
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

:global(.studio-page.is-night-theme) .tag-row span {
  color: rgba(226, 232, 240, 0.86);
  background: rgba(148, 163, 184, 0.16);
}

@media (max-width: 720px) {
  .studio-post-card-surface {
    display: block;
  }

  .post-cover-section,
  .post-cover-section.right {
    width: 100%;
    height: 180px;
    flex-basis: auto;
    order: initial;
  }

  .post-actions-zone,
  .post-cover-section.right .post-actions-zone {
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
