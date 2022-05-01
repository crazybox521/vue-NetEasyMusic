<template>
  <!-- 全部MV页 -->
  <div class="mtop-20 all-mv">
    <div class="all-title font-20 font-bold">全部MV</div>
    <!-- mv的分类筛选 -->
    <div class="tag-wrapper">
      <div class="radio-list">
        <span class="w-60">地区：</span>
        <el-radio-group v-model="queryInfo.area">
          <el-radio
            :label="ar"
            v-for="(ar, index) in catList.area"
            :key="index"
            >{{ ar }}</el-radio
          >
        </el-radio-group>
      </div>
      <div class="radio-list">
        <span class="w-60">类型：</span>
        <el-radio-group v-model="queryInfo.type">
          <el-radio
            :label="tp"
            v-for="(tp, index) in catList.type"
            :key="index"
            >{{ tp }}</el-radio
          >
        </el-radio-group>
      </div>
      <div class="radio-list">
        <span class="w-60">排序：</span>
        <el-radio-group v-model="queryInfo.order">
          <el-radio
            :label="od"
            v-for="(od, index) in catList.order"
            :key="index"
            >{{ od }}</el-radio
          >
        </el-radio-group>
      </div>
    </div>
    <MvList :list="mvList" :disabled="disabled" @loadMore="load" />
  </div>
</template>

<script>
import MvList from '@/components/list/MvList'
import { getAllMv } from '@/api/api_video'
export default {
  components: {
    MvList
  },
  data() {
    return {
      catList: {
        area: ['全部', '内地', '港台', '欧美', '日本', '韩国'],
        type: ['全部', '官方版', '现场版', '网易出品'],
        order: ['上升最快', '最热', '最新']
      },
      queryInfo: {
        area: '全部',
        type: '全部',
        order: '最新',
        limit: 16
      },
      offset: 0,
      mvList: [],
      hasMore: true, // 是否还有更多歌手未加载
      isLoading: false, // 正在获取歌手列表
      mode: 'first'
    }
  },
  computed: {
    disabled() {
      return this.loading || !this.hasMore
    }
  },
  watch: {
    queryInfo: {
      deep: true,
      handler() {
        this.mode = 'first'
        this.getMvList()
      }
    }
  },
  created() {
    this.getQuery()
    this.getMvList()
  },
  methods: {
    /* 获取列表数据 */
    async getMvList() {
      if (this.isLoading) return
      this.isLoading = true
      const res = await getAllMv({
        ...this.queryInfo,
        offset: this.offset
      })
      if (res.code !== 200) {
        this.isLoading = false
        return
      }
      if (this.mode == 'first') this.mvList = res.data
      else this.mvList.push(...res.data)
      this.hasMore = res.hasMore
      this.isLoading = false
    },
    /* 获取路由参数中的地区 */
    getQuery() {
      let query = this.$route.query
      if (
        query.area &&
        this.catList.area.findIndex((item) => item === query.area) !== -1
      ) {
        this.queryInfo.area = query.area
      }
      if (
        query.type &&
        this.catList.type.findIndex((item) => item === query.type) !== -1
      ) {
        this.queryInfo.type = query.type
      }
    },
    /* MvList组件触发loadMore事件的回调 */
    load(length) {
      this.offset = length + 16
      this.mode = 'more'
      this.getMvList()
    }
  }
}
</script>

<style lang="less" scoped>
.radio-list {
  display: flex;
  flex-wrap: wrap;
  line-height: 20px;
  margin-top: 10px;
  span {
    height: 30px;
    line-height: 30px;
  }
  .el-radio-group {
    width: 80%;
    .el-radio {
      width: 60px;
      height: 30px;
      line-height: 30px;
    }
  }
}
</style>