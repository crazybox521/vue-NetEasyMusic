<template>
  <ul class="song-sheet-list">
    <li
      class="song-sheet-item"
      v-for="(item,index) in playlist"
      :key="item.id+''+index"
      @click="toPlayListDetail(item.id)"
    >
      <el-image lazy class="img img-radius-4" :src="item.picUrl?item.picUrl:item.coverImgUrl" />
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
    width: 19%;
    margin-right: 1%;
  }
}
</style>