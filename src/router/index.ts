import {createRouter, createWebHistory} from 'vue-router'
import HomeView from "@/views/blog/HomeView.vue";
import LoginView from "@/views/studio/LoginView.vue";
import DashboardView from "@/views/studio/DashboardView.vue";
import PostListView from "@/views/blog/PostListView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/studio/login',
      name: 'studioLogin',
      component: LoginView
    },
    {
      path: '/posts',
      name: 'posts',
      component: PostListView
    },
    {
      path: '/studio/dashboard',
      name: 'studioDashboard',
      component: DashboardView,
      meta:{
        requiresAuth: true,
      }
    },
  ],
  scrollBehavior(){
    return { top: 0 }
  }
})

router.beforeEach((to) => {
  const token = localStorage.getItem('rain_blog_token');
  if (to.meta.requiresAuth && !token) {
    return './studio/login';
  }
  return true
})
export default router
