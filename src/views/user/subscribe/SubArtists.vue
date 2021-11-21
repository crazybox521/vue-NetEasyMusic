<template>
<!-- 收藏的歌手 -->
  <div class="sub-album">
    <div class="subartists-head">
      <div>
        <span class="font-bold">收藏的歌手</span
        ><span class="font-12" style="color:#cfcfcf">({{ count }})</span>
      </div>
      <div class="detail-search">
        <el-input
          placeholder="搜索我收藏的歌手"
          clearable
          suffix-icon="el-icon-search"
          v-model="key"
        ></el-input>
      </div>
    </div>
    <div class="mtop-20">
      <ul class="sub-list">
        <li
          class="sub-item"
          v-for="item in subAlbumList"
          :key="item.id"
          @click="toArtistDetail(item.id)"
        >
          <img
            class="sub-img mleft-10"
            :src="item.picUrl + '?param=100y100'"
            alt=""
          />
          <div class="sub-title mleft-10">{{ item.name }}</div>
          <div class="sub-author font-12">专辑：{{ item.albumSize }}</div>
          <div class="sub-num font-12">MV：{{ item.mvSize }}</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { getSubArtists } from '../../../api/api'
export default {
  data() {
    return {
      list: [],
      offset: 0,
      count: 0,
      key: ''
    }
  },
  computed: {
    subAlbumList() {
      return this.list.filter((item) => item.name.match(this.key))
    }
  },
  created() {
    this.getSubAlbum()
  },
  methods: {
    async getSubAlbum() {
      const { data: res } = await getSubArtists()
      if (res.code !== 200) return
      this.list = res.data
      this.count = res.count
    },
    toArtistDetail(id) {
      this.$router.push('/artistdetail/' + id)
    }
  }
}
</script>

<style lang="less" scoped>
.subartists-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.sub-item {
  display: flex;
  height: 100px;
  align-items: center;
  &:nth-child(odd) {
    background-color: #f9f9f9;
  }
  &:nth-child(even) {
    background-color: #ffffff;
  }
  &:hover {
    background-color: #f0f1f2;
  }
  .sub-img {
    height: 60px;
    width: 60px;
    border-radius: 4px;
  }
  .sub-title {
    flex: 1;
  }
  .sub-author {
    width: 180px;
    color: #c3c3c4;
  }
  .sub-num {
    width: 160px;
    text-align: center;
    color: #c3c3c4;
  }
}
</style>