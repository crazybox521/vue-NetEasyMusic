<template>
  <!-- 歌单列表 -->
  <ul class="song-sheet-list">
    <li
      class="song-sheet-item"
      v-for="(item, index) in playlist"
      :key="item.id + '' + index"
      @click="toPlayListDetail(item.id)"
    >
      <div class="img-wrap pointer">
        <img
          class="img img-radius-8 img-outline"
          :src="
            item.picUrl
              ? item.picUrl + '?param=300y300'
              : item.coverImgUrl + '?param=300y300'
          "
        />
        <div class="video-playcount font-12">
          <i class="iconfont icon-24gl-play"></i>
          {{ item.playCount | countFormat }}
        </div>
        <div class="play-btn pointer">
          <i class="iconfont icon-bofang"></i>
        </div>
      </div>
      <div class="text-hidden">
        {{ item.name }}
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  props: ['playlist'],
  methods: {
    // 跳转到歌单详情页
    toPlayListDetail(id) {
      this.$router.push({ path: '/playlistdetail/' + id })
    }
  }
}
</script>

<style lang="less" scoped>
.song-sheet-list {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  .song-sheet-item {
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
@media screen and(max-width:415px) {
  .img-wrap {
    .video-playcount {
      display: none;
    }
  }
  .song-sheet-list {
    .song-sheet-item {
      margin-bottom: 30px;
      width: 32%;
      margin-right: 2%;
      &:nth-child(3n){
        margin-right: 0;
      }
    }
  }
}
</style>