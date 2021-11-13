<template>
  <div class="not-found">
    <el-empty
      description="404 Not Found"
      :image-size="400"
      image="https://cdn.jsdelivr.net/gh/crazybox521/blogImg/404.svg"
    >
      <el-button @click="$router.back()">返回上一页</el-button>
    </el-empty>
  </div>
</template>

<script>
export default {}
</script>

<style lang="less" scoped>
.not-found {
  height: 100vh;
}
</style>