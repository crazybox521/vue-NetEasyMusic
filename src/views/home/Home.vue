<template>
  <el-container class="home-container">
    <!-- 头部 -->
    <el-header>
      <HeaderBar></HeaderBar>
    </el-header>
    <el-container>
      <!-- 左侧导航 -->
      <el-aside width="200px">
        <el-menu default-active="1" @select="handleSelect">
          <el-menu-item
            :index="index + 1+''"
            v-for="(item, index) in menuList"
            :key="index"
          >
            <span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <!-- 主体 -->
      <el-main>
        <router-view></router-view>
      </el-main>
      <!-- 抽屉显示播放列表 -->
      <el-drawer
        title="当前播放"
        :visible.sync="drawerMusicList"
        :before-close="handMusicListClose"
      >
        <el-table
          :data="musicList"
          style="width: 100%"
          size="medium"
          stripe
          @row-dblclick="playMusic"
        >
          <el-table-column type="index" width="50"> </el-table-column>
          <el-table-column prop="name" label="音乐标题"> </el-table-column>
          <el-table-column prop="ar[0].name" label="歌手"> </el-table-column>
          <el-table-column prop="dt" label="时长">
            <template v-slot="scope">
              {{ (scope.row.dt / 1000) | timeFormat }}
            </template>
          </el-table-column>
        </el-table>
      </el-drawer>
    </el-container>
    <el-footer>
      <!-- 底部播放器 -->
      <FooterBar></FooterBar>
    </el-footer>
  </el-container>
</template>

<script>
import { mapState } from 'vuex'
import FooterBar from '../../components/footer/FooterBar.vue'
import HeaderBar from '../../components/header/HeaderBar.vue'
import menuList from '../../config/menuList'
export default {
  components: {
    FooterBar,
    HeaderBar
  },
  data() {
    return {
      menuList
    }
  },
  computed: {
    ...mapState(['musicList', 'drawerMusicList'])
  },
  methods: {
    /* 导航 */
    handleSelect(key, keyPath) {
      console.log(key, keyPath)
    },
    handMusicListClose() {
      this.$store.commit('setDrawerMusicList', false)
    },
    /* 播放音乐 */
    playMusic(row) {
      this.$store.commit('setCurrenMusicId', row.id)
      this.$store.commit('setPlayState', true)
      this.getIndex(row.id)
    },
    // 获取并改变当前播放下标
    getIndex(id) {
      if (this.musicList.length === 0) return
      let index = this.musicList.findIndex((item) => item.id == id)
      console.log(index)
      this.$store.commit('setCurrenIndex', index)
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../assets/less/lessConfig.less';
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

.el-table {
  cursor: default;
}
</style>