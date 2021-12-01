<template>
  <div class="comment">
    <!-- 评论区 -->
    <div class="area-wrap">
      <textarea
        class="text-area"
        v-model="value"
        @keyup.enter="sendComment"
      ></textarea>
      <div class="word-num">{{ restNum }}</div>
    </div>
    <div class="btn-wrap mtop-10">
      <div class="at-btn">
        <button class="font-18 no-btn" @click="value += '@'">@</button>
        <button class="font-18 no-btn" @click="addTopic">#</button>
      </div>
      <div class="send-btn">
        <button class="btn btn-white" @click="sendComment">评论</button>
      </div>
    </div>
    <!-- 热门评论 -->
    <div class="hot-wrap mtop-20" v-if="hotList.length !== 0">
      <div class="font-16 font-bold">精彩评论</div>
      <ComentItem
        v-for="item in hotList"
        :key="item.commentId"
        :item="item"
      ></ComentItem>
      <div class="more-btn-wrap mtop-20">
        <button class="btn btn-white">更多精彩评论></button>
      </div>
    </div>
    <!-- 最新评论 -->
    <div ref="newListRef" class="hot-wrap mtop-20" v-if="newList.length !== 0">
      <div class="font-16 font-bold">最新评论</div>
      <ComentItem
        v-for="item in newList"
        :key="item.commentId"
        :item="item"
      ></ComentItem>
      <div class="margin-center w-500" style="margin-top: 10px">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="20"
          layout="prev, pager, next"
          :total="total"
          background
        >
        </el-pagination>
      </div>
    </div>
    <div v-if="total === 0" style="color: #9f9f9f; text-align: center">
      还没有评论，快来抢沙发~
    </div>
  </div>
</template>

<script>
import ComentItem from './CommentItem'
export default {
  components: { ComentItem },
  props: {
    hotList: {
      type: Array,
      required: true,
      default: () => []
    },
    newList: {
      type: Array,
      required: true,
      default: () => []
    },
    total: {
      type: Number,
      required: true,
      default: 0
    }
  },
  data() {
    return {
      value: '',
      currentPage: 1
    }
  },
  computed: {
    restNum() {
      return 140 - this.value.length
    }
  },
  methods: {
    addTopic() {
      this.value += '#输入想说的话题#'
    },
    sendComment() {
      console.log('send')
    },
    toUserDetail(id) {
      this.$router.push('/userdetail/' + id)
    },
    /* 页码变化的回调 */
    handleCurrentChange(val) {
      console.log(val)
      this.currentPage = val
      this.$emit('pagechange', val)
      this.toListTopAnimation()
    },
    /* 点击页码后去最新评论头部的js动画 */
    toListTopAnimation() {
      let start
      const main = document.querySelector('.main-right')
      let max = main.scrollTop
      let size = main.scrollTop - this.$refs.newListRef.offsetTop
      let num = this.$refs.newListRef.offsetTop - 10
      size /= 500
      const step = (timestamp) => {
        if (start === undefined) start = timestamp
        const elapsed = timestamp - start
        /* 防止上滑过头 */
        main.scrollTop = Math.max(max - size * elapsed, num)
        if (elapsed < 500) {
          // 在.5秒后停止动画
          window.requestAnimationFrame(step)
        }
      }
      window.requestAnimationFrame(step)
    }
  }
}
</script>

<style lang="less" scoped>
.area-wrap {
  position: relative;
  .text-area {
    box-sizing: border-box;
    width: 100%;
    height: 60px;
    border: 1px solid #e5e5e5;
    outline: none;
    font-size: 14px;
    border-radius: 4px;
    padding: 4px 10px;
    resize: none;
    word-break: break-all;
    word-wrap: break-word;
  }
  .word-num {
    position: absolute;
    bottom: 4px;
    right: 4px;
    color: #dfcfdf;
  }
}
.btn-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.more-btn-wrap {
  text-align: center;
}
</style>