<template>
  <div class="artist-list mtop-60">
    <button @click="openTag" class="hidden">{{ showH5Info }}列表</button>
    <div class="tag-wrapper" ref="tagRef">
      <div class="radio-list">
        <span class="w-60">语种：</span>
        <el-radio-group v-model="queryInfo.area">
          <el-radio :label="ar.id" v-for="ar in artistData.area" :key="ar.id">{{
            ar.value
          }}</el-radio>
        </el-radio-group>
      </div>
      <div class="radio-list">
        <span class="w-60">分类：</span>
        <el-radio-group v-model="queryInfo.type">
          <el-radio :label="tp.id" v-for="tp in artistData.type" :key="tp.id">{{
            tp.value
          }}</el-radio>
        </el-radio-group>
      </div>
      <div class="radio-list">
        <span class="w-60">筛选：</span>
        <el-radio-group v-model="queryInfo.initial">
          <el-radio
            :label="it.id"
            v-for="it in artistData.initial"
            :key="it.id"
            >{{ it.value }}</el-radio
          >
        </el-radio-group>
      </div>
    </div>
    <Artist @loadMore="load" :list="artistList" :hasMore="hasMore"></Artist>
  </div>
</template>

<script>
import artistData from '@/listData/artistData'
import Artist from '@/components/list/Artist.vue'
import { getArtistList } from '@/api/api'
export default {
  components: {
    Artist
  },
  computed: {
    showH5Info() {
      return this.showTagH5 ? '关闭' : '打开'
    }
  },
  data() {
    return {
      queryInfo: {
        //查询信息
        limit: 30,
        area: -1,
        offset: 0,
        type: -1,
        initial: '-1'
      },
      hasMore: true, // 是否还有更多歌手未加载
      artistData, // 列表项
      artistList: [], // 歌手列表
      isLoading: false, // 正在获取歌手列表
      mode: 'first',
      showTagH5: false
    }
  },
  created() {
    this.getArtistList()
  },
  watch: {
    queryInfo: {
      deep: true,
      handler() {
        this.getArtistList()
      }
    }
  },
  methods: {
    async getArtistList() {
      /* 节流 */
      if (this.isLoading) return
      this.isLoading = true
      /* 重置偏移量 */
      if (this.mode == 'first') this.queryInfo.offset = 0
      const { data: res } = await getArtistList(this.queryInfo)
      if (res.code !== 200) return this.$message.error('获取失败')
      if (this.mode == 'first') {
        this.artistList = res.artists
      } else {
        this.artistList.push(...res.artists)
      }
      this.hasMore = res.more
      this.isLoading = false
      this.mode = 'first'
    },
    /* loadMore事件的回调 */
    load(num) {
      /* 这里有点问题，会多次触发，需要节流*/
      if (this.isLoading) return
      if (!this.hasMore) return this.$message.error('已经到底了')
      this.mode = 'more'
      this.queryInfo.offset = num + 30
    },
    /* 移动端情况下打开标签列表 */
    openTag() {
      if (!this.showTagH5) this.$refs.tagRef.style.display = 'block'
      else this.$refs.tagRef.style.display = 'none'
      this.showTagH5 = !this.showTagH5
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
@media screen and (max-width: 768px) {
  .tag-wrapper {
    display: none;
  }
  .hidden {
    display: block;
    margin-top: 70px;
  }
  .redio-list {
    .el-radio-group {
      width: 80%;
      .el-radio {
        margin-left: 10px;
        width: 40px;
        height: 30px;
        line-height: 30px;
      }
    }
  }
}
</style>