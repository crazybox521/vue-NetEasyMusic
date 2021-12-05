<template>
  <!-- 部分页面展示数据的灰白相间的垂直列表 -->
  <ul class="info-list">
    <li
      class="info-item pointer"
      v-for="(item, index) in list"
      :key="item.id"
      @click="$emit('clickitem', item)"
    >
      <slot name="index" :index="index"></slot>
      <slot name="img" :item="item">
        <img class="sub-img mleft-10" :src="item.picUrl + '?param=100y100'" />
      </slot>
      <div class="sub-title font-14 mleft-10">
        <slot name="title" :item="item">
          {{ item.name }}
        </slot>
      </div>
      <div class="sub-item font-12">
        <slot name="item1" :item="item"></slot>
      </div>
      <div class="sub-item font-12">
        <slot name="item2" :item="item"></slot>
      </div>
      <div class="sub-item sub-final font-12">
        <slot name="item3" :item="item"></slot>
      </div>
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
  height: 90px;
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
.sub-img {
  height: 60px;
  width: 60px;
  border-radius: 4px;
}
.sub-title {
  min-width: 100px;
  flex: 1;
}
.sub-item {
  width: 150px;
  color: #c3c3c4;
}
.sub-final {
  width: 100px;
  text-align: center;
}
.sub-index {
  width: 50px;
  text-align: center;
  color: #cfcfdf;
}
</style>