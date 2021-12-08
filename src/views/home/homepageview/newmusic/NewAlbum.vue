<template>
  <div class="new-album">
    <div class="new-song-view">
      <el-skeleton v-show="isLoading" :rows="6" animated />
      <div v-show="!isLoading" class="new-album-list">
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
      queryInfo: {
        limit: 30,
        offset: 0,
        area: 'ALL',
        type: 'new',
        month: '',
        year: ''
      },
      weekData: [],
      isLoading: true
    }
  },

  methods: {
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
.new-album-list {
  display: flex;
  width: 100%;
  .time-info {
    width: 50px;
    text-align: center;
    &-content {
      font-size: 20px;
      width: 30px;
    }
  }
}
@media screen and (max-width: 415px) {
  .new-album-list {
    display: block;
  }
  .time-info {
    display: none;
  }
}
</style>