<template>
  <!-- 发现音乐页容器及导航 -->
  <div class="home-page">
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
    <div class="home-page-view" ref="ref">
      <transition name="el-fade-in">
        <router-view></router-view>
      </transition>
    </div>
  </div>
</template>

<script>
import notifyMixin from '@/mixins/notifyMixin'
export default {
  mixins: [notifyMixin],
  data() {
    return {
      routeList: [
        { path: '/personalrecom', title: '个性推荐', isActive: true },
        { path: '/dingzhi', title: '专属定制', isActive: false },
        { path: '/playlist', title: '歌单', isActive: false },
        { path: '/toplist', title: '排行榜', isActive: false },
        { path: '/artistlist', title: '歌手', isActive: false },
        { path: '/zuixin', title: '最新音乐', isActive: false }
      ]
    }
  },
  created() {
    let path = this.$route.path
    console.log(path)
    this.setActive(path)
  },
  watch: {
    $route(to, from) {
      console.log(to, from, 'home')
      this.setActive(to.path)
    }
  },
  methods: {
    /* 路由跳转 */
    goTo(path) {
      if (path == '/dingzhi') {
        this.notice()
        return
      }
      if (this.$route.path == path) return false
      document.querySelector('.main-right').scrollTop = 0
      this.$router.push(path)
    },
    /* 激活导航 */
    setActive(path) {
      this.routeList.forEach((item) => {
        item.isActive = false
        if (item.path == path) {
          item.isActive = true
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
@media screen and (max-width: 768px) {
  .router-list {
    left: 0;
    width: 100%;
    overflow-x: scroll;
    padding-left: 0;
    text-align: center;
    transition: all 0.5s linear;
    li {
      width: 20%;
      white-space: nowrap;
    }
  }
}
.home-page-view {
  height: 100%;
}
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
