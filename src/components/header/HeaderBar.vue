<template>
  <!-- 头部工具栏区域组件 -->
  <div class="header-bar">
    <img @click="toHomePage" class="img-h" src="../../assets/img/logo.png" />
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
    <div class="login-info mleft-12" @click="loginView">
      <el-avatar icon="el-icon-user-solid" :src="avatarUrl"></el-avatar>
    </div>
    <div class="login-info mleft-10 font-14 text-hidden">{{ name }}</div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getAcount } from '../../api/api'
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
      return this.info.nickname ? this.info.nickname : '未登录'
    },
    avatarUrl() {
      return this.info.avatarUrl ? this.info.avatarUrl : ''
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
      if (!this.isLogin) this.$router.push('/login')
    },
    /* 获取登录信息 */
    async getAcount() {
      const { data: res } = await getAcount()
      if (res.code !== 200) return
      this.account = res.account
      this.info = res.profile
      this.$store.commit('setIsLogin', true)
      this.$store.commit('setLoginInfo',res)
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