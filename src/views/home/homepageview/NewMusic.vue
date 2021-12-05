<template>
  <div class="new-music mtop-60">
    <div class="new-music-head">
      <div class="head-btn-wrap">
        <button
          class="btn-newmusic"
          :class="{ 'btn-newmusic_active': dIndex === 0 }"
          @click="changeCompo(0)"
        >
          新歌速递
        </button>
        <button
          class="btn-newmusic"
          :class="{ 'btn-newmusic_active': dIndex === 1 }"
          @click="changeCompo(1)"
        >
          新碟上架
        </button>
      </div>
    </div>
    <div class="new-music-view mtop-20">
      <component :is="compo"></component>
    </div>
  </div>
</template>

<script>
import NewSong from './newmusic/NewSong.vue'
import NewAlbum from './newmusic/NewAlbum.vue'
export default {
  components: { NewSong, NewAlbum },
  data() {
    return {
      dyCompo: ['NewSong', 'NewAlbum'],
      dIndex: 0
    }
  },
  computed: {
    compo() {
      return this.dyCompo[this.dIndex]
    }
  },
  methods: {
    changeCompo(index) {
      this.dIndex = index
    }
  }
}
</script>

<style lang="less" scoped>
/* 头部切换按钮 */
.new-music-head {
  display: flex;
  justify-content: center;
  align-items: center;
  .head-btn-wrap {
    width: 202px;
    height: 32px;
    border: 1px solid #bbbbbb;
    border-radius: 16px;
    .btn-newmusic {
      width: 100px;
      height: 30px;
      outline: 0;
      border: 0;
      border-radius: 15px;
      box-sizing: border-box;
      color: #373737;
      background-color: #fff;
      transition: all .5s;
      &:hover {
        background-color: #f4f4f4;
      }
    }
    .btn-newmusic_active {
      background-color: #bbbbbb;
      color: #fff;
      &:hover {
        background-color: #bbbbbb;
      }
    }
  }
}
</style>