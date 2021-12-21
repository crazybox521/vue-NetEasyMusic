<template>
  <!-- 歌手页热门50首组件 -->
  <div class="top-fifty-list">
    <div class="list-container">
      <div style="width: 200px">
        <img class="img img-radius-8" src="@/assets/img/top50.png" />
      </div>
      <div class="mleft-40 list-content">
        <div>
          <span class="font-bold">热门50首</span>
          <button class="no-btn mleft-20 font-20" @click="playMusicAll">
            <i class="el-icon-video-play"></i>
          </button>
          <button class="no-btn mleft-20 font-20">
            <i class="el-icon-folder-add"></i>
          </button>
        </div>
        <el-table
          :data="disList"
          style="width: 100%"
          size="mini"
          stripe
          @row-dblclick="playMusic"
        >
          <el-table-column type="index" width="50"> </el-table-column>
          <el-table-column prop="name" show-overflow-tooltip label="音乐标题">
          </el-table-column>
          <el-table-column prop="dt" label="时长">
            <template v-slot="scope">
              {{ (scope.row.dt / 1000) | timeFormat }}
            </template>
          </el-table-column>
        </el-table>
        <div class="right" v-show="!showAll">
          <button class="pointer no-btn mtop-10" @click="showAll = true">
            查看全部{{ total }}首<i class="el-icon-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: ['list'],
  data() {
    return {
      showAll: false
    }
  },
  computed: {
    ...mapState(['musicList']),
    disList() {
      if (!this.showAll) {
        return this.list.slice(0, 10)
      } else {
        return this.list
      }
    },
    total() {
      return this.list.length
    }
  },
  methods: {
    disPlayAll() {
      this.showAll = true
    },
    //  播放音乐
    playMusic(row) {
      console.log('列表没变', this.list == this.musicList)
      this.$store.dispatch('playMusic', {
        list: this.list,
        id: row.id
      })
    },
    /* 播放当前列表 */
    playMusicAll() {
      console.log('调用了')
      if (this.list.length == 0) return
      let id = this.list[0].id
      this.$store.dispatch('playMusic', {
        list: this.list,
        id
      })
    }
  }
}
</script>

<style lang="less" scoped>
.list-container {
  display: flex;
  .list-content {
    flex: 1;
  }
}
</style>