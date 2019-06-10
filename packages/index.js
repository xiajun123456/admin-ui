import Login from '@/components/login/Login.vue'
import $http from '@/assets/js/http'

const componentList = [Login]
const comment = {
  install: function (Vue) {
    componentList.forEach(component => {
      Vue.component(component.name, component)
    })
  }
}
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(comment)
}
export default comment
export { Login, $http }
