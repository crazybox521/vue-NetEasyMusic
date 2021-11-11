<template>
  <!-- 头部工具栏区域组件 -->
  <div class="header-bar">
    <img
      @click="toHomePage"
      style="height: 100%"
      src="../../assets/img/logo.png"
      alt=""
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
    <div class="login mleft-20">
      <el-button type="danger" @click="loginView" round>未登录</el-button>
    </div>
  </div>
</template>

<script>
import notifyMixin from '../../mixins/notifyMixin'
export default {
  mixins: [notifyMixin],
  data() {
    return {
      keywords: ''
    }
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
      this.notice()
    }
  }
}
</script>

<style lang="less" scoped>
.header-bar {
  height: 100%;
  display: flex;
  align-items: center;
}
.btn-history {
  margin-left: 100px;
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
</style>