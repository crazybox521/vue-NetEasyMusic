<template>
  <div class="new-album">
    <div class="new-song-head">
      <div class="area-wrap">
        <button
          class="no-btn mright-10 font-16"
          @click="changeArea(t.id)"
          :class="{ area_active: t.id === queryInfo.area }"
          v-for="t in typeList"
          :key="t.id"
        >
          {{ t.name }}
        </button>
      </div>
      <div class="btn-wrap">
        <button
          class="btn-tag"
          :class="{ 'btn-tag_active': activeBtn ===1 }"
          @click="changeType('hot')"
        >
          推荐
        </button>
        <span style="color: #f2f2f2">|</span>
        <button
          class="btn-tag"
          :class="{ 'btn-tag_active': activeBtn === 2 }"
          @click="changeType('new')"
        >
          全部
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      typeList: [
        { id: 'ALL', name: '全部' },
        { id: 'ZH', name: '华语' },
        { id: 'EA', name: '欧美' },
        { id: 'JP', name: '日本' },
        { id: 'KR', name: '韩国' }
      ],
      queryInfo: {
        limit: 30,
        offset: 0,
        area: 'ALL',
        type: 'hot'
      }
    }
  },
  computed: {
    activeBtn() {
      return this.queryInfo.type === 'hot' ? 1 : 2
    }
  },
  methods: {
    changeType(type) {
      console.log('changetype');
      this.queryInfo.type = type
    },
    changeArea(areaId) {
      this.queryInfo.area = areaId
    }
  }
}
</script>
<style lang="less" scoped>
.new-song-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 40px;
}
.area_active {
  font-weight: bold;
}
.btn-tag {
  height: 26px;
  line-height: 26px;
  border-radius: 13px;
  outline: 0;
  border: 0;
  background-color: #fff;
  padding: 0 10px;
  cursor: pointer;
  color: #676767;
}
.btn-tag_active {
  color: #ec4141;
  background-color: #fdf5f5;
}
</style>