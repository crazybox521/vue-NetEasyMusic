<template>
  <div class="player">
    <div class="song-info"></div>
    <ul class="player-bar">
      <li @click="changePlayModel">
        <i class="iconfont icon-shunxubofang"></i>
      </li>
      <li @click="changeSong(-1)"><i class="iconfont icon-shangyishou"></i></li>
      <li @click="pause">
        <i v-show="isPlay" class="iconfont icon-zanting"></i>
        <i v-show="!isPlay" class="iconfont icon-bofang"></i>
      </li>
      <li @click="nextMusic()"><i class="iconfont icon-xiayishou"></i></li>
      <li @click="openLyricView">词</li>
    </ul>
    <div class="time-progress">
      <span>{{ currenTime }}</span>
      <el-slider
        v-model="curren"
        class="timeSlider"
        :show-tooltip="false"
      ></el-slider>
      <span>{{ totalTime }}</span>
    </div>
    <div class="volume"></div>
    <audio ref="audioRef" :src="musicUrl" autoplay @ended="nextMusic"></audio>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getMusicUrl } from '../../api/api'
export default {
  data() {
    return {
      curren: 0,
      currenTime: '1:01',
      totalTime: '4:01',
      musicUrl: '',
      type: 'order'
    }
  },
  computed: {
    ...mapState([
      // 映射 this.count 为 store.state.count
      'isPlay',
      'currenMusicId',
      'currenIndex',
      'musicList'
    ])
  },
  watch: {
    isPlay() {
      if (this.isPlay) {
        this.$refs.audioRef.play()
      } else {
        this.$refs.audioRef.pause()
      }
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
      const { data: res } = await getMusicUrl(this.currenMusicId)
      console.log(res)
      if (res.code !== 200) return this.$message.error('播放失败')
      this.musicUrl = res.data[0].url
    },
    /* 下一首 */
    nextMusic() {
      console.log('111')
      if (this.type == 'order') {
        if (this.currenIndex != this.musicList.length - 1) {
          this.$store.commit('setCurrenIndex', this.currenIndex + 1)
          this.$store.commit(
            'setCurrenMusicId',
            this.musicList[this.currenIndex + 1].id
          )
        }else{
            this.$store.commit('setPlayState',false)
            this.$message.error('已经播放完了！')
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.player {
  width: 500px;
}
.player-bar {
  width: 300px;
  margin: 0 auto;
  display: flex;
  line-height: 30px;
  justify-content: space-around;
}
.time-progress {
  line-height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.timeSlider {
  width: 300px;
  margin: 0 10px;
}
</style>