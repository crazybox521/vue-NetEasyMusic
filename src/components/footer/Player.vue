<template>
  <!--音乐播放器封装 -->
  <div class="player">
    <!-- 歌曲信息 -->
    <div class="song-info">
      <img v-if="imgInfo.imgUrl" :src="imgInfo.imgUrl" alt="" />
      <i v-else class="iconfont icon-wangyiyun1"></i>
      <ul class="au-info">
        <li class="font-14">{{ imgInfo.name }}</li>
        <li class="font-12">{{ imgInfo.author }}</li>
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
import { getMusicUrl } from '../../api/api'
export default {
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
      curren: 0
    }
  },
  computed: {
    ...mapState([
      // 映射 this.isPlay 为 store.state.isPlay
      'isPlay',
      'currenMusicId',
      'currenIndex',
      'musicList',
      'currenMusicInfo'
    ])
  },
  watch: {
    isPlay() {
      if (!this.imgUrl) return
      if (this.isPlay) {
        this.$refs.audioRef.play()
      } else {
        this.$refs.audioRef.pause()
      }
    },
    isMute(val) {
      if (val == true) {
        this.saveVolume = this.volume
        this.volume = 0
      } else {
        this.volume = this.saveVolume
      }
    },
    volume() {
      this.changeVolume()
    },
    currenMusicId() {
      console.log('地址改变了')
      this.getMusicUrl()
    }
  },
  methods: {
    changePlayModel() {},
    changeSong() {},
    pause() {
      if (this.musicUrl.length === 0) return
      if (this.isPlay === false) {
        this.$refs.audioRef.play()
      } else {
        this.$refs.audioRef.pause()
      }
      this.$store.commit('setPlayState', !this.isPlay)
    },
    openLyricView() {},
    /* 获取音乐地址 */
    async getMusicUrl() {
      this.getImgInfo()
      this.getToltime()
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
          this.$message.error('已经播放完了！')
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
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../assets/less/lessConfig.less';
.player {
  display: flex;
  margin: 0 auto;
  height: 100%;
  justify-content: space-between;
  align-items: center;
}
.song-info {
  display: flex;
  align-items: center;
  img {
    margin: 0 10px;
    height: 50px;
    width: 50px;
    border-radius: 4px;
  }
  i {
    color: @headRed;
    font-size: 50px;
  }
  .au-info {
    height: 40px;
    margin: 10px;
    line-height: 20px;
  }
}
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
    &:nth-child(3) {
      height: 32px;
      width: 32px;
      border-radius: 50%;
      background-color: #f4f4f4;
      .iconfont{
        margin-left: 9px;
        font-size: 14px;
      }
    }
    &:nth-child(3):hover {
      background-color: #e5e5e5;
    }
  }
}
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
.btn-other {
  display: flex;
  width: 100px;
  justify-content: space-around;
}
/* 音量图标 */
.volume-icon {
  font-size: 30px;
}

.volume {
  position: relative;
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
</style>