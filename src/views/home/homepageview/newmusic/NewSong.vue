<template>
  <div class="new-song">
    <div class="new-song-head">
      <div class="area-wrap">
        <button
          class="no-btn mright-10 font-16"
          @click="changeType(t.id)"
          :class="{ area_active: area_active(t.id) }"
          v-for="t in typeList"
          :key="t.id"
        >
          {{ t.name }}
        </button>
      </div>
      <div class="btn-wrap">
        <button class="btn btn-red" @click="playMusicAll">
          <i class="iconfont icon-bofang"></i>
          <span class="btn-text">播放全部</span>
        </button>
        <button class="btn btn-white mleft-10">
          <i class="el-icon-folder-add"></i>
          <span class="btn-text">收藏全部</span>
        </button>
      </div>
    </div>
    <div class="new-song-view">
      <el-skeleton v-show="isLoading" :rows="6" animated />
      <InfoList v-show="!isLoading" :list="list" @clickitem="playMusic">
        <template #index="{ index }">
          <div class="sub-index">
            {{ index > 8 ? index + 1 : '0' + (index + 1) }}
          </div>
        </template>
        <template #img="{ item }">
          <img
            class="sub-img mleft-10"
            :src="item.al.picUrl + '?param=100y100'"
          />
        </template>
        <template #title="{ item }">
          {{ item.name }}
        </template>
        <template #item1="{ item }">
          <span
            style="color: #676767"
            @click.stop="toArtistDetail(item.ar[0].id)"
            >{{ item.ar[0].name }}</span
          ></template
        >
        <template #item2="{ item }">
          <span
            @click.stop="toAlbumDetail(item.al.id)"
            style="color: #676767"
            >{{ item.al.name }}</span
          >
        </template>
        <template #item3="{ item }">
          {{ (item.dt / 1000) | timeFormat }}
        </template>
      </InfoList>
    </div>
  </div>
</template>

<script>
import { getTopMusic } from '@/api/api_music.js'
import InfoList from '@/components/list/InfoList'
import { mapState } from 'vuex'
export default {
  components: { InfoList },
  data() {
    return {
      // 华语:7 欧美:96 日本:8 韩国:16
      typeList: [
        { id: 0, name: '全部' },
        { id: 7, name: '华语' },
        { id: 96, name: '欧美' },
        { id: 8, name: '日本' },
        { id: 16, name: '韩国' }
      ],
      type: 0,
      list: [],
      isLoading: true
    }
  },
  computed: {
    ...mapState(['musicList']),
    area_active() {
      return function (areaId) {
        return this.type === areaId
      }
    }
  },
  methods: {
    async getMusic() {
      if (typeof this.type !== 'number') return
      this.isLoading = true
      const res = await getTopMusic(this.type)
      if (res.code !== 200) return
      let list = []
      res.data.forEach((item) => {
        list.push({
          id: item.id,
          dt: item.duration,
          alia: item.alias,
          al: item.album,
          ar: item.artists,
          name: item.name,
          mv: item.mvid,
          fee: item.fee
        })
      })
      this.list = list
      this.isLoading = false
    },
    changeType(id) {
      this.type = id
    },
    playMusic(row) {
      this.$store.commit('setMusicList', this.list)
      this.$store.commit('setCurrenMusicId', row.id)
      this.$store.commit('setPlayState', true)
      this.getIndex(row.id)
    },
    // 获取并改变当前播放下标
    getIndex(id) {
      if (this.musicList.length === 0) return
      let index = this.musicList.findIndex((item) => item.id == id)
      console.log(index)
      this.$store.commit('setCurrenIndex', index)
    },
    playMusicAll() {
      console.log('调用了')
      if (this.list.length == 0) return
      let id = this.list[0].id
      console.log('列表没变', this.list == this.musicList)
      this.$store.commit('setMusicList', this.list)
      this.$store.commit('setCurrenMusicId', id)
      this.$store.commit('setPlayState', true)
      this.getIndex(id)
    },
    toArtistDetail(id) {
      if (typeof id === 'number' && id !== 0)
        this.$router.push('/artistdetail/' + id)
    },
    toAlbumDetail(id) {
      if (typeof id === 'number') this.$router.push('/albumdetail/' + id)
    }
  },
  created() {
    this.getMusic()
  },
  watch: {
    type() {
      this.getMusic()
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
@media screen and (max-width: 415px) {
  .btn-wrap {
    width: 100px;
    .btn {
      margin-left: 2px;
    }
  }
}
</style>