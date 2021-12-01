<template>
  <!-- 喜欢的音乐 -->
  <div class="play-list-detail mtop-20">
    <!-- 歌单图片及信息 -->
    <template v-if="!isLoading">
      <div class="detail-desc">
        <!-- 歌单图片 -->
        <div class="detail-img-wrapper">
          <img
            class="img img-radius-4"
            :src="imgUrl + '?param=300y300'"
            alt=""
          />
        </div>
        <!-- 歌单信息 -->
        <div class="detail-desc-info">
          <div class="info-title">
            <Tag text="歌单"></Tag>
            <span class="mleft-12 font-20 font-bold">我喜欢的音乐</span>
          </div>
          <div class="author">
            <div class="author-img">
              <img class="img-h circle" :src="profile.avatarUrl" />
            </div>
            <div class="author-info">
              <span class="mleft-12 font-12">{{ profile.nickname }}</span>
              <span class="mleft-12 font-12">{{
                profile.createTime | dateFormat
              }}</span>
            </div>
          </div>
          <!-- 歌单按钮 -->
          <ul class="info-btn">
            <button class="btn btn-red" @click="playAll">
              <i class="iconfont icon-bofang"></i> 播放全部
            </button>
          </ul>
          <div class="num-info font-14">
            <span>歌曲 ：{{ total }}</span>
          </div>
        </div>
      </div>
      <!-- 歌单列表 -->
      <div class="detail-table">
        <ul class="detail-menu">
          <li class="font-bold">歌曲列表</li>
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
    </template>
    <template v-else>
      <el-skeleton :rows="14" animated />
    </template>
  </div>
</template>

<script>
import MusicList from '@/components/list/MusicList'
import Tag from '@/components/simple/Tag.vue'
import { getMusicListByIds, getLikeIdList } from '@/api/api'
import { mapState } from 'vuex'
export default {
  components: {
    MusicList,
    Tag
  },
  data() {
    return {
      key: '',
      likeList: [],
      isLoading: false
    }
  },
  computed: {
    ...mapState(['profile']),
    list() {
      let reg = new RegExp(this.key.trim(), 'ig')
      return this.likeList.filter((item) => {
        return item.name.match(reg)
      })
    },
    total() {
      return this.likeList.length
    },
    imgUrl() {
      return this.likeList.length !== 0 ? this.likeList[0].al.picUrl : ''
    }
  },
  created() {
    this.getLikeId()
  },
  mounted() {
    document.querySelector('.main-right').scrollTop = 0
  },
  methods: {
    playAll() {
      /* 访问音乐列表组件的方法 */
      this.$refs.listRef.playMusicAll()
    },
    /* 获取喜欢歌曲列表 */
    async getLikeId() {
      this.isLoading = true
      const { data: res } = await getLikeIdList(this.profile.userId)
      if (res.code !== 200) return
      this.loadCompletePlayList(res.ids.join(','))
    },
    /* 获取完整歌单 */
    async loadCompletePlayList(ids) {
      if (ids.length == '') return
      const { data: res } = await getMusicListByIds(ids)
      if (res.code !== 200) return
      this.likeList = res.songs
      console.log(this.likeList)
      this.isLoading = false
    }
  }
}
</script>

<style lang="less" scoped>
.detail-table {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  .info-btn {
    display: flex;
    flex-wrap: wrap;
    .el-button {
      margin: 5px;
    }
  }
}
</style>