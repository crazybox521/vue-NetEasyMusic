<template>
  <!-- 收藏的歌手 -->
  <div class="sub-artists">
    <div class="subartists-head">
      <div>
        <span class="font-bold">收藏的歌手</span
        ><span class="font-12" style="color: #cfcfcf">({{ count }})</span>
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
      <InfoList :list="subList" v-slot="{ item }" @clickitem="toArtistDetail">
        <img
          class="sub-img mleft-10"
          :src="item.picUrl + '?param=100y100'"
          alt=""
        />
        <div class="sub-title mleft-10">{{ item.name }}</div>
        <div class="sub-author font-12">专辑：{{ item.albumSize }}</div>
        <div class="sub-num font-12">MV：{{ item.mvSize }}</div>
      </InfoList>
    </div>
  </div>
</template>

<script>
import InfoList from '@/components/list/InfoList.vue'
import { getSubArtists } from '@/api/api_sub'
export default {
  components: {
    InfoList
  },
  data() {
    return {
      list: [],
      offset: 0,
      count: 0,
      key: ''
    }
  },
  computed: {
    subList() {
      return this.list.filter((item) => item.name.match(this.key))
    }
  },
  created() {
    this.getSubArt()
  },
  methods: {
    async getSubArt() {
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
</style>