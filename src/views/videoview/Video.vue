<template>
  <div class="video">
    <!-- 标签区域 -->
    <div class="list-tag mtop-10">
      <!-- 全部标签弹出层容器 -->
      <div class="layer-wrapper">
        <button class="circle-btn tag-btn" @click="openLayer">
          {{ tagBtn }} <i class="el-icon-arrow-right"></i>
        </button>
        <!-- 全部标签弹出层 -->
        <div class="layer" v-show="showLayer" ref="layerRef">
          <div class="h-80">
            <button
              class="no-btn"
              :class="{ isActive: currenTagId === 0 }"
              @click="selectAll"
            >
              全部视频
            </button>
          </div>
          <div class="div-line"></div>
          <ul class="tag-list">
            <li v-for="(a, index) in allTagList" :key="a.id">
              <button
                @click="selectAllTag(a.id, index)"
                class="no-btn"
                :class="{ isActive: a.selectTab }"
              >
                {{ a.name }}
              </button>
            </li>
          </ul>
        </div>
      </div>
      <!-- 热门标签 -->
      <ul class="tag-ul">
        <li
          class="mright-10 font-12"
          v-for="(h, index) in hotTagList"
          :key="h.id"
          :class="{ isActive: h.selectTab }"
          @click="selectHotTag(h.id, index)"
        >
          {{ h.name }}
        </li>
      </ul>
    </div>
    <VideoList @loadMore="load" :disabled="disabled" :type="listType" :list="videoList"></VideoList>
  </div>
</template>

<script>
import VideoList from '@/components/list/VideoList.vue'
import {
  getVideoHotTag,
  getVideoAlltag,
  getAllVideo,
  getVideoByTag
} from '@/api/api'
export default {
  components: { VideoList },
  data() {
    return {
      showLayer: false,
      hotTagList: [],
      allTagList: [],
      tagBtn: '全部视频',
      offset: 0,
      videoList: [],
      hasMore: true, // 是否还有更多歌手未加载
      isLoading: false, // 正在获取歌手列表
      mode: 'first',
      currenTagId: 0,
      listType:'video'
    }
  },
  computed: {
    disabled() {
      return this.loading || !this.hasMore
    }
  },
  created() {
    this.getHotTag()
    this.getVideo()
  },
  methods: {
    /* 获取热门标签 */
    async getHotTag() {
      const { data: res } = await getVideoHotTag()
      if (res.code !== 200) return
      this.hotTagList = res.data
    },
    /* 获取所有标签 */
    async getAllTag() {
      if (this.allTagList.length !== 0) return
      const { data: res } = await getVideoAlltag()
      if (res.code !== 200) return
      this.allTagList = res.data
      this.allTagList.forEach((item) => {
        if (item.id == this.currenTagId) {
          item.selectTab = true
        }
      })
    },
    /* 获取视频列表数据 */
    async getVideo() {
      if (this.isLoading) return
      this.isLoading = true
      if (this.mode == 'first') this.offset = 0
      /* 全部视频 */
      if (this.currenTagId == 0) {
        const { data: res } = await getAllVideo(this.offset)
        if (res.code !== 200) return
        if (this.mode == 'first') {
          this.videoList = res.datas
          this.hasMore = res.hasmore
          if (this.videoList.length === 0)
            this.$message.error('暂时没有推荐视频，请稍后再试')
        } else {
          this.videoList.push(...res.datas)
        }
        this.hasMore = res.hasmore
      } else {
        /* 根据标签查 */
        const { data: res } = await getVideoByTag(this.currenTagId, this.offset)
        if (res.code !== 200) return
        if (this.mode == 'first') {
          this.videoList = res.datas
          this.hasMore = res.hasmore
        } else {
          this.videoList.push(...res.datas)
          this.hasMore = res.hasmore
        }
      }
      this.isLoading = false
    },
    /* 从热门标签选择了标签 */
    selectHotTag(id, index) {
      console.log(id);
      if(id==1000){
        this.listType ='mv'
      }else{
        this.listType ='video'
      }
      this.hotTagList.forEach((item) => {
        item.selectTab = false
      })
      this.hotTagList[index].selectTab = true
      this.tagBtn = this.hotTagList[index].name
      this.currenTagId = id
      this.mode = 'first'
      this.getVideo()
    },
    /* 从弹出层选择全部视频 */
    selectAll() {
      this.tagBtn = '全部视频'
      console.log('主动选择标签关闭')
      this.showLayer = false
      this.currenTagId = 0
      this.mode = 'first'
      window.removeEventListener('click', this.closeLayer)
      this.getVideo()
    },
    /* 无限滚动事件触发的回调 */
    load(size) {
      if (this.isLoading) return
      if (!this.hasMore) return this.$message.info('已经到底了')
      console.log('load', size)
      this.offset = size + 8
      this.mode = 'more'
      this.getVideo()
    },
    /* 全部歌单标签弹出层 开启按钮回调 */
    openLayer() {
      if (this.showLayer) return
      this.getAllTag()
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
    selectAllTag(id, index) {
      if(id==1000){
        this.listType ='mv'
      }else{
        this.listType ='video'
      }
      this.allTagList.forEach((item) => {
        item.selectTab = false
      })
      this.hotTagList.forEach((item) => {
        item.selectTab = false
        if (item.id == id) {
          item.selectTab = true
        }
      })
      this.allTagList[index].selectTab = true
      this.tagBtn = this.allTagList[index].name
      console.log('主动选择标签关闭')
      this.showLayer = false
      window.removeEventListener('click', this.closeLayer)
      this.currenTagId = id
      this.mode = 'first'
      this.getVideo()
    }
  }
}
</script>

<style lang="less" scoped>
/* 精品歌单下的标签区 */
.list-tag {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .tag-ul {
    display: flex;
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
    height: 500px;
    overflow-y: scroll;
    .h-80 {
      line-height: 80px;
      padding-left: 20px;
    }
  }
}
/* 弹出层内的标签 */
.tag-list {
  display: flex;
  flex-wrap: wrap;
  width: 600px;
  margin: 0 auto;
  li {
    width: 100px;
    height: 26px;
    text-align: center;
    margin: 16px 0;
  }
}
.no-btn {
  width: 100px;
  cursor: pointer;
  padding: 6px 10px;
  &:hover {
    color: #ec4141;
  }
}
</style>