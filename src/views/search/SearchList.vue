<template>
  <!-- 搜索页 -->
  <!-- 头部区域相关功能组件 -->
  <div class="search-list mtop-20">
    <div class="font-bold">找到 {{ total }} {{ desInfo }}</div>

    <ul class="search-menu">
      <li
        v-for="(item, index) in text"
        @click="handMenuClick(index)"
        class="pointer search-menu-item"
        :class="{ isActive: vIndex === index }"
        :key="index"
      >
        {{ item }}
      </li>
    </ul>

    <el-skeleton v-if="isLoading" :rows="12" animated />
    <template v-else-if="total !== 0">
      <!-- 歌曲 -->
      <MusicList v-if="vIndex === 0" :list="searchList.musicList"></MusicList>
      <!-- 专辑 -->
      <InfoList
        @clickitem="toAlbumDetail"
        v-if="vIndex === 1"
        :list="searchList.albumList"
      >
        <template #img="{ item }">
          <img class="sub-img mleft-10" :src="item.picUrl + '?param=100y100'" />
        </template>
        <template #title="{ item }">
          {{ item.name }}
        </template>
        <template #item1="{ item }">
          <span style="color: #676767">{{ item.artist.name }}</span>
        </template>
      </InfoList>
      <!-- 歌手 -->
      <InfoList
        @clickitem="toArtistDetail"
        v-if="vIndex === 2"
        :list="searchList.artistList"
      >
        <template #img="{ item }">
          <img class="sub-img mleft-10" :src="item.picUrl + '?param=100y100'" />
        </template>
        <template #title="{ item }">
          {{ item.name }}
        </template>
      </InfoList>
      <!-- 歌单 -->
      <InfoList
        @clickitem="toPlayListDetail"
        v-if="vIndex === 3"
        :list="searchList.playList"
      >
        <template #img="{ item }">
          <img
            class="sub-img mleft-10"
            :src="item.coverImgUrl + '?param=100y100'"
          />
        </template>
        <template #title="{ item }">
          {{ item.name }}
        </template>
        <template #item1="{ item }"> {{ item.trackCount }} 首 </template>
        <template #item2="{ item }">
          by <span style="color: #676767">{{ item.creator.nickname }}</span>
        </template>
      </InfoList>
      <!-- 用户 -->
      <InfoList
        @clickitem="toUserDetail"
        v-if="vIndex === 4"
        :list="searchList.userList"
      >
        <template #img="{ item }">
          <img
            class="sub-img mleft-10"
            :src="item.avatarUrl + '?param=100y100'"
            alt=""
          />
        </template>
        <template #title="{ item }">
          {{ item.nickname }}
        </template>
      </InfoList>
      <!-- MV -->
      <MvList
        v-if="vIndex === 5"
        :disabled="true"
        :list="searchList.mvList"
      ></MvList>
    </template>

    <el-empty v-else :description="emptyInfo"></el-empty>
    <div class="flex_center" v-if="total !== 0">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="30"
        layout="prev, pager, next"
        :total="total"
        background
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { search } from '@/api/api_other'
import MusicList from '@/components/list/MusicList'
import InfoList from '@/components/list/InfoList.vue'
import MvList from '@/components/list/MvList.vue'
export default {
  components: {
    MusicList,
    InfoList,
    MvList
  },
  data() {
    return {
      /* 搜索分页信息 */
      searchInfo: {
        keywords: '',
        limit: 30,
        offset: 0,
        type: 1
      },
      /* 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1014: 视频*/
      searchType: [1, 10, 100, 1000, 1002, 1004],
      sizeText: ['首', '张', '位', '个', '位', '个'],
      text: ['单曲', '专辑', '歌手', '歌单', '用户', 'MV'],
      total: 0,
      /* 检索到的列表 */
      searchList: {
        musicList: [],
        albumListL: [],
        artistList: [],
        playList: [],
        userList: [],
        mvList: []
      },
      isLoading: true,
      vIndex: 0
    }
  },
  computed: {
    currentPage() {
      return this.searchInfo.offset / this.searchInfo.limit + 1
    },
    desInfo() {
      return this.sizeText[this.vIndex] + this.text[this.vIndex]
    },
    emptyInfo() {
      return (
        '很抱歉，未能找到与' +
        this.searchInfo.keywords +
        '有关的' +
        this.text[this.vIndex]
      )
    }
  },
  watch: {
    '$route.params.key'(val) {
      this.searchInfo.keywords = val
      this.search()
    },
    vIndex(val) {
      this.searchInfo.type = this.searchType[val]
      this.searchInfo.offset = 0
      this.search()
    }
  },
  created() {
    this.searchInfo.keywords = this.$route.params.key
    this.search()
  },
  methods: {
    /* 搜索音乐 */
    async search() {
      if (this.searchInfo.keywords == '') return
      this.isLoading = true
      const res = await search(this.searchInfo)
      console.log(res)
      if (res.code !== 200) return this.$message.error('请求失败')
      if (Object.keys(res.result).length === 0) {
        this.total = 0
        this.isLoading = false
        return
      }
      switch (this.vIndex) {
        case 0:
          this.searchList.musicList = Object.freeze(res.result.songs)
          this.total = res.result.songCount
          break
        case 1:
          this.searchList.albumList = Object.freeze(res.result.albums)
          this.total = res.result.albumCount
          break
        case 2:
          this.searchList.artistList = Object.freeze(res.result.artists)
          this.total = res.result.artistCount
          break
        case 3:
          this.searchList.playList = Object.freeze(res.result.playlists)
          this.total = res.result.playlistCount
          break
        case 4:
          this.searchList.userList = Object.freeze(res.result.userprofiles)
          this.total = res.result.userprofileCount
          break
        case 5:
          this.searchList.mvList = Object.freeze(res.result.mvs)
          this.total = res.result.mvCount
          break
      }
      this.isLoading = false
    },
    handMenuClick(val) {
      console.log(val)
      this.vIndex = val
    },
    handleCurrentChange(val) {
      this.searchInfo.offset = 30 * (val - 1)
      this.search()
    },
    toAlbumDetail(row) {
      this.$router.push('/albumdetail/' + row.id)
    },
    toArtistDetail(row) {
      this.$router.push('/artistdetail/' + row.id)
    },
    toPlayListDetail(row) {
      this.$router.push('/playlistdetail/' + row.id)
    },
    toUserDetail(row) {
      this.$router.push('/userdetail/' + row.userId)
    }
  }
}
</script>

<style lang="less" scoped>
/* 头部搜索类型区域 */
.search-menu {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin: 20px 0;
  &-item {
    width: 40px;
    margin-right: 20px;
    line-height: 1;
    text-align: center;
    &.isActive {
      font-size: 16px;
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
</style>