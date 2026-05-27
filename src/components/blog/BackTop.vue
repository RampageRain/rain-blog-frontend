<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { Icon } from '@iconify/vue'

const visible = ref(false)
const showOffset = 320

function updateVisible() {
  visible.value = window.scrollY > showOffset
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

onMounted(() => {
  updateVisible()
  window.addEventListener('scroll', updateVisible, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateVisible)
})
</script>

<template>
  <Transition name="back-top-fade">
    <button
      v-if="visible"
      type="button"
      class="top-scroll"
      aria-label="Back to top"
      @click="scrollToTop"
    >
      <Icon icon="fa-solid:arrow-up" aria-hidden="true" />
    </button>
  </Transition>
</template>

<style scoped>
.top-scroll {
  position: fixed;
  right: 15px;
  bottom: 15px;
  z-index: 998;

  width: 48px;
  height: 48px;
  padding: 0;
  border: none;
  border-radius: 50%;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  color: #ffffff;
  background: linear-gradient(to bottom right, #ff5e3a 0%, #ff2a68 100%);
  box-shadow: 0 12px 26px rgba(255, 42, 104, 0.32);
  cursor: pointer;

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    filter 0.2s ease;
}

.top-scroll:hover {
  transform: translateY(-3px);
  filter: brightness(1.04);
  box-shadow: 0 16px 32px rgba(255, 42, 104, 0.38);
}

.top-scroll svg {
  width: 30px;
  height: 30px;
}

.back-top-fade-enter-active,
.back-top-fade-leave-active {
  transition:
    opacity 0.22s ease,
    transform 0.22s ease;
}

.back-top-fade-enter-from,
.back-top-fade-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.9);
}

@media (max-width: 640px) {
  .top-scroll {
    right: 14px;
    bottom: 18px;
    width: 44px;
    height: 44px;
  }

  .top-scroll svg {
    width: 27px;
    height: 27px;
  }
}
</style>
