<template>
  <div class="comment">
    <!-- 评论区 -->
    <div class="area-wrap">
      <textarea class="text-area" v-model="value" @keyup.enter="sendComment"></textarea>
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
    <div class="hot-wrap">

    </div>
  </div>
</template>

<script>
import {} from '@/api/api'
export default {
  props: {
    id: {
      type: [Number, String],
      required: true
    },
    type: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      value: ''
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
    sendComment(){
      console.log('send');
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
</style>