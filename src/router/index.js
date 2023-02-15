import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import rootPage from '../views/rootPage.vue'
import addUser from '../views/addUser.vue'
import deleteGroup from '../views/deleteGroup.vue'
import newGroup from '../views/newGroup.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/new',
    name: 'new',
    component: newGroup
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/group',
    name: 'groupPage',
    component: rootPage
  },
  {
    path: '/adduser',
    name: 'addUser',
    component: addUser
  },
  {
    path: '/deletegroup',
    name: 'deleteGroup',
    component: deleteGroup
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
