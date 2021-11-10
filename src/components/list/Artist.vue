<template>
  <div class="artist">
    <ul
      class="song-sheet-list"
      v-infinite-scroll="load"
      nfinite-scroll-disabled="disabled"
      infinite-scroll-delay="300"
    >
      <li
        class="song-sheet-item"
        v-for="(item, index) in list"
        :key="item.id + '' + index"
        @click="toArtistView(item.id)"
      >
        <el-image
          lazy
          class="img img-h img-radius-4"
          :src="item.img1v1Url + '?param=200y200'"
        />
        <div class="text-hidden">
          {{ item.name }}
        </div>
      </li>
    </ul>
    <p v-show="!hasMore">没有更多了</p>
  </div>
</template>

<script>
export default {
  props: ['list', 'hasMore'],
  computed: {
    disabled() {
      return !this.hasMore
    }
  },
  methods: {
    // 跳转到歌手详情页
    toArtistView(id) {
      this.$router.push({ path: '/artistdetail/' + id })
    },
    load() {
      this.$emit('loadMore', this.list.length)
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
    width: 19%;
    margin-right: 1%;
  }
}
p {
  text-align: center;
}
</style>