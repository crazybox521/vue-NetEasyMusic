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
        clearable
        prefix-icon="el-icon-search"
      ></el-input>
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
import { getAcount, logout } from '@/api/api'
export default {
  data() {
    return {
      keywords: '',
      account: {},
      info: {}
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
  },
  methods: {
    /* 去搜索页面 */
    toSearch() {
      if (this.keywords == '') return
      if (this.$route.path != '/search')
        this.$router.push('/search/' + this.keywords)
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
</style>