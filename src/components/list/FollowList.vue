<template>
  <!-- 收藏者，关注者列表 -->
  <div class="follow-list">
    <ul class="follow-list-ul">
      <li v-for="i in list" :key="i.userId">
        <div class="img-wrap pointer" @click="clickImg(i)">
          <img class="img img-h" :src="i.avatarUrl" alt="" />
        </div>
        <div class="content-wrap">
          <div class="content-item pointer text-hidden" @click="clickImg(i)">
            <span>{{ i.nickname }}</span>
            <span class="mleft-10">
              <i
                v-if="i.gender == 1"
                style="color: #3da1d1"
                class="el-icon-male"
              ></i>
              <i
                v-else-if="i.gender == 2"
                style="color: #ea5a95"
                class="el-icon-female"
              ></i
            ></span>
          </div>
          <div class="content-item text-hidden font-12">{{ i.signature }}</div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      required: true,
      default: () => {}
    },
    type: {
      /* 1:歌单收藏者 */
      type: Number,
      required: true
    }
  },
  methods: {
    clickImg(item) {
      this.$emit('clickImg', item)
    }
  }
}
</script>

<style lang="less" scoped>
.follow-list{
    background-color: #fff;
}
.follow-list-ul {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  li {
    width: 30%;
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    @media screen and (max-width: 1000px) {
      & {
        width: 42%;
      }
    }
    @media screen and (max-width: 415px) {
      & {
        width: 100%;
      }
    }
    .img-wrap {
      border: 1px solid #eeeeee;
      width: 100px;
      height: 100px;
      min-width: 100px;
      border-radius: 50%;
      img {
        border-radius: 50%;
      }
      @media screen and (max-width: 768px) {
        & {
          width: 60px;
          height: 60px;
          min-width: 60px;
        }
      }
    }
    .content-wrap {
      padding-left: 10px;
      .content-item {
        width: 200px;
      }
    }
  }
}
</style>