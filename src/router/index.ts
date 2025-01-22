import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Home.vue'
import DigestView from '../views/Digest.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/digest',
      name: 'digest',
      component: DigestView
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/About.vue')
    }
  ]
})

export default router
