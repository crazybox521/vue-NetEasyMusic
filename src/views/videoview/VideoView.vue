<template>
  <div class="video-view">
    <div class="video-head">
      <ul class="router-list">
        <li
          v-for="route in routeList"
          :key="route.path"
          @click="goTo(route.path)"
          class="pointer"
          :class="{ isActive: route.isActive }"
        >
          {{ route.title }}
        </li>
      </ul>
    </div>
    <div class="video-wrap">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      routeList: [
        { path: '/video', title: '视频', isActive: true },
        { path: '/mv', title: 'MV', isActive: false }
      ]
    }
  },
  watch: {
    $route(to, from) {
      console.log(to, from, '111')
      this.setActive(to.path)
    }
  },
  methods: {
    /* 路由跳转 */
    goTo(path) {
      if (this.$route.path == path) return false
      document.querySelector('.main-right').scrollTop = 0
      this.$router.push(path)
    },
    /* 激活导航 */
    setActive(path) {
      this.routeList.forEach((item) => {
        if (item.isActive == true) {
          item.isActive = false
        }
        if (item.path == path) {
          item.isActive = true
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.isActive {
  font-size: 20px;
  font-weight: bold;
}
.isActive::after {
  display: block;
  content: '';
  border-top: 4px solid red;
  width: 80%;
  margin: 0 auto;
}
</style>