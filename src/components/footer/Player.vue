<template>
  <!--音乐播放器封装 -->
  <div class="player">
    <!-- 歌曲信息 -->
    <div class="song-info">
      <img
        class="pointer"
        v-if="imgInfo.imgUrl"
        :src="imgInfo.imgUrl"
        @click="openPlayView"
      />
      <i v-else class="iconfont icon-wangyiyun1" @click="openPlayView"></i>
      <ul class="au-info">
        <li class="font-14 w-200 text-hidden">{{ imgInfo.name }}</li>
        <li class="font-12 w-200 text-hidden">{{ imgInfo.author }}</li>
      </ul>
    </div>
    <!-- 播放器 -->
    <div class="player-wrapper">
      <!-- 播放器按钮 -->
      <ul class="player-bar">
        <li @click="changePlayModel">
          <i class="iconfont icon-shunxubofang"></i>
        </li>
        <li @click="lastMusic">
          <i class="iconfont icon-shangyishou"></i>
        </li>
        <li @click="pause">
          <i v-show="isPlay" class="iconfont icon-zanting"></i>
          <i v-show="!isPlay" class="iconfont icon-bofang"></i>
        </li>
        <li @click="nextMusic"><i class="iconfont icon-xiayishou"></i></li>
        <li @click="openLyricView">词</li>
      </ul>
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
        <i class="el-icon-download volume-icon mright-20" @click="download"></i>
      </div>
      <div class="volume">
        <div @click="isMute = !isMute">
          <i
            v-if="volume == 0"
            class="iconfont icon-shengyinguanbi volume-icon"
          ></i>
          <i v-else class="iconfont icon-shengyin volume-icon"></i>
        </div>

        <div class="volume-slider">
          <el-slider v-model="volume" vertical height="200px"> </el-slider>
        </div>
      </div>
      <!-- 当前播放列表 -->
      <div class="curren-list">
        <i
          @click="showList"
          class="iconfont icon-liebiaoshunxu volume-icon"
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
          <div class="music-title">{{imgInfo.name}}</div>
          <div class="music-author">{{imgInfo.author}}</div>
          <div class="lyric-view">
            <div class="img-wrap">
              <div class="changzhen">
                <img src="../../assets/img/changzhen.png" alt="" />
              </div>
              <div class="changpian">
                <div class="changpian-wrap">
                  <img :src="imgInfo.imgUrl" />
                </div>
              </div>
            </div>
            <div class="lyric-wrap">
              <p>1111111</p>
              <p>1111111</p>
              <p>1111111</p>
              <p class="lyric-active">2222222</p>
              <p>3333333</p>
              <p>3333333</p>
              <p>3333333</p>
              <p>3333333</p>
            </div>
          </div>
        </div>
        <div class="comment-view"></div>
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
import { getMusicUrl, downloadMusic,getLyric } from '../../api/api'
import notifyMixin from '../../mixins/notifyMixin'
export default {
  mixins: [notifyMixin],
  data() {
    return {
      musicUrl: '', //音乐资源
      volume: 88, //音量
      saveVolume: 88, //静音前保存的音量
      isMute: false, //是否是静音
      type: 'order', //播放顺序
      imgInfo: {
        //img区域信息，图片，歌名，歌手
        imgUrl: '',
        name: '未知歌名',
        author: '未知歌手名'
      },
      curren: 0, //进度条的百分比
      PlayViewDrawer: true,
      lyric:''
    }
  },
  computed: {
    ...mapState([
      'isPlay',
      'currenMusicId',
      'currenIndex',
      'musicList',
      'currenMusicInfo'
    ])
  },
  watch: {
    /* 通过Vuex管理的播放状态,audio会自动播放 */
    isPlay() {
      /* 由于misicUrl第一次是状态改变后获取，所以第一次改变不要进入监听 */
      if (!this.musicUrl) return
      if (this.isPlay) {
        this.$refs.audioRef.play()
      } else {
        this.$refs.audioRef.pause()
      }
    },
    /* 监听静音状态 */
    isMute(val) {
      if (val == true) {
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
    }
  },
  methods: {
    changePlayModel() {
      this.notice()
    },
    /* 暂停 */
    pause() {
      if (this.musicUrl.length === 0) return
      if (this.isPlay === false) {
        this.$refs.audioRef.play()
      } else {
        this.$refs.audioRef.pause()
      }
      this.$store.commit('setPlayState', !this.isPlay)
    },
    openLyricView() {
      this.notice()
    },
    /* 获取音乐地址 */
    async getMusicUrl() {
      this.getImgInfo()
      this.getToltime()
      this.getLyric()
      const { data: res } = await getMusicUrl(this.currenMusicId)
      console.log(res)
      if (res.code !== 200) return this.$message.error('播放失败')
      this.musicUrl = res.data[0].url
    },
    /* 获取图片信息 */
    getImgInfo() {
      this.imgInfo.imgUrl = this.musicList[this.currenIndex].al.picUrl
      this.imgInfo.name = this.musicList[this.currenIndex].name
      this.imgInfo.author = this.musicList[this.currenIndex].ar[0].name
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
      time = Math.floor(time)
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
        this.imgInfo.name + '-' + this.imgInfo.author
      )
    },
    openPlayView() {
      this.PlayViewDrawer = true
      this.getLyric()
    },
    handleClose() {
      console.log('close')
      this.PlayViewDrawer = false
      
    },
    async getLyric(){
      const {data:res} =await getLyric(this.currenMusicId)
      if(res.code!==200) return this.$message.error('获取歌词失败')
      if(res.lrc)
      this.lyric =res.lrc.lyric
      console.log(this.lyric);
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../assets/less/lessConfig.less';
/* 整体 */
.player {
  display: flex;
  margin: 0 auto;
  height: 100%;
  justify-content: space-between;
  align-items: center;
}
/* 播放信息 */
.song-info {
  display: flex;
  align-items: center;
  width: 300px;
  img {
    margin: 0 10px;
    height: 50px;
    width: 50px;
    border-radius: 4px;
  }
  i {
    color: @headRed;
    font-size: 50px;
    margin: 0 10px;
    height: 50px;
    width: 50px;
    border-radius: 4px;
  }
  .au-info {
    height: 40px;
    margin: 10px;
    line-height: 20px;
  }
}
/* 中间的按钮区 */
.player-bar {
  width: 300px;
  margin: 0 auto;
  display: flex;
  line-height: 1;
  margin-top: 6px;
  justify-content: space-around;
  .iconfont {
    font-size: 18px;
  }
  li {
    font-size: 14px;
    line-height: 32px;
    cursor: pointer;
    &:nth-child(3) {
      height: 32px;
      width: 32px;
      border-radius: 50%;
      background-color: #f4f4f4;
      text-align: center;
      .iconfont {
        font-size: 14px;
      }
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
      transform: rotate(30deg);
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
      animation: circle 30s infinite;
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
.lyric-wrap{
  width: 600px;
  height: 400px;
  margin: 40px 0 0 20px;
  background-color: #bfc;
  text-align: center;
  font-size: 20px;
  line-height: 2;
}
.lyric-active{
  font-size: 24px;
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
    width: 100px;
  }
  .btn-other {
    display: none;
  }
  .time-progress {
    display: none;
  }
  .player-bar {
    width: auto;
    li {
      &:nth-child(1) {
        display: none;
      }
      &:nth-child(5) {
        display: none;
      }
    }
  }
}
</style>