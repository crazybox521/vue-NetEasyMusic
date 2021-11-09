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
    <div class="home-page-view">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      routeList: [
        { path: '/personalrecom', title: '个性推荐', isActive: true },
        { path: '/dingzhi', title: '专属定制', isActive: false },
        { path: '/playlist', title: '歌单', isActive: false },
        { path: '/toplist', title: '排行榜', isActive: false },
        { path: '/geshou', title: '歌手', isActive: false },
        { path: '/zuixin', title: '最新音乐', isActive: false }
      ]
    }
  },
  created(){
    let path =this.$route.path.slice(9)
    console.log(path)
    this.setActive(path)
  },
  methods: {
    goTo(path) {
      let pathFull = '/homepage' + path
      console.log(this.$route.path)
      if (this.$route.path == pathFull) return false
      this.setActive(path)
      this.$router.push(pathFull)
    },
    setActive(path){
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
  top: 9vh;
  z-index: 99;
  background-color: #ffffff;
  align-items: center;
  li {
    margin-right: 20px;
  }
}
.home-page-view {
  height: 100%;
}
.isActive {
  font-size: 20px;
  font-weight: bold;
}
.isActive::after{
  display: block;
  content: '';
  border-top: 4px solid red;
  width: 80%;
  margin: 0 auto;
}
</style>
