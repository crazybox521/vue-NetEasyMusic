<template>
  <div class="personal-fm">
    <div class="playview-wrap mtop-20">
      <div class="playview-left">
        <div class="img-wrap">
          <img class="img img-h" v-lazy="imgInfo.imgUrl" alt="" />
          <div class="play-btn  pointer" @click="pause" :class="{'play-btn_active':isPlay}">
            <i v-show="!isPlay" class="iconfont icon-bofang"></i>
            <i v-show="isPlay" class="iconfont icon-zanting"></i>
          </div>
        </div>
        <div class="btn-wrap mtop-20">
          <button class="pfm-btn" @click="likeMusic">
            <i class="iconfont icon-aixin" v-show="!isLiked"></i
            ><i
              class="iconfont icon-aixin1"
              v-show="isLiked"
              style="color: red"
            ></i>
          </button>
          <el-popconfirm title="确定将当前音乐移到垃圾桶吗？" @confirm="remove">
            <button slot="reference" class="pfm-btn">
              <i class="el-icon-delete"></i>
            </button>
          </el-popconfirm>
          <button class="pfm-btn" @click="nextMusic">
            <i class="iconfont icon-xiayishou"></i>
          </button>
          <button class="pfm-btn"><i class="el-icon-more"></i></button>
        </div>
      </div>
      <div class="playview-right">
        <div class="title">
          <span class="font-24">{{ imgInfo.name }}</span>
        </div>
        <div class="info">
          <div class="font-12">
            专辑：<span
              @click="toAlbumDetail(imgInfo.album.id)"
              class="btn-a pointer"
              >{{ imgInfo.album.name }}</span
            >
          </div>
          <div class="font-12">
            歌手：<span
              @click="toArtistDetail(imgInfo.author.id)"
              class="btn-a pointer"
              >{{ imgInfo.author.name }}</span
            >
          </div>
        </div>
        <LyricWrap
          :currenTime="currenMusicInfo.currenTime"
          :musicId="currenMusicId"
          lyricAlign="left"
          :width="400"
        />
      </div>
    </div>
    <div class="comment-view mtop-60">
      <Comment
        :active="true"
        :type="0"
        :id="currenMusicId"
        scrollDom=".main-right"
        :scrollOffset="10"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import LyricWrap from '@/components/player/LyricWrap'
import Comment from '@/components/comment/Comment.vue'
import { likeMusic } from '@/api/api_music'
export default {
  components: {
    LyricWrap,
    Comment
  },
  data() {
    return {
      imgInfo: {
        //img区域信息，图片，歌名，歌手
        imgUrl: '',
        name: '未知歌名',
        author: {
          name: '未知歌手名',
          id: 0
        },
        album: {
          name: '未知专辑名',
          id: 0
        }
      },
      myList: []
    }
  },
  computed: {
    ...mapState([
      'isPlay',
      'currenMusicId',
      'currenIndex',
      'musicList',
      'currenMusicInfo',
      'historyList',
      'likeIdList',
      'isLogin',
      'playType'
    ]),
    isLiked: {
      get() {
        return this.likeIdList.indexOf(this.currenMusicId) !== -1
      },
      set(val) {
        console.log(this.isLiked)
        if (this.isLiked) {
          this.$store.commit('setLikeIdList', {
            type: 'remove',
            data: val
          })
        } else {
          this.$store.commit('setLikeIdList', {
            type: 'unshift',
            data: val
          })
        }
      }
    }
  },
  watch: {
    currenMusicId: {
      immediate: true,
      handler(val) {
        if (val !== 0 && this.playType === 'personalFm') {
          this.getImgInfo()
        }
      }
    }
  },
  created() {
    console.log(this)
    this.getPersonalFm()
  },
  methods: {
    /* 获取图片信息 */
    getImgInfo() {
      if (this.musicList[this.currenIndex]?.al.picUrl) {
        this.imgInfo.imgUrl = this.musicList[this.currenIndex].al.picUrl
      } else {
        this.imgInfo.imgUrl =
          'https://cdn.jsdelivr.net/gh/crazybox521/blogImg/music.jpg'
      }
      this.imgInfo.author.name = this.musicList[this.currenIndex].ar[0].name
      this.imgInfo.author.id = this.musicList[this.currenIndex].ar[0].id
      this.imgInfo.album.name = this.musicList[this.currenIndex].al.name
      this.imgInfo.album.id = this.musicList[this.currenIndex].al.id
      this.imgInfo.name = this.musicList[this.currenIndex].name
    },
    /* 喜欢音乐 */
    async likeMusic() {
      if (!this.isLogin) return this.$message.warning('需要登录')
      if (this.currenMusicId === 0 || typeof this.currenMusicId === 'undefined')
        return
      const res = await likeMusic(this.currenMusicId, !this.isLiked)
      if (res.code !== 200) return
      this.$message.success(`${this.isLiked ? '取消喜欢' : '喜欢'}成功`)
      this.isLiked = this.currenMusicId
    },
    pause(){
      this.$store.commit('setPlayState', !this.isPlay)
    },
    toAlbumDetail(id) {
      if (id !== 0 && typeof id === 'number') {
        this.$router.push('/albumdetail/' + id)
      }
    },
    toArtistDetail(id) {
      if (id !== 0 && typeof id === 'number') {
        this.$router.push('/artistdetail/' + id)
      }
    },
    getPersonalFm() {
      if (this.playType !== 'personalFm')
        this.$store.dispatch('personalFm', { type: 'get' })
    },
    nextMusic() {
      this.$store.dispatch('personalFm', { type: 'next' })
    },
    remove() {
      this.$store.dispatch('personalFm', {
        type: 'remove',
        id: this.currenMusicId
      })
    }
  }
}
</script>

<style lang="less" scoped>
.personal-fm {
  width: 710px;
  margin: 0 auto;
}
.playview-wrap {
  display: flex;
}
.playview-left {
  margin-top: 120px;
  width: 260px;
  .img-wrap {
    position: relative;
    box-sizing: border-box;
    border: 1px solid #eeeeee;
    height: 260px;
    width: 260px;
    border-radius: 10px;
    .img {
      border-radius: 10px;
    }
    .play-btn {
      position: absolute;
      right: 105px;
      bottom: 105px;
      background-color: #fbf7f6;
      color: #ec4141;
      box-sizing: border-box;
      border: 1px solid #eeeeee;
      width: 50px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: all 0.8s;
      i {
        font-size: 20px;
      }
    }
    .play-btn_active {
      right: 15px;
      bottom: 15px;
    }
  }
  .btn-wrap {
    display: flex;
    justify-content: space-between;
    .pfm-btn {
      outline: none;
      border: 1px solid #e7e7e7;
      background-color: #fff;
      color: #8c8c8c;
      width: 42px;
      height: 42px;
      border-radius: 50%;
      &:hover {
        background-color: #f5f5f5;
      }
      i {
        font-size: 20px;
      }
    }
  }
}
.playview-right {
  margin-left: 30px;
  width: 400px;
  .info {
    margin-top: 10px;
    .btn-a {
      color: #5d86b5;
    }
  }
}
@media screen and (max-width: 415px) {
  .personal-fm {
    width: 100%;
  }
  .playview-wrap {
    display: block;
  }
  .playview-left {
    margin: 0 auto;
  }
  .playview-right {
    margin: 0 auto;
    width: 100%;
    .title {
      display: flex;
      justify-content: center;
    }
    .info {
      display: flex;
      justify-content: space-around;
    }
  }
}
</style>