<template>
  <!-- 歌单详情 -->
  <div class="play-list-detail mtop-20">
    <el-skeleton :loading="isLoading" animated>
      <!-- 骨架 -->
       <template v-if="!isPhone" slot="template">
        <el-skeleton-item variant="image" style="width: 180px; height: 180px" />
        <div style="padding-top: 14px">
          <el-skeleton-item variant="text" style="width: 50%" />
          <div
            style="
              display: flex;
              align-items: center;
              justify-items: space-between;
              margin-top: 16px;
              height: 16px;
            "
          >
            <el-skeleton-item variant="text" style="margin-right: 16px" />
            <el-skeleton-item variant="text" style="width: 30%" />
          </div>
        </div>
      </template>
      <template>
        <div>
          <!-- 歌单图片及信息 -->
          <div class="detail-desc">
            <!-- 歌单图片 -->
            <div class="detail-img-wrapper">
              <img class="img img-radius-8 img-border" v-lazy="ImgUrl" />
            </div>
            <!-- 歌单信息 -->
            <div class="detail-desc-info">
              <div class="info-title">
                <Tag text="歌单"></Tag>
                <span class="mleft-12 font-20 font-bold">{{ info.name }}</span>
                <span
                  @click="toPlayListEdit"
                  v-if="showEditIcon"
                  class="mleft-10 font-18 pointer"
                  style="color: #a3a3a3"
                  ><i class="el-icon-edit"></i
                ></span>
              </div>
              <div class="author">
                <div class="author-img pointer" @click="toUserDetail(creator)">
                  <img class="img-h circle" :src="creator.avatarUrl" />
                </div>
                <div class="author-info">
                  <span
                    class="mleft-12 font-12 pointer"
                    @click="toUserDetail(creator)"
                    style="color: #0b58b0"
                    >{{ creator.nickname }}</span
                  >
                  <span class="mleft-12 font-12">{{
                    info.createTime | dateFormat
                  }}</span>
                </div>
              </div>
              <!-- 歌单按钮 -->
              <ul class="info-btn">
                <button class="btn btn-red" @click="playAll">
                  <i class="iconfont icon-bofang"></i>
                  <span class="btn-text">播放全部</span>
                </button>
                <button
                  v-if="!subscribed"
                  class="btn btn-white mleft-10"
                  @click="subPlaylist(1)"
                  :disabled="subDisabled"
                >
                  <i class="el-icon-folder-add"></i>
                  <span class="btn-text"
                    >收藏({{ info.subscribedCount | countFormat }})</span
                  >
                </button>
                <button
                  v-else
                  class="btn btn-white mleft-10"
                  @click="subPlaylist(2)"
                >
                  <i class="el-icon-folder-checked"></i>
                  <span class="btn-text"
                    >已收藏({{ info.subscribedCount | countFormat }})</span
                  >
                </button>
                <button class="btn btn-white mleft-10">
                  <i class="iconfont icon-fenxiang"></i>
                  <span class="btn-text"
                    >分享({{ info.shareCount | countFormat }})</span
                  >
                </button>
                <button
                  class="btn btn-red mleft-10"
                  v-show="isShowMoreBtn"
                  @click="loadCompletePlayList"
                >
                  <i class="el-icon-hot-water"></i>
                  <span class="btn-text">加载完整歌单</span>
                </button>
              </ul>
              <div class="detail-tag font-14" v-if="tags.length !== 0">
                <span>标签 ：</span>
                <span
                  class="mright-10"
                  v-for="(val, index) in tags"
                  :key="index"
                  >{{ val }}</span
                >
              </div>
              <div class="num-info font-14">
                <span>歌曲 ：{{ info.trackCount }}</span>
                <span class="mleft-12"
                  >播放 ：{{ info.playCount | countFormat }}</span
                >
              </div>
              <!-- 歌单描述 -->
              <div class="font-14">
                <input id="check" type="checkbox" />
                <div class="element">
                  <p style="max-width: 1000px">简介 ：{{ info.description }}</p>
                </div>
                <label for="check" class="check-in"
                  ><i class="iconfont icon-zhankai"></i
                ></label>
                <label for="check" class="check-out"
                  ><i class="iconfont icon-shouqi"></i
                ></label>
              </div>
            </div>
          </div>
          <!-- 歌单列表 -->
          <div class="detail-head">
            <TabMenu
              :menuList="['歌曲列表', `评论(${info.commentCount})`, '收藏者']"
              @menuClick="handMenuClick"
            ></TabMenu>
            <div class="detail-search" v-show="showtab === 1">
              <el-input
                placeholder="搜索音乐"
                clearable
                suffix-icon="el-icon-search"
                v-model="key"
              ></el-input>
            </div>
          </div>
          <div v-show="showtab === 1">
            <MusicList ref="listRef" :list="list"></MusicList>
            <div v-if="isShowMoreBtn" class="flex_center more-btn">
              点击 <i class="el-icon-hot-water"></i>
              <span class="btn-text">加载完整歌单</span> 查看更多单曲
            </div>
          </div>
          <!-- 评论 -->
          <div v-show="showtab == 2">
            <Comment
              :active="showtab == 2"
              :type="2"
              :id="$route.params.id"
              scrollDom=".main-right"
            ></Comment>
          </div>
          <div v-show="showtab == 3">
            <el-skeleton v-if="isSubloading" :rows="6" animated />
            <div v-else-if="this.pageInfo.total === 0" class="flex_center">
              当前歌单没有收藏者
            </div>
            <template v-else>
              <FollowList
                :type="1"
                :list="suberList"
                @clickImg="toUserDetail"
              ></FollowList>
              <div class="flex_center" style="width: 100%">
                <el-pagination
                  @current-change="handleCurrentChange"
                  :current-page="pageInfo.currentPage"
                  :page-size="30"
                  layout="prev, pager, next"
                  :total="pageInfo.total"
                  background
                >
                </el-pagination>
              </div>
            </template>
          </div>
        </div>
      </template>
    </el-skeleton>
  </div>
</template>

<script>
import MusicList from '@/components/list/MusicList'
import FollowList from '@/components/list/FollowList'
import Tag from '@/components/simple/Tag'
import Comment from '@/components/comment/Comment'
import TabMenu from '@/components/menu/TabMenu'
import {
  getPlayListDetail,
  getSuberList,
  setPlaylistSub
} from '@/api/api_playlist'
import { getMusicListByIds } from '@/api/api_music'
import { mapState } from 'vuex'
export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },
  components: {
    MusicList,
    Tag,
    Comment,
    FollowList,
    TabMenu
  },
  data() {
    return {
      info: {},
      key: '',
      playList: [],
      subscribed: false,
      showtab: 1,
      creator: {},
      tags: [],
      suberList: [],
      pageInfo: {
        currentPage: 1,
        total: 0
      },
      isLoading: true,
      isSubloading: true
    }
  },
  computed: {
    ...mapState(['isLogin', 'profile', 'isPhone']),
    list() {
      let reg = new RegExp(this.key.trim(), 'ig')
      return this.playList.filter((item) => {
        return item.name.match(reg)
      })
    },
    isShowMoreBtn() {
      return (
        this.playList.length < this.info.trackCount &&
        this.playList.length < 800
      )
    },
    subDisabled() {
      if (this.isLogin) return this.info.userId === this.profile.userId
      else return false
    },
    ImgUrl() {
      return this.info.coverImgUrl
        ? `${this.info.coverImgUrl}?param=300y300`
        : ''
    },
    showEditIcon() {
      return (
        this.isLogin &&
        this.profile.userId === this.creator.userId /* &&
        this.info.specialType === 0 */
      )
    }
  },
  watch: {
    id() {
      this.getPlayList()
      if (this.showtab === 3) {
        this.isSubloading = true
        this.getSuberList()
      }
    }
  },
  created() {
    this.getPlayList()
  },
  methods: {
    /* 获取歌单信息 */
    async getPlayList() {
      this.isLoading = true
      const res = await getPlayListDetail(this.id)
      if (res.code !== 200) return
      console.log(res)
      this.info = Object.freeze(res.playlist)
      this.tags = Object.freeze(res.playlist.tags)
      this.creator = Object.freeze(res.playlist.creator)
      console.log(this.creator)
      this.playList = Object.freeze(res.playlist.tracks)
      this.subscribed = res.playlist.subscribed
      this.isLoading = false
    },
    /* 获取歌单收藏者 */
    async getSuberList() {
      const res = await getSuberList({
        id: this.id,
        offset: (this.pageInfo.currentPage - 1) * 30
      })
      if (res.code !== 200) return
      this.suberList = res.subscribers
      this.pageInfo.total = res.total
      this.isSubloading = false
    },
    /* 页码变化的回调 */
    handleCurrentChange(val) {
      this.pageInfo.currentPage = val
      document.querySelector('.main-right').scrollTop = 0
      this.getSuberList()
    },
    playAll() {
      /* 访问音乐列表组件的方法 */
      this.$refs.listRef.playMusicAll()
    },
    /* 加载完整歌单 */
    async loadCompletePlayList() {
      let idArr = []
      this.info.trackIds.forEach((item) => {
        idArr.push(item.id)
      })
      if (idArr.length === 0) return
      console.log(idArr)
      /* 请求歌曲过多需要分片，不然会报431错误,这里简单处理只加载部分 */
      if (idArr.length > 800) {
        const res = await getMusicListByIds(idArr.slice(0, 800).join(','))
        if (res.code !== 200) return
        this.playList = Object.freeze(res.songs)
        this.$message.error('太多歌曲了，只加载一部分')
      } else {
        const res = await getMusicListByIds(idArr.join(','))
        if (res.code !== 200) return
        this.playList = Object.freeze(res.songs)
      }
    },
    /* 收藏/取消收藏 */
    async subPlaylist(type) {
      if (!this.isLogin) return this.$message.warning('需要登录')
      let cancel = false
      if (this.subscribed)
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
      const res = await setPlaylistSub(this.id, type)
      if (res.code !== 200) return
      this.subscribed = !this.subscribed
      if (type == 1) this.$message.success('收藏成功')
      else this.$message.success('取消收藏成功')
      this.$store.dispatch('getMyPlayList')
    },
    toUserDetail(item) {
      if (typeof item === 'object')
        this.$router.push('/userdetail/' + item.userId)
    },
    /* menu按钮点击回调 */
    handMenuClick(type) {
      type = type + 1
      if (this.showtab === type) return
      this.showtab = type
      if (this.showtab === 3) {
        this.isSubloading = true
        this.getSuberList()
      }
    },
    toPlayListEdit() {
      this.$router.push('/playlistedit/' + this.id)
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