<template>
<!-- MV列表 -->
  <div class="mv-list">
    <ul>
      <li v-for="nl in list" :key="nl.id">
        <div class="mtop-10 img-wrap">
          <img class="video-img" :src="nl.cover + '?param=300y170'" />
          <div class="video-playcount font-12">
            <i class="iconfont icon-24gl-play"></i>
            {{ nl.playCount | countFormat }}
          </div>
          <div class="play-btn pointer">
            <i class="iconfont icon-bofang"></i>
          </div>
        </div>
        <div class="title-line text-hidden font-14">{{ nl.name }}</div>
        <div class="author-line font-12">
          <span class="mright-5" v-for="at in nl.artists" :key="at.id">{{
            at.name
          }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
    props:['list']
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
      height: 210px;
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
</style>