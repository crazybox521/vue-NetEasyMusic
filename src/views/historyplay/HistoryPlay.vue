<template>
  <!-- 最近播放 -->
  <div class="history-play mtop-20">
    <div class="info">
      <div>
        <span class="font-24 font-bold">最近播放</span>
        <span class="font-14 mleft-10">共 {{ length }} 首</span>
      </div>
      <div class="btn-wrap">
        <button class="no-btn" @click="clearHistory">清除列表</button>
      </div>
    </div>
    <div class="btn-wrap mtop-10">
      <button class="btn btn-red" @click="playAll">
        <i class="iconfont icon-bofang"></i> 播放全部
      </button>
    </div>
    <div class="div-line mtop-20"></div>
    <MusicList ref="listRef" :list="historyList"></MusicList>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import MusicList from '@/components/list/MusicList.vue'
export default {
  components: { MusicList },
  computed: {
    ...mapState(['historyList']),
    length() {
      return this.historyList.length
    }
  },
 
  methods: {
    playAll() {
      /* 访问音乐列表组件的方法 */
      this.$refs.listRef.playMusicAll()
    },
    clearHistory() {
      if (!window.localStorage.getItem('historylist')) return
      this.$store.commit('setHistoryList', {
        type: 'clear'
      })
    }
  }
}
</script>

<style lang="less" scoped>
.info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>