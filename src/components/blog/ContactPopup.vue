<script setup lang="ts">
import {ref, watch} from 'vue'

import { useBlogTheme } from '@/composables/useBlogTheme'

interface Props {
  visible: boolean
  title: string
  account: string
  qrCode: string
}

const props = defineProps<Props>()
const { isLightTheme } = useBlogTheme()

const emit = defineEmits<{
  close: []
}>()

const previewVisible = ref(false)

function handleMaskClick(event: MouseEvent) {
  if (event.target === event.currentTarget) {
    emit('close')
  }
}

function openPreview() {
  previewVisible.value = true
}

function closePreview() {
  previewVisible.value = false
}

watch(
  () => props.visible,
  (visible) => {
    if (!visible) {
      previewVisible.value = false
    }
  }
)
</script>

<template>
  <Teleport to="body">
    <Transition name="contact-popup">
      <div
        v-if="visible"
        class="contact-popup-mask"
        :class="{ 'is-night-theme': !isLightTheme }"
        @click="handleMaskClick"
      >
        <div class="contact-popup-card" :class="{ 'is-night-theme': !isLightTheme }">
          <button
            type="button"
            class="contact-popup-close"
            @click="emit('close')"
          >
            ×
          </button>

          <div class="contact-popup-header">
            <h3>{{ title }}</h3>
            <p>扫码或复制账号添加联系</p>
          </div>

          <div class="contact-popup-qrcode-wrapper">
            <button
              type="button"
              class="contact-popup-qrcode-button"
              @click="openPreview"
            >
              <img
                class="contact-popup-qrcode"
                :src="qrCode"
                :alt="title"
              />
            </button>
          </div>

          <div class="contact-popup-account">
            {{ account }}
          </div>
        </div>
        <Transition name="qr-preview">
          <div
            v-if="previewVisible"
            class="qr-preview-mask"
            :class="{ 'is-night-theme': !isLightTheme }"
            @click="closePreview"
          >
            <button
              type="button"
              class="qr-preview-close"
              @click.stop="closePreview"
            >
              ×
            </button>

            <img
              class="qr-preview-image"
              :src="qrCode"
              :alt="title"
              @click.stop
            />
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.contact-popup-mask {
  position: fixed;
  inset: 0;
  z-index: 9999;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;

  background: rgba(15, 23, 42, 0.52);
  backdrop-filter: blur(12px);
}

.contact-popup-mask.is-night-theme {
  background: rgba(2, 6, 23, 0.76);
}

.contact-popup-card {
  position: relative;

  width: min(380px, 100%);
  padding: 34px 28px 28px;

  display: flex;
  flex-direction: column;
  align-items: center;

  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.68);
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.22),
  inset 0 1px 0 rgba(255, 255, 255, 0.82);

  backdrop-filter: blur(20px);
}

.contact-popup-card.is-night-theme {
  background: rgba(15, 23, 42, 0.92);
  border-color: rgba(148, 163, 184, 0.22);
  box-shadow: 0 24px 60px rgba(2, 6, 23, 0.56),
    inset 0 1px 0 rgba(255, 255, 255, 0.06);
}

.contact-popup-close {
  position: absolute;
  top: 14px;
  right: 14px;

  width: 34px;
  height: 34px;
  border: none;
  border-radius: 50%;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  color: #475569;
  font-size: 22px;
  line-height: 1;

  background: rgba(226, 232, 240, 0.72);

  transition: transform 0.18s ease,
  background 0.18s ease;
}

.contact-popup-card.is-night-theme .contact-popup-close {
  color: #cbd5e1;
  background: rgba(51, 65, 85, 0.84);
}

.contact-popup-close:hover {
  transform: rotate(90deg);
  background: rgba(203, 213, 225, 0.92);
}

.contact-popup-card.is-night-theme .contact-popup-close:hover {
  background: rgba(71, 85, 105, 0.96);
}

.contact-popup-header {
  text-align: center;
}

.contact-popup-header h3 {
  margin: 0;

  color: #0f172a;
  font-size: 28px;
  font-weight: 800;
}

.contact-popup-card.is-night-theme .contact-popup-header h3 {
  color: #f8fafc;
}

.contact-popup-header p {
  margin: 10px 0 0;

  color: #64748b;
  font-size: 14px;
}

.contact-popup-card.is-night-theme .contact-popup-header p {
  color: #94a3b8;
}

.contact-popup-qrcode-wrapper {
  margin-top: 26px;
  padding: 12px;

  background: rgba(248, 250, 252, 0.92);
  box-shadow: inset 0 0 0 1px rgba(226, 232, 240, 0.82),
  0 10px 24px rgba(15, 23, 42, 0.08);
}

.contact-popup-qrcode {
  width: 240px;
  height: 240px;
  border-radius: 4px;

  display: block;
  object-fit: contain;
  background: #ffffff;
}

.contact-popup-account {
  margin-top: 22px;
  padding: 10px 18px;
  border-radius: 999px;

  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.2px;

  background-image: linear-gradient(to right, #0000CD 0%, #0f9d58 100%);
  box-shadow: 0 10px 24px rgba(1, 1, 254, 0.18);
}

.contact-popup-enter-active,
.contact-popup-leave-active {
  transition: opacity 0.22s ease,
  transform 0.22s ease;
}

.contact-popup-enter-from,
.contact-popup-leave-to {
  opacity: 0;
}

.contact-popup-enter-from .contact-popup-card,
.contact-popup-leave-to .contact-popup-card {
  transform: translateY(10px) scale(0.96);
}

.contact-popup-qrcode-button {
  border: none;
  padding: 0;
  margin: 0;

  display: block;

  cursor: zoom-in;
  background: transparent;
}

.contact-popup-qrcode-button:hover .contact-popup-qrcode {
  transform: scale(1.02);
}

.contact-popup-qrcode {
  transition: transform 0.2s ease;
}

.qr-preview-mask {
  position: fixed;
  inset: 0;
  z-index: 10000;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 28px;

  background: rgba(15, 23, 42, 0.72);
  backdrop-filter: blur(16px);
}

.qr-preview-mask.is-night-theme {
  background: rgba(2, 6, 23, 0.84);
}

.qr-preview-image {
  width: min(78vw, 520px);
  height: min(78vw, 520px);

  display: block;
  object-fit: contain;

  background: #ffffff;
  box-shadow: 0 28px 80px rgba(15, 23, 42, 0.38);
}

.qr-preview-close {
  position: fixed;
  top: 28px;
  right: 32px;

  width: 42px;
  height: 42px;
  border: none;
  border-radius: 6px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  color: #ffffff;
  font-size: 28px;
  line-height: 1;

  background: rgba(15, 23, 42, 0.62);
  border: 1px solid rgba(255, 255, 255, 0.18);

  transition: background 0.18s ease,
  transform 0.18s ease;
}

.qr-preview-close:hover {
  background: rgba(15, 23, 42, 0.82);
  transform: rotate(90deg);
}

.qr-preview-enter-active,
.qr-preview-leave-active {
  transition: opacity 0.2s ease;
}

.qr-preview-enter-from,
.qr-preview-leave-to {
  opacity: 0;
}
</style>
