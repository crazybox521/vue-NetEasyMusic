<template>
  <!-- 部分页面展示数据的灰白相间的垂直列表 -->
  <ul class="info-list">
    <li
      class="info-item pointer"
      v-for="item in list"
      :key="item.id"
      @click="$emit('clickitem', item.id)"
    >
      <slot :item="item"></slot>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      required: true
    }
  }
}
</script>

<style lang="less" scoped>
.info-item {
  display: flex;
  height: 100px;
  align-items: center;
  &:nth-child(odd) {
    background-color: #f9f9f9;
  }
  &:nth-child(even) {
    background-color: #ffffff;
  }
  &:hover {
    background-color: #f0f1f2;
  }
}
</style>