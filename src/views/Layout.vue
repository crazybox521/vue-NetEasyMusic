<template>
  <el-container class="layout-container">
    <!-- 头部 -->
    <el-header>
      <HeaderBar></HeaderBar>
    </el-header>
    <el-container>
      <!-- 左侧导航 -->
      <el-aside width="200px">
        <el-menu :default-active="activeMenu" @select="handleSelect">
          <el-menu-item
            :index="item.path"
            v-for="item in menuList"
            :key="item.path"
          >
            <span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <!-- 主体 -->
      <el-main>
        <div class="view-mian">
          <router-view></router-view>
        </div>
      </el-main>
      <!-- 抽屉显示播放列表 -->
      <el-drawer
        title="当前播放"
        :visible.sync="drawerMusicList"
        :before-close="handMusicListClose"
      >
        <div class="flex-around">
          <div class="font-12 mleft-12">总 {{ length }} 首</div>
          <div class="font-14">清空列表</div>
        </div>

        <el-divider></el-divider>
        <el-table
          :data="musicList"
          style="width: 100%"
          size="medium"
          stripe
          @row-dblclick="playMusic"
          v-if="musicList.length != 0"
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
      <div class="div-line"></div>
      <FooterBar></FooterBar>
    </el-footer>
  </el-container>
</template>

<script>
import { mapState } from 'vuex'
import FooterBar from '../components/footer/FooterBar.vue'
import HeaderBar from '../components/header/HeaderBar.vue'
import menuList from '../config/menuList'
export default {
  components: {
    FooterBar,
    HeaderBar
  },
  data() {
    return {
      menuList,
      activeMenu: '/homepage'
    }
  },
  computed: {
    ...mapState(['musicList', 'drawerMusicList']),
    length() {
      return this.musicList.length
    }
  },
  methods: {
    /* 导航 */
    handleSelect(key, keyPath) {
      if (this.activeMenu == key) return
      if (key !== '/homepage') {
        this.activeMenu = '/homepage'
        console.log(this.activeMenu)
        const h = this.$createElement
        this.$notify({
          title: '开发中',
          message: h('i', { style: 'color: teal' }, '还在完善中')
        })
        return
      }
      this.$router.push(key)
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
@import '../assets/less/lessConfig.less';
.el-header {
  height: 9vh !important;
  background-color: @headRed;
  color: @bgWhite;
}
.el-footer {
  height: 11vh !important;
  background-color: @bgWhite;
}
.el-aside {
  padding-top: 16px;
}
.el-main {
  background-color: #ffffff;
  color: #333;
  padding: 0;
  height: 80vh;
  margin: 0;
  overflow-y: scroll;
  .view-mian {
    margin: 20px auto;
    max-width: 1260px;
  }
}
.layout-container {
  height: 100%;
}
</style>