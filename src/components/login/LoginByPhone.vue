<template>
  <div class="login-by-phone">
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
  </div>
</template>

<script>
import { doLogin } from '@/api/api_user'
import md5 from 'js-md5'
export default {
  data() {
    return {
      form: { phone: '', password: '', md5_password: '' },
      rules: {
        phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  },
  methods: {
    doLogin() {
      this.$refs.loginRef.validate(async (valid) => {
        if (!valid) return this.$message.error('请输入正确的信息')
        this.form.md5_password = md5(this.form.password)
        const res = await doLogin(this.form)
        if (res.code !== 200)
          return this.$message.error('登录失败,请检查手机号和密码')
        this.$router.push('/personalrecom')
      })
    }
  }
}
</script>
