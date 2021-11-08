<template>
  <div class="footer-bar">
    <Player></Player>
  </div>
</template>

<script>
import Player from './Player.vue'
export default {
  components: {
    Player
  }
}
</script>
<style lang="less" scoped>
.footer-bar{
  height: 99%;
}
</style>