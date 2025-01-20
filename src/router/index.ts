import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Home.vue'
import ShareView from '../views/Share.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/share',
      name: 'share',
      component: ShareView
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/About.vue')
    }
  ]
})

export default router
