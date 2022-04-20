<template>
  <!-- 视频列表组件 -->
  <div class="video-list mtop-10">
    <ul v-infinite-scroll="load" :infinite-scroll-disabled="disabled">
      <li v-for="(v, index) in list" :key="index" class="mtop-10">
        <template v-if="v.type === 1">
          <div class="mtop-10 img-wrap" @click="toVideoDetail(v.data.vid)">
            <el-image
              style="width: 100%; height: auto"
              :src="v.data.coverUrl + '?param=320y180'"
            >
              <template v-slot:placeholder>
                <img src="@/assets/img/loading-2.gif" alt="" />
              </template>
            </el-image>
            <!--  <img
              class="video-img pointer img-border"
              :src="v.data.coverUrl + '?param=300y170'"
            /> -->
            <div class="video-playcount font-12">
              <i class="iconfont icon-24gl-play"></i>
              {{ v.data.playTime | countFormat }}
            </div>
            <div class="video-time font-12">
              {{ (v.data.durationms / 1000) | timeFormat }}
            </div>
            <div class="play-btn pointer">
              <i class="iconfont icon-bofang"></i>
            </div>
          </div>
          <div class="title-line text-hidden font-14 pointer">
            {{ v.data.title }}
          </div>
          <div class="author-line font-12 pointer">
            by {{ v.data.creator.nickname }}
          </div>
        </template>
        <template v-else>
          <!-- 视频列表中的MV标签下视频 -->
          <div class="mtop-10 img-wrap" @click="toMvDetail(v.data.id)">
            <el-image
              style="width: 100%; height: auto"
              :src="v.data.coverUrl + '?param=320y180'"
            >
              <template v-slot:placeholder>
                <img src="@/assets/img/loading-2.gif" alt="" />
              </template>
            </el-image>
            <!-- <img class="video-img" :src="v.data.coverUrl + '?param=300y170'" /> -->
            <div class="video-playcount font-12">
              <i class="iconfont icon-24gl-play"></i>
              {{ v.data.playCount | countFormat }}
            </div>
            <div class="video-time font-12">
              {{ (v.data.duration / 1000) | timeFormat }}
            </div>
            <div class="play-btn pointer">
              <i class="iconfont icon-bofang"></i>
            </div>
          </div>
          <div class="title-line text-hidden font-14">{{ v.data.name }}</div>
          <div class="author-line font-12">
            {{ v.data.artists[0].name }}
          </div>
        </template>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      required: true
    },
    disabled: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  watch: {
    'list.length'(val) {
      if (val === 8) {
        this.$emit('loadMore', this.list.length)
      }
    }
  },
  methods: {
    load() {
      this.$emit('loadMore', this.list.length)
    },
    toVideoDetail(id) {
      if (typeof id !== 'undefined') this.$router.push('/videodetail/v/' + id)
    },
    toMvDetail(id) {
      if (typeof id !== 'undefined') this.$router.push('/videodetail/mv/' + id)
    }
  }
}
</script>

<style lang="less" scoped>
.video-list {
  ul {
    display: flex;
    flex-wrap: wrap;
    li {
      width: 22%;
      margin-right: 3%;
      .title-line {
        margin: 4px 0;
      }
      .author-line {
        margin: 2px 0;
        color: #cfcfcf;
      }
    }
  }
}
@media screen and (max-width: 415px) {
  .video-list {
    ul {
      li {
        width: 48%;
        margin-right: 4%;
        &:nth-child(2n) {
          margin-right: 0;
        }
      }
    }
  }
}
.img-wrap {
  position: relative;
  .video-img {
    width: 100%;
    border-radius: 4px;
  }
  .video-playcount {
    color: #ffffff;
    position: absolute;
    right: 10px;
    top: 10px;
    .iconfont {
      font-size: 12px;
    }
  }
  .video-time {
    color: #ffffff;
    position: absolute;
    right: 10px;
    bottom: 10px;
  }
  .play-btn {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fbf7f6;
    color: #ec4141;
    width: 40px;
    height: 40px;
    line-height: 40px;
    text-align: center;
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
</style>