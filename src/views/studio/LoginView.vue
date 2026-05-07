<script setup lang="ts">
import {computed, ref, watch} from "vue";
import {login} from "@/api/auth";
import {useRouter} from "vue-router";

const username = ref('')
const password = ref('')
const errorMessage = ref('')
const loading = ref(false)
const router = useRouter()

const canLogin = computed(() => {
  return username.value.trim() !== '' && password.value.trim() !== ''
})

watch([username, password], () => {
  errorMessage.value = ''
})

async function handleLogin() {
  if (username.value.trim() === '') {
    errorMessage.value = '请输入用户名'
    return
  }
  if (password.value.trim() === '') {
    errorMessage.value = '请输入密码'
    return
  }

  loading.value = true

  try {
    const res = await login({username: username.value, password: password.value})
    console.log('后端响应：', res.data)
    if (res.data.code !== 200) {
      errorMessage.value = res.data.message || '用户名或密码错误'
      return
    }
    const token = res.data.data.token
    localStorage.setItem('rain_blog_token', token)
    localStorage.setItem(
      'rain_blog_admin',
      JSON.stringify({
        username: res.data.data.username,
        nickname: res.data.data.nickname,
        avatar: res.data.data.avatar
      })
    )
    await router.push('/studio/dashboard')
  } catch (error) {
    console.log('登录失败', error)
    errorMessage.value = '用户名或密码错误'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="login-page">
    <div class="overlay"></div>
    <section class="login-card">
      <div class="login-header">
        <h1>Rain Blog</h1>
        <p>技术博客后台管理</p>
      </div>
      <form class="login-form" @submit.prevent="handleLogin">
        <label class="form-item">
          <span>用户名</span>
          <input v-model="username" type="text" placeholder="请输入用户名"/>
        </label>
        <label class="form-item">
          <span>密码</span>
          <input v-model="password" type="password" placeholder="请输入密码"/>
        </label>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <button class="login-button" type="submit" :disabled="!canLogin || loading">
          {{ loading ? '登录中……' : '登录' }}
        </button>
      </form>
    </section>
  </main>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  min-height: 100dvh;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;

  background-image: url("@/assets/images/login-bg.jpg");
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;

  overflow: hidden;
}

.overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
}

.login-card {
  position: relative;
  z-index: 1;
  width: 400px;
  padding: 36px;
  border-radius: 24px;
  background: rgba(15, 23, 42, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.28);
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.28);
  backdrop-filter: blur(16px);
}

.login-header {
  text-align: center;
  color: #ffffff;
  margin-bottom: 32px;
}

.login-header h1 {
  margin: 0;
  font-size: 32px;
}

.login-header p {
  margin: 10px 0 0;
  color: rgba(255, 255, 255, 0.76);
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-item span {
  color: rgba(255, 255, 255, 0.88);
  font-size: 14px;
}

.form-item input {
  height: 46px;
  padding: 0 14px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 14px;
  outline: none;
  color: #ffffff;
  background: rgba(15, 23, 42, 0.32);
}

.form-item input::placeholder {
  color: rgba(255, 255, 255, 0.55);
}

.login-button {
  width: 180px;
  height: 44px;
  align-self: center;

  border: 1px solid rgba(255, 255, 255, 0.28);
  border-radius: 14px;

  cursor: pointer;
  color: rgba(255, 255, 255, 0.92);
  font-weight: 600;
  font-size: 15px;

  background: rgba(15, 23, 42, 0.8);
  box-shadow: 0 10px 28px rgba(15, 23, 42, 0.18);

  transition: background 0.2s,
  border-color 0.2s,
  transform 0.2s,
  box-shadow 0.2s;
}

.login-button:disabled {
  cursor: not-allowed;
  opacity: 0.45;
  transform: none;
}

.login-button:not(:disabled):hover {
  background: rgba(15, 23, 42, 0.46);
  border-color: rgba(125, 211, 252, 0.72);
  box-shadow: 0 12px 32px rgba(125, 211, 252, 0.18);
  transform: translateY(-2px);
}

.login-button:active {
  transform: translateY(0);
}

.error-message {
  margin: 0;
  color: #fecaca;
  font-size: 14px;
  text-align: center;
}

@media (max-width: 800px) {
  .login-page {
    background-image: url("@/assets/images/login-bg-mobile.jpg");
    background-size: cover;
    background-position: center center;
    padding: 20px;
  }

  .login-card {
    width: min(100%, 360px);
    padding: 28px 22px;
    transform: translateY(200px);
  }
}
</style>
