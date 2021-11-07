<template>
  <!-- 封装音乐列表组件 -->
  <el-table
    :data="list"
    style="width: 100%"
    size="medium"
    class="music-list"
    stripe
    v-if="isDisplay"
    @row-dblclick="playMusic"
  >
    <el-table-column type="index" width="50"> </el-table-column>
    <el-table-column width="50">
      <i class="el-icon-download"></i>
    </el-table-column>
    <el-table-column prop="name" label="音乐标题"> </el-table-column>
    <el-table-column prop="ar[0].name" label="歌手" width="180">
    </el-table-column>
    <el-table-column prop="al.name" label="专辑名"> </el-table-column>
    <el-table-column prop="dt" label="时长" width="180">
      <template v-slot="scope">
        {{ (scope.row.dt / 1000) | timeFormat }}
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: ['list'],
  computed: {
    ...mapState(['musicList']),
    isDisplay() {
      return this.list ? true : false
    }
  },
  methods: {
    //  播放音乐
    playMusic(row) {
      console.log('列表没变', this.list == this.musicList)
      this.$store.commit('setMusicList', this.list)
      this.$store.commit('setCurrenMusicId', row.id)
      this.$store.commit('setPlayState', true)
      this.getIndex(row.id)
    },
    // 获取并改变当前播放下标
    getIndex(id) {
      if (this.musicList.length === 0) return
      let index = this.musicList.findIndex((item) => item.id == id)
      console.log(index)
      this.$store.commit('setCurrenIndex', index)
    },
    /* 播放当前列表 */
    playMusicAll() {
      console.log('调用了')
      if (this.list.length == 0) return
      let id = this.list[0].id
      console.log('列表没变', this.list == this.musicList)
      this.$store.commit('setMusicList', this.list)
      this.$store.commit('setCurrenMusicId', id)
      this.$store.commit('setPlayState', true)
      this.getIndex(id)
    }
  }
}
</script>

<style>
</style>