<template>
  <div class="layout" :class="{ layout_gray: isGray }">
    <!-- 头部 -->
    <div class="header"><HeaderBar></HeaderBar></div>
    <!-- 内容区域 -->
    <div class="main">
      <!-- 左侧导航栏 -->
      <div class="aside">
        <el-menu router :default-active="activeMenu" @select="handleSelect">
          <el-menu-item
            :index="item.path"
            v-for="item in commenList"
            :key="item.path"
            :disabled="item.Login && !isLogin"
          >
            <span slot="title">{{ item.title }}</span>
          </el-menu-item>
          <el-menu-item-group>
            <template slot="title">我的音乐</template>
            <el-menu-item
              :index="item.path"
              v-for="item in myList"
              :key="item.path"
              :disabled="item.Login && !isLogin"
              ><span slot="title">{{ item.title }}</span>
            </el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group v-if="isLogin">
            <template slot="title">创建的歌单</template>
            <el-menu-item
              :index="subPath(item.id)"
              v-for="(item, index) in creList"
              :key="item.id"
              ><div slot="title" class="text-hidden">
                <i v-if="index === 0" class="iconfont icon-aixin"></i>
                <i v-else class="iconfont icon-gedan"></i>{{ item.name }}
              </div>
            </el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group v-if="isLogin">
            <template slot="title">收藏的歌单</template>
            <el-menu-item
              :index="subPath(item.id)"
              v-for="item in subList"
              :key="item.id"
              ><div slot="title" class="text-hidden">
                <i class="iconfont icon-gedan"></i>{{ item.name }}
              </div>
            </el-menu-item>
          </el-menu-item-group>
        </el-menu>
      </div>
      <!-- 右侧内容区域 -->
      <div class="main-right" ref="scrollWrapRef">
        <div class="view-mian">
          <transition name="el-fade-in">
            <router-view></router-view>
          </transition>
        </div>
        <el-backtop target=".main-right" :bottom="100"></el-backtop>
      </div>
      <!-- 当前播放列表抽屉 -->
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
      <FooterBar></FooterBar>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import FooterBar from '@/components/footer/FooterBar.vue'
import HeaderBar from '@/components/header/HeaderBar.vue'
export default {
  components: {
    FooterBar,
    HeaderBar
  },
  data() {
    return {
      activeMenu: '/personalrecom',
      menuList: [
        { path: '/personalrecom', title: '发现音乐', Login: false, type: 0 },
        { path: '/recomsongs', title: '每日推荐', Login: true, type: 1 },
        { path: '/video', title: '视频', Login: true, type: 0 },
        { path: '/personalfm', title: '私人FM', Login: true, type: 0 },
        { path: '/historyplay', title: '最近播放', Login: false, type: 1 },
        { path: '/subscribe', title: '我的收藏', Login: true, type: 1 }
      ],
    }
  },
  computed: {
    ...mapState([
      'musicList',
      'drawerMusicList',
      'currenMusicId',
      'isLogin',
      'currenIndex',
      'isPlay',
      'profile',
      'myPlayList'
    ]),
    length() {
      return this.musicList.length
    },
    /* 公有菜单 */
    commenList() {
      return this.menuList.filter((item) => item.type == 0)
    },
    /* 我的菜单 */
    myList() {
      return this.menuList.filter((item) => item.type == 1)
    },
    /* 创建的歌单 */
    creList() {
      return this.myPlayList.filter((item) => item.userId == this.userId)
    },
    /* 收藏的歌单 */
    subList() {
      return this.myPlayList.filter((item) => item.userId !== this.userId)
    },
    userId() {
      return this.isLogin ? this.profile.userId : 0
    },
    /* 灰色滤镜 */
    isGray() {
      const time_today = new Date()
      if (time_today.getMonth() == 11 && time_today.getDate() == 13) return true
      else return false
    }
  },
  created() {
    if (window.sessionStorage.getItem('activeMenu'))
      this.activeMenu = window.sessionStorage.getItem('activeMenu')
  },
  watch: {
    '$route.path'() {
      this.$refs.scrollWrapRef.scrollTop = 0
    }
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
      this.$store.dispatch('playMusic', {
        list: this.musicList,
        id: row.id
      })
    },
    clearList() {
      this.$store.commit('setCurrenMusicId', 0)
      this.$store.commit('setPlayState', false)
    },
    showCurren(id) {
      return this.currenMusicId === id
    },
    subPath(id) {
      if (typeof id === 'number') return `/playlistdetail/${id}`
      else return '/404'
    }
  }
}
</script>

<style lang="less" scoped>
@import '@/assets/less/lessConfig.less';

.layout {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
}
.layout_gray {
  -webkit-filter: grayscale(100%); /* Chrome, Safari, Opera */
  filter: grayscale(100%);
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
  overflow-y: scroll;
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
    left: -200px;
    z-index: 999;
    transition: all 0.4s;
  }

  .main-right {
    left: 0;
  }
  .footer {
    height: 51px;
  }
  .main {
    bottom: 51px;
  }
}
</style>