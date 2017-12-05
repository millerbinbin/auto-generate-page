// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI)
Vue.use(Vuex)
Vue.config.productionTip = false

/* eslint-disable no-new */
const store = new Vuex.Store({
  state: {
    sysUser: 'aaa',
    sysUserTenant: '11',
    sysDate: '2011/11/11',
    sysWeek: '2011 W33',
    sysMonth: '2011 M10',
    sysWeekPeriod: '',
    sysMonthPeriod: '',
    warehouse: '',
    warehouseList: [],
    dateCycleList: [],
    allMetrics: {
    },
    homepageValues: [],
    homepageCharts: [],
    homepageFree: [],
    initial: true,
    isNative: false
  },
  mutations: {
    setUser (state, username) {
      state.sysUser = username
    },
    setUserTenant (state, tenant) {
      state.sysUserTenant = tenant
    },
    setDate (state, currentDate) {
      state.sysDate = currentDate
    },
    setWeek (state, currentWeek) {
      state.sysWeek = currentWeek
    },
    setWeekPeriod (state, currentWeekPeriod) {
      state.sysWeekPeriod = currentWeekPeriod
    },
    setMonth (state, currentMonth) {
      state.sysMonth = currentMonth
    },
    setMonthPeriod (state, currentMonthPeriod) {
      state.sysMonthPeriod = currentMonthPeriod
    },
    setWarehouse (state, warehouse) {
      state.warehouse = warehouse
    },
    setWarehouseList (state, list) {
      state.warehouseList = list
    },
    setDateCycle (state, list) {
      state.dateCycleList = list
    },
    addMetrics (state, p) {
      state.allMetrics[p.metricName] = p
    },
    setHomepageValue (state, p) {
      state.homepageValues = p
    },
    setHomepageChart (state, p) {
      state.homepageCharts = p
    },
    setHomepageFree (state, p) {
      state.homepageFree = p
    },
    setInitial (state, p) {
      state.initial = p
    },
    setNative (state, p) {
      state.isNative = p
    }
  },
  getters: {
  },
  actions: {
  }
})

new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
  store
  // mounted: function () {
  //   this.$router.push({ name: 'homepage' })
  // }
})
