<template>
  <!-- 歌单详情 -->
  <div class="play-list-detail mtop-20" v-if="this.info.creator">
    <!-- 歌单图片及信息 -->
    <div class="detail-desc">
      <!-- 歌单图片 -->
      <div class="detail-img-wrapper">
        <img
          class="img img-radius-8 img-border"
          :src="info.coverImgUrl + '?param=300y300'"
        />
      </div>
      <!-- 歌单信息 -->
      <div class="detail-desc-info">
        <div class="info-title">
          <Tag text="歌单"></Tag>
          <span class="mleft-12 font-20 font-bold">{{ info.name }}</span>
        </div>
        <div class="author">
          <div
            class="author-img pointer"
            @click="toUserDetail(info.creator.userId)"
          >
            <img class="img-h circle" :src="info.creator.avatarUrl" />
          </div>
          <div class="author-info">
            <span
              class="mleft-12 font-12 pointer"
              @click="toUserDetail(info.creator.userId)"
              style="color: #0b58b0"
              >{{ info.creator.nickname }}</span
            >
            <span class="mleft-12 font-12">{{
              info.createTime | dateFormat
            }}</span>
          </div>
        </div>
        <!-- 歌单按钮 -->
        <ul class="info-btn">
          <button class="btn btn-red" @click="playAll">
            <i class="iconfont icon-bofang"></i> 播放全部
          </button>
          <button
            v-if="!subscribed"
            class="btn btn-white mleft-10"
            @click="subPlaylist(1)"
          >
            <i class="el-icon-folder-add"></i>
            收藏({{ info.subscribedCount | countFormat }})
          </button>
          <button v-else class="btn btn-white mleft-10" @click="subPlaylist(2)">
            <i class="el-icon-folder-checked"></i>
            已收藏({{ info.subscribedCount | countFormat }})
          </button>
          <button class="btn btn-white mleft-10">
            <i class="iconfont icon-fenxiang"></i>
            分享({{ info.shareCount | countFormat }})
          </button>
          <button
            class="btn btn-red mleft-10"
            v-show="isShowMoreBtn"
            @click="loadCompletePlayList"
          >
            <i class="el-icon-hot-water"></i>
            加载完整歌单
          </button>
        </ul>
        <div class="detail-tag font-14" v-if="info.tags.length !== 0">
          <span>标签 ：</span>
          <span
            class="mright-10"
            v-for="(val, index) in info.tags"
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
            <p>简介 ：{{ info.description }}</p>
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
          评论({{ info.commentCount }})
        </li>
        <li
          @click="handMenuClick(3)"
          class="pointer"
          :class="{ isActive: showtab === 3 }"
        >
          收藏者
        </li>
      </ul>
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
        点击 加载完整歌单 查看更多单曲
      </div>
    </div>
    <!-- 评论 -->
    <div v-show="showtab == 2">
      <Comment :active="showtab == 2" :type="2" :id="$route.params.id"></Comment>
    </div>
    <div v-show="showtab == 3">收藏者</div>
  </div>
</template>

<script>
import MusicList from '@/components/list/MusicList'
import Tag from '@/components/simple/Tag'
import Comment from '@/components/comment/Comment'
import { getPlayListDetail } from '@/api/api_playlist'
import { getMusicListByIds } from '@/api/api_music'
import { setPlaylistSub } from '@/api/api_sub'
import { mapState } from 'vuex'
export default {
  components: {
    MusicList,
    Tag,
    Comment
  },
  data() {
    return {
      info: {},
      key: '',
      playList: [],
      subscribed: false,
      showtab: 1,
    }
  },
  computed: {
    ...mapState(['isLogin']),
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
    }
  },
  created() {
    this.getPlayList(this.$route.params.id)
  },
  mounted() {
    document.querySelector('.main-right').scrollTop = 0
  },
  methods: {
    /* 获取歌单信息 */
    async getPlayList(id) {
      const { data: res } = await getPlayListDetail(id, Date.now())
      if (res.code !== 200) return
      console.log(res)
      this.info = res.playlist
      this.playList = res.playlist.tracks
      this.subscribed = res.playlist.subscribed
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
        const { data: res } = await getMusicListByIds(
          idArr.slice(0, 800).join(',')
        )
        if (res.code !== 200) return
        this.playList = res.songs
        this.$message.error('太多歌曲了，只加载一部分')
      } else {
        const { data: res } = await getMusicListByIds(idArr.join(','))
        console.log('111')
        if (res.code !== 200) return
        this.playList = res.songs
      }
    },
    /* 收藏/取消收藏 */
    async subPlaylist(type) {
      if (!this.isLogin) return this.$message.error('需要登录')
      const { data: res } = await setPlaylistSub(this.$route.params.id, type)
      if (res.code !== 200) return
      this.subscribed = !this.subscribed
      if (type == 1) this.$message.success('收藏成功')
      else this.$message.success('取消收藏成功')
    },
   
    toUserDetail(id) {
      this.$router.push('/userdetail/' + id)
    },
    handMenuClick(type) {
      if (this.showtab === type) return
      this.showtab = type
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
.more-btn {
  margin-top: 10px;
  font-size: 14px;
  color: #bbb;
}
/* 列表头部区域 */
.detail-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
@media screen and (max-width: 768px) {
  .detail-search {
    display: none;
  }
  .info-btn {
    display: flex;
    flex-wrap: wrap;
    .btn {
      margin: 5px;
    }
  }
}
</style>