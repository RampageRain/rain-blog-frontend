<script setup lang="ts">
import { Icon } from '@iconify/vue'

import BackTop from '@/components/blog/BackTop.vue'
import { useBlogTheme } from '@/composables/useBlogTheme'

withDefaults(
  defineProps<{
    showToc?: boolean
    tocActive?: boolean
    showTop?: boolean
    topAlwaysVisible?: boolean
  }>(),
  {
    showToc: false,
    tocActive: false,
    showTop: true,
    topAlwaysVisible: false,
  },
)

const emit = defineEmits<{
  toggleToc: []
}>()

const { isLightTheme, toggleTheme } = useBlogTheme()
</script>

<template>
  <div
    class="blog-desktop-actions"
    :class="{
      'is-night-theme': !isLightTheme,
      'has-toc': showToc,
      'no-top': !showTop,
    }"
  >
    <button
      type="button"
      class="blog-desktop-theme-button"
      :aria-label="isLightTheme ? '切换夜间模式' : '切换日间模式'"
      :title="isLightTheme ? '夜间模式' : '日间模式'"
      @click="toggleTheme"
    >
      <Icon :icon="isLightTheme ? 'fa-solid:moon' : 'fa-solid:sun'" aria-hidden="true" />
    </button>

    <button
      v-if="showToc"
      class="blog-desktop-toc-button"
      type="button"
      :class="{ 'is-active': tocActive }"
      :aria-label="tocActive ? '隐藏目录' : '显示目录'"
      :title="tocActive ? '隐藏目录' : '显示目录'"
      @click="emit('toggleToc')"
    >
      <Icon icon="fa-solid:list-ul" aria-hidden="true" />
    </button>

    <BackTop v-if="showTop" :always-visible="topAlwaysVisible" />
  </div>
</template>

<style scoped>
.blog-desktop-actions {
  display: contents;
}

.blog-desktop-theme-button,
.blog-desktop-toc-button {
  position: fixed;
  right: 15px;
  z-index: 998;

  width: 48px;
  height: 48px;
  padding: 0;
  min-width: 48px;
  min-height: 48px;
  max-width: 48px;
  max-height: 48px;
  flex: 0 0 48px;
  line-height: 1;
  border-radius: 50%;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    filter 0.2s ease;
}

.blog-desktop-theme-button {
  bottom: 76px;
  border: 1px solid rgba(255, 255, 255, 0.72);
  color: #1d4ed8;
  background: rgba(255, 255, 255, 0.86);
  box-shadow:
    0 10px 24px rgba(15, 23, 42, 0.18),
    inset 0 1px 0 rgba(255, 255, 255, 0.72);
  -webkit-backdrop-filter: blur(14px);
  backdrop-filter: blur(14px);
}

.blog-desktop-actions.has-toc .blog-desktop-theme-button {
  bottom: 137px;
}

.blog-desktop-actions.no-top:not(.has-toc) .blog-desktop-theme-button {
  bottom: 15px;
}

.blog-desktop-toc-button {
  bottom: 76px;
  border: none;
  color: #ffffff;
  background: linear-gradient(to right, #0000cd 0%, #0f9d58 100%);
  box-shadow: 0 12px 26px rgba(1, 1, 254, 0.24);
}

.blog-desktop-theme-button:hover,
.blog-desktop-theme-button:focus-visible,
.blog-desktop-toc-button:hover,
.blog-desktop-toc-button:focus-visible {
  transform: translateY(-3px);
  filter: brightness(1.04);
}

.blog-desktop-theme-button:hover,
.blog-desktop-theme-button:focus-visible {
  box-shadow:
    0 14px 28px rgba(15, 23, 42, 0.22),
    inset 0 1px 0 rgba(255, 255, 255, 0.82);
}

.blog-desktop-toc-button:hover,
.blog-desktop-toc-button:focus-visible {
  box-shadow: 0 16px 32px rgba(1, 1, 254, 0.3);
}

.blog-desktop-theme-button svg {
  width: 22px;
  height: 22px;
}

.blog-desktop-toc-button svg {
  width: 18px;
  height: 18px;
}

.blog-desktop-actions.is-night-theme .blog-desktop-theme-button {
  color: #fbbf24;
  border-color: rgba(255, 255, 255, 0.72);
  background: rgba(15, 23, 42, 0.82);
  box-shadow:
    0 12px 26px rgba(0, 0, 0, 0.34),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

@media (max-width: 768px) {
  .blog-desktop-actions {
    display: none;
  }
}
</style>
