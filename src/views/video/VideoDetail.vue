<template>
  <div class="video-detail">
    <!-- 左侧内容区 -->
    <div class="vd-main">
      <div class="video-container">
        <div>
          <button class="no-btn font-16 font-bold mtop-10" @click="toVideo">
            <i class="el-icon-arrow-left"></i> 视频详情
          </button>
        </div>
        <!-- 视频 -->
        <div class="video-wrap mtop-10">
          <video autoplay controls :src="urlInfo.url">
            您的浏览器不支持 video 标签。
          </video>
        </div>
        <!-- 视频信息 -->
        <div class="info-wrap">
          <div class="creator-info">
            <div class="img-wrap font-14">
              <img :src="creator.avatarUrl" alt="" />
              <span class="mleft-10">{{ creator.nickname }}</span>
            </div>
            <div class="font-14">
              <button class="sub-btn">+ 关注</button>
            </div>
          </div>
          <div class="video-info">
            <div class="font-18 mtop-10 font-bold">{{ deTail.title }}</div>
            <div class="font-12 mtop-10" style="color: #cfcfcf">
              <span>发布时间:{{ deTail.publishTime | dateFormat }}</span>
              <span class="mleft-20"
                >播放次数:{{ deTail.playTime | countFormat }}</span
              >
            </div>
            <ul class="tag mtop-10">
              <li v-for="tag in deTail.videoGroup" :key="tag.id">
                <button class="tag-btn">{{ tag.name }}</button>
              </li>
            </ul>
          </div>
        </div>
        <!-- 视频下按钮 -->
        <div class="video-btn mtop-20">
          <button class="btn btn-white">
            <i class="iconfont icon-good"></i>
            赞({{ deTail.praisedCount }})
          </button>
          <button class="btn btn-white mleft-10">
            <i class="el-icon-folder-add"></i>
            收藏({{ deTail.subscribeCount }})
          </button>
          <button class="btn btn-white mleft-10">
            <i class="iconfont icon-fenxiang"></i>
            分享({{ deTail.shareCount }})
          </button>
        </div>
      </div>
    </div>
    <!-- 右侧推荐区 -->
    <div class="vd-right">
      <div class="tuijian">
        <div class="font-bold mtop-10">相关推荐</div>
        <!-- 推荐列表 -->
        <ul class="xiangguan mtop-10">
          <li v-for="item in RelatedList" :key="item.vid" class="mtop-10">
            <div class="xiangguan-img">
              <img
                @click="toDetail(item.vid)"
                class="img-h img pointer"
                :src="item.coverUrl"
                alt=""
              />
            </div>
            <div class="xg-info mleft-10">
              <div
                class="mtop-10 font-14 title pointer"
                @click="toDetail(item.vid)"
              >
                {{ item.title }}
              </div>
              <div class="font-12 mtop-10 pointer" style="color: #9f9f9f">
                by {{ item.creator[0].userName }}
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { getVideoDetail, getVideoUrl, getRelatedVideo } from '../../api/api'
export default {
  data() {
    return {
      deTail: {},
      urlInfo: {},
      RelatedList: []
    }
  },
  computed: {
    creator() {
      return this.deTail.creator ? this.deTail.creator : {}
    }
  },
  watch: {
    '$route.params.id'() {
      this.getDetail()
      this.getUrl()
      this.getRelatedVideo()
    }
  },
  created() {
    this.getDetail()
    this.getUrl()
    this.getRelatedVideo()
  },
  methods: {
    /* 获取视频详情 */
    async getDetail() {
      const { data: res } = await getVideoDetail(this.$route.params.id)
      if (res.code !== 200) return
      this.deTail = res.data
    },
    /* 获取视频URL */
    async getUrl() {
      const { data: res } = await getVideoUrl(this.$route.params.id)
      if (res.code !== 200) return
      this.urlInfo = res.urls[0]
      this.$store.commit('setPlayState', false)
    },
    /* 获取相关视频 */
    async getRelatedVideo() {
      const { data: res } = await getRelatedVideo(this.$route.params.id)
      if (res.code !== 200) return
      this.RelatedList = res.data
    },
    toDetail(id) {
      if (typeof id !== 'undefined') this.$router.push('/videodetail/' + id)
    },
    toVideo() {
      this.$router.push('/video')
    }
  }
}
</script>

<style lang="less" scoped>
.video-detail {
  margin: 0 auto;
  display: flex;
  justify-content: space-around;
}
.vd-main {
  min-width: 600px;
}
.vd-right {
  min-width: 400px;
}
.video-container {
  .video-wrap {
    width: 600px;
    video {
      width: 600px;
    }
  }
  .no-btn {
    color: #000;
  }

  .info-wrap {
    /* 发布者信息区域 */
    .creator-info {
      display: flex;
      margin: 10px auto;
      justify-content: space-between;
      align-items: center;
      height: 40px;
      .img-wrap {
        display: flex;
        align-items: center;
        img {
          height: 40px;
          width: 40px;
          border-radius: 50%;
        }
      }
      .sub-btn {
        outline: none;
        border: none;
        background-color: #fcf4f4;
        color: #ff3a3a;
        height: 30px;
        width: 80px;
        border-radius: 15px;
      }
    }
    .video-info {
      .tag {
        display: flex;
        li {
          margin-right: 5px;
        }
        .tag-btn {
          outline: none;
          border: none;
          height: 20px;
          background-color: #f7f7f7;
          color: #363636;
          font-size: 12px;
          border-radius: 10px;
        }
      }
    }
  }
}
/* 推荐区域 */
.tuijian {
  .xiangguan {
    li {
      display: flex;
      .xiangguan-img {
        width: 140px;
        img {
          border-radius: 4px;
        }
      }
      .title {
        width: 140px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
      }
    }
  }
}
</style>