import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue')
  },
  {
    path: '/day/:dayId',
    name: 'day',
    component: () => import('@/views/TodayView.vue')
  },
  {
    path: '/time/:dayId',
    name: 'time',
    component: () => import('@/views/TimeView.vue')
  },
  {
    path: '/todo',
    name: 'todo',
    component: () => import('@/views/TodoView.vue')
  },
  {
    path: '/d-day',
    name: 'dDay',
    component: () => import('@/views/DdayView.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue')
  },
  {
    path: '/my-account',
    name: 'myAccount',
    component: () => import('@/views/MyView.vue')
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
