<template>
  <div class="not-found">
    <el-empty
      description="404 Not Found"
      :image-size="400"
      :image="imgUrl"
    >
      <el-button @click="$router.back()">返回上一页</el-button>
    </el-empty>
  </div>
</template>

<script>
let imgUrl =require('@/assets/img/404.svg')
console.log(imgUrl);
export default {
  data() {
    return {
      imgUrl
    }
  },
}
</script>

<style lang="less" scoped>
.not-found {
  height: 100vh;
}
</style>