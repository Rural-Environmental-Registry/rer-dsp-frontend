import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import GeoservicesView from '@/views/GeoservicesView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/geoservices',
      name: 'geoservices',
      component: GeoservicesView,
    },
  ],
})

export default router
