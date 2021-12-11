<template>
  <div class="login-by-qr mtop-20">
    <div class="msg-wrap">打开网易云音乐手机端扫码登录</div>
    <div class="img-wrap">
      <img class="img img-h" :src="imgData" />
      <div class="btn-refresh pointer" @click="getKey" v-show="qrType === 800">
        <i class="el-icon-refresh-left"></i>
      </div>
    </div>

    <div class="msg-wrap">状态：{{ message }}</div>
  </div>
</template>

<script>
import { getQrKey, createQr, checkQr } from '@/api/api_user.js'
export default {
  data() {
    return {
      key: '',
      imgData: '',
      qrType: '',
      message: ''
    }
  },
  methods: {
    /* 获取二维码key */
    async getKey() {
      const res = await getQrKey()
      if (res.code !== 200) return this.$message.error('获取二维码失败')
      this.key = res.data.unikey
      this.createQr()
    },
    /* 生成二维码 */
    async createQr() {
      const res = await createQr(this.key)
      if (res.code !== 200) return this.$message.error('生成二维码失败')
      this.imgData = res.data.qrimg
      this.checkQr()
    },
    /* 800 为二维码过期,801 为等待扫码,802 为待确认,803 为授权登录成功(803 状态码下会返回 cookies) */
    /* 检查二维码状态 */
    async checkQr() {
      console.log(11)
      const res = await checkQr(this.key)
      this.qrType = res.code
      this.message = res.message
      if (res.code === 801 || res.code === 802) {
        this.timer = window.setTimeout(() => {
          this.checkQr()
        }, 5000)
      } else if (res.code === 803) {
        this.$router.push('/personalrecom')
      }
    }
  },
  created() {
    this.getKey()
  },
  beforeDestroy() {
    window.clearTimeout(this.timer)
  }
}
</script>

<style lang="less" scoped>
.login-by-qr {
  position: relative;
  .img-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 200px;
    height: 200px;
    margin: 0 auto;
    .btn-refresh {
      position: absolute;
      width: 200px;
      height: 200px;
      background-color: #ccc;
      opacity: 0.8;
      color: red;
      display: flex;
      justify-content: center;
      align-items: center;
      i {
        font-size: 30px;
      }
    }
  }
  .msg-wrap {
    text-align: center;
  }
}
</style>