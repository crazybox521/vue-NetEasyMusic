<template>
  <div>
    <el-dialog
      title="收藏到指定歌单"
      :visible.sync="dialogVisible"
      :width="dialogWidth"
    >
      <InfoList :list="createPlaylist" @clickitem="add">
        <template #img="{ item }">
          <img
            class="sub-img mleft-10"
            v-lazy="item.coverImgUrl + '?param=100y100'"
          />
        </template>
      </InfoList>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { MusicToPlaylist } from '@/api/api_playlist'
import InfoList from '@/components/list/InfoList.vue'
export default {
  components: { InfoList },
  data() {
    return {
      dialogVisible: false
    }
  },
  props: {
    musicIdList: {
      type: Array,
      require: true
    }
  },
  computed: {
    ...mapState(['isPhone']),
    ...mapGetters(['createPlaylist']),
    dialogWidth() {
      return this.isPhone ? '80%' : '400px'
    }
  },
  methods: {
    openDialog() {
      this.dialogVisible = true
    },
    async add(item) {
      console.log(item)
      let pid = item.id
      if (typeof pid !== 'number')
        return this.$message.warning('请选择一个歌单')
      let addObj = {
        op: 'add',
        pid,
        tracks: this.musicIdList.join(',')
      }
      const res = await MusicToPlaylist(addObj)
      console.log(res)
      if (res.status !== 200) return this.$message.error('收藏失败')
      this.$store.dispatch('getLikeList')
      this.dialogVisible = false
      this.$message.success('收藏成功！')
    }
  }
}
</script>

<style>
</style>