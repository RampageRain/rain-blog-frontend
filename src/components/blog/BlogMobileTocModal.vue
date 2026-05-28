<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { Icon } from '@iconify/vue'

interface TocItem {
  id: string
  text: string
  level: number
}

const props = defineProps<{
  visible: boolean
  items: TocItem[]
  activeId: string
}>()

const emit = defineEmits<{
  select: [id: string]
}>()

const isMobile = ref(false)
let mobileMediaQuery: MediaQueryList | undefined

const isModalVisible = computed(() => {
  return props.visible && isMobile.value
})

function syncMobileViewport() {
  isMobile.value = mobileMediaQuery?.matches ?? false
}

function handleSelect(id: string) {
  emit('select', id)
}

onMounted(() => {
  mobileMediaQuery = window.matchMedia('(max-width: 768px)')
  syncMobileViewport()
  mobileMediaQuery.addEventListener('change', syncMobileViewport)
})

onBeforeUnmount(() => {
  mobileMediaQuery?.removeEventListener('change', syncMobileViewport)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="mobile-toc-modal">
      <div
        v-if="isModalVisible"
        class="mobile-toc-modal-mask"
      >
        <section class="mobile-toc-modal-card" aria-label="文章目录" @click.stop>
          <header class="mobile-toc-modal-title">
            <Icon icon="fa-regular:list-alt" aria-hidden="true" />
            <span>目录</span>
          </header>

          <nav class="mobile-toc-modal-list">
            <a
              v-for="item in items"
              :key="item.id"
              :href="`#${item.id}`"
              :class="[
                'mobile-toc-modal-link',
                `is-level-${item.level}`,
                { 'is-active': activeId === item.id }
              ]"
              @click="handleSelect(item.id)"
            >
              {{ item.text }}
            </a>
          </nav>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.mobile-toc-modal-mask {
  position: fixed;
  inset: 0;
  z-index: 1100;

  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px;

  pointer-events: none;

}

.mobile-toc-modal-card {
  width: min(88vw, 460px);
  max-height: min(68vh, 520px);
  border: 1px solid rgba(255, 255, 255, 0.32);
  border-radius: 12px;

  display: flex;
  flex-direction: column;
  overflow: hidden;
  pointer-events: auto;

  color: #ffffff;
  background: rgba(15, 23, 42, 0.28);
  box-shadow:
    0 18px 48px rgba(15, 23, 42, 0.24),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  -webkit-backdrop-filter: blur(18px) saturate(145%);
  backdrop-filter: blur(18px) saturate(145%);
}

.mobile-toc-modal-title {
  padding: 20px 22px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.18);

  display: flex;
  align-items: center;
  gap: 10px;

  color: rgba(255, 255, 255, 0.96);
  font-size: 18px;
  font-weight: 700;
  line-height: 1.4;
}

.mobile-toc-modal-title svg {
  width: 20px;
  height: 20px;
}

.mobile-toc-modal-list {
  padding: 10px 0;
  overflow-y: auto;
  background: rgba(255, 255, 255, 0.1);
  -webkit-backdrop-filter: blur(16px);
  backdrop-filter: blur(16px);
}

.mobile-toc-modal-link {
  min-height: 40px;
  padding: 9px 22px;

  display: flex;
  align-items: center;

  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  line-height: 1.55;
  font-weight: 500;
  text-decoration: none;

  transition:
    background 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;
}

.mobile-toc-modal-link.is-level-2 {
  padding-left: 34px;
}

.mobile-toc-modal-link.is-level-3 {
  padding-left: 46px;
  font-size: 13px;
}

.mobile-toc-modal-link.is-active {
  color: #ffffff;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.22);
  transform: translateX(2px);
}

@media (hover: hover) {
  .mobile-toc-modal-link:hover {
    color: #ffffff;
    font-weight: 600;
    background: rgba(255, 255, 255, 0.16);
    transform: translateX(2px);
  }
}

.mobile-toc-modal-enter-active,
.mobile-toc-modal-leave-active {
  transition: opacity 0.22s ease;
}

.mobile-toc-modal-enter-from,
.mobile-toc-modal-leave-to {
  opacity: 0;
}

.mobile-toc-modal-enter-active .mobile-toc-modal-card,
.mobile-toc-modal-leave-active .mobile-toc-modal-card {
  transition: transform 0.22s ease, opacity 0.22s ease;
}

.mobile-toc-modal-enter-from .mobile-toc-modal-card,
.mobile-toc-modal-leave-to .mobile-toc-modal-card {
  opacity: 0;
  transform: translateY(14px) scale(0.96);
}
</style>
