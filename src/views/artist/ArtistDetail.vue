<template>
  <div class="artist-detail">
    <div class="artist-info">
      <img :src="imgUrl" class="img-h img-radius-4" />
      <div class="info">
        <h2 class="font-24 font-bold">{{ artistInfo.name }}</h2>
        <div>
          <el-button round>收藏</el-button>
          <el-button round>个人主页</el-button>
        </div>
        <div>
          <span>单曲数:{{ artistInfo.albumSize }}</span>
          <span class="mleft-20">专辑数:{{ artistInfo.albumSize }}</span>
          <span class="mleft-20">MV数:{{ artistInfo.mvSize }}</span>
        </div>
      </div>
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="专辑" name="1">专辑</el-tab-pane>
      <el-tab-pane label="MV" name="2">MV</el-tab-pane>
      <el-tab-pane label="歌手详情" name="3">
        <div></div>
      </el-tab-pane>
      <el-tab-pane label="相似歌手" name="4">相似歌手</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { queryArtistDetail,getArtistTop } from '../../api/api'
export default {
  data() {
    return {
      activeName: '1',
      artistInfo: {
        name: '',
        cover: '',
        briefDesc: '',
        albumSize: 0,
        musicSize: 0,
        mvSize: 0
      }
    }
  },
  computed: {
    imgUrl() {
      return this.artistInfo.cover
        ? this.artistInfo.cover + '?param=300y300'
        : 'https://cdn.jsdelivr.net/gh/crazybox521/blogImg/music.jpg'
    }
  },
  created() {
    this.getInfo()
  },
  methods: {
      /* 获取歌手详情 */
    async getInfo() {
      const { data: res } = await queryArtistDetail(this.$route.params.id)
      if (res.code !== 200) return
      this.artistInfo = res.data.artist
    },
    async getTop(){
        const {data:res} =await getArtistTop(this.$route.params.id)
        if(res.code!==200) return
        
    },
    handleClick() {}
  }
}
</script>
<style lang="less" scoped>
.artist-info {
  height: 200px;
  display: flex;
  .info {
    margin-left: 30px;
    line-height: 50px;
  }
}
</style>