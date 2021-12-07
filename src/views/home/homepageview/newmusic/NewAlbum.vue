<template>
  <div class="new-album">
    <div class="new-song-head">
      <div class="area-wrap">
        <button
          class="no-btn mright-10 font-16"
          @click="changeArea(t.id)"
          :class="{ area_active: area_active(t.id) }"
          v-for="t in typeList"
          :key="t.id"
        >
          {{ t.name }}
        </button>
      </div>
      <div class="btn-wrap">
        <button
          class="btn-tag"
          :class="{ 'btn-tag_active': btn_active('hot') }"
          @click="changeType('hot')"
        >
          推荐
        </button>
        <span style="color: #f2f2f2">|</span>
        <button
          class="btn-tag"
          :class="{ 'btn-tag_active': btn_active('new') }"
          @click="changeType('new')"
        >
          全部
        </button>
      </div>
    </div>
    <div class="new-song-view" v-show="showWeek">
      <el-skeleton v-if="isLoading" :rows="6" animated />

      <div v-else class="new-album-list">
        <div class="time-info">
          <div class="time-info-content">本周新碟</div>
        </div>
        <div class="data-list">
          <ImgList @clickImg="toAlbumDetail" :list="weekData" type="album">
            <template v-slot="{ item }">
              <div class="text-hidden">
                {{ item.name }}
              </div>
              <div style="color: #9f9f9f" class="text-hidden">
                {{ item.artist.name }}
              </div>
            </template>
          </ImgList>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getTopAlbum } from '@/api/api_album.js'
import ImgList from '@/components/list/ImgList.vue'
export default {
  components: { ImgList },
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
        type: 'new',
        month: '',
        year: ''
      },
      weekData: [],
      monthData: [
        {
          time: '2021-12',
          data: []
        }
      ],
      hasMore: false,
      isLoading: true
    }
  },
  computed: {
    btn_active() {
      return function (type) {
        return this.queryInfo.type === type
      }
    },
    area_active() {
      return function (areaId) {
        return this.queryInfo.area === areaId
      }
    },
    showWeek() {
      return this.weekData.length !== 0
    }
  },
  methods: {
    changeType(type) {
      console.log('changetype')
      this.queryInfo.type = type
      this.getNewAlbum()
    },
    changeArea(areaId) {
      this.queryInfo.area = areaId
      this.getNewAlbum()
    },
    async getNewAlbum() {
      this.isLoading = true
      const res = await getTopAlbum(this.queryInfo)
      if (res.code !== 200) return
      if (Object.hasOwnProperty.call(res, 'weekData'))
        this.weekData = Object.freeze(res.weekData)
      else this.weekData = []
      console.log(res)
      /*  this.monthData = res.data.monthData
      this.hasMore = res.data.hasMore */
      this.isLoading = false
    },
    toAlbumDetail(id) {
      if (typeof id === 'number') this.$router.push('/albumdetail/' + id)
    }
  },
  created() {
    this.getNewAlbum()
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
.new-album-list {
  display: flex;
  .time-info {
    width: 50px;
    text-align: center;
    &-content {
      font-size: 20px;
      width: 30px;
    }
  }
  .data-list {
    flex: 1;
  }
}
@media screen and (max-width: 415px) {
  .btn-wrap {
    width: 100px;
  }
}
</style>