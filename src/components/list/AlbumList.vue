<template>
  <!-- 歌手信息页专辑列表 -->
  <div class="album-list mtop-60">
    <div class="list-container">
      <div style="width: 200px">
        <img
          class="img img-radius-8 img-border"
          @click="toAlbumDetail"
          :src="albumInfo.picUrl + '?param=300y300'"
        />
      </div>
      <div class="mleft-40 list-content">
        <div>
          <span class="font-bold">{{ albumInfo.name }}</span>
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
        <div class="right" v-show="total > 10">
          <button class="pointer no-btn mtop-10" @click="toAlbumDetail">
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
  props: ['list', 'albumInfo'],
  computed: {
    ...mapState(['musicList']),
    disList() {
      return this.list.slice(0, 10)
    },
    total() {
      return this.list.length
    }
  },
  methods: {
    toAlbumDetail() {
      this.$router.push({ path: `/albumdetail/${this.albumInfo.id}` })
    },
    //  播放音乐
    playMusic(row) {
      console.log('列表没变?', this.list == this.musicList)
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

<style lang="less" scoped>
.list-container {
  display: flex;
  .list-content {
    flex: 1;
  }
}
</style>