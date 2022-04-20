<template>
  <div class="play-list mtop-60">
    <!-- 精品歌单banner -->
    <div class="jingpin" v-if="hasHighInfo">
      <img class="back-img" :src="highInfo.coverImgUrl" />
      <img class="img-80" :src="highInfo.coverImgUrl" alt="" />
      <div class="info-wrapper">
        <div>
          <button class="circle-btn">
            <i class="iconfont icon-huiyuanhuangguanguanjun-xianxing"></i>
            精品歌单
          </button>
        </div>
        <div class="mtop-10">
          <span>{{ highInfo.name }}</span>
        </div>
      </div>
    </div>
    <!-- 标签区域 -->
    <div class="list-tag mtop-10">
      <!-- 全部标签弹出层容器 -->
      <div class="layer-wrapper">
        <button class="circle-btn tag-btn" @click="openLayer">
          {{ tagBtn }} <i class="el-icon-arrow-right"></i>
        </button>
        <!-- 全部标签弹出层 -->
        <div class="layer" v-show="showLayer" ref="layerRef">
          <div class="h-80">全部歌单</div>
          <div class="div-line"></div>
          <div class="tag-list" v-for="(item, index) in allCats" :key="index">
            <div class="tag-title">
              <template v-if="index === 0">
                <i class="iconfont icon-diqiuquanqiu font-24"></i
                ><span class="mleft-6">语种</span>
              </template>
              <template v-if="index === 1">
                <i class="iconfont icon-fengge font-24"></i
                ><span class="mleft-6">风格</span>
              </template>
              <template v-if="index === 2">
                <i class="iconfont icon-xiazai47 font-24"></i
                ><span class="mleft-6">场景</span>
              </template>
              <template v-if="index === 3">
                <i class="iconfont icon-smiling font-24"></i
                ><span class="mleft-6">情感</span>
              </template>
              <template v-if="index === 4">
                <i class="iconfont icon-zhuti font-24"></i>
                <span class="mleft-6">主题</span>
              </template>
            </div>
            <ul>
              <li v-for="cat in item" :key="cat.name">
                <button
                  @click="changefromAll(cat.name)"
                  class="no-btn"
                  :class="{ isActive: cat.isActive }"
                >
                  {{ cat.name }}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <!-- 热门标签 -->
      <ul class="tag-ul">
        <li
          class="mright-10 font-12"
          v-for="h in hotCats"
          :key="h.id"
          :class="{ isActive: h.isActive }"
          @click="changeCat(h.name)"
        >
          {{ h.name }}
        </li>
      </ul>
    </div>
   <!--  <el-skeleton class="mtop-10" v-show="isLoading" :rows="6" animated /> -->
    <ImgList
      
      @clickImg="toPlayListDetail"
      :list="playList"
      type="playlist"
    >
      <template v-slot="{ item }">
        <div class="text-hidden">
          {{ item.name }}
        </div>
      </template>
    </ImgList>

    <div class="flex_center" style="width: 100%">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="pageInfo.currentPage"
        :page-size="50"
        layout="prev, pager, next"
        :total="pageInfo.total"
        background
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import {
  getAllCat,
  getHotCat,
  getPlayListByCat,
  getHighquality
} from '@/api/api_playlist'
import ImgList from '@/components/list/ImgList.vue'
export default {
  components: {
    ImgList
  },
  data() {
    return {
      hotCats: [],
      allCats: [],
      queryInfo: {
        limit: 50,
        order: 'hot',
        cat: '华语',
        offset: 0
      },
      pageInfo: {
        total: 0,
        currentPage: 1
      },

      playList: [],
      highInfo: {},
      isLoading: true,
      hasHighInfo: true,
      tagBtn: '华语',
      showLayer: false
    }
  },
  created() {
    this.getHotCats()
    this.getPlayList()
  },
  methods: {
    /* 获取热门歌单分类 */
    async getHotCats() {
      const res = await getHotCat()
      if (res.code !== 200) return
      /* 使当前标签激活 */
      res.tags.forEach((item) => {
        item.isActive = false
        if (item.name == this.tagBtn) item.isActive = true
      })
      this.hotCats = res.tags
    },
    /* 获取所有分类 */
    async getAllCats() {
      const res = await getAllCat()
      if (res.code !== 200) return
      this.allCats = []
      res.sub.forEach((item) => {
        item.isActive = false
        /* 使当前标签激活 */
        if (item.name == this.tagBtn) {
          item.isActive = true
        }
      })
      for (let i = 0; i < 5; i++) {
        this.allCats.push(
          Object.freeze(res.sub.filter((item) => item.category === i))
        )
      }
    },
    /* 根据分类获取歌单 */
    async getPlayList() {
      this.isLoading = true
      this.getHighInfo(this.queryInfo.cat)
      const res = await getPlayListByCat(this.queryInfo)
      if (res.code !== 200) return
      this.playList = Object.freeze(res.playlists)
      this.pageInfo.total = res.total
      this.isLoading = false
    },
    /* 分页器页数变化的回调 */
    handleCurrentChange(val) {
      console.log(val)
      console.log(this.pageInfo.currentPage)
      this.pageInfo.currentPage = val
      this.queryInfo.offset = (val - 1) * 50
      document.querySelector('.main-right').scrollTop = 0
      this.getPlayList()
    },
    /* 获取精品歌单第一首封面展示 */
    async getHighInfo(cat) {
      const res = await getHighquality(1, cat)
      if (res.code !== 200) return
      if (res.playlists.length === 0) {
        this.highInfo = {}
        this.hasHighInfo = false
        return
      }
      this.highInfo = Object.freeze(res.playlists[0])
      this.hasHighInfo = true
    },
    changeCat(name) {
      /* 重置页数 */
      this.queryInfo.offset = 0
      this.pageInfo.currentPage = 1
      this.queryInfo.cat = name
      this.tagBtn = name
      this.hotCats.forEach((item) => {
        if (item.isActive === true) item.isActive = false
        if (item.name === name) item.isActive = true
      })
      this.getPlayList()
    },
    /* 全部歌单标签弹出层 开启按钮回调 */
    openLayer() {
      if (this.showLayer) return
      this.getAllCats()
      this.showLayer = true
      /* 向window绑定关闭弹出层方法回调 */
      setTimeout(() => {
        window.addEventListener('click', this.closeLayer)
      }, 10)
    },
    /* 关闭弹出层的方法 */
    closeLayer(e) {
      /* 判断触发回调的事件对象的target是否在layer里 */
      if (!this.$refs.layerRef) return
      if (!this.$refs.layerRef.contains(e.target)) {
        console.log('触发关闭')
        this.showLayer = false
        window.removeEventListener('click', this.closeLayer)
      }
    },
    /* 从弹出层访问了标签 */
    changefromAll(cat) {
      this.changeCat(cat)
      console.log('主动选择标签关闭')
      this.showLayer = false
      window.removeEventListener('click', this.closeLayer)
    },
    toPlayListDetail(id) {
      if (typeof id === 'number')
        this.$router.push({ path: '/playlistdetail/' + id })
    }
  }
}
</script>

<style lang="less" scoped>
/* 精品歌单banner */
.jingpin {
  background-color: rgba(0, 0, 0, 0);
  height: 200px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  overflow: hidden;
  position: relative;
  .back-img {
    position: absolute;
    top: -400px;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 1;
    width: 100%;
    filter: blur(45px);
  }

  .img-80 {
    margin: 0 20px;
    border-radius: 6px;
    z-index: 2;
  }
  .info-wrapper {
    z-index: 2;
  }
}
/* 精品歌单下的标签区 */
.list-tag {
  display: flex;
  justify-content: space-between;
  .tag-ul {
    display: flex;
    align-items: center;
    height: 26px;
    li {
      height: 26px;
      line-height: 26px;
      padding: 0 10px;
      cursor: pointer;
    }
  }
}
/* 标签激活的样式 */
.isActive {
  background-color: #fdf5f5;
  color: #ec4141;
  border-radius: 13px;
}
/* 打开全部标签的按钮 */
.tag-btn {
  color: #343434;
  border-color: #d8d8d8;
  padding: 0 30px;
  &:hover {
    background-color: #f2f2f2;
  }
}
/* 弹出层 */
.layer-wrapper {
  position: relative;
  .layer {
    position: absolute;
    width: 720px;
    top: 40px;
    left: 0px;
    background-color: #ffffff;
    z-index: 99;
    box-shadow: 0 0 8px #e5e5e5;
    border-radius: 4px;
    font-size: 14px;
    min-height: 400px;
    .h-80 {
      line-height: 80px;
      padding-left: 20px;
    }
  }
}
/* 弹出层内的标签 */
.tag-list {
  display: flex;
  line-height: 26px;
  margin: 10px 0px 30px 0;
  .tag-title {
    width: 120px;
    height: 26px;
    color: #cfcfcf;
    margin: 0 40px 0 20px;
    .iconfont {
      color: #b1b1b1;
    }
  }
  ul {
    display: flex;
    flex-wrap: wrap;
    width: 500px;

    li {
      width: 100px;
      height: 26px;

      .no-btn {
        cursor: pointer;
        padding: 4px 10px;
        &:hover {
          color: #ec4141;
        }
      }
    }
  }
}
@media screen and(max-width:768px) {
  .tag-btn {
    padding: 0 10px;
    white-space: nowrap;
  }
  .layer-wrapper {
    .layer {
      width: 90vw;
    }
  }
  .list-tag {
    .tag-ul {
      overflow-x: auto;
      li {
        height: 26px;
        line-height: 26px;
        white-space: nowrap;
        cursor: pointer;
      }
    }
  }
}
</style>