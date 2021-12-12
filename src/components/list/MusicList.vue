<template>
  <!-- 封装音乐列表组件 -->
  <el-table
    :data="list"
    style="width: 100%"
    size="mini"
    class="music-list"
    stripe
    v-if="isDisplay"
    @row-dblclick="playMusic"
    empty-text="当前没有音乐哦"
    tooltip-effect="light"
  >
    <el-table-column type="index" width="50">
      <template v-slot="scope">
        <span class="active-color" v-if="showCurren(scope.row.id)"
          ><i v-if="isPlay" class="iconfont icon-shengyin_shiti"></i
          ><i v-else class="iconfont icon-sound"></i
        ></span>
        <span v-else style="color: #c3c3db">{{ scope.$index + 1 }}</span>
      </template>
    </el-table-column>
    <el-table-column width="30">
      <template v-slot="{ row }">
        <div class="pointer" @click="likeMusic(row.id)">
          <i v-if="!isLiked(row.id)" class="iconfont icon-aixin"></i>
          <i v-else style="color: #ec4141" class="iconfont icon-aixin1"></i>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="name" label="音乐标题" show-overflow-tooltip>
      <template v-slot="{ row }">
        <span :class="{ 'active-color': showCurren(row.id) }">{{
          row.name
        }}</span>
        <span style="color: #969697" v-if="row.alia.length !== 0"
          >({{ row.alia[0] }})</span
        >
        <span v-if="row.fee == 1" class="vip-tag">VIP</span>
        <span
          v-if="row.mv !== 0"
          class="vip-tag pointer"
          @click="toMvDeTail(row.mv)"
          style="color: #ec4949; border-color: #ec4949"
          >MV<i class="el-icon-caret-right"></i
        ></span>
      </template>
    </el-table-column>
    <el-table-column
      prop="ar[0].name"
      show-overflow-tooltip
      label="歌手"
      :width="artistColLength"
    >
      <template v-slot="{ row }">
        <span
          class="pointer artist-list"
          @click="toArtistDetail(a.id)"
          v-for="a in row.ar"
          :key="a.name"
          >{{ a.name }}</span
        >
      </template>
    </el-table-column>
    <el-table-column
      prop="al.name"
      label="专辑名"
      width="300"
      show-overflow-tooltip
      v-if="!isPhone"
    >
      <template v-slot="{ row }">
        <span class="pointer" @click="toAlbumDetail(row.al.id)">{{
          row.al.name
        }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="dt" label="时长" width="120" v-if="!isPhone">
      <template v-slot="{ row }">
        {{ (row.dt / 1000) | timeFormat }}
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { mapState } from 'vuex'
import { likeMusic } from '@/api/api_music.js'
export default {
  props: {
    list: {
      type: Array,
      required: true,
      default: () => {}
    }
  },
  computed: {
    ...mapState([
      'musicList',
      'currenMusicId',
      'isPlay',
      'isPhone',
      'likeIdList',
      'isLogin'
    ]),
    isDisplay() {
      return this.list ? true : false
    },
    artistColLength() {
      return this.isPhone ? 80 : 180
    }
  },
  methods: {
    //  播放音乐
    playMusic(row) {
      console.log('列表没变', this.list == this.musicList)
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
    /* 播放当前列表 */
    playMusicAll() {
      console.log('调用了')
      if (this.list.length == 0) return
      let id = this.list[0].id
      console.log(this.list)
      console.log('列表没变', this.list == this.musicList)
      this.$store.commit('setMusicList', this.list)
      this.$store.commit('setCurrenMusicId', id)
      this.$store.commit('setPlayState', true)
      this.getIndex(id)
    },
    toMvDeTail(id) {
      if (typeof id === 'number') this.$router.push('/videodetail/mv/' + id)
    },
    toArtistDetail(id) {
      if (typeof id === 'number') this.$router.push('/artistdetail/' + id)
    },
    showCurren(id) {
      return this.currenMusicId === id
    },
    toAlbumDetail(id) {
      if (this.$route.path === '/albumdetail/' + id) return

      if (typeof id === 'number') this.$router.push('/albumdetail/' + id)
    },
    isLiked(id) {
      return this.likeIdList.indexOf(id) !== -1
    },
    /* 喜欢音乐 */
    async likeMusic(id) {
      if (!this.isLogin) return this.$message.error('需要登录')
      if (typeof id !== 'number') return
      let liked = this.isLiked(id)
      const res = await likeMusic(id, !liked)
      if (res.code !== 200) return
      this.$message.success(`${liked ? '取消喜欢' : '喜欢'}成功`)
      if (liked) {
        this.$store.commit('setLikeIdList', {
          type: 'remove',
          data: id
        })
      } else {
        this.$store.commit('setLikeIdList', {
          type: 'unshift',
          data: id
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.vip-tag {
  display: inline-block;
  box-sizing: border-box;
  border: 1px solid #fe672e;
  border-radius: 2px;
  color: #fe672e;
  margin-left: 10px;
  height: 14px;
  padding: 0 2px;
  line-height: 1;
}
.active-color {
  color: #ec4141;
}
.artist-list {
  &::after {
    display: inline;
    margin: 2px;
    content: '/';
  }
  &:last-child::after {
    content: '';
  }
}
</style>