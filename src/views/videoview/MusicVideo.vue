<template>
  <div class="music-video mtop-60">
    <div class="mv-item">
      <div class="new-head">
        <div>
          <button class="no-btn font-16 font-bold mtop-10" @click="toMv">
            最新MV <i class="el-icon-arrow-right"></i>
          </button>
        </div>
        <ul class="cat-list">
          <li v-for="(nc, index) in newCat" :key="index">
            <button
              class="no-btn"
              @click="selectNewCat(index, nc.name)"
              :class="{ isActive: nc.isActive }"
            >
              {{ nc.name }}
            </button>
          </li>
        </ul>
      </div>
      <MvList :list="newList"></MvList>
    </div>
    <div class="mv-item mtop-20">
      <div class="hot-head">
        <button class="no-btn font-16 font-bold mtop-10" @click="toMv">
          网易出品 <i class="el-icon-arrow-right"></i>
        </button>
      </div>
      <MvList :list="netEasyList"></MvList>
    </div>
    <div class="mv-item mtop-20">
      <div class="new-head">
        <div>
          <button class="no-btn font-16 font-bold mtop-10" @click="toMv">
            MV排行榜 <i class="el-icon-arrow-right"></i>
          </button>
        </div>
        <ul class="cat-list">
          <li v-for="(tc, index) in topCat" :key="index">
            <button
              class="no-btn"
              @click="selectTopCat(index, tc.name)"
              :class="{ isActive: tc.isActive }"
            >
              {{ tc.name }}
            </button>
          </li>
        </ul>
      </div>
      <MvTopList :list="topList"></MvTopList>
    </div>
  </div>
</template>

<script>
import { getNewMv, getNetEasyMv, getTopMv } from '../../api/api'
import MvList from '../../components/list/MvList.vue'
import MvTopList from '../../components/list/MvTopList.vue'
export default {
  components: { MvList,MvTopList },
  data() {
    return {
      newCat: [
        { name: '内地', isActive: true },
        { name: '港台', isActive: false },
        { name: '欧美', isActive: false },
        { name: '日本', isActive: false },
        { name: '韩国', isActive: false }
      ],
      newQueryInfo: {
        area: '内地'
      },
      newList: [],
      netEasyList: [],
      PersonalizedList: [],
      topCat: [
        { name: '内地', isActive: true },
        { name: '港台', isActive: false },
        { name: '欧美', isActive: false },
        { name: '日本', isActive: false },
        { name: '韩国', isActive: false }
      ],
      topQueryInfo: {
        area: '内地',
        limit: 10,
        offset: 0
      },
      topList: []
    }
  },
  created() {
    this.getNewMv()
    this.getNetEasyMv()
    this.getTopMv()
  },
  methods: {
    async getNewMv() {
      const { data: res } = await getNewMv(this.newQueryInfo.area, 8)
      if (res.code1 == 200) return
      this.newList = res.data
    },
    async getNetEasyMv() {
      const { data: res } = await getNetEasyMv(8, 0)
      if (res.code !== 200) return
      this.netEasyList = res.data
    },
    async getTopMv() {
      const { data: res } = await getTopMv(this.topQueryInfo)
      if (res.code !== 200) return
      this.topList = res.data
    },
    toMv() {
      this.$router.push('/videoview')
    },
    selectNewCat(index, name) {
      this.newCat.forEach((item) => {
        item.isActive = false
      })
      this.newCat[index].isActive = true
      this.newQueryInfo.area = name
      this.getNewMv()
    },
    selectTopCat(index, name) {
      this.topCat.forEach((item) => {
        item.isActive = false
      })
      this.topCat[index].isActive = true
      this.topQueryInfo.area = name
      this.getTopMv()
    }
  }
}
</script>

<style lang="less" scoped>
.isActive {
  background-color: #fcebeb;
  color: #ec4141;
  border-radius: 15px;
  padding: 0 10px;
}
/* 最近视频头部 */
.new-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .cat-list {
    display: flex;
    li {
      width: 60px;
      .no-btn {
        height: 30px;
      }
    }
  }
}
</style>