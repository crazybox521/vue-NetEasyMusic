<template>
  <!-- 头部工具栏区域组件 -->
  <div class="header-bar">
    <img
      @click="toHomePage"
      class="img-h pointer"
      src="../../assets/img/logo.png"
    />
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
                  class="btn btn-white his-item"
                  v-for="val in historySearchList"
                  :key="val"
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
            </div>
          </div>
        </div>
      </transition>
    </div>
    <div class="login-info mleft-12 pointer" @click="loginView">
      <el-avatar icon="el-icon-user-solid" :src="avatarUrl"></el-avatar>
    </div>
    <div
      class="login-info mleft-10 font-14 text-hidden"
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
import { getHotSearch } from '@/api/api_other'
export default {
  data() {
    return {
      keywords: '',
      account: {},
      info: {},
      showInfoTip: false,
      hotList: [],
      historySearchList: []
    }
  },
  computed: {
    ...mapState(['isLogin']),
    name() {
      return this.info ? this.info.nickname : '未登录'
    },
    avatarUrl() {
      return this.info ? this.info.avatarUrl : ''
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
    /* 获取热搜及搜索记录 */
    async getHotSearch() {
      this.showInfoTip = true
      if (this.hotList.length !== 0) return
      const { data: res } = await getHotSearch()
      if (res.code !== 200) return
      this.hotList = res.data
    },
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
        this.historySearchList.unshift(val)
        window.localStorage.setItem(
          'search',
          JSON.stringify(this.historySearchList)
        )
      }
    },
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
.search-input {
  margin-left: 10px;
  position: relative;
  .search-info_tip {
    position: absolute;
    top: 40px;
    left: 0;
    width: 340px;
    min-height: 300px;
    max-height: 400px;
    overflow-y: scroll;
    border-radius: 8px;
    box-shadow: 0 1px 4px #dddddd;
    background-color: #fff;
    z-index: 100;
    color: #000;
  }
}
.hot-title {
  color: #666666;
  margin: 10px auto 10px 10px;
}
.hot-search {
  margin-top: 20px;
  .hot-item {
    height: 50px;
    display: flex;
    align-items: center;

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
.his-wrap {
  padding: 0 18px;
  display: flex;
  flex-wrap: wrap;
  .his-item {
    margin: 0 10px 10px 0;
    font-size: 12px;
    height: 26px;
  }
}
.login-info {
  max-width: 4rem;
}
@media screen and (max-width: 768px) {
  .btn-history {
    margin-left: 10px;
    /* display: none; */
    .btn-circle {
      &:nth-child(2) {
        display: none;
      }
    }
  }
  .img-h {
    display: none;
  }
  .search-input {
    margin: 0;
  }
}
@media screen and (max-width: 415px) {
  .search-input {
    .search-info_tip {
      left: -30px;
    }
  }
}
</style>