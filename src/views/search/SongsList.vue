<template>
  <!-- 头部区域相关功能组件 -->
  <div class="songs-list">
    <div class="font-bold">找到 {{ total }} 首单曲</div>
    <el-table
      :data="seachList"
      style="width: 100%"
      size="medium"
      stripe
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
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { search } from '../../api/api.js'
export default {
  data() {
    return {
      /* 搜索分页信息 */
      searchInfo: {
        keywords: '',
        limit: 20,
        offset: 0
      },
      total: 0,
      /* 检索到的列表 */
      seachList: []
    }
  },
  computed: {
    ...mapState(['keywords', 'musicList'])
  },
  watch: {
    keywords() {
      this.searchInfo.keywords = this.keywords
      this.search()
    }
  },
  methods: {
    /* 搜索音乐 */
    async search() {
      if (this.searchInfo.keywords == '') return
      const { data: res } = await search(this.searchInfo)
      console.log('@result', res.result)
      if (res.code !== 200) return this.$message.error('请求失败')
      this.seachList = res.result.songs
      this.total = res.result.songCount
      console.log('@musicList', this.seachList)
    },
    /* 播放音乐 */
    playMusic(row) {
      console.log('列表没变', this.seachList == this.musicList)
      this.$store.commit('setMusicList', this.seachList)
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
    }
  }
}
</script>

<style lang="less" scoped>
.songs-list {
  background-color: #ffffff;
  margin: 20px;
}
</style>