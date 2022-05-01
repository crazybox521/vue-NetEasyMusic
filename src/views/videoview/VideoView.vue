<template>
  <!-- 视频页首屏 -->
  <div class="video-view">
    <div class="router-list">
      <TabMenu :menuList="routeList" mode="router"/>
    </div>
    <div class="video-wrap mtop-60">
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
        { path: '/video', name: '视频' },
        { path: '/mv', name: 'MV' }
      ]
    }
  }
}
</script>
