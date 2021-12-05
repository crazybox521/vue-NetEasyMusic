<template>
  <div class="artist-detail mtop-20">
    <div class="artist-info">
      <img :src="imgUrl" class="img-h img-radius-8 img-outline" />
      <div class="info">
        <h2 class="font-24 font-bold">{{ artistInfo.name }}</h2>
        <div class="info-btn">
          <button class="btn btn-white mleft-10">
            <i class="el-icon-folder-add"></i>
            收藏
          </button>
          <button
            class="btn btn-white mleft-10"
            v-if="showPriMsg"
            @click="toUserDetail"
          >
            <i class="el-icon-user"></i>
            个人主页
          </button>
        </div>
        <div>
          <span class="font-14">单曲数:{{ artistInfo.albumSize }}</span>
          <span class="mleft-20 font-14"
            >专辑数:{{ artistInfo.albumSize }}</span
          >
          <span class="mleft-20 font-14">MV数:{{ artistInfo.mvSize }}</span>
        </div>
      </div>
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="专辑" name="album">
        <div style="height: 200px" v-if="isLoading" v-loading="isLoading">
          加载中...
        </div>
        <template v-else>
          <TopFiftyList
            :list="topList"
            v-if="topList.length !== 0"
          ></TopFiftyList>
          <AlbumList
            v-for="(item, index) in albumList"
            :key="index"
            :albumInfo="item.album"
            :list="item.songs"
          ></AlbumList>
        </template>
      </el-tab-pane>
      <el-tab-pane label="MV" name="MV">
        <div style="height: 200px" v-if="isLoading" v-loading="isLoading">
          加载中...
        </div>
        <div v-else-if="mvList.length === 0">没有MV</div>
        <MvList v-else :disabled="true" :list="mvList"></MvList>
      </el-tab-pane>
      <el-tab-pane label="歌手详情" name="desc">
        <div style="height: 200px" v-if="isLoading" v-loading="isLoading">
          加载中...
        </div>
        <div v-else-if="introduction.length === 0">没有歌手详情</div>
        <template v-else>
          <div class="mtop-60" v-for="text in introduction" :key="text.ti">
            <h2 class="font-bold font-14">{{ text.ti }}</h2>
            <div
              class="my-pre font-14"
              v-for="(t, index) in text.txt"
              :key="index"
            >
              <p>{{ t }}</p>
            </div>
          </div>
        </template>
      </el-tab-pane>
      <el-tab-pane label="相似歌手" name="same">
        <div style="height: 200px" v-if="isLoading" v-loading="isLoading">
          加载中...
        </div>
        <div v-else-if="sameArtistList.length === 0">没有相似歌手</div>
        <Artist :hasMore="false" v-else :list="sameArtistList"></Artist>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import AlbumList from '@/components/list/AlbumList.vue'
import MvList from '@/components/list/MvList.vue'
import TopFiftyList from '@/components/list/TopFiftyList.vue'
import Artist from '@/components/list/Artist.vue'
import {
  queryArtistDetail,
  getArtistTop,
  getArtistAlbum,
  getIntro,
  getArtistMv,
  getArtistSame
} from '@/api/api_artist'
import { getAlbumDetail } from '@/api/api_album'
export default {
  components: { AlbumList, TopFiftyList, MvList, Artist },
  data() {
    return {
      activeName: 'album', //激活的tab页
      artistInfo: {
        //歌手的信息
        name: '',
        cover: '',
        briefDesc: '',
        albumSize: 0,
        musicSize: 0,
        mvSize: 0
      },
      showPriMsg: false,
      topList: [], //热门50首
      albumList: [], //专辑信息
      introduction: [], //歌手详细描述,
      userId: 0, //歌手用户ID
      mvList: [], //歌手MV列表
      sameArtistList: [],
      isLoading: false
    }
  },
  computed: {
    imgUrl() {
      return this.artistInfo.cover
        ? this.artistInfo.cover + '?param=300y300'
        : 'https://cdn.jsdelivr.net/gh/crazybox521/blogImg/music.jpg'
    },
    id() {
      return this.$route.params.id
    }
  },
  watch: {
    '$route.params.id'() {
      this.getInfo()
      /* 在相似歌手页切换歌手，重置前三个tab的数据，且重新获取相似歌手 */
      this.getSame()
      this.topList = []
      this.albumList = []
      this.introduction = []
      this.mvList = []
    }
  },
  created() {
    this.getInfo()
    this.getTop()
    this.getAlbum()
  },
  methods: {
    /* 获取歌手详情 */
    async getInfo() {
      const { data: res } = await queryArtistDetail(this.id)
      if (res.code !== 200) return
      console.log('歌手信息', res)
      console.log(res)
      this.artistInfo = res.data.artist
      this.showPriMsg = res.data.showPriMsg
      if (this.showPriMsg) this.userId = res.data.user.userId
    },
    /* 获取热门50首 */
    async getTop() {
      const { data: res } = await getArtistTop(this.id)
      if (res.code !== 200) return
      this.topList = res.songs
      this.isLoading = false
    },
    /* 获取专辑列表 */
    async getAlbum() {
      const { data: res } = await getArtistAlbum(this.id)
      if (res.code !== 200) return
      this.albumList = []
      res.hotAlbums.forEach((item) => {
        this.getAlbumDetail(item.id)
      })
    },
    /* 获取专辑信息 */
    async getAlbumDetail(id) {
      const { data: res } = await getAlbumDetail(id)
      if (res.code !== 200) return
      this.albumList.push(res)
    },
    /* 获取歌手详细描述 */
    async getIntroduction() {
      const { data: res } = await getIntro(this.id)
      if (res.code !== 200) return
      res.introduction.forEach((item) => {
        item.txt = item.txt.split('\n')
      })
      this.introduction = res.introduction
      this.isLoading = false
    },
    /* 获取歌手MV */
    async getMv() {
      const { data: res } = await getArtistMv(this.id)
      if (res.code !== 200) return
      res.mvs.forEach((item) => {
        item.cover = item.imgurl
      })
      this.mvList = res.mvs
      this.isLoading = false
    },
    /* 获取相似歌手 */
    async getSame() {
      const { data: res } = await getArtistSame(this.id)
      if (res.code !== 200) return
      this.sameArtistList = res.artists
      this.isLoading = false
    },
    toUserDetail() {
      if (this.userId !== 0 && this.showPriMsg)
        this.$router.push('/userdetail/' + this.userId)
    },
    /* tab点击事件回调 */
    handleClick() {
      if (this.activeName === 'desc') {
        if (this.introduction.length !== 0) return
        console.log('desc')
        this.isLoading = true
        this.getIntroduction()
        return
      }
      if (this.activeName === 'album') {
        console.log('album')
        if (this.albumList.length !== 0) return
        this.isLoading = true
        this.getTop()
        this.getAlbum()
        return
      }
      if (this.activeName === 'MV') {
        console.log('mv')
        if (this.mvList.length !== 0) return
        this.isLoading = true
        this.getMv()
        return
      }
      if (this.activeName === 'same') {
        console.log('same')
        if (this.sameArtistList.length !== 0) return
        this.isLoading = true
        this.getSame()
        return
      }
    }
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
.my-pre {
  text-indent: 2em;
  line-height: 2;
  width: 100%;
  p {
    color: #676767;
  }
}
.mtop-60:nth-child(1) {
  margin-top: 10px;
}
@media screen and (max-width: 532px) {
  .artist-info .img-h {
    display: none;
  }
}
</style>