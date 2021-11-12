<template>
  <div class="album-detail">
    <!-- 专辑图片及信息 -->
    <div class="detail-desc">
      <!-- 专辑图片 -->
      <div class="detail-img-wrapper">
        <el-image class="img img-radius-4" :src="imgUrl" alt="" />
      </div>
      <!-- 歌单信息 -->
      <div class="detail-desc-info">
        <div class="inf o-title">
          <Tag text="专辑"></Tag>
          <span class="mleft-12 font-bold font-20">{{ albumInfo.name }}</span>
        </div>
        <!-- 歌单按钮 -->
        <ul class="info-btn">
          <el-button type="danger" @click="playAll" round>播放全部</el-button>
          <el-button round>收藏</el-button>
          <el-button round>分享({{ shareCount | countFormat }})</el-button>
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
    <!-- 歌单列表 -->
    <div class="detail-table">
      <ul class="detail-menu">
        <li>歌曲列表</li>
        <li>评论({{ commentCount }})</li>
        <li>专辑详情</li>
      </ul>
    </div>
    <MusicList ref="listRef" :list="list"></MusicList>
  </div>
</template>

<script>
import { getAlbumDetail } from '../../api/api'
import Tag from '../../components/simple/Tag.vue'
import MusicList from '../../components/list/MusicList.vue'
export default {
  components: {
    Tag,
    MusicList
  },
  data() {
    return {
      albumInfo: {},
      list: []
    }
  },
  computed: {
    imgUrl() {
      return this.albumInfo.picUrl
        ? this.albumInfo.picUrl + '?param=300y300'
        : ''
    },
    shareCount() {
      return this.albumInfo.info ? this.albumInfo.info.shareCount : 0
    },
    commentCount() {
      return this.albumInfo.info ? this.albumInfo.info.commentCount : 0
    }
  },
  created() {
    this.getAlbum()
  },
  methods: {
    playAll() {
      this.$refs.listRef.playMusicAll()
    },
    /* 获取专辑信息 */
    async getAlbum() {
      const { data: res } = await getAlbumDetail(this.$route.params.id)
      if (res.code !== 200) return
      this.list = res.songs
      this.albumInfo = res.album
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
  .info-btn{
    display: flex;
    flex-wrap: wrap;
    .el-button{
      margin: 5px;
    }
  }
}
</style>