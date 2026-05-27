<script setup lang="ts">
import { ref } from 'vue'
import { getAdminHello } from '@/api/admin'

const message = ref('')

async function testAdminApi() {
  try {
    const res = await getAdminHello()

    if (res.data.code === 200) {
      message.value = res.data.data
    } else {
      message.value = res.data.message
    }
  } catch {
    message.value = '请求失败'
  }
}
</script>

<template>
  <main>
    <h1>后台首页</h1>

    <button @click="testAdminApi">
      测试后台接口
    </button>

    <p>{{ message }}</p>
  </main>
</template>
