import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/blog/HomeView.vue'),
    },
    {
      path: '/studio/login',
      name: 'studioLogin',
      component: () => import('@/views/studio/LoginView.vue'),
    },
    {
      path: '/posts',
      name: 'posts',
      component: () => import('@/views/blog/PostListView.vue'),
    },
    {
      path: '/posts/:id',
      name: 'postDetail',
      component: () => import('@/views/blog/PostDetailView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/blog/AboutView.vue'),
    },
    {
      path: '/studio/dashboard',
      name: 'studioDashboard',
      component: () => import('@/views/studio/DashboardView.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/studio/write',
      name: 'studioWrite',
      component: () => import('@/views/studio/WriteView.vue'),
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
