import Vue from 'vue'
import Router from 'vue-router'

import login from '@/views/login'
import vehtype from '@/views/vehType'
import vehlist from '@/views/vehList'
import collect from '@/views/collect'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: login
    }, {
      path: '/vehtype',
      name: 'vehtype',
      component: vehtype
    }, {
      path: '/vehlist/:typeid',
      name: 'vehlist',
      component: vehlist
    }, {
      path: '/collect/:typeid/:lng/:lat',
      name: 'collect',
      component: collect
    }
  ]
})
