<template>
  <div class="personal-recom mtop-60">
    <div class="swiper-wrapper">
      <el-carousel :interval="4000" type="card" height="200px">
        <el-carousel-item v-for="item in imgList" :key="item.imageUrl">
          <img class="img" :src="item.imageUrl" alt="" />
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="play-list">
      <h2 class="font-20 font-bold">
        推荐歌单 <i class="iconfont icon-arrow-right"></i>
      </h2>
      <SongSheetList :playlist="recSongList"></SongSheetList>
    </div>
  </div>
</template>

<script>
import { getBanner, getPersonalized } from '../../../api/api'
import SongSheetList from '../../../components/list/SongSheetList.vue'
export default {
  components: {
    SongSheetList
  },
  data() {
    return {
      imgList: [],
      recSongList: []
    }
  },
  created() {
    this.getImgList()
    this.getRecSongList(10)
  },
  methods: {
    /* 个性推荐页 */
    // 轮播图
    async getImgList() {
      const { data: res } = await getBanner()
      if (res.code !== 200) return
      res.banners.forEach((item) => {
        let { imageUrl, typeTitle } = item
        this.imgList.push({ imageUrl, typeTitle })
      })
    },
    // 获取歌单
    async getRecSongList(limit) {
      const { data: res } = await getPersonalized(limit)
      if (res.code !== 200) return
      res.result.forEach((item) => {
        let { id, name, picUrl, playCount, trackCount } = item
        this.recSongList.push({ id, name, picUrl, playCount, trackCount })
      })
    }
  }
}
</script>

<style>
</style>