<template>
  <div class="top-list mtop-60">
    <!-- <el-skeleton :rows="6" v-if="guanfangList.length !== 4" animated /> -->
    <!-- 官方榜区域 -->
    <div class="guanfang-list" >
      <h2 class="font-bold font-20">官方榜</h2>
      <div
        class="guanfang-item mtop-10"
        v-for="(item, listIndex) in guanfangList"
        :key="item.id"
      >
        <div class="guanfang">
          <div class="img-wrap">
            <img
              class="img-h img-radius-4 pointer"
              v-lazy="item.coverImgUrl"
              @click="toPlayListDetail(item.id)"
            />
            <div class="play-btn pointer" @click="toPlayListDetail(item.id)">
              <i class="iconfont icon-bofang"></i>
            </div>
          </div>
          <ul class="mleft-30">
            <li
              v-for="(music, index) in item.tracks"
              :key="music.id"
              class="default-cursor"
              @dblclick="playMusic(music.id, listIndex, index)"
            >
              <span class="mleft-12 text-hidden">{{ index + 1 }}</span
              ><span class="mleft-12 geming text-hidden">{{ music.name }}</span
              ><span class="zuozhe mright-10 text-hidden">{{
                music.ar[0].name
              }}</span>
            </li>
          </ul>
        </div>
        <div class="mleft-200">
          <button
            class="pointer no-btn mtop-10"
            @click="toPlayListDetail(item.id)"
          >
            查看全部<i class="el-icon-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
    <!-- 全球榜区域 -->
    <div class="global-list" v-if="guanfangList.length == 4">
      <h2 class="font-bold font-20">全球榜</h2>
      <ImgList @clickImg="toPlayListDetail" :list="globalList" type="playlist">
        <template v-slot="{ item }">
          <div class="text-hidden">
            {{ item.name }}
          </div>
        </template>
      </ImgList>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getToplist, getPlayListDetail } from '@/api/api_playlist'
import ImgList from '@/components/list/ImgList.vue'
export default {
  components: { ImgList },
  data() {
    return {
      guanfangListId: [], //官方榜ID
      guanfangList: [], //官方榜的列表
      globalList: [] //全球榜列表
    }
  },
  computed: {
    ...mapState(['musicList'])
  },
  created() {
    this.getTopList()
  },
  methods: {
    /* 排行榜页 */
    async getTopList() {
      /* 使用缓存的数据 */
      if (this.guanfangList.length !== 0) return
      const res = await getToplist()
      if (res.code !== 200) return
      /* 清空官方榜ID数组 */
      this.guanfangListId = []
      res.list.slice(0, 4).forEach((item) => {
        this.guanfangListId.push(item.id)
      })
      this.globalList = Object.freeze(res.list.slice(4))
      this.guanfangListId.forEach((item) => {
        this.getPlayList(item)
      })
    },
    /* 获取歌单详情 */
    async getPlayList(id) {
      /* 清空官方榜数据数组 */
      this.guanfangList = []
      const res = await getPlayListDetail(id)
      if (res.code !== 200) return
      res.playlist.tracks = Object.freeze(res.playlist.tracks.slice(0, 5))
      this.guanfangList.push(Object.freeze(res.playlist))
      console.log(this.guanfangList)
    },
    // 跳转到歌单详情页
    toPlayListDetail(id) {
      this.$router.push({ path: '/playlistdetail/' + id })
    },
    /* 播放音乐 */
    playMusic(id, listIndex, index) {
      this.$store.commit('setMusicList', this.guanfangList[listIndex].tracks)
      this.$store.commit('setCurrenMusicId', id)
      this.$store.commit('setPlayState', true)
      this.$store.commit('setCurrenIndex', index)
    }
  }
}
</script>

<style lang="less" scoped>
.guanfang-item {
  margin-bottom: 20px;
}
.guanfang {
  display: flex;
  height: 160px;
  ul {
    flex-grow: 1;
    li {
      height: 32px;
      line-height: 32px;
      color: #f00;
      background-color: #ffffff;
      &:nth-child(1) {
        background-color: #f9f9f9;
      }
      &:nth-child(3) {
        background-color: #efefef;
      }
      &:nth-child(4) {
        color: #666;
      }
      &:nth-child(5) {
        color: #666;
        background-color: #f9f9f9;
      }
      &:hover {
        background-color: #f4f4f4;
      }
      span {
        display: inline-block;
      }
      .geming {
        color: #373737;
      }
      .zuozhe {
        float: right;
        color: #9b9b9b;
      }
    }
  }
}
.img-wrap {
  position: relative;
  height: 160px;
  width: 160px;
  .play-btn {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fbf7f6;
    color: #ec4141;
    width: 40px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    border-radius: 50%;
    opacity: 0;
    transition: all 0.8s;
    i {
      font-size: 18px;
    }
  }
  &:hover .play-btn {
    opacity: 1;
  }
}
@media screen and(max-width:1100px) {
  .geming {
    max-width: 280px;
  }
}
@media screen and (max-width: 768px) {
  .guanfang {
    .img-wrap {
      width: 60px;
      height: 60px;
    }
    img {
      width: 60px;
      height: 60px;
    }
    .geming {
      width: 80px;
    }
    .zuozhe {
      width: 80px;
    }
  }
}
</style>