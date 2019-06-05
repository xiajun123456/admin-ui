import SideMenu from '@/components/SideMenu.vue'

const componentList = [SideMenu]
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
export { SideMenu }
