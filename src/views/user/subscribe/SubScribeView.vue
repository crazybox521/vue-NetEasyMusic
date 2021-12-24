<template>
  <!-- 收藏页父路由 -->
  <div class="subscribe-view">
    <div class="router-list">
      <TabMenu :menuList="subRouteList" mode="router"></TabMenu>
    </div>
    <div class="sub-main mtop-60">
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
      subRouteList: [
        { path: '/sub-album', name: '专辑' },
        { path: '/sub-artists', name: '歌手' },
        { path: '/sub-mv', name: '视频' }
      ]
    }
  }
}
</script>