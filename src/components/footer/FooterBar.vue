<template>
  <div class="footer-bar">
    <Player />
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
 height: 100%;
}
</style>