<template>
  <el-container class="home-container">
    <el-header>
      <el-input
        placeholder="请输入内容"
        v-model="searchInfo.keywords"
        @change="search"
        clearable
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="search"
        ></el-button>
      </el-input>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu default-active="2" @open="handleOpen" @close="handleClose">
          <el-menu-item index="1">
            <span slot="title">发现音乐</span>
          </el-menu-item>
          <el-menu-item index="2">
            <span slot="title">播客</span>
          </el-menu-item>
          <el-menu-item index="3">
            <span slot="title">视频</span>
          </el-menu-item>
          <el-menu-item index="4">
            <span slot="title">朋友</span>
          </el-menu-item>
          <el-menu-item index="5">
            <span slot="title">直播</span>
          </el-menu-item>
          <el-menu-item index="6">
            <span slot="title">私人FM</span>
          </el-menu-item>
          <el-menu-item index="7">
            <span slot="title">最近播放</span>
          </el-menu-item>
          <el-menu-item index="6">
            <span slot="title">我喜欢的音乐</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <div>共找到{{ total }}首单曲</div>
        <el-table
          :data="seachList"
          style="width: 100%"
          size="medium"
          stripe
          @row-dblclick="playMusic"
        >
          <el-table-column type="index" width="50"> </el-table-column>
          <el-table-column width="50">
            <i class="el-icon-download"></i>
          </el-table-column>
          <el-table-column prop="name" label="音乐标题"> </el-table-column>
          <el-table-column prop="ar[0].name" label="歌手" width="180">
          </el-table-column>
          <el-table-column prop="al.name" label="专辑名"> </el-table-column>
          <el-table-column prop="dt" label="时长" width="180">
          </el-table-column>
        </el-table>
        <!-- <router-view></router-view> -->
      </el-main>
    </el-container>
    <el-footer>
      <FooterBar></FooterBar>
    </el-footer>
  </el-container>
</template>

<script>
import { mapState } from 'vuex'
import { search } from '../../api/api.js'
import FooterBar from '../../components/footer/FooterBar.vue'
export default {
  components: {
    FooterBar
  },
  data() {
    return {
        /* 搜索分页信息 */
      searchInfo: {
        keywords: '海阔天空',
        limit: 20,
        offset: 0
      },
      total: 0,
      /* 检索到的列表 */
      seachList: []
    }
  },
  computed: {
    ...mapState(['musicList'])
  },
  methods: {
      /* 搜索音乐 */
    async search() {
      if (this.searchInfo.keywords == '') return
      const { data: res } = await search(this.searchInfo)
      console.log('@result', res.result)
      if (res.code !== 200) return this.$message.error('请求失败')
      this.seachList = res.result.songs
      this.total = res.result.songCount
      console.log('@musicList', this.seachList)
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
    },
    /* 播放音乐 */
    playMusic(row) {
      this.$store.commit('setMusicList', this.seachList)
      this.$store.commit('setCurrenMusicId', row.id)
      this.$store.commit('setPlayState', true)
      this.getIndex(row.id)
    },
    // 获取下标
    getIndex(id) {
      if (this.musicList.length === 0) return
      let index = this.musicList.findIndex(
        (item) => item.id == id
      )
      console.log(index)
      this.$store.commit('setCurrenIndex', index)
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../assets/lessConfig.less';
.el-header,
.el-footer {
  line-height: 60px;
}
.el-header {
  background-color: @headRed;
  color: @bgWhite;
}
.el-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: @bgWhite;
  outline: 1px solid @border;
}
.el-main {
  background-color: #e9eef3;
  color: #333;
  padding: 0;
  height: 100%;
  margin: 0;
  overflow-y: scroll;
}

.home-container {
  margin-bottom: 40px;
  height: 100%;
}
</style>