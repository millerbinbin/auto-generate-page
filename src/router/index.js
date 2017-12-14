import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Empty from '@/components/Empty'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/home',
      name: 'homepage',
      component: Home
    },
    {
      path: '/empty',
      name: 'empty',
      component: Empty
    }
  ]
})
