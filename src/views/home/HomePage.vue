<template>
  <!-- 发现音乐页容器及导航 -->
  <div class="home-page">
    <div class="router-list">
      <TabMenu :menuList="routeList" mode="router" />
    </div>
    <div class="home-page-view">
      <transition name="el-fade-in">
        <router-view></router-view>
      </transition>
    </div>
  </div>
</template>

<script>
import TabMenu from '@/components/menu/TabMenu'
export default {
  components: { TabMenu },
  data() {
    return {
      routeList: [
        { path: '/personalrecom', name: '个性推荐' },
        { path: '/playlist', name: '歌单' },
        { path: '/toplist', name: '排行榜' },
        { path: '/artistlist', name: '歌手' },
        { path: '/zuixin', name: '最新音乐' }
      ]
    }
  }
}
</script>
