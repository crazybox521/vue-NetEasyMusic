<template>
  <div class="subscribe-view">
    <div class="sub-head">
      <ul class="router-list">
        <li
          v-for="route in subRouteList"
          :key="route.path"
          @click="goTo(route.path)"
          class="pointer"
          :class="{ isActive: route.isActive }"
        >
          {{ route.title }}
        </li>
      </ul>
    </div>
    <div class="sub-main mtop-60">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      subRouteList: [
        { path: '/sub-album', title: '专辑', isActive: true },
        { path: '/sub-artists', title: '歌手', isActive: false },
        { path: '/sub-mv', title: '视频', isActive: false }
      ]
    }
  },
  watch: {
    /* 监听路由，改变激活态 */
    '$route.path': {
      immediate: true,
      handler(toPath) {
        this.subRouteList.forEach((item) => {
          item.isActive = false
          if (toPath == item.path) item.isActive = true
        })
      }
    }
  },
  methods: {
    /* 切换路由 */
    goTo(path) {
      if (this.$route.path == path) return
      this.$router.push(path)
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