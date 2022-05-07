<template>
  <div class="user-edit mtop-20">
    <div class="font-20 font-bold">编辑个人信息</div>
    <div class="edit-wrap mtop-20">
      <el-form class="edit-form" :model="form" label-width="80px" size="mini">
        <el-form-item label="昵称：">
          <el-input v-model="form.nickname"></el-input>
        </el-form-item>
        <el-form-item label="介绍：">
          <el-input type="textarea" v-model="form.signature"></el-input>
        </el-form-item>
        <el-form-item label="性别：">
          <el-radio-group v-model="form.gender">
            <el-radio-button :label="0">保密</el-radio-button>
            <el-radio-button :label="1">男</el-radio-button>
            <el-radio-button :label="2">女</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="生日：">
          <el-date-picker
            v-model="form.birthday"
            type="date"
            placeholder="选择日期"
            :editable="false"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div class="edit-img-container">
        <ImgCut btnText="修改头像" :imgUrl="imgUrl" @upload="upload"/>
      </div>
    </div>
    <div class="submit-wrap">
      <button class="btn btn-red" @click="update">保存</button>
      <button class="btn btn-white" @click="$router.back()">取消</button>
    </div>
  </div>
</template>

<script>
import { uploadAvatar } from '@/service/get'
import { updateUserInfo } from '@/api/api_user'
import ImgCut from '@/components/img-cut/ImgCut'
import { mapState } from 'vuex'
export default {
  components: {
    ImgCut
  },
  data() {
    /* gender, signature, nickname, birthday, */
    return {
      form: {
        nickname: '',
        signature: '',
        gender: 0,
        birthday: {}
      }
    }
  },
  computed: {
    ...mapState(['profile']),
    imgUrl() {
      return this.profile.avatarUrl ? this.profile.avatarUrl : ''
    }
  },
  watch: {
    'form.signature'(val, oldval) {
      if (val.length > 100) {
        this.form.signature = oldval
        return this.$message.warning('介绍过长')
      }
    }
  },
  created() {
    this.getInfo()
  },
  methods: {
    getInfo() {
      if (Object.keys(this.profile).length !== 0) {
        this.form.nickname = this.profile.nickname
        this.form.signature = this.profile.signature
        this.form.gender = this.profile.gender
        this.form.birthday = new Date(this.profile.birthday)
      } else {
        setTimeout(() => {
          this.getInfo()
        }, 200)
      }
    },
    /* 上传头像 */
    async upload({ file, imgSize }) {
      var formData = new FormData()
      formData.append('imgFile', file)
      const imgObj = {
        imgSize: imgSize.width,
        data: formData
      }
      console.log(imgObj)
      console.log(imgObj.data.get('imgFile'))
      const res = await uploadAvatar(imgObj)
      console.log(res)
      if (res.code !== 200) return this.$message.error('上传失败')
      this.$message.success('上传成功')
      this.$store.dispatch('getAcount')
    },
    async update() {
      const obj = {
        nickname: this.form.nickname,
        signature: this.form.signature,
        gender: this.form.gender,
        birthday: this.form.birthday.getTime()
      }
      const res = await updateUserInfo(obj)
      if (res.code !== 200) return this.$message.error('更新失败')
      this.$message.success('更新成功')
      this.$store.dispatch('getAcount')
    }
  }
}
</script>

<style lang="less" scoped>
.edit-form {
  width: 500px;
  @media screen and (max-width: 415px) {
    width: auto;
  }
}
.edit-wrap {
  display: flex;
  @media screen and (max-width: 415px) {
    display: block;
  }
}

.edit-img-container {
  margin-left: 30px;
  @media screen and (max-width: 415px) {
    margin: 0;
  }
}
.submit-wrap {
  margin: 10px 0 0 80px;
  .btn {
    width: 80px;
    &:nth-child(2) {
      margin-left: 20px;
    }
  }
}
</style>