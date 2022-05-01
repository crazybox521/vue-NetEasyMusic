<template>
  <div class="album-detail mtop-20">
    <!-- 专辑图片及信息 -->
    <div class="detail-desc">
      <!-- 专辑图片 -->
      <div class="detail-img-wrapper">
        <img
          class="img img-radius-8 img-border"
          v-lazy="imgUrl + '?param=300y300'"
        />
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
            <i class="iconfont icon-bofang"></i>
            <span class="btn-text">播放全部</span>
          </button>
          <button
            v-if="!isSub"
            class="btn btn-white mleft-10"
            @click="subAlbum(1)"
          >
            <i class="el-icon-folder-add"></i>
            <span class="btn-text">收藏({{ subCount | countFormat }})</span>
          </button>
          <button v-else class="btn btn-white mleft-10" @click="subAlbum(0)">
            <i class="el-icon-folder-checked"></i>
            <span class="btn-text">已收藏({{ subCount | countFormat }})</span>
          </button>
          <button class="btn btn-white mleft-10">
            <i class="iconfont icon-fenxiang"></i>
            <span class="btn-text">分享({{ shareCount | countFormat }})</span>
          </button>
        </ul>
        <div class="author font-14">
          <span>歌手：</span>
          <span
            class="pointer author-name"
            v-for="a in albumInfo.artists"
            :key="a.id"
            @click="toArtistDetail(a.id)"
            >{{ a.name }}
          </span>
        </div>
        <div class="">
          <span class="font-14">
            时间：{{ albumInfo.publishTime | dateFormat }}</span
          >
        </div>
      </div>
    </div>
    <!-- 专辑列表 -->
    <div class="detail-head">
      <TabMenu
        :menuList="['歌曲列表', '评论', '专辑详情']"
        @menuClick="handMenuClick"
      />
    </div>
    <MusicList v-show="showtab === 1" ref="listRef" :list="list" />
    <Comment
      v-show="showtab == 2"
      :active="showtab == 2"
      :type="3"
      :id="$route.params.id"
      scrollDom=".main-right"
    />
    <div v-show="showtab == 3">
      <div class="font-bold">专辑介绍</div>
      <div class="my-pre" v-if="description.lengtj !== 0">
        <p v-for="(item, index) in description" :key="index">
          {{ item }}
        </p>
      </div>
      <div v-else style="text-align: center">没有专辑详情</div>
    </div>
  </div>
</template>

<script>
import { getAlbumDetail, getAlbumDynamic, setAlbumSub } from '@/api/api_album'
import Tag from '@/components/simple/Tag.vue'
import MusicList from '@/components/list/MusicList.vue'
import Comment from '@/components/comment/Comment.vue'
import TabMenu from '@/components/menu/TabMenu'
import { mapState } from 'vuex'
export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },
  components: {
    Tag,
    MusicList,
    Comment,
    TabMenu
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
    },
    description() {
      return this.albumInfo.description
        ? this.albumInfo.description.split('\n')
        : []
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
      const res = await getAlbumDetail(this.id)
      if (res.code !== 200) return
      console.log(res)
      this.list = Object.freeze(res.songs)
      this.albumInfo = Object.freeze(res.album)
    },
    /* 收藏、取消收藏 */
    async subAlbum(type) {
      if (!this.isLogin) return this.$message.warning('需要登录')
      let cancel = false
      if (this.isSub)
        await this.$confirm('确认取消收藏吗？', '确认信息', {
          distinguishCancelAndClose: true,
          confirmButtonText: '确认',
          cancelButtonText: '放弃'
        })
          .then(() => {
            cancel = false
          })
          .catch((action) => {
            cancel = true
            this.$message({
              type: 'info',
              message: action === 'cancel' ? '取消' : '出错'
            })
          })
      if (cancel) return
      const res = await setAlbumSub(this.id, type)
      if (res.code !== 200) return
      this.isSub = !this.isSub
      if (type == 1) this.$message.success('收藏成功')
      else this.$message.success('取消收藏成功')
    },
    /* 获取点赞评论信息 */
    async getAlbumDynamic() {
      const res = await getAlbumDynamic(this.id)
      if (res.code !== 200) return
      this.isSub = res.isSub
      this.shareCount = res.shareCount
      this.commentCount = res.commentCount
      this.subCount = res.subCount
    },
    handMenuClick(val) {
      this.showtab = val + 1
    },
    toArtistDetail(id) {
      if (typeof id === 'number') this.$router.push('/artistdetail/' + id)
    }
  }
}
</script>
<style lang="less" scoped>
/* 歌单信息区域 */
.detail-desc {
  display: flex;

  .detail-img-wrapper {
    width: 180px;
    height: 180px;
  }

  .detail-desc-info {
    line-height: 24px;
    margin-left: 20px;

    .author {
      margin: 5px 0;
      display: flex;
      flex-wrap: wrap;
      .author-img {
        height: 24px;
      }
      .author-name {
        color: #3771dd;
        &::after {
          display: inline;
          color: #000;
          margin: 4px;
          content: '/';
        }
        &:last-child::after {
          content: '';
        }
      }
    }

    .info-btn {
      margin: 5px 0;
    }
  }
}

.more-btn {
  margin-top: 10px;
  font-size: 14px;
  color: #bbb;
}

/* 列表头部区域 */
.detail-head {
  display: flex;
  background-color: #fff;
  justify-content: space-between;
  align-items: center;
}

/* 文字展开收起效果 */
.element {
  max-height: 20px;
  overflow: hidden;
  transition: max-height 1s;
}

:checked ~ .element {
  max-height: 666px;
}

input[type='checkbox'] {
  position: absolute;
  clip: rect(0 0 0 0);
}

:checked ~ .check-in {
  display: none;
}

:checked ~ .check-out {
  display: inline-block;
}

.check-out {
  display: none;
}

.check-in,
.check-out {
  color: #34538b;
  cursor: pointer;
}

.comment {
  background-color: #fff;
}
.my-pre {
  text-indent: 2em;
  line-height: 2;
  width: 100%;
  p {
    color: #676767;
  }
}
@media screen and (max-width: 768px) {
  .detail-desc {
    display: block;
    position: relative;

    .detail-img-wrapper {
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.5;
      border-radius: 8px;
      overflow: hidden;

      img {
        transform: translateY(-20%);
        border: none;
      }
    }

    .detail-desc-info {
      padding-top: 10px;
    }
  }

  /* .detail-search {
      display: none;
    } */
  .info-btn {
    display: flex;
    flex-wrap: wrap;

    .btn {
      margin: 5px;
    }
  }
}

@media screen and (max-width: 415px) {
  .detail-desc {
    display: block;
    position: relative;

    .detail-img-wrapper {
      img {
        transform: none;
      }
    }

    .detail-desc-info {
      min-height: 60vw;
      position: relative;
    }
  }

  .detail-search {
    display: none;
  }
}
</style>