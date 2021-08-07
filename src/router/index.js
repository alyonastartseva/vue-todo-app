import { createRouter, createWebHistory } from 'vue-router'
import firebase from 'firebase/app'

const routes = [
  {
    path: '/',
    name: 'tasks',
    meta: { auth: true },
    component: () => import('@/views/Tasks')
  },
  {
    path: '/create/:parentId?',
    name: 'create',
    meta: { auth: true },
    component: () => import('@/views/CreateTask')
  },
  {
    path: '/edit/:id/:parentId',
    name: 'edit',
    meta: { auth: true },
    component: () => import('@/views/EditTask')
  },
  {
    path: '/details/:parentId/:id',
    name: 'details',
    meta: { auth: true },
    component: () => import('@/views/DetailsTask')
  },
  {
    path: '/register',
    name: 'register',
    meta: {
      layout: 'authLayout'
    },
    component: () => import('@/views/Register')
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      layout: 'authLayout'
    },
    exact: true,
    component: () => import('@/views/Login')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from ,next) => {
  const currentUser = firebase.auth().currentUser
  const requireAuth = to.matched.some(record => record.meta.auth)

  if (requireAuth && !currentUser) {
    next('/login')
  }
  else {
    next()
  }
})

export default router
