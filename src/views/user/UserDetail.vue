<template>
  <!-- 用户详情页 -->
  <div class="user-detail mtop-20" v-loading="isLoading">
    <!-- 头部 -->
    <div class="user-info">
      <div class="img-wrap">
        <img :src="info.avatarUrl" alt="" />
      </div>
      <div class="info-wrap mleft-20">
        <div class="font-24 font-bold">{{ info.nickname }}</div>
        <div class="info-btn">
          <div>
            <Tag :text="`Lv ${level}`" :fontSize="'12px'" :height="'20px'"></Tag>
            <span class="mleft-10 font-14 sex-wrap">
              <i v-if="info.gender == 1" style="color: #3da1d1" class="el-icon-male"></i>
              <i v-else-if="info.gender == 2" style="color: #ea5a95" class="el-icon-female"></i>
            </span>
          </div>
          <div v-if="isLogin && profile.userId === userId">
            <button class="btn btn-white" @click="toUserEdit">
              <i class="el-icon-edit"></i>编辑个人信息
            </button>
          </div>
          <div v-else>
            <button class="btn btn-white">
              <i class="el-icon-message"></i> 发私信
            </button>
            <button class="btn btn-white mleft-10" @click="follow">
              <template v-if="!followed">
                <i class="el-icon-plus"></i> 关注
              </template>
              <template v-else> <i class="el-icon-check"></i> 已关注 </template>
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
        <div class="desc-item mtop-10 font-14">所在地区：{{userArea}}</div>
        <div class="desc-item mtop-10 font-14">
          个人介绍：{{ info.signature }}
        </div>
      </div>
    </div>
    <div class="menu-wrap mtop-20">
      <TabMenu :menuList="['创建的歌单', '收藏的歌单']" @menuClick="handleMenuClick"></TabMenu>
    </div>
    <!--列表 -->
    <div class="mtop-20" v-show="showTab === 1">
      <template v-if="list.length === 0">
        <span>加载中...</span>
      </template>
      <template v-else-if="creList.length !== 0">
        <ImgList @clickImg="toPlayListDetail" :list="creList" type="playlist">
          <template v-slot="{ item }">
            <div class="text-hidden">
              {{ item.name }}
            </div>
          </template>
        </ImgList>
      </template>
      <template v-else>
        <span>该用户没有创建的歌单或已隐藏</span>
      </template>
    </div>
    <div class="mtop-20" v-show="showTab === 2">
      <template v-if="list.length === 0">
        <span>加载中...</span>
      </template>
      <template v-else-if="subList.length !== 0">
        <ImgList @clickImg="toPlayListDetail" :list="subList" type="playlist">
          <template v-slot="{ item }">
            <div class="text-hidden">
              {{ item.name }}
            </div>
          </template>
        </ImgList>
      </template>
      <template v-else>
        <span>该用户没有收藏的歌单或已隐藏</span>
      </template>
    </div>
  </div>
</template>

<script>
import ImgList from '@/components/list/ImgList.vue'
import TabMenu from '@/components/menu/TabMenu.vue'
import Tag from '@/components/simple/Tag.vue'
/* const { province, city,area } = require('province-city-china/data') */
const province =require('@/json/province.json')
const city =require('@/json/city.json')
import { getUserDetail, getUserPlayList, follow } from '@/api/api_user'
import { mapState } from 'vuex'
export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },
  components: { ImgList, TabMenu, Tag },
  data() {
    return {
      info: {}, //基本信息
      list: [], //歌单列表
      level: 0, //等级
      followed: false,
      offset: 0,
      showTab: 1,
      isLoading:true
    }
  },
  computed: {
    sex() {
      return this.info.gender === 1 ? '男' : '女'
    },
    userId() {
      return this.info.userId
    },
    /* 用户/个人 创建/收藏的歌单 */
    creList() {
      return this.list.filter((item) => item.userId == this.userId)
    },
    subList() {
      return this.list.filter((item) => item.userId !== this.userId)
    },
    userArea(){
      return (this.info.province && this.info.city)?this.getArea(this.info.province,this.info.city):'用户已隐藏'
    },
    ...mapState(['profile', 'isLogin'])
  },
  watch: {
    id() {
      this.list = []
      this.isLoading=true
      this.getDetail()
      this.getUserPlayList()
    }
  },
  created() {
/*     const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        setTimeout(() => {
          loading.close();
        }, 2000); */
    this.getDetail()
    this.getUserPlayList()
   
  },
  mounted() {
  },
  methods: {
    /* 获取详情信息 */
    async getDetail() {
      const res = await getUserDetail(this.id)
      if (res.code !== 200) return
      console.log(res)
      this.info = Object.freeze(res.profile)
      this.level = res.level
      this.followed = res.profile.followed
      this.isLoading=false
    },
    /* 获取收藏及创建歌单 */
    async getUserPlayList() {
      const res = await getUserPlayList(this.id, this.offset)
      if (res.code !== 200) return
      if (this.list.length === 0) this.list = res.playlist
      else {
        this.list.push(...Object.freeze(res.playlist))
      }
      if (res.more) {
        this.offset += 30
        this.getUserPlayList()
      }
    },
    /* 关注 */
    async follow() {
      if (!this.isLogin) return this.$message.warning('需要登录')
      let followObj = {
        id: this.info.userId,
        t: this.followed ? 0 : 1
      }
      const res = await follow(followObj)
      if (res.code !== 200) return this.$message.error(res?.data?.blockText || '操作失败')
      this.$message.success(this.followed ? '取关成功' : '关注成功')
      this.followed = !this.followed
    },
    toPlayListDetail(id) {
      this.$router.push({ path: '/playlistdetail/' + id })
    },
    toUserEdit() {
      this.$router.push('/useredit')
    },
    handleMenuClick(index) {
      this.showTab = index + 1
    },
    getArea(_province,_city){
      const provinceObj =province.find(item=>item.c==_province)
      const cityObj =city.find(item=>item.c==_city)
      console.log(provinceObj);
      const specialProvince =[110000,120000,500000,310000,810000,820000,710000]
      if(specialProvince.find(item=>item==provinceObj.c))
      return `${provinceObj.n}`
      return( !!provinceObj && !!cityObj) ? `${provinceObj.n} ${cityObj.n}`:'用户地区未知'
    }
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