<template>
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
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import notifyMixin from '../../mixins/notifyMixin'
export default {
  mixins:[notifyMixin],
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
      console.log(to, from, '111')
      this.setActive(to.path)
    }
  },
  methods: {
    /* 路由跳转 */
    goTo(path) {
      if (path == '/dingzhi' || path == '/zuixin') {
        this.notice()
        return
      }
      if (this.$route.path == path) return false
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
.router-list {
  height: 60px;
  width: 100%;
  display: flex;
  position: fixed;
  left: 200px;
  padding-left: 30px;
  top: 60px;
  z-index: 99;
  background-color: #ffffff;
  align-items: center;
  li {
    margin-right: 20px;
  }
}
@media screen and (max-width:768px) {
  .router-list{
    left: 0;
    width: 100%;
    overflow-x:scroll;
    padding-left:0;
    text-align: center;
    transition: all 1s linear;
    li{
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
