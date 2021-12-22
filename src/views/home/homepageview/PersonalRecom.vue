<template>
  <div class="personal-recom mtop-60">
    <div class="swiper-wrapper">
      <el-carousel :interval="4000" type="card" :height="bannerHeight + 'px'">
        <el-carousel-item v-for="item in imgList" :key="item.imageUrl">
          <img
            class="img img-h swiper-img"
            :src="item.imageUrl"
            @click="open(item.url)"
          />
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="play-list" v-if="!isLogin">
      <h2 class="font-20 font-bold pointer" @click="$router.push('playlist')">
        热门推荐 <i class="iconfont icon-arrow-right"></i>
      </h2>
      <ImgList @clickImg="toPlayListDetail" :list="recSongList" type="playlist">
        <template v-slot="{ item }">
          <div class="text-hidden">
            {{ item.name }}
          </div>
        </template>
      </ImgList>
    </div>
    <div class="play-list" v-else>
      <h2 class="font-20 font-bold pointer" @click="$router.push('playlist')">
        推荐歌单 <i class="iconfont icon-arrow-right"></i>
      </h2>
      <ImgList
        @clickImg="toPlayListDetail"
        :list="recommendList"
        type="playlist"
      >
        <template v-slot="{ item }">
          <div class="text-hidden">
            {{ item.name }}
          </div>
        </template>
      </ImgList>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getBanner } from '@/api/api_other'
import { getPersonalized, getRecommend } from '@/api/api_playlist'
import ImgList from '@/components/list/ImgList.vue'
export default {
  components: {
    ImgList
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
  computed: {
    ...mapState(['bannerHeight', 'isLogin', 'isPhone']),
    bannerHeight() {
      return this.isPhone ? 80 : 200
    }
  },
  methods: {
    /* 个性推荐页 */
    // 轮播图
    async getImgList() {
      const res = await getBanner()
      if (res.code !== 200) return
      this.imgList = Object.freeze(res.banners)
    },
    // 获取热门推荐歌单 未登录时
    async getRecSongList(limit) {
      if (this.isLogin) return
      const res = await getPersonalized(limit)
      if (res.code !== 200) return
      console.log(res)
      this.recSongList = Object.freeze(res.result)
    },
    /* 获取推荐歌单 登陆后 */
    async getRecommend() {
      if (!this.isLogin) return
      const res = await getRecommend()
      if (res.code !== 200) return
      console.log(res)
      res.recommend.forEach((item) => {
        item.playCount = item.playcount
        this.recommendList.push(Object.freeze(item))
      })
    },
    open(url) {
      console.log(url)
      if (url !== null) window.open(url)
    },
    toPlayListDetail(id) {
      if (typeof id === 'number')
        this.$router.push({ path: '/playlistdetail/' + id })
    }
  }
}
</script>

<style lang="less" scoped>
.swiper-img {
  border-radius: 8px;
}
</style>、