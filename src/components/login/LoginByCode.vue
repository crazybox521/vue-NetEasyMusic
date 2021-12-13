<template>
  <div class="login-by-code">
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
      <el-form-item label="验证码" prop="captcha">
        <el-col :span="16">
          <el-input
            v-model="form.captcha"
            placeholder="请输入验证码"
            prefix-icon="el-icon-key"
          ></el-input
        ></el-col>
        <el-col :offset="1" :span="6">
          <el-button :disabled="time !== 0" @click="getCode">
            <span v-show="time == 0">获取验证码</span>
            <span v-show="time != 0">{{ time }}s</span>
          </el-button>
        </el-col>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { doLogin, getCode } from '@/api/api_user'
export default {
  data() {
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'))
      }
      setTimeout(() => {
        let reg = /^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/
        if (!reg.test(this.form.phone)) {
          callback(new Error('手机号错误'))
        } else {
          callback()
        }
      }, 1000)
    }
    return {
      form: { phone: '', captcha: '' },
      rules: {
        phone: [{ validator: checkPhone, trigger: 'blur' }],
        captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
      },
      time: 0
    }
  },
  methods: {
    doLogin() {
      this.$refs.loginRef.validate(async (valid) => {
        if (!valid) return this.$message.error('请输入正确的信息')
        const res = await doLogin(this.form)
        if (res.code !== 200)
          return this.$message.error('登录失败,请检查手机号和密码')
        this.$message.success('登录成功')
        this.$router.push('/personalrecom')
      })
    },
    async getCode() {
      if (this.form.phone === '') return this.$message.error('请输入手机号')
      let reg = /^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/
      if (!reg.test(this.form.phone)) return this.$message.error('手机号有误')
      this.time = 60
      this.timer = window.setInterval(() => {
        this.time--
        if (this.time === 0) window.clearInterval(this.timer)
      }, 1000)
      const res = await getCode(this.form.phone)
      if (res.code !== 200) return this.$message.error('发送失败，请检查手机号')
      this.$message.success('发送成功！请查看手机信息')
    }
  }
}
</script>
