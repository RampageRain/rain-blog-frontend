<script setup lang="ts">
import { Icon } from '@iconify/vue'

import { useBlogTheme } from '@/composables/useBlogTheme'

const emit = defineEmits<{
  toggle: []
}>()

const { isLightTheme } = useBlogTheme()
const toggleLabel = '展开快捷操作'
</script>

<template>
  <button
    type="button"
    class="blog-side-toggle"
    :class="{ 'is-night-theme': !isLightTheme }"
    :aria-label="toggleLabel"
    :title="toggleLabel"
    @click="emit('toggle')"
  >
    <Icon icon="fa-solid:chevron-left" aria-hidden="true" />
  </button>
</template>

<style scoped>
.blog-side-toggle {
  display: none;
}

@media (max-width: 768px) {
  .blog-side-toggle {
    position: fixed;
    right: 0;
    top: 50%;
    z-index: 1201;

    width: 38px;
    height: 30px;
    padding: 0 6px 0 10px;
    border: 1px solid rgba(255, 255, 255, 0.72);
    border-right: 0;
    border-radius: 999px 0 0 999px;

    display: inline-flex;
    align-items: center;
    justify-content: flex-start;

    color: #1d4ed8;
    background: rgba(255, 255, 255, 0.88);
    box-shadow:
      0 10px 24px rgba(15, 23, 42, 0.18),
      inset 0 1px 0 rgba(255, 255, 255, 0.78);
    -webkit-backdrop-filter: blur(14px);
    backdrop-filter: blur(14px);
    cursor: pointer;

    transform: translateY(-50%) rotate(-1deg);
    transform-origin: right center;
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease,
      filter 0.2s ease;
  }

  .blog-side-toggle::before {
    content: '';
    position: absolute;
    right: 6px;
    top: 6px;
    width: 1px;
    height: 18px;
    border-radius: 999px;
    background: rgba(29, 78, 216, 0.18);
    box-shadow: 4px 0 0 rgba(29, 78, 216, 0.12);
  }

  .blog-side-toggle:hover,
  .blog-side-toggle:focus-visible {
    transform: translateY(-50%) translateX(-2px) rotate(-1deg);
    filter: brightness(1.04);
    box-shadow:
      0 14px 28px rgba(15, 23, 42, 0.22),
      inset 0 1px 0 rgba(255, 255, 255, 0.84);
  }

  .blog-side-toggle svg {
    position: relative;
    z-index: 1;
    width: 11px;
    height: 11px;
  }

  .blog-side-toggle.is-night-theme {
    color: #dbeafe;
    border-color: rgba(148, 163, 184, 0.22);
    background: rgba(15, 23, 42, 0.84);
    box-shadow:
      0 12px 26px rgba(0, 0, 0, 0.34),
      inset 0 1px 0 rgba(255, 255, 255, 0.08);
  }

  .blog-side-toggle.is-night-theme::before {
    background: rgba(147, 197, 253, 0.24);
    box-shadow: 4px 0 0 rgba(147, 197, 253, 0.14);
  }
}
</style>
