<template>
  <div class="video-detail">
    <!-- 左侧内容区 -->
    <div class="vd-main">
      <div class="video-container">
        <div>
          <button class="no-btn font-16 font-bold mtop-10" @click="toVideo">
            <i class="el-icon-arrow-left"></i> {{ title }}
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
            <div class="img-wrap font-14" @click="toUorADetail()">
              <img class="pointer" :src="avatarUrl" alt="" />
              <span class="mleft-10 pointer">{{ nickName }}</span>
            </div>
            <div class="font-14" v-if="type === 'v'">
              <button
                class="sub-btn pointer"
                :class="{ isfollow: followed }"
                @click="follow"
              >
                <span v-show="followed">√ 已关注</span>
                <span v-show="!followed">+ 关注</span>
              </button>
            </div>
          </div>
          <div class="video-info">
            <div class="font-18 mtop-10 font-bold">
              {{ deTail.title || deTail.name }}
            </div>
            <div class="font-12 mtop-10" style="color: #cfcfcf">
              <span>发布时间:{{ deTail.publishTime | dateFormat }}</span>
              <span class="mleft-20"
                >播放次数:{{
                  deTail.playTime || deTail.playCount | countFormat
                }}</span
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
          <button class="btn btn-white" @click="likeVideo">
            <i
              class="iconfont icon-good"
              :class="{ icon_liked: countInfo.liked }"
            ></i>
            <span class="btn-text">{{ likedInfo }}</span>
            ({{ countInfo.likedCount }})
          </button>

          <button class="btn btn-white mleft-10" @click="subVideo">
            <span v-show="!subed">
              <i class="el-icon-folder-add"></i>
              <span class="btn-text">收藏</span>
            </span>
            <span v-show="subed">
              <i class="el-icon-folder-checked"></i>
              <span class="btn-text">已收藏</span>
            </span>
            ({{ deTail.subscribeCount || deTail.subCount }})
          </button>
          <button class="btn btn-white mleft-10">
            <i class="iconfont icon-fenxiang"></i>
             <span class="btn-text">分享</span>
            ({{ deTail.shareCount }})
          </button>
        </div>
      </div>
      <div class="comment-container">
        <div class="mbottom-10">
          <span class="font-bold font-20">评论</span>
          <span>({{ countInfo.commentCount }})</span>
        </div>
        <Comment
          :active="true"
          :type="resoureType"
          :id="id"
          scrollDom=".main-right"
        ></Comment>
      </div>
    </div>
    <!-- 右侧推荐区 -->
    <div class="vd-right">
      <div class="tuijian">
        <div class="font-bold mtop-10">相关推荐</div>
        <!-- 推荐列表 -->
        <ul class="xiangguan mtop-10">
          <li v-for="(item, index) in RelatedList" :key="index" class="mtop-10">
            <div class="xiangguan-img">
              <img
                @click="toVideoDetail(item)"
                class="img-h img pointer"
                :src="relatedImgUrl(item)"
              />
            </div>
            <div class="xg-info mleft-10">
              <div
                class="mtop-10 font-14 title pointer"
                @click="toVideoDetail(item)"
              >
                {{ item.title || item.name }}
              </div>
              <div class="font-12 mtop-10 pointer" style="color: #9f9f9f">
                by {{ relatedNickName(item) }}
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getVideoDetail,
  getVideoUrl,
  getRelatedVideo,
  getVideoLike,
  likeVideo,
  subVideo
} from '@/api/api_video'
import { follow } from '@/api/api_user'
import { mapState } from 'vuex'
import Comment from '@/components/comment/Comment'
export default {
  components: { Comment },
  props: {
    id: {
      type: String,
      required: true
    },
    type: {
      /* mv/v */
      type: String,
      required: true
    }
  },
  data() {
    return {
      deTail: {},
      urlInfo: {},
      RelatedList: [],
      countInfo: {
        likedCount: 0,
        shareCount: 0,
        commentCount: 0,
        liked: false
      },
      followed: false,
      subed: false
    }
  },
  computed: {
    creator() {
      return this.type === 'v'
        ? this.deTail?.creator
        : this.deTail?.artists?.[0]
    },
    likedInfo() {
      return this.countInfo.liked ? '已赞' : '赞'
    },
    resoureType() {
      return this.type === 'v' ? 5 : 1
    },
    title() {
      return this.type === 'v' ? '视频详情' : 'MV详情'
    },
    avatarUrl() {
      return this.creator?.avatarUrl || this.creator?.img1v1Url
    },
    nickName() {
      return this.creator?.nickname || this.creator?.name
    },
    ...mapState(['isLogin'])
  },
  watch: {
    /* 监听id */
    id() {
      this.getDetail()
      this.getUrl()
      this.getRelatedVideo()
      this.getVideoLikeInfo()
    },
    type: {
      immediate: true,
      handler(val) {
        if (val !== 'mv' && val !== 'v') this.$router.push('/404')
      }
    }
  },
  created() {
    this.getDetail()
    this.getUrl()
    this.getRelatedVideo()
    this.getVideoLikeInfo()
  },
  methods: {
    /* 获取视频详情 */
    async getDetail() {
      const res = await getVideoDetail(this.type, this.id)
      if (res.code !== 200) return
      this.deTail = Object.freeze(res.data)
      if (this.type === 'v') this.followed = res.data.creator.followed
      else this.subed = res.subed
    },
    /* 获取视频URL */
    async getUrl() {
      const res = await getVideoUrl(this.type, this.id)
      if (res.code !== 200) return
      if (this.type === 'v') this.urlInfo = Object.freeze(res.urls[0])
      else this.urlInfo = Object.freeze(res.data)
      this.$store.commit('setPlayState', false)
    },
    /* 获取相关视频 */
    async getRelatedVideo() {
      const res = await getRelatedVideo(this.type, this.id)
      if (res.code !== 200) return
      if (this.type === 'v') this.RelatedList = Object.freeze(res.data)
      else this.RelatedList = Object.freeze(res.result)
    },
    /* 获取视频点赞，分享，评论，是否点赞数据 */
    async getVideoLikeInfo() {
      const res = await getVideoLike(this.type, this.id)
      if (res.code !== 200) return
      this.countInfo = res
    },
    /* 点赞或取消 */
    async likeVideo() {
      if (!this.isLogin) return this.$message.error('需要登录')
      let likeObj = {
        type: this.resoureType,
        t: this.countInfo.liked ? 0 : 1,
        id: this.id
      }
      const res = await likeVideo(likeObj)
      console.log(res)
      if (res.code !== 200) return
      this.getVideoLikeInfo()
    },
    /* 关注 */
    async follow() {
      if (!this.isLogin) return this.$message.error('需要登录')
      let followObj = {
        id: this.creator.userId,
        t: this.followed ? 0 : 1
      }
      const res = await follow(followObj)
      if (res.code !== 200) return this.$message.error('操作失败')
      this.$message.success(this.creator.followed ? '取关成功' : '关注成功')
      this.followed = !this.followed
    },
    /* 视频详情页 */
    toVideoDetail(item) {
      if (this.type === 'v') {
        if (typeof item.vid !== 'undefined')
          this.$router.push('/videodetail/v/' + item.vid)
      } else {
        if (typeof item.id !== 'undefined')
          this.$router.push('/videodetail/mv/' + item.id)
      }
    },
    /* 去用户或者歌手页 */
    toUorADetail() {
      if (this.type === 'v') {
        if (typeof this.creator?.userId !== 'undefined')
          this.$router.push('/userdetail/' + this.creator.userId)
      } else {
        if (typeof this.creator?.id !== 'undefined')
          this.$router.push('/artistdetail/' + this.creator.id)
      }
    },
    /* 去视频页首屏 */
    toVideo() {
      if (this.type === 'v') this.$router.push('/video')
      else this.$router.push('/mv')
    },
    /* 推荐列表的图片 */
    relatedImgUrl(item) {
      return item?.coverUrl || item?.picUrl + '?param=200y110'
    },
    /* 推荐列表的用户名 */
    relatedNickName(item) {
      return item?.creator?.[0].userName || item?.artists?.[0].name
    },
    /* 收藏MV */
    async subVideo() {
      if (!this.isLogin) return this.$message.error('需要登录')
      let subObj = {
        type: this.type,
        id: this.id,
        t: this.subed ? 0 : 1
      }
      const res = await subVideo(subObj)
      if (res.code !== 200) return
      this.$message.success(this.subed ? '取消成功' : '收藏成功')
      this.subed = !this.subed
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
  width: 600px;
}
.vd-right {
  width: 400px;
}
.video-container {
  .video-wrap {
    video {
      width: 600px;
      height: 340px;
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
      .isfollow {
        background-color: #f8f8f8;
        color: #9b9b9b;
      }
    }
    .video-info {
      .tag {
        display: flex;
        flex-wrap: wrap;
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
.comment-container {
  margin-top: 20px;
}
.icon_liked {
  color: red;
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
@media screen and (max-width: 768px) {
  .vd-right {
    display: none;
  }
}
@media screen and (max-width: 415px) {
  .video-container {
    .video-wrap {
      video {
        height: 200px;
      }
    }
  }
}
</style>