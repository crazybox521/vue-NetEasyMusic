<template>
  <div class="footer-bar">
    <Player></Player>
  </div>
</template>

<script>
import Player from '../player/Player.vue'
export default {
  components: {
    Player
  }
}
</script>
<style lang="less" scoped>
.footer-bar{
 box-sizing: border-box;
 border-top: 1px solid #cccccc;
}
</style>