<template>
  <div id="app">
    <transition name="el-fade-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
