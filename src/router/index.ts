import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import MainRoutes from './MainRoutes'
const routes: RouteRecordRaw[] = [
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/layouts/ErrorLayout.vue'),
    children: [
      {
        path: '',
        name: 'NotFound',
        component: () => import('@/views/NotFoundView.vue')
      }
    ]
  },
  MainRoutes,
];

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})
