<template>
  <div class="home">
    <SideMenu></SideMenu>
  </div>
</template>

<script>
// @ is an alias to /src
import SideMenu from '@/components/SideMenu.vue'

export default {
  name: 'home',
  components: {
    SideMenu
  }
}
</script>
