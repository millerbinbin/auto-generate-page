import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/pages/Login'
import Home from '@/components/pages/Home'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/home',
      name: 'homepage',
      component: Home
    }
  ]
})
