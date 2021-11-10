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
        @change="search"
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
  mixins:[notifyMixin],
  data() {
    return {
      keywords: ''
    }
  },
  methods: {
    search() {
      if (this.keywords == '') return
      if (this.$route.path != '/search') this.$router.push('/search')
      this.$store.commit('setKeywords', this.keywords)
    },
    toHomePage() {
      if (this.$route.path != '/homepage/personalrecom') this.$router.push('/homepage/personalrecom')
    },
    goTo(step) {
      this.$router.go(step)
    },
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