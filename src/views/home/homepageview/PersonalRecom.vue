<template>
  <div class="personal-recom mtop-60">
    <div class="swiper-wrapper">
      <el-carousel :interval="4000" type="card" :height="bannerHeight + 'px'">
        <el-carousel-item v-for="item in imgList" :key="item.imageUrl">
          <img class="img img-h" :src="item.imageUrl" @click="open(item.url)" />
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="play-list">
      <h2 class="font-20 font-bold">
        热门推荐 <i class="iconfont icon-arrow-right"></i>
      </h2>
      <SongSheetList :playlist="recSongList"></SongSheetList>
    </div>
    <div class="play-list" v-if="isLogin">
      <h2 class="font-20 font-bold">
        个性化推荐 <i class="iconfont icon-arrow-right"></i>
      </h2>
      <SongSheetList :playlist="recommendList"></SongSheetList>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getBanner, getPersonalized, getRecommend } from '../../../api/api'
import SongSheetList from '../../../components/list/SongSheetList.vue'
export default {
  components: {
    SongSheetList
  },
  data() {
    return {
      imgList: [],
      recSongList: [],
      recommendList: []
    }
  },
  created() {
    this.getImgList()
    this.getRecSongList(10)
  },
  watch: {
    isLogin: {
      immediate: true,
      handler() {
        if (this.isLogin) this.getRecommend()
      }
    }
  },
  computed: mapState(['bannerHeight', 'isLogin']),
  methods: {
    /* 个性推荐页 */
    // 轮播图
    async getImgList() {
      const { data: res } = await getBanner()
      if (res.code !== 200) return
      res.banners.forEach((item) => {
        let { imageUrl, url, typeTitle } = item
        this.imgList.push({ imageUrl, url, typeTitle })
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
    },
    /* 获取个性歌单 */
    async getRecommend() {
      if (!this.isLogin) return
      const { data: res } = await getRecommend()
      if (res.code !== 200) return
      this.recommendList = res.recommend
    },
    open(url) {
      console.log(url)
      if (url !== null) window.open(url)
    }
  }
}
</script>

<style>
</style>