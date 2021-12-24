<template>
  <div class="playlist-edit mtop-20">
    <div class="font-20 font-bold">编辑歌单信息</div>
    <div class="edit-wrap mtop-20">
      <el-form class="edit-form" :model="form" label-width="80px" size="mini">
        <el-form-item label="歌单名：">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="标签：">
          <div class="tag-wrap">
            <div class="tag" v-for="tag in form.tags" :key="tag">
              {{ tag }}
            </div>
            <div class="button-wrap">
              <button style="color: #5380b2" class="no-btn" @click="getCat">
                添加标签
              </button>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="简介：">
          <el-input type="textarea" v-model="form.desc"></el-input>
        </el-form-item>
      </el-form>
      <div class="edit-img-container">
        <div class="img-wrap">
          <img class="edit-img" :src="imgUrl" alt="" />
        </div>
        <div class="btn-wrap">
          <el-upload
            ref="upload"
            action="/playlist/cover/update"
            :auto-upload="false"
            :on-change="handleChange"
            :show-file-list="false"
            accept="image/*"
          >
            <button slot="trigger" class="btn btn-white">编辑封面</button>
          </el-upload>
        </div>
      </div>
    </div>
    <div class="submit-wrap">
      <button class="btn btn-red" @click="update">保存</button>
      <button class="btn btn-white" @click="$router.back()">取消</button>
    </div>
    <el-dialog
      title="图片剪裁"
      :visible.sync="ImgdialogVisible"
      :modal="false"
      :close-on-click-modal="false"
      append-to-body
      :destroy-on-close="true"
      :center="true"
    >
      <div class="cropper-content">
        <div class="cropper" style="text-align: center">
          <vueCropper
            ref="cropper"
            :img="option.img"
            :outputSize="option.size"
            :outputType="option.outputType"
            :info="option.info"
            :full="option.full"
            :canMove="option.canMove"
            :canMoveBox="option.canMoveBox"
            :original="option.original"
            :autoCrop="option.autoCrop"
            :fixed="option.fixed"
            :fixedNumber="option.fixedNumber"
            :centerBox="option.centerBox"
            :infoTrue="option.infoTrue"
            :fixedBox="option.fixedBox"
            :mode="option.mode"
            :canScale="option.canScale"
          ></vueCropper>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <button class="btn btn-white" @click="ImgdialogVisible = false">
          取消
        </button>
        <button class="btn btn-red mleft-10" @click="getSliceImg">
          保存并关闭
        </button>
      </div>
    </el-dialog>
    <el-dialog
      title="添加标签"
      :visible.sync="TagsdialogVisible"
      :modal="false"
      :close-on-click-modal="false"
      append-to-body
      :destroy-on-close="true"
      :center="true"
    >
      <div class="tag-list-wrap">
        <div class="tag-list" v-for="(item, index) in allCats" :key="index">
          <div class="tag-title">
            <template v-if="index === 0">
              <i class="iconfont icon-diqiuquanqiu font-24"></i
              ><span class="mleft-6">语种</span>
            </template>
            <template v-if="index === 1">
              <i class="iconfont icon-fengge font-24"></i
              ><span class="mleft-6">风格</span>
            </template>
            <template v-if="index === 2">
              <i class="iconfont icon-xiazai47 font-24"></i
              ><span class="mleft-6">场景</span>
            </template>
            <template v-if="index === 3">
              <i class="iconfont icon-smiling font-24"></i
              ><span class="mleft-6">情感</span>
            </template>
            <template v-if="index === 4">
              <i class="iconfont icon-zhuti font-24"></i>
              <span class="mleft-6">主题</span>
            </template>
          </div>
          <ul>
            <li v-for="(cat, catIndex) in item" :key="cat.name">
              <button
                @click="pushTags(cat.name, index, catIndex)"
                class="no-btn"
                :class="{ isActive: cat.isActive }"
              >
                {{ cat.name }}
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <button class="btn btn-red" @click="TagsdialogVisible = false">
          完成
        </button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getPlayListDetail,
  updateMyPlayList,
  getAllCat
} from '@/api/api_playlist.js'
import { uploadPlayListImg } from '@/service/get.js'

export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      form: {
        name: '',
        tags: [],
        desc: ''
      },
      imgUrl: '',
      isInput: false,
      ImgdialogVisible: false,
      TagsdialogVisible: false,
      option: {
        img: '', // 裁剪图片的地址
        info: true, // 裁剪框的大小信息
        outputSize: 0.8, // 裁剪生成图片的质量
        outputType: 'jpeg', // 裁剪生成图片的格式
        canScale: true, // 图片是否允许滚轮缩放
        autoCrop: true, // 是否默认生成截图框
        fixedBox: true, // 固定截图框大小 不允许改变
        fixed: true, // 是否开启截图框宽高固定比例
        fixedNumber: [1, 1], // 截图框的宽高比例
        full: true, // 是否输出原图比例的截图
        canMoveBox: false, // 截图框能否拖动
        original: false, // 上传图片按照原始比例渲染
        centerBox: true, // 截图框是否被限制在图片里面
        infoTrue: true, // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
        mode: 'contain'
      },
      allCats: []
    }
  },
  watch: {
    form: {
      deep: true,
      handler(val) {
        if (val.name.length >= 20) {
          this.form.name = val.name.slice(0, 19)
          this.$message.warning('歌单名过长')
        }
        if (val.desc.length > 1000) {
          this.form.desc = val.desc.slice(0, 999)
          this.$message.warning('描述过长')
        }
        this.isInput = true
      }
    }
  },
  created() {
    this.getPlayList()
  },
  methods: {
    getSliceImg() {
      this.$refs.cropper.getCropBlob((data) => {
        this.upload(data)
        this.ImgdialogVisible = false
      })
    },
    async getCat() {
      const res = await getAllCat()
      if (res.code !== 200) return
      this.allCats = []
      res.sub.forEach((item) => {
        item.isActive = false
        /* 使当前标签激活 */
        if (this.form.tags.findIndex((ele) => ele === item.name) !== -1) {
          item.isActive = true
        }
      })
      for (let i = 0; i < 5; i++) {
        this.allCats.push(
          Object.freeze(res.sub.filter((item) => item.category === i))
        )
      }
      this.TagsdialogVisible = true
    },
    pushTags(name, index, tagIndex) {
      let formTagIndex = this.form.tags.indexOf(name)
      if (formTagIndex !== -1) {
        this.form.tags.splice(formTagIndex, 1)
        this.allCats[index][tagIndex].isActive = false
      } else {
        if (this.form.tags.length === 3)
          return this.$message.warning('最多只能选三个标签')
        this.form.tags.push(name)
        this.allCats[index][tagIndex].isActive = true
      }
    },
    /* 获取歌单信息 */
    async getPlayList() {
      this.isLoading = true
      const res = await getPlayListDetail(this.id)
      if (res.code !== 200) return
      console.log(res)
      this.form.name = res.playlist.name
      this.form.tags = res.playlist.tags
      this.form.desc = res.playlist.description ? res.playlist.description : ''
      this.imgUrl = res.playlist.coverImgUrl
      this.$nextTick(() => {
        this.isInput = false
      })
    },
    /* 更新歌单 */
    async update() {
      if (!this.isInput) return this.$message.warning('并没有修改内容')
      const editObj = {
        id: this.id,
        name: this.form.name,
        desc: this.form.desc
      }
      if (this.form.tags.length !== 0) editObj.tags = this.form.tags.join(';')
      const res = await updateMyPlayList(editObj)
      console.log(res)
      if (res.code !== 200) {
        this.$message.error('更新失败')
        this.$router.back()
        return
      }
      this.$message.success('更新成功')
      this.$router.back()
    },
    handleChange(file) {
      this.openImgDialog(file.raw)
    },
    /* 打开裁剪页面 */
    openImgDialog(file) {
      let reader = new FileReader()
      reader.onload = (theFile) => {
        this.option.img = theFile.target.result
        this.ImgdialogVisible = true
      }
      if (file) {
        reader.readAsDataURL(file)
      }
    },
    /* 获取图片size */
    getImgSize(file) {
      return new Promise((resolve, reject) => {
        let reader = new FileReader()
        reader.onload = function (theFile) {
          console.log(theFile)
          let image = new Image()
          image.src = theFile.target.result
          image.onload = function () {
            resolve({
              width: this.width,
              height: this.height
            })
          }
        }

        if (file) {
          reader.readAsDataURL(file)
        } else {
          reject('出错了')
        }
      })
    },
    /* 上传图片 */
    async upload(file) {
      var formData = new FormData()
      formData.append('imgFile', file)
      const imgSize = await this.getImgSize(file)
      const imgObj = {
        id: this.id,
        imgSize: imgSize.width,
        imgX: this.imgX,
        imgY: this.imgY,
        data: formData
      }
      console.log(imgObj)
      console.log(imgObj.data.get('imgFile'))
      const res = await uploadPlayListImg(imgObj)
      console.log(res)
      if (res.code !== 200) return this.$message.error('上传失败')
      this.imgUrl = res.data.url
      this.$message.success('上传成功')
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
.tag-wrap {
  height: 28px;
  display: flex;
  align-items: center;
  .tag {
    box-sizing: border-box;
    display: inline-block;
    padding: 0 12px;
    margin-right: 10px;
    font-size: 12px;
    height: 22px;
    border-radius: 11px;
    border: 1px solid #e0e0e0;
    color: #9f9f9f;
    text-align: center;
    display: flex;
    align-items: center;
  }
}
.edit-img-container {
  margin-left: 30px;
  @media screen and (max-width: 415px) {
    margin: 0;
  }
  .img-wrap {
    width: 140px;
    height: 140px;
    @media screen and (max-width: 415px) {
      margin: 0 auto;
    }
    .edit-img {
      width: 100%;
      height: 100%;
      border-radius: 10px;
    }
  }
  .btn-wrap {
    @media screen and (max-width: 415px) {
      margin: 20px auto 0;
    }
    margin-top: 20px;
    width: 140px;
    text-align: center;
  }
}
.cropper-content {
  .cropper {
    width: auto;
    height: 400px;
  }
}
.tag-list-wrap {
  .tag-list {
    display: flex;
    line-height: 26px;
    margin: 0 0px 10px 0;
    .tag-title {
      width: 120px;
      height: 26px;
      color: #cfcfcf;
      margin: 0 40px 0 20px;
      .iconfont {
        color: #b1b1b1;
      }
    }
    ul {
      display: flex;
      flex-wrap: wrap;
      width: 500px;

      li {
        width: 100px;
        height: 26px;

        .no-btn {
          cursor: pointer;
          padding: 4px 10px;
          &:hover {
            color: #ec4141;
          }
        }
      }
    }
  }
  .isActive {
    background-color: #fdf5f5;
    color: #ec4141;
    border-radius: 13px;
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