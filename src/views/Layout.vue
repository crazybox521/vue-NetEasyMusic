<template>
  <div class="layout">
    <!-- 头部 -->
    <div class="header"><HeaderBar></HeaderBar></div>
    <!-- 内容区域 -->
    <div class="main">
      <div class="aside">
        <el-menu router :default-active="activeMenu" @select="handleSelect">
          <el-menu-item
            :index="item.path"
            v-for="item in menuList"
            :key="item.path"
            :disabled="item.checkLogin && !isLogin"
          >
            <span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </el-menu>
      </div>
      <div class="main-right">
        <div class="view-mian">
          <transition name="el-fade-in">
            <router-view></router-view>
          </transition>
        </div>
        <el-backtop target=".main-right" :bottom="100"></el-backtop>
      </div>
      <el-drawer
        title="当前播放"
        :visible.sync="drawerMusicList"
        :before-close="handMusicListClose"
      >
        <div class="flex-around">
          <div class="font-12 mleft-12">总 {{ length }} 首</div>
          <div class="font-12 mleft-12">
            <span v-show="length !== 0"
              >当前播放第 {{ currenIndex + 1 }} 首</span
            >
            <span v-show="length === 0">没有在播放哦</span>
          </div>
        </div>
        <el-divider></el-divider>
        <el-table
          :show-header="false"
          :data="musicList"
          style="width: 100%"
          size="mini"
          stripe
          @row-dblclick="playMusic"
          empty-text="快去播放音乐吧！"
          tooltip-effect="light"
        >
          <el-table-column type="index" width="50">
            <template v-slot="scope">
              <span style="color: red" v-if="showCurren(scope.row.id)"
                ><i v-if="isPlay" class="iconfont icon-shengyin_shiti"></i
                ><i v-else class="iconfont icon-sound"></i
              ></span>

              <span v-else>{{ scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="name" show-overflow-tooltip label="音乐标题">
          </el-table-column>
          <el-table-column prop="ar[0].name" show-overflow-tooltip label="歌手">
          </el-table-column>
          <el-table-column prop="dt" label="时长">
            <template v-slot="{ row }">
              {{ (row.dt / 1000) | timeFormat }}
            </template>
          </el-table-column>
        </el-table>
      </el-drawer>
    </div>
    <!-- 底部播放器容器 -->
    <div class="footer">
      <div class="div-line"></div>
      <FooterBar></FooterBar>
    </div>
  </div>
</template>

<script>
import notifyMixin from '@/mixins/notifyMixin'
import { mapState } from 'vuex'
import FooterBar from '@/components/footer/FooterBar.vue'
import HeaderBar from '@/components/header/HeaderBar.vue'
import menuList from '@/listData/menuList'
export default {
  mixins: [notifyMixin],
  components: {
    FooterBar,
    HeaderBar
  },
  data() {
    return {
      activeMenu: '/personalrecom'
    }
  },
  computed: {
    ...mapState([
      'musicList',
      'drawerMusicList',
      'currenMusicId',
      'isLogin',
      'currenIndex',
      'isPlay'
    ]),
    length() {
      return this.musicList.length
    },
    menuList() {
      return menuList
      /* this.isLogin
        ? menuList
        : menuList.filter((item) => !item.checkLogin) */
    }
  },
  created() {
    if (window.sessionStorage.getItem('activeMenu'))
      this.activeMenu = window.sessionStorage.getItem('activeMenu')
  },
  methods: {
    /* 导航 */
    handleSelect(key, keyPath) {
      console.log(key, keyPath)
      window.sessionStorage.setItem('activeMenu', key)
      this.activeMenu = key
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
    },
    clearList() {
      this.$store.commit('setCurrenMusicId', 0)
      this.$store.commit('setPlayState', false)
    },
    showCurren(id) {
      return this.currenMusicId === id
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
    width: 90%;
    margin: 0 auto;
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