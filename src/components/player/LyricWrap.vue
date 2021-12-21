<template>
  <div class="lyric-wrap" ref="lyricWrapRef" :style="styleObj">
    <p
      v-for="(line, index) in lyricObj.lines"
      class="text-hidden"
      :class="{ lyric_active: index === lyricObj.curren }"
      :key="index"
    >
      {{ line.txt }}
    </p>
  </div>
</template>

<script>
import Lyric from '@/utils/lyric'
import { getLyric } from '@/api/api_music'
export default {
  props: {
    /* 歌曲ID */
    musicId: {
      type: Number,
      required: true
    },
    /* 当前时间 */
    currenTime: {
      type: Number,
      required: true
    },
    lyricAlign: {
      type: String,
      default: 'center'
    },
    width: {
      type: Number,
      default: 600
    }
  },
  data() {
    return {
      lyricObj: {
        lines: [],
        total: 1,
        curren: 0
      },
      styleObj: {
        'text-align': 'center',
        width: '600px'
      }
    }
  },
  watch: {
    musicId: {
      immediate: true,
      handler(val) {
        if (val) {
          this.getLyric()
        }
      }
    },
    currenTime(val) {
      if (val) this.handleCurrenTime(val)
    }
  },
  created() {
    this.handleTextAlign(this.lyricAlign)
    this.handleWidth(this.width)
  },
  methods: {
    /* 获取歌词 */
    async getLyric() {
      const res = await getLyric(this.musicId)
      if (res.code !== 200) return this.$message.error('获取歌词失败')
      if (res.lrc) this.lyricObj = new Lyric(res.lrc.lyric)
      this.$nextTick(() => {
        this.$refs.lyricWrapRef.scrollTop = 0
      })
    },
    handleCurrenTime(time) {
      /* 歌词滚动 */
      if (
        this.lyricObj.curren !== this.lyricObj.total - 1 &&
        time + 0.5 > this.lyricObj.lines[this.lyricObj.curren + 1].time
      ) {
        /* 正常播放或往前拉进度条 */
        this.lyricObj.curren++
        /* 在拉进度的时候，time只改变了一次，但需要定位到歌词进度对应的行 */
        if (
          this.lyricObj.curren !== this.lyricObj.total - 1 &&
          time + 0.5 > this.lyricObj.lines[this.lyricObj.curren + 1].time
        ) {
          this.handleCurrenTime(time)
        }
        this.lyricHanlder(this.lyricObj.curren)
      } else if (
        this.lyricObj.curren != 0 &&
        time - 0.5 < this.lyricObj.lines[this.lyricObj.curren - 1].time
      ) {
        /* 往前拉进度条 */
        this.lyricObj.curren--
        if (
          this.lyricObj.curren != 0 &&
          time - 0.5 < this.lyricObj.lines[this.lyricObj.curren - 1].time
        ) {
          this.handleCurrenTime(time)
        }
        this.lyricHanlder(this.lyricObj.curren)
      }
    },
    /* 歌词行数变化的回调 */
    lyricHanlder(lineNum) {
      if (lineNum > 4) this.scrollAnimation(lineNum - 4)
    },
    /* 歌词滚动动画 */
    scrollAnimation(line) {
      let start
      const step = (timestamp) => {
        if (start === undefined) start = timestamp
        const elapsed = timestamp - start
        this.$refs.lyricWrapRef.scrollTop = Math.min(
          0.04 * elapsed + (line - 1) * 40,
          line * 40
        )
        if (elapsed < 1000) {
          // 在1秒后停止动画
          window.requestAnimationFrame(step)
        }
      }
      window.requestAnimationFrame(step)
    },
    handleTextAlign(align) {
      if (align === 'center' || align === 'left' || align === 'right')
        this.styleObj['text-align'] = align
    },
    handleWidth(width) {
      if (width < 1200) {
        this.styleObj.width = width + 'px'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.lyric-wrap {
  width: 600px;
  height: 400px;
  overflow-y: scroll;
  scrollbar-width: thin;
  margin: 40px 0 0 20px;
  color: #666666;
  font-size: 14px;
  line-height: 40px;
  transition: all 0.8s linear;
  &::-webkit-scrollbar {
    width: 1px;
  }
  p {
    height: 40px;
  }
}
.lyric_active {
  font-weight: bold;
  color: #000;
}
@media screen and(max-width:768px) {
  .lyric-wrap {
    width: 100%;
    margin: 20px auto;
    font-size: 13px;
    p {
      height: 40px;
    }
  }
}
</style>