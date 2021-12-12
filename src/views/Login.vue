<template>
  <div class="login">
    <div class="login-container">
      <div class="login-wrapper">
        <span class="title">{{ currenType }}登录</span>
        <div class="type-btn-wrap type-btn-wrap_active">
          <button
            v-for="(item, index) in type"
            :key="index"
            class="no-btn"
            @click="changeType(index)"
            :class="{ btn_active: index === loginType }"
          >
            {{ item }}
          </button>
        </div>
        <component :is="currenComponent" ref="loginRef"></component>
        <div class="form-btn-container" v-show="loginType !== 1">
          <div class="form-btn-wrap">
            <div class="btn-bg"></div>
            <button class="form-btn" @click="doLogin">
              {{ btnText }}<i class="el-icon-loading" v-show="isLoading"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LoginByPhone from '@/components/login/LoginByPhone'
import LoginByQr from '@/components/login/LoginByQr'
import LoginByCode from '@/components/login/LoginByCode'
export default {
  components: { LoginByPhone, LoginByQr, LoginByCode },
  data() {
    return {
      isLoading: false,
      loginType: 1, //1:手机号 2:,
      loginComponent: ['LoginByPhone', 'LoginByQr', 'LoginByCode'],
      type: ['手机号', '二维码', '验证码']
    }
  },
  computed: {
    btnText() {
      return this.isLoading ? '登录中' : '登录'
    },
    currenComponent() {
      return this.loginComponent[this.loginType]
    },
    currenType() {
      return this.type[this.loginType]
    }
  },

  methods: {
    /* 手机号密码登录 */
    doLogin() {
      if (this.loginType === 0 || this.loginType===2) {
        this.$refs.loginRef.doLogin()
      }
    },
    changeType(type) {
      this.loginType = type
    }
  }
}
</script>

<style lang="less" scoped>
.login {
  width: 100%;
  margin: 0 auto;
  overflow: hidden;
  .login-container {
    min-height: 100vh;
    background-image: url('https://cdn.jsdelivr.net/gh/crazybox521/blogImg/login.jpg');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.login-wrapper {
  width: 500px;
  height: 600px;
  background-color: #ffffff;
  border-radius: 10px;
  padding: 65px 55px 54px 55px;
  .title {
    display: block;
    font-size: 30px;
    color: #423d3d;
    line-height: 1.2;
    text-align: center;
    padding-bottom: 49px;
  }
  .type-btn-wrap {
    display: flex;
    justify-content: center;
    .no-btn {
      font-size: 16px;
    }
    .btn_active {
      font-weight: bold;
      &::after {
        content: '';
        display: block;
        width: 100%;
        height: 2px;
        background-color: #000;
      }
    }
  }
}
.form-btn-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 50px;
  .form-btn-wrap {
    width: 100%;
    display: block;
    position: relative;
    z-index: 1;
    border-radius: 25px;
    overflow: hidden;
    margin: 0 auto;
    &:hover .btn-bg {
      background-position-x: 200px;
    }
    .btn-bg {
      position: absolute;
      z-index: -1;
      width: 300%;
      height: 100%;
      background: #a64bf4;
      background: -webkit-linear-gradient(
        right,
        #00dbde,
        #fc00ff,
        #00dbde,
        #fc00ff
      );

      top: 0;
      left: -100%;
      transition: all 0.5s;
    }
    .form-btn {
      font-size: 16px;
      color: #fff;
      line-height: 1.2;
      text-transform: uppercase;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0 20px;
      width: 100%;
      height: 50px;
      outline: none;
      border: none;
      background: transparent;
    }
  }
}
@media screen and (max-width: 576px) {
  .login-container {
    padding-left: 15px;
    padding-right: 15px;
  }
}
</style>