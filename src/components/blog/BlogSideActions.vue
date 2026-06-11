<script setup lang="ts">
import BlogDesktopActions from '@/components/blog/BlogDesktopActions.vue'
import BlogMobileActions from '@/components/blog/BlogMobileActions.vue'

withDefaults(
  defineProps<{
    showToc?: boolean
    tocActive?: boolean
    showDesktopTop?: boolean
    topAlwaysVisible?: boolean
    showJumpToPosts?: boolean
  }>(),
  {
    showToc: false,
    tocActive: false,
    showDesktopTop: true,
    topAlwaysVisible: false,
    showJumpToPosts: false,
  },
)

const emit = defineEmits<{
  toggleToc: []
  jumpToPosts: []
}>()
</script>

<template>
  <BlogDesktopActions
    :show-toc="showToc"
    :toc-active="tocActive"
    :show-top="showDesktopTop"
    :top-always-visible="topAlwaysVisible"
    @toggle-toc="emit('toggleToc')"
  />

  <BlogMobileActions
    :show-toc="showToc"
    :toc-active="tocActive"
    :show-top="showDesktopTop"
    :show-jump-to-posts="showJumpToPosts"
    @toggle-toc="emit('toggleToc')"
    @jump-to-posts="emit('jumpToPosts')"
  />
</template>
