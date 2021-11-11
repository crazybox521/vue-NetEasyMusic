<template>
  <!-- 头部区域相关功能组件 -->
  <div class="songs-list">
    <div class="font-bold">找到 {{ total }} 首单曲</div>
    <el-skeleton v-if="isLoading" :rows="16" animated />
    <MusicList v-else :list="seachList"></MusicList>
    <el-empty v-if="total == 0" :description="desInfo"></el-empty>
  </div>
</template>

<script>
import { search } from '../../api/api.js'
import MusicList from '../../components/list/MusicList'
export default {
  components: {
    MusicList
  },
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
      seachList: [],
      isLoading: true
    }
  },
  computed: {
    desInfo() {
      return '很抱歉，未能找到与' + this.searchInfo.keywords + '有关的单曲'
    }
  },
  watch: {
    '$route.params.key'(val) {
      this.searchInfo.keywords = val
      this.search()
    }
  },
  created() {
    this.searchInfo.keywords = this.$route.params.key
    this.search()
  },
  methods: {
    /* 搜索音乐 */
    async search() {
      if (this.searchInfo.keywords == '') return
      const { data: res } = await search(this.searchInfo)
      if (res.code !== 200) return this.$message.error('请求失败')
      this.seachList = res.result.songs
      this.total = res.result.songCount
      this.isLoading = false
    }
  }
}
</script>

<style lang="less" scoped>
</style>