import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import rootPage from '../views/rootPage.vue'
import addUser from '../views/addUser.vue'
import deleteGroup from '../views/deleteGroup.vue'
import newGroup from '../views/newGroup.vue'
import viewData from '../views/viewData.vue'
import printView from '../views/printView.vue'
import notFoundView from '../views/notFound.vue'
import excelView from '../views/excelView.vue'

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
    component: () => import('../views/AboutView.vue')
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
  },
  {
    path: '/view',
    name: 'viewData',
    component: viewData
  },
  {
    path: '/print',
    name: 'printData',
    component: printView
  },
  {
    path: '/excel',
    name: 'excelView',
    component: excelView
  },
  {
    path: '*',
    name: 'notFound',
    component: notFoundView
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
