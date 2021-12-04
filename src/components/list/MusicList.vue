<template>
  <!-- 封装音乐列表组件 -->
  <el-table
    :data="list"
    style="width: 100%"
    size="mini"
    class="music-list"
    stripe
    v-if="isDisplay"
    @row-dblclick="playMusic"
    empty-text="当前没有音乐哦"
    tooltip-effect="light"
  >
    <el-table-column type="index" width="50">
      <template v-slot="scope">
        <span class="active-color" v-if="currenMusicId == scope.row.id"
          ><i class="iconfont icon-sound"></i
        ></span>
        <span v-else style="color: #c3c3db">{{ scope.$index + 1 }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="name" label="音乐标题" show-overflow-tooltip>
      <template v-slot="{ row }">
        <span :class="{'active-color':currenMusicId ==row.id}">{{ row.name }}</span>
        <span style="color:#969697;" v-if="row.alia.length!==0">({{row.alia[0]}})</span>
        <span v-if="row.fee == 1" class="vip-tag">VIP</span>
        <span
          v-if="row.mv !== 0"
          class="vip-tag pointer"
          @click="toMvDeTail(row.mv)"
          style="color: #ec4949; border-color: #ec4949"
          >MV<i class="el-icon-caret-right"></i
        ></span>
      </template>
    </el-table-column>
    <el-table-column
      prop="ar[0].name"
      show-overflow-tooltip
      label="歌手"
      width="180"
    >
    </el-table-column>
    <el-table-column prop="al.name" label="专辑名" width="300" show-overflow-tooltip>
    </el-table-column>
    <el-table-column prop="dt" label="时长" width="120">
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
    ...mapState(['musicList', 'currenMusicId']),
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
    },
    toMvDeTail(id) {
      if (typeof id === 'number') this.$router.push('/mvdetail/' + id)
    }
  }
}
</script>

<style lang="less" scoped>
.vip-tag {
  display: inline-block;
  box-sizing: border-box;
  border: 1px solid #fe672e;
  border-radius: 2px;
  color: #fe672e;
  margin-left: 10px;
  height: 14px;
  padding: 0 2px;
  line-height: 1;
}
.active-color{
  color:#ec4141
}
</style>