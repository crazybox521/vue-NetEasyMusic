<template>
  <div class="album-detail mtop-20">
    <!-- 专辑图片及信息 -->
    <div class="detail-desc">
      <!-- 专辑图片 -->
      <div class="detail-img-wrapper">
        <img class="img img-radius-4" :src="imgUrl + '?param=300y300'" alt="" />
      </div>
      <!-- 专辑信息 -->
      <div class="detail-desc-info">
        <div class="inf o-title">
          <Tag text="专辑"></Tag>
          <span class="mleft-12 font-bold font-20">{{ albumInfo.name }}</span>
        </div>
        <!-- 专辑按钮 -->
        <ul class="info-btn">
          <button class="btn btn-red" @click="playAll">
            <i class="iconfont icon-bofang"></i> 播放全部
          </button>
          <button
            v-if="!isSub"
            class="btn btn-white mleft-10"
            @click="subAlbum(1)"
          >
            <i class="el-icon-folder-add"></i>
            收藏({{ subCount | countFormat }})
          </button>
          <button v-else class="btn btn-white mleft-10" @click="subAlbum(0)">
            <i class="el-icon-folder-checked"></i>
            已收藏({{ subCount | countFormat }})
          </button>
          <button class="btn btn-white mleft-10">
            <i class="iconfont icon-fenxiang"></i>
            分享({{ shareCount | countFormat }})
          </button>
        </ul>
        <div class="author font-14">
          <span>歌手：</span>
          <span v-for="a in albumInfo.artists" :key="a.id"
            >{{ a.name }} /
          </span>
        </div>
        <div class="author">
          <span class="font-14">
            时间：{{ albumInfo.publishTime | dateFormat }}</span
          >
        </div>
      </div>
    </div>
    <!-- 专辑列表 -->
    <div class="detail-table">
      <ul class="detail-menu">
        <li
          @click="handMenuClick(1)"
          class="pointer"
          :class="{ isActive: showtab === 1 }"
        >
          歌曲列表
        </li>
        <li
          @click="handMenuClick(2)"
          class="pointer"
          :class="{ isActive: showtab === 2 }"
        >
          评论({{ commentCount }})
        </li>
        <li
          @click="handMenuClick(3)"
          class="pointer"
          :class="{ isActive: showtab === 3 }"
        >
          专辑详情
        </li>
      </ul>
    </div>
    <MusicList v-show="showtab === 1" ref="listRef" :list="list"></MusicList>
    <Comment
      v-show="showtab == 2"
      :active="showtab == 2"
      :type="3"
      :id="$route.params.id"
    ></Comment>
    <div v-show="showtab == 3">专辑详情</div>
  </div>
</template>

<script>
import { getAlbumDetail, getAlbumDynamic } from '@/api/api_album'
import { setAlbumSub } from '@/api/api_sub'
import Tag from '@/components/simple/Tag.vue'
import MusicList from '@/components/list/MusicList.vue'
import Comment from '@/components/comment/Comment.vue'
import { mapState } from 'vuex'
export default {
  components: {
    Tag,
    MusicList,
    Comment
  },
  data() {
    return {
      albumInfo: {},
      list: [],
      isSub: false,
      shareCount: 0,
      commentCount: 0,
      subCount: 0,
      showtab: 1
    }
  },
  computed: {
    ...mapState(['isLogin']),
    imgUrl() {
      return this.albumInfo.picUrl
        ? this.albumInfo.picUrl + '?param=300y300'
        : ''
    }
  },
  created() {
    this.getAlbum()
    this.getAlbumDynamic()
  },
  methods: {
    playAll() {
      this.$refs.listRef.playMusicAll()
    },
    /* 获取专辑信息 */
    async getAlbum() {
      const { data: res } = await getAlbumDetail(this.$route.params.id)
      if (res.code !== 200) return
      console.log(res)
      this.list = res.songs
      this.albumInfo = res.album
    },
    /* 收藏、取消收藏 */
    async subAlbum(type) {
      if (!this.isLogin) return this.$message.error('需要登录')
      const { data: res } = await setAlbumSub(this.$route.params.id, type)
      if (res.code !== 200) return
      this.isSub = !this.isSub
      if (type == 1) this.$message.success('收藏成功')
      else this.$message.success('取消收藏成功')
    },
    async getAlbumDynamic() {
      const { data: res } = await getAlbumDynamic(this.$route.params.id)
      if (res.code !== 200) return
      this.isSub = res.isSub
      this.shareCount = res.shareCount
      this.commentCount = res.commentCount
      this.subCount = res.subCount
    },
    handMenuClick(val) {
      this.showtab = val
    }
  }
}
</script>

<style lang="less" scoped>
.detail-table {
  display: flex;
  justify-content: space-between;
  .detail-menu {
    display: flex;
    justify-content: space-between;
    align-items: center;
    li {
      margin: 10px;
      &.isActive {
        font-size: 18px;
        font-weight: bold;
        &::after {
          display: block;
          content: '';
          height: 4px;
          width: 90%;
          margin: 0 auto;
          background-color: #ec4141;
          border-radius: 2px;
        }
      }
    }
  }
}

.detail-desc {
  display: flex;
  .detail-img-wrapper {
    width: 180px;
    height: 180px;
  }
  .detail-desc-info {
    width: 1000px;
    line-height: 24px;
    margin-left: 20px;
    .author {
      margin: 5px 0;
      height: 24px;
      display: flex;
      .author-img {
        height: 24px;
      }
    }
    .info-btn {
      margin: 5px 0;
    }
  }
}
@media screen and (max-width: 768px) {
  .info-btn {
    display: flex;
    flex-wrap: wrap;
    .btn {
      margin: 5px;
    }
  }
}
</style>