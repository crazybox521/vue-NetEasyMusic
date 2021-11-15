<template>
  <div class="artist-detail">
    <div class="artist-info">
      <img :src="imgUrl" class="img-h img-radius-4" />
      <div class="info">
        <h2 class="font-24 font-bold">{{ artistInfo.name }}</h2>
        <div class="info-btn">
          <button class="btn btn-white mleft-10">
            <i class="el-icon-folder-add"></i>
            收藏
          </button>
          <button class="btn btn-white mleft-10">
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
        <TopFiftyList
          v-if="topList.length !== 0"
          :list="topList"
        ></TopFiftyList>
        <AlbumList
          v-for="(item, index) in albumList"
          :key="index"
          :albumInfo="item.album"
          :list="item.songs"
        ></AlbumList>
      </el-tab-pane>
      <el-tab-pane label="MV" name="MV">MV</el-tab-pane>
      <el-tab-pane label="歌手详情" name="desc">
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
      </el-tab-pane>
      <el-tab-pane label="相似歌手" name="same">相似歌手</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import AlbumList from '../../components/list/AlbumList.vue'
import TopFiftyList from '../../components/list/TopFiftyList.vue'
import {
  queryArtistDetail,
  getArtistTop,
  getArtistAlbum,
  getAlbumDetail,
  getIntro
} from '../../api/api'
export default {
  components: { AlbumList, TopFiftyList },
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
      topList: [], //热门50首
      albumList: [], //专辑信息
      introduction: []
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
    this.getTop()
    this.getAlbum()
  },
  methods: {
    /* 获取歌手详情 */
    async getInfo() {
      const { data: res } = await queryArtistDetail(this.$route.params.id)
      if (res.code !== 200) return
      this.artistInfo = res.data.artist
    },
    /* 获取热门50首 */
    async getTop() {
      const { data: res } = await getArtistTop(this.$route.params.id)
      if (res.code !== 200) return
      this.topList = res.songs
    },
    async getAlbum() {
      const { data: res } = await getArtistAlbum(this.$route.params.id)
      if (res.code !== 200) return
      this.albumList = []
      res.hotAlbums.forEach((item) => {
        this.getAlbumDetail(item.id)
      })
    },
    async getAlbumDetail(id) {
      const { data: res } = await getAlbumDetail(id)
      if (res.code !== 200) return
      this.albumList.push(res)
    },
    async getIntroduction() {
      const { data: res } = await getIntro(this.$route.params.id)
      if (res.code !== 200) return
      res.introduction.forEach((item) => {
        item.txt = item.txt.split('\n')
      })
      this.introduction = res.introduction
    },
    handleClick() {
      if (this.activeName === 'desc') {
        if (this.introduction.length !== 0) return
        console.log('desc')
        this.getIntroduction()
        return
      }
      if (this.activeName === 'album') {
        console.log('album')
        return
      }
      if (this.activeName === 'MV') {
        console.log('desc')
        return
      }
      if (this.activeName === 'same') {
        console.log('same')
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
@media screen and (max-width: 768px) {
  .artist-info .img-h {
    display: none;
  }
}
</style>