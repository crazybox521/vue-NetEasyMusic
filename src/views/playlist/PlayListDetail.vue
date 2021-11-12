<template>
  <div class="play-list-detail" v-if="this.info.creator">
    <!-- 歌单图片及信息 -->
    <div class="detail-desc">
      <!-- 歌单图片 -->
      <div class="detail-img-wrapper">
        <img
          class="img img-radius-4"
          :src="info.coverImgUrl + '?param=300y300'"
          alt=""
        />
      </div>
      <!-- 歌单信息 -->
      <div class="detail-desc-info">
        <div class="info-title">
          <Tag text="歌单"></Tag>
          <span class="mleft-12 font-20 font-bold">{{ info.name }}</span>
        </div>
        <div class="author">
          <div class="author-img">
            <img class="img-h circle" :src="info.creator.avatarUrl" />
          </div>
          <div class="author-info">
            <span class="mleft-12 font-12">{{ info.creator.nickname }}</span>
            <span class="mleft-12 font-12">{{
              info.createTime | dateFormat
            }}</span>
          </div>
        </div>
        <!-- 歌单按钮 -->
        <ul class="info-btn">
          <el-button type="danger" @click="playAll" round>播放全部</el-button>
          <el-button round
            >收藏({{ info.subscribedCount | countFormat }})</el-button
          >
          <el-button round>分享({{ info.shareCount | countFormat }})</el-button>
          <el-button
            v-show="isShowMoreBtn"
            type="danger"
            round
            @click="loadCompletePlayList"
            >加载完整歌单</el-button
          >
        </ul>
        <div class="detail-tag font-14" v-if="info.tags.length !== 0">
          <span>标签 ：</span>
          <span v-for="(val, index) in info.tags" :key="index">{{ val }}</span>
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
    <div class="detail-table">
      <ul class="detail-menu">
        <li>歌曲列表</li>
        <li>评论({{ info.commentCount }})</li>
        <li>收藏者</li>
      </ul>
      <div class="detail-search">
        <el-input
          placeholder="搜索音乐"
          clearable
          suffix-icon="el-icon-search"
          v-model="key"
        ></el-input>
      </div>
    </div>
    <MusicList ref="listRef" :list="list"></MusicList>
    <div v-if="isShowMoreBtn" class="margin-center w-300 mtop-10">
      <span>登录</span>
      <span>或</span>
      <span>点击加载完整歌单</span>
      <span>查看更多单曲</span>
    </div>
  </div>
</template>

<script>
import MusicList from '../../components/list/MusicList'
import Tag from '../../components/simple/Tag.vue'
import { getPlayListDetail, getMusicListByIds } from '../../api/api'
export default {
  components: {
    MusicList,
    Tag
  },
  data() {
    return {
      info: {},
      isLogin: false,
      key: '',
      playList: []
    }
  },
  computed: {
    list() {
      let reg = new RegExp(this.key.trim(), 'ig')
      return this.playList.filter((item) => {
        return item.name.match(reg)
      })
    },
    isShowMoreBtn() {
      return this.playList.length < this.info.trackCount
    }
  },
  created() {
    this.getPlayList(this.$route.params.id)
  },
  mounted() {},
  methods: {
    /* 获取歌单信息 */
    async getPlayList(id) {
      const { data: res } = await getPlayListDetail(id)
      if (res.code !== 200) return
      this.info = res.playlist
      this.playList = res.playlist.tracks
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
      const { data: res } = await getMusicListByIds(idArr.join(','))
      console.log('111')
      if (res.code !== 200) return
      this.playList = res.songs
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
@media screen and (max-width:768px) {
  .detail-search{
    display: none;
  }
}
</style>