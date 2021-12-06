<template>
  <!-- 头部工具栏区域组件 -->
  <div class="header-bar">
    <div class="logo-wrap pointer" @click="toHomePage">
      <i class="iconfont icon-logView"></i>
    </div>
    <div class="menu-btn">
      <span></span>
    </div>
    <div class="btn-history">
      <button @click="goTo(-1)" class="btn-circle">
        <i class="iconfont icon-arrow-left-bold"></i>
      </button>
      <button @click="goTo(1)" class="btn-circle">
        <i class="iconfont icon-arrow-right"></i>
      </button>
    </div>
    <!-- 搜索框 -->
    <div class="search-input">
      <el-input
        style="width: 200px"
        placeholder="搜索"
        v-model="keywords"
        @change="toSearch"
        @input="handleInput"
        ref="inputRef"
        clearable
        @focus="getHotSearch"
        @blur="showInfoTip = false"
        prefix-icon="el-icon-search"
      ></el-input>
      <transition name="el-fade-in">
        <!-- 热搜及搜索建议 -->
        <div class="search-info_tip" v-show="showInfoTip">
          <div v-show="keywords === ''">
            <div class="his-search" v-show="historySearchList.length !== 0">
              <div class="hot-title font-14">
                <span>搜索历史</span>
                <button class="no-btn" @click="clearHis">
                  <i class="el-icon-delete"></i>
                </button>
              </div>
              <div class="his-wrap">
                <button
                  class="btn btn-white his-item font-12"
                  v-for="val in historySearchList"
                  :key="val"
                  @click="clickHot(val)"
                >
                  {{ val }}
                </button>
              </div>
            </div>
            <div class="hot-search">
              <div class="hot-title font-14">热搜榜</div>
              <div
                class="hot-item pointer"
                :class="{ 'top-item': index < 3 }"
                v-for="(item, index) in hotList"
                :key="index"
                @click="clickHot(item.searchWord)"
              >
                <div class="item-index">{{ index + 1 }}</div>
                <div class="item-info">
                  <div class="key-word">
                    <span class="font-12 item-key">{{ item.searchWord }}</span>
                    <span style="color: #c2c1c1" class="font-12 mleft-10">{{
                      item.score
                    }}</span>
                  </div>
                  <div>
                    <span style="color: #999999" class="font-12">{{
                      item.content
                    }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-show="keywords !== ''">
            <div class="search-suggest">
              <div class="search-btn-wrap">
                <button class="no-btn">
                  搜“{{ keywords }}”相关的内容<i
                    class="el-icon-arrow-right"
                  ></i>
                </button>
              </div>
              <SuggestList v-if="showMusic">
                <template #title>
                  <i class="iconfont icon-yinle font-16"></i
                  ><span class="mleft-10">单曲</span>
                </template>
                <template #item>
                  <div
                    v-for="s in suggestInfo.songs"
                    :key="s.id"
                    class="item pointer text-hidden"
                    @click="playMusic(s.id)"
                  >
                    {{ s.name }} - {{ s.artists[0].name }}
                  </div>
                </template>
              </SuggestList>
              <SuggestList v-if="showAlbum">
                <template #title>
                  <i class="iconfont icon-zhuanji font-16"></i
                  ><span class="mleft-10">专辑</span>
                </template>
                <template #item>
                  <div
                    v-for="al in suggestInfo.albums"
                    :key="al.id"
                    class="item pointer text-hidden"
                    @click="toAlbumDetail(al.id)"
                  >
                    {{ al.name }} - {{ al.artist.name }}
                  </div>
                </template>
              </SuggestList>
              <SuggestList v-if="showArtist">
                <template #title
                  ><i class="el-icon-user font-16"></i
                  ><span class="mleft-10">歌手</span>
                </template>
                <template #item>
                  <div
                    v-for="ar in suggestInfo.artists"
                    :key="ar.id"
                    class="item pointer text-hidden"
                    @click="toArtistDetail(ar.id)"
                  >
                    {{ ar.name }}
                  </div>
                </template>
              </SuggestList>

              <SuggestList v-if="showPlaylist">
                <template #title>
                  <i class="iconfont icon-gedan font-16"></i
                  ><span class="mleft-10">歌单</span>
                </template>
                <template #item>
                  <div
                    v-for="p in suggestInfo.playlists"
                    :key="p.id"
                    class="item pointer text-hidden"
                    @click="toPlayListDetail(p.id)"
                  >
                    {{ p.name }}
                  </div>
                </template>
              </SuggestList>
            </div>
          </div>
        </div>
      </transition>
    </div>
    <div class="avatar-wrap mleft-12 pointer" @click="loginView">
      <el-avatar
        :size="30"
        icon="el-icon-user-solid"
        :src="avatarUrl"
      ></el-avatar>
    </div>
    <div
      class="login-info mleft-10 font-12 text-hidden"
      :class="{ pointer: isLogin }"
      @click="doLogout"
    >
      {{ name }}
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getAcount, logout } from '@/api/api_user'
import { getHotSearch, getSuggest } from '@/api/api_other'
import { getMusicListByIds } from '@/api/api_music.js'
import SuggestList from '@/components/list/SuggestList'
export default {
  components: { SuggestList },
  data() {
    return {
      keywords: '',
      account: {},
      info: {},
      showInfoTip: false,
      hotList: [],
      historySearchList: [],
      suggestInfo: {}
    }
  },
  computed: {
    /* 登录相关信息 */
    ...mapState(['isLogin']),
    name() {
      return this.info ? this.info.nickname : '未登录'
    },
    avatarUrl() {
      return this.info ? this.info.avatarUrl : ''
    },
    /* 搜索建议相关状态 */
    showMusic() {
      return Object.hasOwnProperty.call(this.suggestInfo, 'songs')
    },
    showAlbum() {
      return Object.hasOwnProperty.call(this.suggestInfo, 'albums')
    },
    showArtist() {
      return Object.hasOwnProperty.call(this.suggestInfo, 'artists')
    },
    showPlaylist() {
      return Object.hasOwnProperty.call(this.suggestInfo, 'playlists')
    }
  },
  created() {
    this.getAcount()
    this.getHistory()
  },
  methods: {
    /* 去搜索页面 */
    toSearch() {
      if (this.keywords == '') return
      this.$refs.inputRef.blur()
      if (this.$route.path != '/search/' + this.keywords) {
        this.$router.push('/search/' + this.keywords)
      }
      this.setHistory(this.keywords)
    },
    /* 获取搜索建议 */
    async getSuggest(val) {
      if (val == '') return
      console.log('object')
      const { data: res } = await getSuggest({ keywords: val })
      if (res.code !== 200) return
      if (Object.keys(res.result).length !== 0) this.suggestInfo = res.result
      console.log(res)
    },
    handleInput(val) {
      console.log(val)
      /* input事件防抖 */
      if (this.timer) {
        window.clearTimeout(this.timer)
      }
      this.timer = window.setTimeout(() => {
        console.log(val, 'timer')
        this.getSuggest(val)
      }, 500)
    },
    /* 获取热搜及搜索记录 */
    async getHotSearch() {
      this.showInfoTip = true
      if (this.hotList.length !== 0) return
      const { data: res } = await getHotSearch()
      if (res.code !== 200) return
      this.hotList = res.data
    },

    /* 点击热搜 */
    clickHot(val) {
      if (val !== '') {
        this.keywords = val
        this.toSearch()
      }
    },
    /* 获取搜索历史 */
    getHistory() {
      if (!window.localStorage.getItem('search')) return
      this.historySearchList =
        JSON.parse(window.localStorage.getItem('search')) instanceof Array
          ? JSON.parse(window.localStorage.getItem('search'))
          : []
    },
    /* 更新搜索历史 */
    setHistory(val) {
      if (val) {
        if (this.historySearchList.findIndex((item) => item == val) !== -1)
          return
        this.historySearchList.unshift(val)
        this.historySearchList = this.historySearchList.slice(0, 5)
        window.localStorage.setItem(
          'search',
          JSON.stringify(this.historySearchList)
        )
      }
    },
    /* 清空历史 */
    clearHis() {
      this.$confirm('确认清空历史记录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        window.localStorage.removeItem('search')
        this.historySearchList = []
      })
    },
    /* 网页logo点击回调 */
    toHomePage() {
      if (this.$route.path != '/personalrecom')
        this.$router.push('/personalrecom')
    },
    /* 前进后退 */
    goTo(step) {
      this.$router.go(step)
    },
    /* 登录页面 */
    loginView() {
      console.log(this.$route)
      if (!this.isLogin) this.$router.push('/login')
      else {
        if (this.$route.path === '/userdetail/' + this.account.id) return
        this.$router.push('/userdetail/' + this.account.id)
      }
    },
    /* 获取登录信息 */
    async getAcount() {
      const { data: res } = await getAcount()
      if (res.code !== 200) return
      this.account = res.account
      this.info = res.profile
      if (res.account !== null) {
        this.$store.commit('setIsLogin', true)
        this.$store.commit('setLoginInfo', res)
      } else {
        this.$store.commit('setIsLogin', false)
        this.$store.commit('setLoginInfo', { account: null, profile: null })
        this.openTip()
      }
    },
    /* 未登录的提示 */
    openTip() {
      if (!this.isLogin)
        this.$notify({
          title: '提示',
          type: 'warning',
          message:
            '部分功能需要登录后才能使用，如每日推荐等，本网站不会收集用户信息，点击头像可以登录',
          duration: 0
        })
    },
    /* 退出登录 */
    doLogout() {
      if (!this.isLogin) return
      this.$confirm('将要退出登录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await logout()
          if (res.code !== 200) return
          this.$message.success('退出成功')
          this.getAcount()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    toAlbumDetail(id) {
      if (typeof id === 'number') {
        this.$router.push('/albumdetail/' + id)
      }
    },
    toPlayListDetail(id) {
      if (typeof id === 'number') {
        this.$router.push('/playlistdetail/' + id)
      }
    },
    toArtistDetail(id) {
      if (typeof id === 'number') {
        this.$router.push('/artistdetail/' + id)
      }
    },
    /* 处理搜索建议中单曲数据格式。并播放 */
    async playMusic(id) {
      if (typeof id !== 'number') return
      const { data: res } = await getMusicListByIds(id)
      if (res.code !== 200 || res.songs.length === 0) return
      this.$store.commit('setMusicList', res.songs)
      this.$store.commit('setCurrenMusicId', res.songs[0].id)
      this.$store.commit('setPlayState', true)
      this.$store.commit('setCurrenIndex', 0)
    }
  }
}
</script>

<style lang="less" scoped>
.header-bar {
  height: 100%;
  display: flex;
  align-items: center;
  color: #ffffff;
  position: relative;
}
.logo-wrap {
  height: 60px;
  line-height: 60px;
  .icon-logView {
    font-size: 48px;
  }
}
.btn-history {
  margin-left: 100px;
  display: flex;
  /* 圆按钮 */
  .btn-circle {
    display: inline-block;
    height: 26px;
    width: 26px;
    outline: 0;
    border: 0;
    background-color: #e13e3e;
    color: #ffffff;
    margin-right: 10px;
    border-radius: 50%;
    cursor: pointer;
  }
}
/* 搜索框容器 */
.search-input {
  margin-left: 10px;
  position: relative;
  /* 搜索建议等的弹出层 */
  .search-info_tip {
    position: absolute;
    top: 40px;
    left: 0;
    width: 340px;
    min-height: 340px;
    max-height: 420px;
    transition: all 0.5s;
    overflow-y: auto;
    border-radius: 8px;
    box-shadow: 0 1px 4px #dddddd;
    background-color: #fff;
    z-index: 100;
    color: #000;
  }
}
/* 标题 */
.hot-title {
  color: #666666;
  margin: 10px auto 10px 10px;
}
/* 热搜区域 */
.hot-search {
  margin-top: 20px;
  .hot-item {
    height: 50px;
    display: flex;
    align-items: center;
    &:hover {
      background-color: #f2f2f2;
    }
    .item-index {
      color: #c2c2c2;
      width: 40px;
      text-align: center;
    }
  }
  .top-item {
    .item-index {
      color: #e13e3e;
    }
    .item-key {
      font-weight: bold;
    }
  }
}
/* 历史记录区域 */
.his-wrap {
  padding: 0 18px;
  display: flex;
  flex-wrap: wrap;
  .his-item {
    margin: 0 10px 10px 0;
    height: 26px;
  }
}
/* 搜索建议顶部按钮区域 */
.search-btn-wrap {
  height: 30px;
  line-height: 30px;
}

.login-info {
  max-width: 4rem;
}

@media screen and (max-width: 768px) {
  .btn-history {
    margin-left: 10px;
    .btn-circle {
      &:nth-child(2) {
        display: none;
      }
    }
  }
  .logo-wrap {
    display: none;
  }
  .search-input {
    margin: 0;
  }
}
@media screen and (max-width: 415px) {
  /* 后续优化，移动端menu */
  /* .menu-btn {
    span {
      display: inline-block;
      width: 22px;
      height: 2px;
      background-color: #fff;
      border-radius: 5px;
      transition: background-color 0.2s ease-out 0.1s;
      &::before {
        content: '';
        display: inline-block;
        width: 22px;
        height: 2px;
        border-radius: 5px;
        background-color: #fff;
        transition: transform 0.1s ease-out, top 0.3s ease 0.2s;
        transform: rotate(0deg);
      }
    }
  } */
  .search-input {
    .search-info_tip {
      left: -30px;
    }
  }
}
</style>