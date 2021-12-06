<template>
  <!-- 所有以以图片及描述信息为主要内容的列表通用组件 -->
  <div class="img-list">
    <ul
      class="img-list-ul"
      v-infinite-scroll="load"
      :infinite-scroll-disabled="disabled"
      infinite-scroll-delay="300"
    >
      <li class="img-item-li" v-for="item in list" :key="item.id">
        <div class="img-wrap pointer" @click="clickImg(item.id)">
          <img class="img img-radius-8 img-border" :src="picUrl(item)" />
          <div class="video-playcount font-12" v-if="item.playCount">
            <i class="iconfont icon-24gl-play"></i>
            {{ item.playCount | countFormat }}
          </div>
          <div v-if="showPlayBtn" class="play-btn pointer">
            <i class="iconfont icon-bofang"></i>
          </div>
        </div>
        <slot :item="item"></slot>
      </li>
    </ul>
    <div class="loding-wrap" v-show="isLoading">
      <i class="el-icon-loading"></i>加载中
    </div>
    <div class="loading-wrap" v-if="noMore">没有更多了</div>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      required: true,
      default: () => []
    },
    hasMore: {
      type: Boolean,
      default: false
    },
    infinite: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      required: true
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    /* 无限滚动禁用 */
    disabled() {
      return !this.infinite || !this.hasMore || this.isLoading
    },
    showPlayBtn() {
      return this.type === 'playlist' || this.type === 'album'
    },
    noMore() {
      return this.infinite && !this.hasMore
    }
  },
  methods: {
    /* 点击图片的回调 */
    clickImg(id) {
      this.$emit('clickImg', id)
    },
    picUrl(item) {
      if (this.type === 'playlist')
        return `${item.picUrl ? item.picUrl : item.coverImgUrl}?param=300y300`
      else if (this.type === 'artist') {
        return `${item.img1v1Url}?param=300y300`
      } else if (this.type === 'album') {
        return `${item.picUrl}?param=300y300`
      }
    },
    load() {
      if (this.hasMore) this.$emit('loadMore', this.list.length)
    }
  }
}
</script>

<style lang="less" scoped>
.img-list-ul {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  .img-item-li {
    margin-bottom: 30px;
    width: 18%;
    margin-right: 2%;
  }
}
.img-wrap {
  position: relative;
  .video-playcount {
    color: #ffffff;
    position: absolute;
    right: 10px;
    top: 10px;
    text-shadow: 0 0 2px #000;
    .iconfont {
      font-size: 12px;
    }
  }
  .play-btn {
    position: absolute;
    right: 15px;
    bottom: 15px;
    background-color: #fbf7f6;
    color: #ec4141;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    opacity: 0;
    transition: all 0.8s;
    i {
      font-size: 18px;
    }
  }
  &:hover .play-btn {
    opacity: 1;
  }
}
.loading-wrap {
  font-size: 18px;
  height: 50px;
  text-align: center;
}

@media screen and(max-width:415px) {
  .img-wrap {
    .video-playcount {
      display: none;
    }
    .play-btn {
      width: 24px;
      height: 24px;
      right: 5px;
      bottom: 8px;
      opacity: 1;
      i {
        font-size: 12px;
      }
    }
  }
  .img-list-ul {
    .img-item-li {
      margin-bottom: 30px;
      width: 32%;
      margin-right: 2%;
      &:nth-child(3n) {
        margin-right: 0;
      }
    }
  }
}
</style>