import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/blog/HomeView.vue'
import LoginView from '@/views/studio/LoginView.vue'
import DashboardView from '@/views/studio/DashboardView.vue'
import WriteView from '@/views/studio/WriteView.vue'
import PostListView from '@/views/blog/PostListView.vue'
import PostDetailView from '@/views/blog/PostDetailView.vue'
import AboutView from '@/views/blog/AboutView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/studio/login',
      name: 'studioLogin',
      component: LoginView,
    },
    {
      path: '/posts',
      name: 'posts',
      component: PostListView,
    },
    {
      path: '/posts/:id',
      name: 'postDetail',
      component: PostDetailView,
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
    },
    {
      path: '/studio/dashboard',
      name: 'studioDashboard',
      component: DashboardView,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/studio/write',
      name: 'studioWrite',
      component: WriteView,
      meta: {
        requiresAuth: true,
      },
    },
  ],
  scrollBehavior(to) {
    if (to.path === '/' && to.hash === '#home-posts') {
      return {
        el: '#home-posts',
        top: 0,
        behavior: 'auto',
      }
    }

    return { top: 0 }
  },
})

router.beforeEach((to) => {
  const token = localStorage.getItem('rain_blog_token')
  const allowStudioPreview = import.meta.env.DEV

  if (to.meta.requiresAuth && !token && !allowStudioPreview) {
    return './studio/login'
  }
  return true
})
export default router
