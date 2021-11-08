<template>
  <div class="tag" :style="{ color, backgroundColor: bgcolor,borderColor:color }">
     {{text}}
  </div>
</template>

<script>
export default {
    props:['text','color','bgcolor']
}
</script>

<style lang="less" scoped>
.tag{
    display: inline-block;
    border: 1px solid #ec4141;
    padding:0 2px;
    font-size: 14px;
    height: 22px;
    line-height: 22px;
    color: #ec4141;
    border-radius: 2px;
}
</style>