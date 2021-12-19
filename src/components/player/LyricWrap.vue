<template>
  <div class="lyric-wrap" ref="lyricWrapRef">
    <p
      v-for="(line, index) in lyricObj.lines"
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
    musicId: {
      type: Number,
      required: true
    },
    currenTime: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      lyricObj: {
        lines: [],
        total: 1,
        curren: 0
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
  methods: {
    /* 获取歌词 */
    async getLyric() {
      const res = await getLyric(this.musicId)
      if (res.code !== 200) return this.$message.error('获取歌词失败')
      if (res.lrc) this.lyricObj = new Lyric(res.lrc.lyric)
      this.$refs.lyricWrapRef.scrollTop = 0
    },
    handleCurrenTime(time) {
      /* 歌词滚动 */
      if (
        this.lyricObj.curren != this.lyricObj.total - 1 &&
        time + 0.5 > this.lyricObj.lines[this.lyricObj.curren + 1].time
      ) {
        /* 正常播放或往前拉进度条 */
        this.lyricObj.curren++
        if (time > this.lyricObj.lines[this.lyricObj.curren + 1].time) {
          this.handleCurrenTime(time)
        }
        this.lyricHanlder(this.lyricObj.curren)
      } else if (
        this.lyricObj.curren != 0 &&
        time - 0.5 < this.lyricObj.lines[this.lyricObj.curren - 1].time
      ) {
        /* 往前拉进度条 */
        this.lyricObj.curren--
        if (time - 0.5 < this.lyricObj.lines[this.lyricObj.curren - 1].time) {
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
@media screen and(max-width:768px) {
  .lyric-wrap {
    width: 100%;
    margin: 20px auto;
  }
  .lyric-active {
    font-size: 17px;
  }
}
</style>