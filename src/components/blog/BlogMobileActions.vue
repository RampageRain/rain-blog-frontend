<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { Icon } from '@iconify/vue'

import BlogSideToggle from '@/components/blog/BlogSideToggle.vue'
import { useBlogTheme } from '@/composables/useBlogTheme'

withDefaults(
  defineProps<{
    showToc?: boolean
    tocActive?: boolean
    showTop?: boolean
    showJumpToPosts?: boolean
  }>(),
  {
    showToc: false,
    tocActive: false,
    showTop: true,
    showJumpToPosts: false
  }
)

const emit = defineEmits<{
  toggleToc: []
  jumpToPosts: []
}>()

const { isLightTheme, toggleTheme } = useBlogTheme()
const isExpanded = ref(false)
const actionRoot = ref<HTMLElement | null>(null)

function closeActions() {
  isExpanded.value = false
}

function toggleActions() {
  isExpanded.value = !isExpanded.value
}

function handleDocumentPointerDown(event: PointerEvent) {
  if (!isExpanded.value) {
    return
  }

  const target = event.target

  if (!(target instanceof Node)) {
    return
  }

  if (actionRoot.value?.contains(target)) {
    return
  }

  closeActions()
}

function handleThemeClick() {
  toggleTheme()
  closeActions()
}

function handleTocClick() {
  emit('toggleToc')
  closeActions()
}

function handleJumpToPostsClick() {
  emit('jumpToPosts')
  closeActions()
}

function handleTopClick() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
  closeActions()
}

onMounted(() => {
  document.addEventListener('pointerdown', handleDocumentPointerDown)
  window.addEventListener('scroll', closeActions, { passive: true })
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', handleDocumentPointerDown)
  window.removeEventListener('scroll', closeActions)
})
</script>

<template>
  <div
    ref="actionRoot"
    class="blog-mobile-actions"
    :class="{
      'is-night-theme': !isLightTheme,
      'is-expanded': isExpanded
    }"
  >
    <BlogSideToggle v-if="!isExpanded" @toggle="toggleActions" />

    <div class="blog-mobile-action-panel">
      <button
        type="button"
        class="blog-mobile-action blog-mobile-action--theme"
        :aria-label="isLightTheme ? '切换夜间模式' : '切换日间模式'"
        :title="isLightTheme ? '夜间模式' : '日间模式'"
        @click="handleThemeClick"
      >
        <Icon :icon="isLightTheme ? 'fa-solid:moon' : 'fa-solid:sun'" aria-hidden="true" />
      </button>

      <button
        v-if="showJumpToPosts"
        type="button"
        class="blog-mobile-action blog-mobile-action--posts"
        aria-label="文章区域"
        title="文章区域"
        @click="handleJumpToPostsClick"
      >
        <Icon icon="fa-solid:layer-group" aria-hidden="true" />
      </button>

      <button
        v-if="showToc"
        type="button"
        class="blog-mobile-action blog-mobile-action--toc"
        :class="{ 'is-active': tocActive }"
        :aria-label="tocActive ? '隐藏目录' : '展开目录'"
        :title="tocActive ? '隐藏目录' : '展开目录'"
        @click="handleTocClick"
      >
        <Icon icon="fa-solid:list-ul" aria-hidden="true" />
      </button>

      <button
        v-if="showTop"
        type="button"
        class="blog-mobile-action blog-mobile-action--top"
        aria-label="返回顶部"
        title="返回顶部"
        @click="handleTopClick"
      >
        <Icon icon="fa-solid:arrow-up" aria-hidden="true" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.blog-mobile-actions {
  display: none;
}

@media (max-width: 768px) {
  .blog-mobile-actions {
    position: fixed;
    right: 0;
    top: 50%;
    z-index: 1200;

    display: block;
    transform: translateY(-50%);
  }

  .blog-mobile-action-panel {
    position: fixed;
    right: 9px;
    top: 50%;
    z-index: 1200;

    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: flex-end;

    opacity: 0;
    pointer-events: none;
    transform: translateX(12px) translateY(-50%) scale(0.96);
    transform-origin: right center;
    transition:
      opacity 0.22s ease,
      transform 0.22s ease;
  }

  .blog-mobile-actions.is-expanded .blog-mobile-action-panel {
    opacity: 1;
    pointer-events: auto;
    transform: translateX(0) translateY(-50%) scale(1);
  }

  .blog-mobile-action {
    width: 36px;
    height: 36px;
    padding: 0;
    border: 1px solid rgba(255, 255, 255, 0.72);
    border-radius: 50%;

    display: inline-flex;
    align-items: center;
    justify-content: center;

    color: #1d4ed8;
    background: rgba(255, 255, 255, 0.86);
    box-shadow:
      0 10px 24px rgba(15, 23, 42, 0.18),
      inset 0 1px 0 rgba(255, 255, 255, 0.72);
    -webkit-backdrop-filter: blur(14px);
    backdrop-filter: blur(14px);
    cursor: pointer;
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease,
      filter 0.2s ease;
  }

  .blog-mobile-action:hover,
  .blog-mobile-action:focus-visible {
    transform: translateY(-2px);
    filter: brightness(1.04);
    box-shadow:
      0 14px 28px rgba(15, 23, 42, 0.22),
      inset 0 1px 0 rgba(255, 255, 255, 0.82);
  }

  .blog-mobile-action svg {
    width: 15px;
    height: 15px;
  }

  .blog-mobile-action--toc.is-active {
    color: #1d4ed8;
    border-color: rgba(29, 78, 216, 0.42);
    background: rgba(219, 234, 254, 0.9);
  }

  .blog-mobile-actions.is-night-theme .blog-mobile-action {
    color: #dbeafe;
    border-color: rgba(148, 163, 184, 0.2);
    background: rgba(15, 23, 42, 0.82);
    box-shadow:
      0 12px 26px rgba(0, 0, 0, 0.34),
      inset 0 1px 0 rgba(255, 255, 255, 0.08);
  }

  .blog-mobile-actions.is-night-theme .blog-mobile-action--theme {
    color: #fbbf24;
  }

  .blog-mobile-actions.is-night-theme .blog-mobile-action--toc.is-active {
    color: #93c5fd;
    border-color: rgba(147, 197, 253, 0.36);
    background: rgba(30, 41, 59, 0.9);
  }
}
</style>
