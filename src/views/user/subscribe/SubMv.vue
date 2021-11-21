<template>
<!-- 收藏的MV -->
  <div class="sub-mv">
    <div class="submv-head">
      <div>
        <span class="font-bold">收藏的视频</span
        ><span class="font-12" style="color: #cfcfcf">({{ count }})</span>
      </div>
      <div class="detail-search">
        <el-input
          placeholder="搜索我收藏的视频"
          clearable
          suffix-icon="el-icon-search"
          v-model="key"
        ></el-input>
      </div>
    </div>
    <!-- 视频列表 -->
    <div class="video-list mtop-10">
      <ul>
        <li v-for="(v, index) in subMvList" :key="index" class="mtop-10">
          <div class="mtop-10 img-wrap">
            <img
              class="video-img"
              :src="v.coverUrl + '?param=300y170'"
              @click="toMvDetail(v.vid)"
            />
            <div class="video-playcount font-12">
              <i class="iconfont icon-24gl-play"></i>
              {{ v.playTime | countFormat }}
            </div>
            <div class="video-time font-12">
              {{ (v.durationms / 1000) | timeFormat }}
            </div>
            <div class="play-btn pointer" @click="toMvDetail(v.vid)">
              <i class="iconfont icon-bofang"></i>
            </div>
          </div>
          <div class="title-line text-hidden font-14">{{ v.title }}</div>
          <div class="author-line font-12">
            <span v-for="(ct, index) in v.creator" :key="index"
              >{{ ct.name }}
            </span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { getSubMv } from '../../../api/api'
export default {
  data() {
    return {
      key: '',
      list: [],
      count: 0
    }
  },
  computed: {
    subMvList() {
      return this.list.filter((item) => item.title.match(this.key))
    }
  },
  created() {
    this.getSubMv()
  },
  methods: {
    async getSubMv() {
      const { data: res } = await getSubMv()
      if (res.code !== 200) return
      this.list = res.data
      this.count = res.count
    },
    toMvDetail(id) {
      if (typeof id !== 'undefined') this.$router.push('mvdetail/' + id)
    }
  }
}
</script>

<style lang="less" scoped>
.submv-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
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