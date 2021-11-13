<template>
  <div class="layout">
    <div class="header"><HeaderBar></HeaderBar></div>
    <div class="main">
      <div class="aside">
        <el-menu :default-active="activeMenu" @select="handleSelect">
          <el-menu-item
            :index="item.path"
            v-for="item in menuList"
            :key="item.path"
          >
            <span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </el-menu>
      </div>
      <div class="main-right">
        <div class="view-mian">
          <router-view></router-view>
        </div>
        <el-backtop target=".view-mian" :bottom="100"></el-backtop>
      </div>
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
          <el-table-column prop="name" show-overflow-tooltip label="音乐标题">
          </el-table-column>
          <el-table-column prop="ar[0].name" show-overflow-tooltip label="歌手">
          </el-table-column>
          <el-table-column prop="dt" label="时长">
            <template v-slot="scope">
              {{ (scope.row.dt / 1000) | timeFormat }}
            </template>
          </el-table-column>
        </el-table>
      </el-drawer>
    </div>
    <div class="footer">
      <div class="div-line"></div>
      <FooterBar></FooterBar>
    </div>
  </div>
</template>

<script>
import notifyMixin from '../mixins/notifyMixin'
import { mapState } from 'vuex'
import FooterBar from '../components/footer/FooterBar.vue'
import HeaderBar from '../components/header/HeaderBar.vue'
import menuList from '../config/menuList'
export default {
  mixins: [notifyMixin],
  components: {
    FooterBar,
    HeaderBar
  },
  data() {
    return {
      menuList,
      activeMenu: '/personalrecom'
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
      if (this.$route.path == key) return
      if (key !== '/personalrecom') {
        this.activeMenu = '/personalrecom'
        console.log(this.activeMenu)
        this.notice()
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

.layout {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
  min-width: 300px;
}

.header {
  position: absolute;
  background-color: @headRed;
  height: 60px;
  width: 100%;
  top: 0;
}

.main {
  position: absolute;
  top: 60px;
  left: 0;
  right: 0;
  bottom: 80px;
  height: auto;
  width: auto;
}

.aside {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 200px;
  height: 100%;
}

.main-right {
  position: absolute;
  left: 200px;
  top: 0;
  bottom: 0;
  right: 0;
  height: 100%;
  width: auto;
  overflow-y: scroll;
  overflow-x: hidden;
  scrollbar-width: thin;
  .view-mian {
    height: 100%;
    width: 90%;
    margin: 20px auto;
    max-width: 1200px;
  }
}

.footer {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 80px;
  width: 100%;
}

@media screen and (max-width: 768px) {
  .aside {
    display: none;
  }

  .main-right {
    left: 0;
  }
}
</style>