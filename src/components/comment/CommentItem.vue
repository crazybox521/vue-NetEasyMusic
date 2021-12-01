<template>
  <div class="comment-item">
    <div class="comment_main">
      <div class="img-wrap">
        <img
          class="img circle pointer"
          :src="item.user.avatarUrl"
          @click="toUserDetail(item.user.userId)"
        />
      </div>
      <div class="comment-wrap mleft-10">
        <div class="comment-content">
          <span
            class="font-12 pointer"
            @click="toUserDetail(item.user.userId)"
            style="color: #507daf"
            >{{ item.user.nickname }}：</span
          >
          <span class="font-12">{{ item.content }}</span>
        </div>
        <div class="reply-content" v-if="item.beReplied.length !== 0">
          <span
            class="font-12 pointer"
            style="margin-left: 5px; color: #507daf"
            @click="toUserDetail(item.beReplied[0].user.userId)"
          >
            @{{ item.beReplied[0].user.nickname }}：</span
          >
          <span class="font-12">{{ item.beReplied[0].content }}</span>
        </div>
        <div class="comment-info">
          <div class="time font-12" style="color: #9f9f9f">
            {{ item.timeStr }}
          </div>
          <!-- 点赞评论按钮 -->
          <div class="comment-btn">
            <button class="no-btn" @click="like(item.commentId, item.liked)">
              <i
                class="iconfont icon-good"
                :class="{ isliked: item.liked }"
              ></i>
              <span> {{ item.likedCount }}</span>
            </button>
            <div class="div-column"></div>
            <button class="no-btn">
              <i class="iconfont icon-fenxiang"></i>
            </button>
            <div class="div-column"></div>
            <button
              class="no-btn"
              @click="reply(item.commentId, item.user.nickname)"
            >
              <i class="iconfont icon-pinglun"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="div-line"></div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true
    },
    identy:String
  },
  methods: {
    toUserDetail(id) {
      this.$router.push('/userdetail/' + id)
    },
    like(cid, liked) {
      this.$emit('like', { cid, liked,identy:this.identy })
    },
    reply(cid, name) {
      this.$emit('reply', { cid, name })
    }
  }
}
</script>

<style lang="less" scoped>
.comment_main {
  display: flex;
  align-items: center;
  margin: 10px 0;
  .img-wrap {
    height: 40px;
    width: 40px;
  }
  .comment-wrap {
    line-height: 30px;
    flex: 1;
    .comment-info {
      display: flex;
      justify-content: space-between;
    }
    .reply-content {
      background-color: #f4f4f4;
      border-radius: 6px;
    }
  }
}

.div-column {
  display: inline-block;
  width: 1px;
  height: 14px;
  background-color: #dfcfe7;
}
.isliked {
  color: red;
}
</style>