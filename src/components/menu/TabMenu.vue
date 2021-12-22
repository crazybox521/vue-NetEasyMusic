<template>
  <!-- 控制tab的行菜单 -->
  <ul class="tab-menu">
    <li
      v-for="(item, index) in menuList"
      @click="handMenuClick(index, item)"
      class="pointer"
      :class="{ isActive: tabIndex === index }"
      :key="index"
    >
      <span v-if="mode === 'menu'">{{ item }}</span>
      <span v-else-if="mode === 'router'">{{ item.name }}</span>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    menuList: {
      /* [menuName1,menuName2] */
      /* [{path:'/xxx',name:'xxx'}] */
      type: Array,
      required: true
    },
    mode: {
      /* menu/router */
      type: String,
      default: 'menu'
    }
  },
  data() {
    return {
      tabIndex: 0
    }
  },
  watch: {
    '$route.path': {
      immediate: true,
      handler(val) {
        if (this.mode === 'router') {
          this.tabIndex = this.menuList.findIndex((item) => item.path === val)
        }
      }
    }
  },
  methods: {
    handMenuClick(index, item) {
      if (this.mode === 'menu') {
        this.tabIndex = index
        this.$emit('menuClick', index)
      } else if (this.mode === 'router') {
        if (this.$route.path !== item.path) {
          this.$router.push(item.path)
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.tab-menu {
  display: flex;
  justify-content: flex-start;
  align-items: center;

  li {
    margin: 10px;

    &.isActive {
      font-size: 18px;
      font-weight: bold;

      &::after {
        display: block;
        content: '';
        height: 4px;
        width: 90%;
        margin: 0 auto;
        background-color: #ec4141;
        border-radius: 2px;
      }
    }
  }
}
</style>