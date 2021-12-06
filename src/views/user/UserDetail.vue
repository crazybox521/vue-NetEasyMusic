<template>
  <!-- 用户详情页 -->
  <div class="user-detail mtop-20">
    <!-- 头部 -->
    <div class="user-info">
      <div class="img-wrap">
        <img :src="info.avatarUrl" alt="" />
      </div>
      <div class="info-wrap mleft-20">
        <div class="font-24 font-bold">{{ info.nickname }}</div>
        <div class="info-btn">
          <div>
            <span class="font-12 level-wrap">Lv{{ level }}</span
            ><span class="mleft-10 font-14 sex-wrap">
              <i
                v-if="info.gender == 1"
                style="color: #3da1d1"
                class="el-icon-male"
              ></i>
              <i
                v-else-if="info.gender == 2"
                style="color: #ea5a95"
                class="el-icon-female"
              ></i>
            </span>
          </div>
          <div v-if="isLogin&&profile.userId===userId">自己</div>
          <div v-else>
            <button class="btn btn-white">
              <i class="el-icon-message"></i> 发私信
            </button>
            <button class="btn btn-white mleft-10">
              <i class="el-icon-plus"></i> 关注
            </button>
          </div>
        </div>
        <div class="div-line"></div>
        <div class="info-num mtop-10">
          <div class="num-item">
            <div class="font-20 font-bold">{{ info.eventCount }}</div>
            <div class="item-text font-12">动态</div>
          </div>
          <div class="num-item">
            <div class="font-20 font-bold">{{ info.follows }}</div>
            <div class="item-text font-12">关注</div>
          </div>
          <div class="num-item">
            <div class="font-20 font-bold">{{ info.followeds }}</div>
            <div class="item-text font-12">粉丝</div>
          </div>
        </div>
        <div class="desc-item mtop-10 font-14">所在地区：四川成都</div>
        <div class="desc-item mtop-10 font-14">
          个人介绍：{{ info.signature }}
        </div>
      </div>
    </div>
    <!--列表 -->
    <div class="mtop-20" v-show="creList.length !== 0">
      <div>
        <span class="font-bold">歌单</span>
        <span class="font-12" style="color: #676767">
          ({{ creList.length }})</span
        >
      </div>
      <ImgList
        @clickImg="toPlayListDetail"
        :list="creList"
        type="playlist"
      >
        <template v-slot="{ item }">
          <div class="text-hidden">
            {{ item.name }}
          </div>
        </template>
      </ImgList>
    </div>
    <div class="mtop-20" v-show="subList.length !== 0">
      <div>
        <span class="font-bold">收藏</span>
        <span class="font-12" style="color: #676767">
          ({{ subList.length }})</span
        >
      </div>
      <ImgList
        @clickImg="toPlayListDetail"
        :list="subList"
        type="playlist"
      >
        <template v-slot="{ item }">
          <div class="text-hidden">
            {{ item.name }}
          </div>
        </template>
      </ImgList>
    </div>
  </div>
</template>

<script>
import ImgList from '@/components/list/ImgList.vue'
import { getUserDetail, getUserPlayList } from '@/api/api_user'
import { mapState } from 'vuex'
export default {
  components: { ImgList },
  data() {
    return {
      info: {}, //基本信息
      list: [], //歌单列表
      level: 0 //等级
    }
  },
  computed: {
    sex() {
      return this.info.gender === 1 ? '男' : '女'
    },
    userId() {
      return this.info.userId
    },
    creList() {
      return this.list.filter((item) => item.userId == this.userId)
    },
    subList() {
      return this.list.filter((item) => item.userId !== this.userId)
    },
    ...mapState(['profile','isLogin'])
  },
  watch: {
    '$route.params.id'() {
      this.getDetail()
      this.getUserPlayList()
    }
  },
  created() {
    this.getDetail()
    this.getUserPlayList()
  },
  methods: {
    /* 获取详情信息 */
    async getDetail() {
      const { data: res } = await getUserDetail(this.$route.params.id)
      if (res.code !== 200) return
      this.info = res.profile
      this.level = res.level
    },
    /* 获取收藏及创建歌单 */
    async getUserPlayList() {
      const { data: res } = await getUserPlayList(this.$route.params.id)
      if (res.code !== 200) return
      this.list = res.playlist
    },
     toPlayListDetail(id) {
      this.$router.push({ path: '/playlistdetail/' + id })
    },
  }
}
</script>

<style lang="less" scoped>
.user-info {
  display: flex;
  .img-wrap {
    height: 200px;
    width: 200px;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
  .info-wrap {
    flex: 1;
    .info-btn {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 40px;
    }
    .info-num {
      display: flex;
      .num-item {
        width: 80px;
        text-align: center;
        border-right: 1px solid #e6e6e6;
        &:nth-child(3) {
          border: none;
        }
        .item-text {
          color: #676767;
        }
      }
    }
    .desc-item {
      color: #676767;
    }
  }
}
.el-icon-plus {
  color: #ec4141;
}
@media screen and (max-width: 768px) {
  /* .img-wrap{
        display: none;
    } */
}
@media screen and (max-width: 415px) {
  .img-wrap {
    display: none;
  }
}
</style>