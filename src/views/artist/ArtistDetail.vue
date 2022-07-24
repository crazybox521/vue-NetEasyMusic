<template>
  <div class="artist-detail mtop-20">
    <div class="artist-info">
      <div class="img-wrap">
        <img :src="imgUrl" class="img-h img-radius-8 img-border" />
      </div>
      <div class="info">
        <div class="font-24 font-bold">{{ artistInfo.name }}</div>
        <div class="info-btn">
          <button class="btn btn-white mleft-10" @click="subArtist">
            <span v-if="!isSub"><i class="el-icon-folder-add"></i> 收藏</span>
            <span v-else><i class="el-icon-folder-checked"></i> 已收藏</span>
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
    <TabMenu
      :menuList="['专辑', 'MV', '歌手详情', '相似歌手']"
      @menuClick="handleClick"
    />
    <!-- 专辑 -->
    <div v-show="tabIndex === 0">
      <div style="height: 200px" v-if="isLoading" v-loading="isLoading">
        加载中...
      </div>
      <template v-else>
        <TopFiftyList :list="topList" v-if="topList.length !== 0" />
        <AlbumList
          v-for="(item, index) in albumList"
          :key="index"
          :albumInfo="item.album"
          :list="item.songs"
        />
      </template>
    </div>
    <!-- MV -->
    <div v-show="tabIndex === 1">
      <div style="height: 200px" v-if="isLoading" v-loading="isLoading">
        加载中...
      </div>
      <div v-else-if="mvList.length === 0">没有MV</div>
      <MvList v-else :disabled="true" :list="mvList" />
    </div>
    <!-- 歌手详情 -->
    <div v-show="tabIndex === 2">
      <div style="height: 200px" v-if="isLoading" v-loading="isLoading">
        加载中...
      </div>
      <div v-else-if="introduction.length === 0">没有歌手详情</div>
      <template v-else>
        <div class="mtop-20" v-for="text in introduction" :key="text.ti">
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
    </div>
    <!-- 相似歌手 -->
    <div v-show="tabIndex === 3">
      <div style="height: 200px" v-if="isLoading" v-loading="isLoading">
        加载中...
      </div>
      <div v-else-if="sameArtistList.length === 0">没有相似歌手</div>
      <ImgList
        v-else
        @clickImg="toArtistDetail"
        :list="sameArtistList"
        type="artist"
        :isLoading="isLoading"
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
import AlbumList from '@/components/list/AlbumList.vue'
import MvList from '@/components/list/MvList.vue'
import TopFiftyList from '@/components/list/TopFiftyList.vue'
import ImgList from '@/components/list/ImgList.vue'
import {
  getArtistDetail,
  getArtistTop,
  getArtistAlbum,
  getIntro,
  getArtistMv,
  getArtistSame,
  getSubArtists,
  subArtist
} from '@/api/api_artist'
import { getAlbumDetail } from '@/api/api_album'
import { mapState } from 'vuex'
import TabMenu from '@/components/menu/TabMenu'
let imgUrl =require('@/assets/img/music.jpg')
export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },
  components: { AlbumList, TopFiftyList, MvList, ImgList, TabMenu },
  data() {
    return {
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
      sameArtistList: [], //相似歌手
      isLoading: false,
      subList: [], //收藏的歌手列表
      tabIndex: 0 //tab页的索引值
    }
  },
  computed: {
    imgUrl() {
      return this.artistInfo.cover
        ? this.artistInfo.cover + '?param=300y300'
        : imgUrl
    },
    isSub() {
      return this.subList.findIndex((item) => item.id == this.id) !== -1
    },
    ...mapState(['isLogin'])
  },
  watch: {
    id() {
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
      const res = await getArtistDetail(this.id)
      if (res.code !== 200) return
      console.log('歌手信息', res)
      console.log(res)
      this.artistInfo = Object.freeze(res.data.artist)
      this.showPriMsg = Object.freeze(res.data.showPriMsg)
      if (this.showPriMsg) this.userId = res.data.user.userId
      /* 获取收藏的歌手列表 */
      this.getSubArtists()
    },
    /* 获取热门50首 */
    async getTop() {
      const res = await getArtistTop(this.id)
      if (res.code !== 200) return
      this.topList = Object.freeze(res.songs)
      this.isLoading = false
    },
    /* 获取专辑列表 */
    async getAlbum() {
      const res = await getArtistAlbum(this.id)
      if (res.code !== 200) return
      this.albumList = []
      res.hotAlbums.forEach((item) => {
        this.getAlbumDetail(item.id)
      })
    },
    /* 获取专辑信息 */
    async getAlbumDetail(id) {
      const res = await getAlbumDetail(id)
      if (res.code !== 200) return
      this.albumList.push(Object.freeze(res))
    },
    /* 获取歌手详细描述 */
    async getIntroduction() {
      const res = await getIntro(this.id)
      if (res.code !== 200) return
      console.log(res)
      res.introduction.forEach((item) => {
        item.txt = item.txt.split('\n')
      })
      console.log(res.introduction)
      if (res.briefDesc)
        res.introduction.unshift({
          ti: '个人简介',
          txt: [res.briefDesc]
        })
      this.introduction = Object.freeze(res.introduction)
      this.isLoading = false
    },
    /* 获取歌手MV */
    async getMv() {
      const res = await getArtistMv(this.id)
      if (res.code !== 200) return
      res.mvs.forEach((item) => {
        item.cover = item.imgurl
      })
      this.mvList = Object.freeze(res.mvs)
      this.isLoading = false
    },
    /* 获取相似歌手 */
    async getSame() {
      const res = await getArtistSame(this.id)
      if (res.code !== 200) return
      this.sameArtistList = res.artists
      this.isLoading = false
    },
    /* 获取收藏列表 */
    async getSubArtists() {
      if (!this.isLogin) return
      const res = await getSubArtists()
      if (res.code !== 200) return
      this.subList = Object.freeze(res.data)
    },
    async subArtist() {
      if (!this.isLogin) return this.$message.warning('需要登录')
      let cancel = false
      if (this.isSub)
        await this.$confirm('确认取消收藏吗？', '确认信息', {
          distinguishCancelAndClose: true,
          confirmButtonText: '确认',
          cancelButtonText: '放弃'
        })
          .then(() => {
            cancel = false
          })
          .catch((action) => {
            cancel = true
            this.$message({
              type: 'info',
              message: action === 'cancel' ? '取消' : '出错'
            })
          })
      if (cancel) return
      let t = this.isSub ? 0 : 1
      const res = await subArtist(this.id, t)
      console.log(res)
      if (res.code !== 200)
        return this.$message.error(res?.data?.blockText || '操作失败')
      this.$message.success(`${t === 1 ? '收藏' : '取消收藏'}成功`)
      this.getSubArtists()
    },
    toUserDetail() {
      if (this.userId !== 0 && this.showPriMsg)
        this.$router.push('/userdetail/' + this.userId)
    },
    /* tab点击事件回调 */
    handleClick(index) {
      this.tabIndex = index
      if (index === 2) {
        if (this.introduction.length !== 0) return
        console.log('desc')
        this.isLoading = true
        this.getIntroduction()
      } else if (index === 0) {
        console.log('album')
        if (this.albumList.length !== 0) return
        this.isLoading = true
        this.getTop()
        this.getAlbum()
      } else if (index === 1) {
        console.log('mv')
        if (this.mvList.length !== 0) return
        this.isLoading = true
        this.getMv()
      } else if (index === 3) {
        console.log('same')
        if(!this.isLogin) return this.$message.error('需要登录')
        if (this.sameArtistList.length !== 0) return
        this.isLoading = true
        this.getSame()
      }
      
    },
    toArtistDetail(id) {
      if (typeof id === 'number') this.$router.push('/artistdetail/' + id)
    }
  }
}
</script>
<style lang="less" scoped>
.artist-info {
  height: 200px;
  display: flex;
  .img-wrap {
    width: 200px;
    height: 200px;
  }
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
@media screen and (max-width: 415px) {
  .artist-info {
    height: auto;
    flex-direction: column;
    align-items: center;
    .img-wrap {
      width: 100%;
      height: auto;
      display: flex;
      justify-content: center;
    }
    .info {
      margin: auto;
      display: flex;
      flex-wrap: wrap;
      .info-btn {
        display: inline-block;
      }
    }
  }
}
</style>