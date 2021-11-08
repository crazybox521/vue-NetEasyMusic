<template>
  <div class="home-page">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <!-- 个性推荐页 -->
      <el-tab-pane label="个性推荐" name="first">
        <div class="mtop-60"></div>
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
            <li
              class="play-list-item"
              v-for="item in recSongList"
              :key="item.id"
              @click="toPlayListDetail(item.id)"
            >
              <el-image lazy class="img img-radius-4" :src="item.picUrl" alt="" />
              <div class="text-hidden">
                {{ item.name }}
              </div>
            </li>
          </ul>
        </div>
      </el-tab-pane>
      <el-tab-pane label="专属定制" name="second">
        <div class="mtop-60"></div>
        专属定制
      </el-tab-pane>
      <el-tab-pane label="歌单" name="third">
        <div class="mtop-60"></div>
        歌单
      </el-tab-pane>
      <el-tab-pane label="排行榜" name="fourth">
        <div class="mtop-60"></div>
        <el-skeleton :rows="16" v-if="guanfangList.length!==4" animated />
        <div class="guanfang-list" v-if="guanfangList.length==4">
          <h2 class="font-bold font-20">官方榜</h2>
          <div class="guanfang-item mtop-10" v-for="item in guanfangList"
              :key="item.id"
              @click="toPlayListDetail(item.id)">
            <div class="guanfang">
              <el-image lazy
                class="img-h img-radius-4"
                :src="item.coverImgUrl"
                alt=""
              />
              <ul class="mleft-30">
                <li v-for="(music,index) in item.tracks" :key="music.id" class="default-cursor">
                  <span class="mleft-12">{{index+1}}</span
                  ><span class="mleft-12 geming">{{music.name}}</span
                  ><span class="zuozhe mright-10">{{music.ar[0].name}}</span>
                </li>
              </ul>
            </div>
            <div class="mleft-200">
              <button class="pointer no-btn mtop-10">
                查看全部<i class="el-icon-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
        <div class="global-list" v-if="guanfangList.length==4">
          <h2 class="font-bold font-20">全球榜</h2>
          <div class="play-list">
            <ul class="play-list-wrapper">
              <li
                class="play-list-item"
                v-for="item in globalList"
                :key="item.id"
                @click="toPlayListDetail(item.id)"
              >
                <el-image lazy class="img img-radius-4" :src="item.coverImgUrl"/>
                <div class="text-hidden">
                  {{ item.name }}
                </div>
              </li>
            </ul>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="歌手" name="fifth">
        <div class="mtop-60"></div>
        歌手
      </el-tab-pane>
      <el-tab-pane label="最新音乐" name="sixth">
        <div class="mtop-60"></div>
        最新音乐
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { getBanner, getPersonalized, getToplist,getPlayListDetail } from '../../api/api'
export default {
  data() {
    return {
      imgList: [],
      recSongList: [],
      activeName: 'first',
      guanfangListId:[],
      guanfangList:[],
      globalList:[]
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
    },
    // 跳转到歌单详情页 
    toPlayListDetail(id) {
      this.$router.push({ path: '/playlistdetail/' + id })
    },
    // 处理tab点击事件
    handleClick() {
      console.log(this.activeName)
      if(this.activeName=='fourth'){
        this.getTopList()
      }
    },

    /* 排行榜页 */
    async getTopList() {
      const { data: res } = await getToplist()
      if (res.code !== 200) return
      res.list.slice(0,4).forEach((item) => {
        this.guanfangListId.push(item.id)
      })
      this.globalList =res.list.slice(4)
      this.guanfangListId.forEach((item) => {
         this.getPlayList(item)
      })
    },
    /* 获取歌单详情 */
     async getPlayList(id) {
      const { data: res } = await getPlayListDetail(id)
      if (res.code !== 200) return
      res.playlist.tracks = res.playlist.tracks.slice(0,5)
      this.guanfangList.push(res.playlist)
      console.log(this.guanfangList); 
      
    },
  }
}
</script>

<style lang="less" scoped>
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
.guanfang-item {
  margin-bottom: 20px;
}
.guanfang-list {
  .guanfang {
    display: flex;
    height: 160px;

    ul {
      flex-grow: 1;
      li {
        height: 32px;
        line-height: 32px;
        color: #f00;
        background-color: #ffffff;
        &:nth-child(1) {
          background-color: #f9f9f9;
        }
        &:nth-child(3) {
          background-color: #efefef;
        }
        &:nth-child(4){
          color: #666;
        }
        &:nth-child(5) {
          color: #666;
          background-color: #f9f9f9;
        }
        .geming {
          color: #373737;
        }
        .zuozhe {
          float: right;
          color: #9b9b9b;
        }
      }
    }
  }
}
</style>
<style lang="less">
/* 自定义标签导航栏样式 */
.home-page .el-tabs__header {
  position: fixed;
  top: 9vh;
  width: 100%;
  z-index: 100;
  background-color: #ffffff;
  padding-top: 20px;
}
.el-tabs__item {
  padding: 0 12px !important;
}
/* 导航栏选择样式 */
.el-tabs__item.is-active {
  color: #000 !important;
  font-weight: bold;
  font-size: 20px;
}
.el-tabs__item:hover {
  color: #ec4141 !important;
}
/* 导航栏选中下划线 */
.el-tabs__active-bar {
  background-color: #ec4141 !important;
}
</style>