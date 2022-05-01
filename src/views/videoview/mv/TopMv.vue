<template>
  <div class="mtop-20 top-mv">
    <div class="font-20 font-bold">MV排行榜</div>
    <div class="top-mv-head">
      <div class="font-12" style="color: #9f9f9f">最近更新：今天</div>
      <div class="btn-wrap">
        <button
          class="btn-tag"
          v-for="item in areaList"
          :key="item"
          :class="{ 'btn-tag_active': area_active(item) }"
          @click="changeArea(item)"
        >
          {{ item }}
        </button>
      </div>
    </div>
    <MvTopList :list="list" />
  </div>
</template>

<script>
import { getTopMv } from '@/api/api_video.js'
import MvTopList from '@/components/list/MvTopList'
export default {
  components: { MvTopList },
  data() {
    return {
      areaList: ['全部', '内地', '港台', '欧美', '日本', '韩国'],
      area: '全部',
      queryInfo: {
        limit: 50,
        offset: 0,
        area: ''
      },
      list: []
    }
  },
  methods: {
    area_active(item) {
      return this.area === item
    },
    changeArea(area) {
      this.area = area
      if (area !== '全部') {
        this.queryInfo.area = area
      } else {
        this.queryInfo.area = ''
      }
      this.getTopData()
    },
    async getTopData() {
      const res = await getTopMv(this.queryInfo)
      if (res.code !== 200) return
      console.log(res)
      this.list = Object.freeze(res.data)
    }
  },
  created() {
    if (
      this.$route.query.area &&
      this.areaList.findIndex((item) => item === this.$route.query.area) !== -1
    ) {
      this.area = this.$route.query.area
      this.queryInfo.area = this.area
    }
    this.getTopData()
  }
}
</script>

<style lang="less" scoped>
.top-mv-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 40px;
}
.area_active {
  font-weight: bold;
}
.btn-tag {
  height: 26px;
  line-height: 26px;
  border-radius: 13px;
  outline: 0;
  border: 0;
  background-color: #fff;
  padding: 0 10px;
  cursor: pointer;
  color: #676767;
}
.btn-tag_active {
  color: #ec4141;
  background-color: #fdf5f5;
}
@media screen and (max-width: 415px) {
  .btn-wrap {
    width: 100px;
  }
}
</style>