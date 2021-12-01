<template>
  <div class="login">
    <div class="login-container">
      <div class="login-wrapper">
        <span class="title">登录</span>
        <el-form
          :model="form"
          :rules="rules"
          ref="loginRef"
          label-position="top"
          hide-required-asterisk
        >
          <el-form-item label="手机号" prop="phone">
            <el-input
              v-model="form.phone"
              placeholder="请输入手机号"
              prefix-icon="el-icon-mobile"
            ></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              type="password"
              v-model="form.password"
              placeholder="请输入密码"
              prefix-icon="el-icon-key"
            ></el-input>
          </el-form-item>
        </el-form>
        <div class="form-btn-container">
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
import { doLoginByPhone } from '@/api/api'
import md5 from 'js-md5'
export default {
  data() {
    return {
      form: { phone: '', password: '', md5_password: '' },
      rules: {
        phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      isLoading: false
    }
  },
  computed: {
    btnText() {
      return this.isLoading ? '登录中' : '登录'
    }
  },
  created() {
    console.log(md5('mduhu1'))
  },
  methods: {
    doLogin() {
      this.$refs.loginRef.validate(async (valid) => {
        if (!valid) return this.$message.error('请输入正确的信息')
        this.form.md5_password = md5(this.form.password)
        this.isLoading = true
        const { data: res } = await doLoginByPhone(
          this.form.phone,
          this.form.md5_password
        )
        if (res.code !== 200) return this.$message.error('登录失败')
        this.$router.push('/personalrecom')
      })
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
    font-size: 39px;
    color: #333333;
    line-height: 1.2;
    text-align: center;
    padding-bottom: 49px;
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