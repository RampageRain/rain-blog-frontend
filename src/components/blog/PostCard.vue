<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

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
    index: 0
  }
)

const imageLoading = computed(() => (props.index < 2 ? 'eager' : 'lazy'))
const imageFetchPriority = computed(() => (props.index === 0 ? 'high' : 'auto'))
const tags = computed(() => props.post.tags ?? [])
const hasAction = computed(() => Boolean(props.post.category) || tags.value.length > 0)
</script>

<template>
  <article class="post-card">
    <RouterLink class="post-card-link" :to="`/posts/${post.id}`">
      <div class="post-cover">
        <img
          class="post-cover-image"
          :src="post.cover"
          :alt="post.title"
          :loading="imageLoading"
          :fetchpriority="imageFetchPriority"
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
          <span v-if="post.date">{{ post.date }}</span>
          <span v-if="typeof post.views === 'number'">{{ post.views }} 阅读</span>
        </div>

        <div class="post-card-action" :class="{ 'is-empty': !hasAction }">
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
    </RouterLink>
  </article>
</template>

<style scoped>
.post-card {
  overflow: hidden;
  min-height: var(--post-card-min-height);
  display: flex;
  flex-direction: column;

  background: var(--theme-card-bg);
  border-radius: 8px;
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

.post-card-link {
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

  border-radius: 8px 8px 0 0;
}

.post-cover-image {
  position: relative;
  z-index: 1;

  width: 100%;
  height: auto;
  display: block;

  object-fit: initial;
  object-position: center;
  transform: scale(1);
  transform-origin: center;
  transition: transform 0.3s ease;
}

.post-card:hover .post-cover-image {
  transform: scale(1.035);
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
  padding: 15px 15px 14px 18px;

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

  min-height: 0;
  margin-top: 6px;
  padding: 4px 0 0;

  display: flex;
  align-items: center;

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

.grey-chip {
  background-image: var(--theme-muted-chip-bg) !important;
}

@media (max-width: 640px) {
  .post-content {
    min-height: 0;
  }
}
</style>
