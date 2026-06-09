<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'

type ImageFitMode = 'fill-width' | 'fill-height'

interface PostCardItem {
  id: number | string
  title: string
  summary: string
  category?: string
  tags?: string[]
  date?: string
  views?: number
  cover: string
}

const props = withDefaults(
  defineProps<{
    post: PostCardItem
    index?: number
  }>(),
  {
    index: 0,
  },
)

const imageLoading = computed(() => (props.index < 2 ? 'eager' : 'lazy'))
const imageFetchPriority = computed(() => (props.index === 0 ? 'high' : 'auto'))
const tags = computed(() => props.post.tags ?? [])
const hasAction = computed(() => Boolean(props.post.category) || tags.value.length > 0)
const coverRef = ref<HTMLElement | null>(null)
const coverFitMode = ref<ImageFitMode>('fill-width')

function updateCoverFit(event: Event) {
  const image = event.target

  if (!(image instanceof HTMLImageElement) || !image.naturalWidth || !image.naturalHeight) {
    return
  }

  const cover = coverRef.value
  const coverRatio =
    cover && cover.clientWidth && cover.clientHeight
      ? cover.clientWidth / cover.clientHeight
      : 16 / 9
  const imageRatio = image.naturalWidth / image.naturalHeight

  coverFitMode.value = imageRatio >= coverRatio ? 'fill-height' : 'fill-width'
}
</script>

<template>
  <article class="post-card">
    <div class="post-card-surface">
      <RouterLink class="post-card-link" :to="`/posts/${post.id}`">
      <div ref="coverRef" class="post-cover">
        <img
          class="post-cover-image"
          :class="`is-${coverFitMode}`"
          :src="post.cover"
          :alt="post.title"
          :loading="imageLoading"
          :fetchpriority="imageFetchPriority"
          decoding="async"
          @load="updateCoverFit"
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
          <span v-if="post.date">{{ post.date }}</span>
          <span v-if="typeof post.views === 'number'">{{ post.views }} 阅读</span>
        </div>

        <div class="post-card-action" :class="{ 'is-empty': !hasAction }">
          <div class="post-card-action-body">
            <div class="article-tags">
              <span
                v-if="post.category"
                class="chip bg-color"
                :class="{ 'grey-chip': post.category === '未分类' }"
              >
                {{ post.category }}
              </span>

              <span v-for="tag in tags" :key="tag" class="chip bg-color">
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
      </div>
      </RouterLink>
    </div>
  </article>
</template>

<style scoped>
.post-card {
  position: relative;
  overflow: hidden;
  height: 100%;
  min-height: var(--post-card-min-height);
  display: flex;
  contain: paint;
}

.post-card-surface {
  overflow: hidden;
  width: 100%;
  height: 100%;
  min-height: var(--post-card-min-height);
  display: flex;
  flex: 1;
  flex-direction: column;

  background: var(--theme-card-bg);
  border-radius: 8px;
  box-shadow: none;
  backdrop-filter: blur(10px);
  transition:
    background 0.28s ease,
    transform 0.24s ease;
  isolation: isolate;
}

.post-card:hover .post-card-surface {
  transform: translateY(-3px);
}

.post-card-link {
  height: 100%;
  min-height: var(--post-card-min-height);
  display: flex;
  flex: 1;
  flex-direction: column;

  color: inherit;
  text-decoration: none;
}

.post-cover {
  position: relative;
  overflow: hidden;
  display: block;
  flex: 0 0 var(--post-card-cover-height, 190px);
  height: var(--post-card-cover-height, 190px);

  border-radius: 8px 8px 0 0;
}

.post-cover-image {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 1;

  display: block;
  object-fit: initial;
  object-position: center;
  transform: translate(-50%, -50%) scale(1);
  transform-origin: center;
  transition: transform 0.3s ease;
}

.post-card:hover .post-cover-image {
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

.post-cover-mask {
  position: absolute;
  inset: auto 0 0;
  z-index: 2;

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
  padding: 15px 15px 0 18px;

  display: flex;
  flex: 1;
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
  gap: 12px;

  color: var(--theme-subtle);
  font-size: 13px;
}

.post-card-action {
  position: relative;

  margin-top: auto;
  padding-top: 1px;

  display: flex;
  flex: 0 0 auto;
  min-height: 52px;

  border-radius: 0 0 8px 8px !important;
  box-sizing: border-box;
}

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

.post-card-action-body {
  width: 100%;
  min-height: 37px;

  display: flex;
  align-items: center;
}

.article-tags {
  width: 100%;
  min-height: 0;
  margin: 0;

  display: flex;
  align-items: center;
  align-content: center;
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

.grey-chip {
  background-image: var(--theme-muted-chip-bg) !important;
}

@media (max-width: 640px) {
  .post-cover {
    flex-basis: var(--post-card-cover-height-mobile, 180px);
    height: var(--post-card-cover-height-mobile, 180px);
  }

  .post-content {
    min-height: 0;
  }
}
</style>
