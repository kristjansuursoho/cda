import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import('../pages/index.page.vue'),
    },
    {
      path: '/document/:id',
      name: 'document',
      component: () => import('../pages/document.page.vue'),
    },
  ],
})

export default router
