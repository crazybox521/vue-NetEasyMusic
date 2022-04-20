<template>
  <!-- MV列表 -->
  <div class="mv-list">
    <ul v-infinite-scroll="load" :infinite-scroll-disabled="disabled">
      <li v-for="(nl, index) in list" :key="index">
        <div class="mtop-10 img-wrap" @click="toMvDetail(nl.id)">
          <el-image
              style="width: 100%; height: auto"
              :src="nl.cover + '?param=320y180'"
              lazy
            >
              <template v-slot:placeholder>
                <img src="@/assets/img/loading-2.gif" alt="" />
              </template>
            </el-image>
          <!-- <img
            class="video-img img-border"
            :src="nl.cover + '?param=300y170'"
          /> -->
          <div class="video-playcount font-12">
            <i class="iconfont icon-24gl-play"></i>
            {{ nl.playCount | countFormat }}
          </div>
          <div class="play-btn pointer">
            <i class="iconfont icon-bofang"></i>
          </div>
        </div>
        <div
          class="title-line text-hidden font-14 pointer"
          @click="toMvDetail(nl.id)"
        >
          {{ nl.name }}
        </div>
        <div class="author-line font-12">
          <span
            class="mright-5"
            v-for="(at, index) in nl.artists"
            :key="index"
            >{{ at.name }}</span
          >
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    list: Array,
    disabled: {
      type: Boolean,
      default: true
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
    toMvDetail(id) {
      this.$router.push('/videodetail/mv/' + id)
    }
  }
}
</script>

<style lang="less" scoped>
.mv-list {
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
        color: #676767;
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
@media screen and (max-width: 415px) {
  .mv-list {
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
</style>