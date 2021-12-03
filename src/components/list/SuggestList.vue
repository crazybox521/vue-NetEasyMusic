<template>
  <div class="suggest-list">
    <header class="suggest-list-header"><slot name="title"></slot></header>
    <main class="suggest-list-main">
      <slot name="item"> <div class="item"></div> </slot>
    </main>
  </div>
</template>

<script>
export default {}
</script>

<style lang="less" scoped>
.suggest-list-header {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  padding-left: 10px;
  height: 30px;
  font-size: 12px;
  background-color: #f5f5f7;
}
.item {
  box-sizing: border-box;
  padding: 0 30px;
  line-height: 28px;
  height: 28px;
  font-size: 12px;
  &:hover {
    background-color: #f2f2f2;
  }
}
</style>