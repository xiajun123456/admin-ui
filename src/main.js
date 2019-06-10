import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import '@/assets/css/_main.scss'

Vue.use(ElementUI)
Vue.config.productionTip = false
router.beforeEach((to, from, next) => {
  let token = window.sessionStorage.getItem('token')
  if (to.path === '/login' && !token) return next()
  if (token) {
    next()
  } else {
    next('/login')
  }
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
