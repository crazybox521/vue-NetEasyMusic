<template>
  <div class="home-page">
    <ul class="home-menu">
      <li>个性推荐</li>
      <li>专属定制</li>
      <li>歌单</li>
      <li>排行榜</li>
      <li>歌手</li>
      <li>最新音乐</li>
    </ul>
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
      <ul class="play-list-wrapper">
        <li class="play-list-item" v-for="item in recSongList" :key="item.id" @click="toPlayListDetail(item.id)">
          <img
            class="img img-radius-4"
            :src="item.picUrl"
            alt=""
          />
          <div class="text-hidden">
            {{item.name}}
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { getBanner, getPersonalized } from '../../api/api'
export default {
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
    /* 轮播图 */
    async getImgList() {
      const { data: res } = await getBanner()
      if (res.code !== 200) return
      res.banners.forEach((item) => {
        let { imageUrl, typeTitle } = item
        this.imgList.push({ imageUrl, typeTitle })
      })
    },
    /* 歌单 */
    async getRecSongList(limit) {
      const { data: res } = await getPersonalized(limit)
      if (res.code !== 200) return
      res.result.forEach((item) => {
        let {id,name,picUrl,playCount,trackCount}= item
        this.recSongList.push({id,name,picUrl,playCount,trackCount})
      })
    },
    toPlayListDetail(id){
      this.$router.push({path:'/playlistdetail/'+id})
    }
  }
}
</script>

<style lang="less" scoped>
.home-menu {
  position: fixed;
  top: 9vh;
  display: flex;
  width: 100%;
  height: 60px;
  line-height: 60px;
  background-color: #ffffff;
  z-index: 99;
  li {
    margin-right: 10px;
  }
}
.swiper-wrapper {
  margin-top: 60px;
}
.play-list-wrapper {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  .play-list-item {
    margin-bottom: 30px;
    width: 19%;
    margin-right: 1%;
  }
}
</style>