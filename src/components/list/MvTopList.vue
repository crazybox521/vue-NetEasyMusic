<template>
  <!-- mv排行榜列表组件 -->
  <div class="mv-top-list">
    <ul>
      <li v-for="(item, index) in list" :key="item.id">
        <div class="top-index font-24 mleft-10">
          {{ (index + 1) | mvTopFormat }}
        </div>
        <div class="mtop-10 img-wrap">
          <img
            class="video-img img-border"
            :src="item.cover + '?param=300y170'"
            @click="toDetail(item.id)"
          />
          <div class="video-playcount font-12">
            <i class="iconfont icon-24gl-play"></i>
            {{ item.playCount | countFormat }}
          </div>
          <div class="play-btn pointer" @click="toDetail(item.id)">
            <i class="iconfont icon-bofang"></i>
          </div>
        </div>
        <div class="top-info mleft-10">
          <div
            class="title-line text-hidden pointer font-14"
            @click="toDetail(item.id)"
          >
            {{ item.name }}
          </div>
          <div class="author-line font-12">
            <span class="mright-5" v-for="at in item.artists" :key="at.id">{{
              at.name
            }}</span>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: ['list'],
  methods: {
    toDetail(id) {
      this.$router.push('/mvdetail/' + id)
    }
  }
}
</script>

<style lang="less" scoped>
.mv-top-list {
  ul {
    display: flex;
    flex-wrap: wrap;
    li {
      display: flex;
      align-items: center;
      width: 49%;
      height: 180px;
      /* 奇数 */
      &:nth-child(odd) {
        border-bottom: 1px solid #f2f2f2;
        border-right: 1px solid #f2f2f2;
      }
      /* 偶数 */
      &:nth-child(even) {
        border-bottom: 1px solid #f2f2f2;
      }
    }
  }
}
/* 序号 */
.top-index {
  width: 50px;
  color: #9f9f9f;
}
/* 图片区域 */
.img-wrap {
  position: relative;
  min-width: 200px;
  transition: all 0.5s;
  .video-img {
    height: 120px;
    width: 200px;
    border-radius: 4px;
    transition: all 0.5s;
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
/* mv标题 */
.top-info {
  width: 200px;
  transition: all 0.5s;
  .title-line {
    margin: 4px 0;
  }
  .author-line {
    margin: 2px 0;
    color: #676767;
  }
}
@media screen and (max-width: 1200px) {
  .top-info {
    width: 100px;
  }
  .img-wrap {
    min-width: 100px;
    .video-img {
      width: 100px;
      height: 80px;
    }
  }
}
</style>