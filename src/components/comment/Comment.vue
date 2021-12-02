<template>
  <div class="comment">
    <!-- 评论区 -->
    <div class="area-wrap" ref="areaWrapRef">
      <textarea
        class="text-area"
        v-model="commentInfo.content"
        @keyup.enter="sendComment"
      ></textarea>
      <div class="word-num">{{ restNum }}</div>
    </div>
    <div class="btn-wrap mtop-10">
      <div class="at-btn">
        <button class="font-18 no-btn" @click="commentInfo.content += '@'">
          @
        </button>
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
        identy="hot"
        @like="handleLike"
        @reply="handleReply"
      ></ComentItem>
      <div class="more-btn-wrap mtop-20">
        <button class="btn btn-white">更多精彩评论></button>
      </div>
    </div>
    <!-- 最新评论 -->
    <div ref="newListRef" class="hot-wrap mtop-20" v-if="newList.length !== 0">
      <div class="font-16 font-bold">最新评论({{newCount}})</div>
      <ComentItem
        v-for="item in newList"
        :key="item.commentId"
        :item="item"
        identy="new"
        @like="handleLike"
        @reply="handleReply"
      ></ComentItem>
      <div class="flex_center" style="margin-top: 10px">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="20"
          layout="prev, pager, next"
          :total="newCount"
          background
        >
        </el-pagination>
      </div>
    </div>
    <div v-if="newCount === 0" style="color: #9f9f9f; text-align: center">
      还没有评论，快来抢沙发~
    </div>
  </div>
</template>

<script>
import ComentItem from './CommentItem'
import {
  getHotComment,
  getNewComment,
  sendComment,
  likeComment
} from '@/api/api_comment'
import { mapState } from 'vuex'
export default {
  components: { ComentItem },
  props: {
    id: {
      type: [Number, String],
      required: true
    },
    type: {
      type: Number,
      required: true
    },
    active: Boolean
  },
  data() {
    return {
      currentPage: 1,
      /* 热评 */
      hotList: [],
      /* 新评 */
      newList: [],
      /* 新评的检索信息 */
      newQuery: {
        id: this.id,
        offset: 0,
        limit: 20,
        before: 0,
        type: this.type
      },
      newCount: 0,
      commentInfo: {
        /* 1评论 2回复 0删除 */
        t: 1,
        type: this.type,
        id: this.id,
        content: '',
        commentId: 0
      },
      replyName: ''
    }
  },
  computed: {
    restNum() {
      return 140 - this.commentInfo.content.length
    },
    ...mapState(['isLogin'])
  },
  watch: {
    active: {
      immediate: true,
      handler(val) {
        if (!val || this.newList.length !== 0) return
        this.getHotComment()
        this.getNewComment()
      }
    },
    'commentInfo.content'(val) {
      if (val == '') {
        this.commentInfo.t = 1
      }
    },
    id(val) {
      /* 监听ID，改变后重新获取数据 */
      console.log('评论的资源ID改变了')
      if (!val) return
      this.hotList = []
      console.log('监听ID', val, this.commentInfo.id)
      this.commentInfo.id = val
      this.newQuery.id = val
      this.getHotComment()
      this.getNewComment()
    }
  },
  methods: {
    addTopic() {
      this.commentInfo.content += '#输入想说的话题#'
    },
    /* 发送评论 */
    async sendComment() {
      if (!this.isLogin) return this.$message.error('需要登录')
      if (this.restNum < 0) return this.$message.error('字数过长')
      if (this.commentInfo.commentId !== 0) {
        this.commentInfo.content = this.commentInfo.content.replace(
          '回复' + this.replyName + ':',
          ''
        )
      }
      console.log('send')
      const { data: res } = await sendComment(this.commentInfo)
      if (res.code !== 200) return
      console.log(res)
      this.commentInfo.content = ''
      this.commentInfo.t = 1
      this.commentInfo.commentId = 0
      this.getNewComment()
    },
    toUserDetail(id) {
      this.$router.push('/userdetail/' + id)
    },
    /* 获取热门评论 */
    async getHotComment() {
      if (this.hotList.length !== 0) return
      const { data: res } = await getHotComment(this.id, this.type, 5)
      if (res.code !== 200) return
      console.log(res.hotComments)
      this.hotList = res.hotComments
    },
    /* 获取最新评论 */
    async getNewComment() {
      const { data: res } = await getNewComment(this.newQuery)
      if (res.code !== 200) return
      console.log(res)
      this.newCount = res.total
      this.newList = res.comments
    },
    /* 点赞的回调 */
    handleLike(info) {
      if (!this.isLogin) return this.$message.error('需要登录')
      console.log(info)
      let obj = { id: this.id, cid: info.cid, t: 1, type: this.type }
      if (info.liked) {
        obj.t = 0
      }
      this.like(obj, info.identy)
    },
    /* 点赞的请求及处理 */
    async like(obj, type) {
      const { data: res } = await likeComment(obj)
      if (res.code !== 200) return
      if (type == 'new') {
        let index = this.newList.findIndex((item) => item.commentId == obj.cid)
        this.newList[index].liked = !this.newList[index].liked
        if (obj.t) {
          this.newList[index].likedCount++
        } else {
          this.newList[index].likedCount--
        }
      } else if (type == 'hot') {
        let index = this.hotList.findIndex((item) => item.commentId == obj.cid)
        this.hotList[index].liked = !this.hotList[index].liked
        if (obj.t) {
          this.hotList[index].likedCount++
        } else {
          this.hotList[index].likedCount--
        }
      }
    },
    /* 回复的回调 */
    handleReply(info) {
      if (!this.isLogin) return this.$message.error('需要登录')
      console.log(info)
      this.replyName = info.name
      this.commentInfo.content = '回复' + info.name + ':'
      this.commentInfo.commentId = info.cid
      this.commentInfo.t = 2
      if (this.type === 0)
        this.toTopAnimation(
          this.$refs.areaWrapRef.offsetTop - 80,
          document.querySelector('.el-drawer__body'),
          600
        )
      else
        this.toTopAnimation(
          this.$refs.areaWrapRef.offsetTop - 10,
          document.querySelector('.main-right'),
          200
        )
    },
    /* 页码变化的回调 */
    handleCurrentChange(val) {
      console.log(val)
      this.currentPage = val
      this.newQuery.offset = (val - 1) * 20
      this.getNewComment()
      if (this.type === 0)
        this.toTopAnimation(
          this.$refs.newListRef.offsetTop - 80,
          document.querySelector('.el-drawer__body'),
          600
        )
      else
        this.toTopAnimation(
          this.$refs.newListRef.offsetTop - 20,
          document.querySelector('.main-right'),
          600
        )
    },
    /* 滚动条由下至上的动画js动画 */
    toTopAnimation(target, scrollDom, ms = 500) {
      let start
      let begin = scrollDom.scrollTop
      let size = (begin - target) / ms
      const step = (timestamp) => {
        if (start === undefined) start = timestamp
        const elapsed = timestamp - start
        /* 防止上滑过头 */
        scrollDom.scrollTop = Math.max(begin - size * elapsed, target)
        if (elapsed < ms) {
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