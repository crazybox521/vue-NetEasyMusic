<template>
  <!-- 收藏的专辑 -->
  <div class="sub-album">
    <div class="subalbum-head">
      <div>
        <span class="font-bold">收藏的专辑</span
        ><span class="font-12" style="color: #cfcfcf">({{ count }})</span>
      </div>
      <div class="detail-search">
        <el-input
          placeholder="搜索收藏专辑"
          clearable
          suffix-icon="el-icon-search"
          v-model="key"
        ></el-input>
      </div>
    </div>
    <div class="mtop-20">
      <InfoList :list="subAlbumList" @clickitem="toAlbumDetail">
        <template #img="{ item }">
          <img class="sub-img mleft-10" :src="item.picUrl + '?param=100y100'" />
        </template>
        <template #title="{ item }">
          {{ item.name }}
        </template>
        <template #author="{ item }">
          <span v-for="(ar, index) in item.artists" :key="index"
            >{{ ar.name }}
          </span>
        </template>
        <template #num="{ item }"> {{ item.size }} 首 </template>
      </InfoList>
    </div>
  </div>
</template>

<script>
import InfoList from '@/components/list/InfoList.vue'
import { getSubAlbum } from '@/api/api_sub'
export default {
  components: { InfoList },
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
      const { data: res } = await getSubAlbum()
      if (res.code !== 200) return
      this.list = res.data
      this.count = res.count
    },
    toAlbumDetail(row) {
      this.$router.push('/albumdetail/' + row.id)
    }
  }
}
</script>

<style lang="less" scoped>
.subalbum-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>