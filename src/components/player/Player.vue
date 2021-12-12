<template>
  <!--音乐播放器封装 -->
  <div class="player">
    <!-- 歌曲信息 -->
    <div class="player-left">
      <img
        class="pointer img-border"
        :src="imgInfo.imgUrl"
        @click="openPlayView"
      />
      <div class="music-info">
        <div class="font-14 w-150 text-hidden">{{ imgInfo.name }}</div>
        <div class="font-12 w-100 text-hidden">{{ imgInfo.author }}</div>
      </div>
    </div>
    <!-- 播放器 -->
    <div class="player-wrapper">
      <!-- 播放器按钮 -->
      <div class="player-bar">
        <div class="player-bar-btn" @click="changePlayModel">
          <i class="iconfont icon-liebiaoshunxu"></i>
        </div>
        <div class="player-bar-btn" @click="lastMusic">
          <i class="iconfont icon-shangyishou"></i>
        </div>
        <div class="player-bar-btn" @click="pause">
          <i v-show="isPlay" class="iconfont icon-zanting"></i>
          <i v-show="!isPlay" class="iconfont icon-bofang"></i>
        </div>
        <div class="player-bar-btn" @click="nextMusic">
          <i class="iconfont icon-xiayishou"></i>
        </div>
        <div class="player-bar-btn" @click="likeMusic">
          <i v-show="!isLiked" class="iconfont icon-aixin"></i>
          <i
            v-show="isLiked"
            style="color: #ec4141"
            class="iconfont icon-aixin1"
          ></i>
        </div>
      </div>
      <!-- 进度条 -->
      <div class="time-progress">
        <span>{{ currenMusicInfo.currenTime | timeFormat }}</span>
        <el-slider
          v-model="curren"
          class="timeSlider"
          :show-tooltip="false"
          @change="changeCurrenTime"
        ></el-slider>
        <span>{{ (currenMusicInfo.totalTime / 1000) | timeFormat }}</span>
      </div>
    </div>
    <div class="btn-other">
      <!-- 音量按钮 -->
      <div class="dowmload">
        <i
          class="el-icon-download volume-icon mright-20 pointer"
          @click="download"
        ></i>
      </div>
      <div class="volume">
        <div @click="isMute = !isMute">
          <i
            v-if="volume == 0"
            class="iconfont icon-shengyinguanbi volume-icon pointer"
          ></i>
          <i v-else class="iconfont icon-shengyin volume-icon pointer"></i>
        </div>

        <div class="volume-slider">
          <el-slider v-model="volume" vertical height="200px"> </el-slider>
        </div>
      </div>
      <!-- 当前播放列表 -->
      <div class="curren-list">
        <i
          @click="showList"
          class="iconfont icon-liebiaoshunxu volume-icon pointer"
        ></i>
      </div>
    </div>
    <!-- 播放界面 -->
    <el-drawer
      :visible.sync="PlayViewDrawer"
      direction="btt"
      size="100%"
      :before-close="handleClose"
      :show-close="false"
      :modal="false"
    >
      <template #title>
        <div>
          <i
            class="el-icon-arrow-down pointer"
            @click="PlayViewDrawer = false"
          ></i>
        </div>
      </template>
      <div class="play-view">
        <div class="music-info">
          <div class="music-title">{{ imgInfo.name }}</div>
          <div class="music-author">{{ imgInfo.author }}</div>
          <div class="lyric-view">
            <div class="img-wrap">
              <div
                class="changzhen pointer"
                :class="{ 'changzhen-active': isPlay }"
                @click="pause"
              >
                <img src="../../assets/img/changzhen.png" alt="" />
              </div>
              <div class="changpian" :class="{ 'changpian-active': isPlay }">
                <div class="changpian-wrap">
                  <img :src="imgInfo.imgUrl" />
                </div>
              </div>
            </div>
            <div class="lyric-wrap" ref="lyricWrapRef">
              <p
                v-for="(line, index) in lyricObj.lines"
                :class="{ lyric_active: index === lyricObj.curren }"
                :key="index"
              >
                {{ line.txt }}
              </p>
            </div>
          </div>
        </div>
        <div class="comment-view mtop-50">
          <Comment
            :active="true"
            :type="0"
            @closePlayView="PlayViewDrawer = false"
            :id="this.currenMusicId"
            scrollDom=".player .el-drawer__body"
            :scrollOffset="80"
          ></Comment>
        </div>
      </div>
    </el-drawer>
    <audio
      ref="audioRef"
      :src="musicUrl"
      autoplay
      @ended="nextMusic"
      @timeupdate="updateCurrenTime"
    ></audio>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getMusicUrl, getLyric, likeMusic } from '@/api/api_music'
import { downloadMusic } from '@/service/get'
import notifyMixin from '@/mixins/notifyMixin'
import Lyric from '@/utils/lyric'
import Comment from '@/components/comment/Comment.vue'
export default {
  mixins: [notifyMixin],
  components: { Comment },
  data() {
    return {
      musicUrl: '', //音乐资源
      volume: 50, //音量
      saveVolume: 50, //静音前保存的音量
      isMute: false, //是否是静音
      type: 'order', //播放顺序
      imgInfo: {
        //img区域信息，图片，歌名，歌手
        imgUrl: 'https://cdn.jsdelivr.net/gh/crazybox521/blogImg/music.jpg',
        name: '未知歌名',
        author: '未知歌手名'
      },
      curren: 0, //进度条的百分比
      PlayViewDrawer: false,
      lyricObj: {
        lines: [],
        total: 1,
        curren: 0
      }
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
      'isLogin'
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
    /* 通过Vuex管理的播放状态,audio会自动播放 */
    isPlay(val) {
      /* 由于misicUrl第一次是状态改变后获取，所以第一次改变不要进入监听 */
      if (!this.musicUrl) return
      if (val) {
        this.$refs.audioRef.play()
      } else {
        this.$refs.audioRef.pause()
      }
    },
    /* 监听静音状态 */
    isMute(val) {
      if (val) {
        this.saveVolume = this.volume
        this.volume = 0
      } else {
        this.volume = this.saveVolume
      }
    },
    /* 监听音量的改变 */
    volume() {
      this.changeVolume()
    },
    currenMusicId() {
      console.log('播放的歌曲改变了')
      this.getMusicUrl()
      if (this.PlayViewDrawer) {
        document.querySelector('.player .el-drawer__body').scrollTop = 0
      }
    }
  },
  created() {
    this.getHistory()
  },
  methods: {
    /* 获取历史播放 */
    getHistory() {
      if (!window.localStorage.getItem('historylist')) return
      this.$store.commit('setHistoryList', {
        type: 'get',
        data: JSON.parse(window.localStorage.getItem('historylist'))
      })
    },
    /* 更新历史播放 */
    setHistory() {
      this.$store.commit('setHistoryList', {
        type: 'unshift',
        data: this.musicList[this.currenIndex]
      })
    },
    changePlayModel() {
      this.notice()
    },
    /* 暂停 */
    pause() {
      if (this.musicUrl.length === 0) return
      this.$store.commit('setPlayState', !this.isPlay)
    },
    /* 获取音乐地址 */
    async getMusicUrl() {
      this.getImgInfo()
      this.getToltime()
      const res = await getMusicUrl(this.currenMusicId)
      console.log(res)
      if (res.code !== 200) return this.$message.error('播放失败')
      if (!res.data[0].url) {
        const h = this.$createElement
        this.$notify({
          title: '当前歌曲暂无音源',
          message: h(
            'i',
            { style: 'color: teal' },
            '因版权方要求，该资源暂时无法播放，我们正在争取歌曲回归'
          )
        })
        this.musicUrl = ''
        this.$store.commit('setPlayState', false)
        return
      }
      this.getLyric()
      this.musicUrl = res.data[0].url
      console.log(res)
    },
    /* 获取图片信息 */
    getImgInfo() {
      if (this.musicList[this.currenIndex].al.picUrl) {
        this.imgInfo.imgUrl = this.musicList[this.currenIndex].al.picUrl
      } else {
        this.imgInfo.imgUrl =
          'https://cdn.jsdelivr.net/gh/crazybox521/blogImg/music.jpg'
      }
      this.imgInfo.author = this.musicList[this.currenIndex].ar[0].name
      this.imgInfo.name = this.musicList[this.currenIndex].name
      this.setHistory()
    },
    /* 获取歌曲时长 */
    getToltime() {
      this.$store.commit('setTotalTime', this.musicList[this.currenIndex].dt)
    },
    /* 下一首 */
    nextMusic() {
      console.log('下一首')
      if (this.type == 'order') {
        if (this.currenIndex != this.musicList.length - 1) {
          this.$store.commit('setCurrenIndex', this.currenIndex + 1)
          this.$store.commit(
            'setCurrenMusicId',
            this.musicList[this.currenIndex].id
          )
        } else {
          this.$store.commit('setPlayState', false)
          this.$message.error('已经是最后一首了！')
        }
      }
    },
    /* 上一首 */
    lastMusic() {
      console.log('上一首')
      if (this.type == 'order') {
        if (this.currenIndex != 0) {
          this.$store.commit('setCurrenIndex', this.currenIndex - 1)
          this.$store.commit(
            'setCurrenMusicId',
            this.musicList[this.currenIndex].id
          )
        } else {
          this.$store.commit('setPlayState', false)
          this.$message.error('已经是第一首了')
        }
      }
    },
    /* 喜欢音乐 */
    async likeMusic() {
      if (!this.isLogin) return this.$message.error('需要登录')
      if (this.currenMusicId === 0 || typeof this.currenMusicId === 'undefined')
        return
      const res = await likeMusic(this.currenMusicId, !this.isLiked)
      if (res.code !== 200) return
      this.$message.success(`${this.isLiked ? '取消喜欢' : '喜欢'}成功`)
      this.isLiked = this.currenMusicId
    },
    /* 改变音量 */
    changeVolume() {
      this.$refs.audioRef.volume = this.volume / 100
    },
    /* 展示播放列表 */
    showList() {
      this.$store.commit('setDrawerMusicList', true)
    },
    /* 更新当前播放时间 */
    updateCurrenTime() {
      if (!this.$refs.audioRef) return
      /* 通过audio对象的方法获取当前时间 */
      let time = this.$refs.audioRef.currentTime
      /* 歌词滚动 */
      if (
        this.lyricObj.curren != this.lyricObj.total - 1 &&
        time > this.lyricObj.lines[this.lyricObj.curren + 1].time
      ) {
        this.lyricObj.curren++
        if (this.$refs.lyricWrapRef) this.lyricHanlder(this.lyricObj.curren)
      }
      time = Math.floor(time)
      /* 同步进度条 */
      if (time != this.currenMusicInfo.currenTime) {
        this.$store.commit('setCurrenTime', time)
        let percent =
          ((this.currenMusicInfo.currenTime * 1000) /
            this.currenMusicInfo.totalTime) *
          100
        percent = Math.floor(percent)
        this.curren = percent
      }
    },
    /* 拖动进度条的回调，手动改变播放进度 */
    changeCurrenTime(val) {
      console.log(val)
      let time = ((val / 100) * this.currenMusicInfo.totalTime) / 1000
      this.$refs.audioRef.currentTime = time
    },
    /* 下载 */
    download() {
      if (this.musicUrl == '') return
      downloadMusic(
        this.musicUrl,
        `${this.imgInfo.name}-${this.imgInfo.author}`
      )
    },
    /* 打开歌曲播放页 */
    openPlayView() {
      if (this.musicUrl == '') return
      this.PlayViewDrawer = true
      /* 打开后歌词跳到对应行 */
      this.$nextTick(() => {
        document.querySelector('.player .el-drawer__body').scrollTop = 0
        if (this.$refs.lyricWrapRef) {
          if (this.lyricObj.curren <= 4) {
            this.$refs.lyricWrapRef.scrollTop = 0
          } else {
            this.$refs.lyricWrapRef.scrollTop = (this.lyricObj.curren - 4) * 32
          }
        }
      })
    },
    /* 抽屉关闭的回调 */
    handleClose() {
      console.log('close')
      this.PlayViewDrawer = false
    },
    /* 获取歌词 */
    async getLyric() {
      const res = await getLyric(this.currenMusicId)
      if (res.code !== 200) return this.$message.error('获取歌词失败')
      if (res.lrc) this.lyricObj = new Lyric(res.lrc.lyric)
      if (this.PlayViewDrawer) this.$refs.lyricWrapRef.scrollTop = 0
    },
    /* 歌词行数变化的回调 */
    lyricHanlder(lineNum) {
      if (!this.PlayViewDrawer || !this.isPlay) return
      if (lineNum > 4) this.scrollAnimation(lineNum - 4)
    },
    /* 歌词滚动动画 */
    scrollAnimation(line) {
      let start
      const step = (timestamp) => {
        if (start === undefined) start = timestamp
        const elapsed = timestamp - start
        this.$refs.lyricWrapRef.scrollTop = Math.min(
          0.032 * elapsed + (line - 1) * 32,
          line * 32
        )
        if (elapsed < 1000) {
          // 在1秒后停止动画
          window.requestAnimationFrame(step)
        }
      }
      window.requestAnimationFrame(step)
    }
  }
}
</script>

<style lang="less" scoped>
@import '@/assets/less/lessConfig.less';
/* 整体 */
.player {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: space-between;
  align-items: center;
}
/* 播放器左边的信息区 */
.player-left {
  display: flex;
  align-items: center;
  width: 300px;
  img {
    margin: 0 10px;
    height: 50px;
    width: 50px;
    border-radius: 8px;
  }
  &-info {
    margin: 10px;
    line-height: 20px;
    .info-title {
      div {
        display: inline-block;
      }
    }
  }
}
/* 中间的按钮区 */
.player-bar {
  width: 300px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  margin-top: 6px;
  justify-content: space-around;
  &-btn {
    cursor: pointer;
    &:nth-child(3) {
      height: 32px;
      width: 32px;
      border-radius: 50%;
      background-color: #f4f4f4;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    &:nth-child(3):hover {
      background-color: #e5e5e5;
    }
  }
}
/* 时间进度条 */
.time-progress {
  line-height: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
.timeSlider {
  width: 460px;
  margin: 0 10px;
}
/* 右侧按钮 */
.btn-other {
  display: flex;
  width: 300px;
  justify-content: flex-end;
}
/* 音量图标 */
.volume-icon {
  font-size: 30px;
}
.volume {
  position: relative;
  margin-right: 20px;
  .volume-slider {
    display: none;
    position: absolute;
    top: -220px;
    left: -3px;
    background-color: #ffffff;
    padding: 10px 0;
    border-radius: 5px;
    box-shadow: 0 0 10px #bbbbbb;
  }
  &:hover .volume-slider {
    display: block;
  }
}
/* 播放界面抽屉 */
.play-view {
  width: 100%;
  margin: 0 auto;
  padding: 0 20%;
  .music-info {
    margin: 0 auto;
    .music-title {
      text-align: center;
      font-size: 30px;
    }
    .music-author {
      text-align: center;
    }
  }
}
/* 歌词及唱片区域 */
.lyric-view {
  display: flex;
  .img-wrap {
    position: relative;
    .changzhen {
      position: absolute;
      top: -20px;
      left: 130px;
      width: 120px;
      transform-origin: 3px 3px;
      transition: all 0.5s;
      z-index: 20;
      img {
        width: 120px;
      }
    }
    .changpian {
      margin-top: 40px;
      width: 260px;
      height: 260px;
      border-radius: 50%;
      background-color: #c4c3c6;
      display: flex;
      justify-content: center;
      align-items: center;
      .changpian-wrap {
        width: 240px;
        height: 240px;
        background-color: #1a1c1e;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      img {
        width: 180px;
        height: 180px;
        border-radius: 50%;
      }
    }
  }
}
.changzhen-active {
  transform: rotate(30deg);
}
.changpian-active {
  animation: circle 30s infinite linear;
}
/* 歌词滚动区域 */
.lyric-wrap {
  width: 600px;
  height: 400px;
  overflow-y: scroll;
  scrollbar-width: thin;
  margin: 40px 0 0 20px;
  text-align: center;
  font-size: 16px;
  line-height: 2;
  transition: all 0.8s linear;
  &::-webkit-scrollbar {
    width: 1px;
  }
}
.lyric_active {
  font-size: 20px;
  font-weight: bold;
}
@keyframes circle {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@media screen and(max-width:768px) {
  .song-info {
    width: auto;
  }
  .btn-other {
    display: none;
  }
  .time-progress {
    display: none;
  }
  .player-bar {
    margin-top: 0;
    width: 150px;
    &-btn {
      &:nth-child(1) {
        display: none;
      }
    }
  }
  .play-view {
    padding: 0 10px;
  }
  .img-wrap {
    display: none;
  }
  .lyric-wrap {
    width: 100%;
    margin: 20px auto;
  }
  .lyric-active {
    font-size: 17px;
  }
}
</style>