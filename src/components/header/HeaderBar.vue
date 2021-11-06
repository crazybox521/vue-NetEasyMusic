<template>
  <div class="header-bar">
    <img style="height: 100%" src="../../assets/img/logo.png" alt="" />
    <div class="btn-history">
      <i class="iconfont icon-arrow-left-bold"></i>
      <i class="iconfont icon-arrow-right"></i>
    </div>
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      keywords: ''
    }
  },
  methods: {
    search() {
        console.log(this.$route)
        if(this.$route.path!='/songlist')
        this.$router.push('/songlist')
        this.$store.commit('setKeywords',this.keywords)
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
  .iconfont {
    margin-right: 10px;
  }
}
.search-input {
  margin-left: 10px;
}
</style>