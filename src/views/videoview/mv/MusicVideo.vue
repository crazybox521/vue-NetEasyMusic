<template>
  <div class="music-video mtop-60">
    <div class="mv-item">
      <div class="new-head">
        <div>
          <button
            class="no-btn font-16 font-bold mtop-10"
            @click="toAllMv('new')"
          >
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
        <button
          class="no-btn font-16 font-bold mtop-10"
          @click="toAllMv('网易出品')"
        >
          网易出品 <i class="el-icon-arrow-right"></i>
        </button>
      </div>
      <MvList :list="netEasyList"></MvList>
    </div>
    <div class="mv-item mtop-20">
      <div class="new-head">
        <div>
          <button class="no-btn font-16 font-bold mtop-10" @click="toTopMv">
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
import { getNewMv, getNetEasyMv, getTopMv } from '../../../api/api'
import MvList from '../../../components/list/MvList.vue'
import MvTopList from '../../../components/list/MvTopList.vue'
export default {
  components: { MvList, MvTopList },
  data() {
    return {
      // 最新MV的cat
      newCat: [
        { name: '内地', isActive: true },
        { name: '港台', isActive: false },
        { name: '欧美', isActive: false },
        { name: '日本', isActive: false },
        { name: '韩国', isActive: false }
      ],
      // 最新MV的搜索信息
      newQueryInfo: {
        area: '内地'
      },
      newList: [], //最新MV列表
      netEasyList: [], //网易出品MV列表
      //排行榜的cat
      topCat: [
        { name: '内地', isActive: true },
        { name: '港台', isActive: false },
        { name: '欧美', isActive: false },
        { name: '日本', isActive: false },
        { name: '韩国', isActive: false }
      ],
      // 排行榜的检索信息
      topQueryInfo: {
        area: '内地',
        limit: 10,
        offset: 0
      },
      topList: [] //排行榜列表
    }
  },
  created() {
    this.getNewMv()
    this.getNetEasyMv()
    this.getTopMv()
  },
  methods: {
    /* 获取最新MV */
    async getNewMv() {
      const { data: res } = await getNewMv(this.newQueryInfo.area, 8)
      if (res.code1 == 200) return
      this.newList = res.data
    },
    /* 获取网易出品MV */
    async getNetEasyMv() {
      const { data: res } = await getNetEasyMv(8, 0)
      if (res.code !== 200) return
      this.netEasyList = res.data
    },
    /* 获取排行榜MV */
    async getTopMv() {
      const { data: res } = await getTopMv(this.topQueryInfo)
      if (res.code !== 200) return
      this.topList = res.data
    },
    /* 选择最新MV中cat的回调 */
    selectNewCat(index, name) {
      this.newCat.forEach((item) => {
        item.isActive = false
      })
      this.newCat[index].isActive = true
      this.newQueryInfo.area = name
      this.getNewMv()
    },
    /* 选择排行榜的cat的回调 */
    selectTopCat(index, name) {
      this.topCat.forEach((item) => {
        item.isActive = false
      })
      this.topCat[index].isActive = true
      this.topQueryInfo.area = name
      this.getTopMv()
    },
    toAllMv(type) {
      console.log(type)
      if (type === 'new') {
        this.$router.push({
          path: '/allmv',
          query: {  area: this.newQueryInfo.area }
        })
      } else if (type === '网易出品') {
        this.$router.push({ path: '/allmv', query: { type } })
      } else {
        this.$message.error('出错')
      }
    },
    toTopMv() {
      this.$router.push({
        path: '/topmv',
        query: { area: this.topQueryInfo.area }
      })
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