<template>
  <!-- 图片裁剪组件 -->
  <div class="img-cut">
    <div class="img-wrap">
      <img class="edit-img" :src="imgUrl" />
    </div>
    <div class="btn-wrap">
      <el-upload
        ref="upload"
        :action="action"
        :auto-upload="false"
        :on-change="handleChange"
        :show-file-list="false"
        accept="image/*"
      >
        <button slot="trigger" class="btn btn-white">{{ btnText }}</button>
      </el-upload>
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
  </div>
</template>

<script>
export default {
  props: {
    /* playlist / avatar */
    imgUrl: {
      type: String,
      required: true
    },
    btnText: {
      type: String,
      default: '选择图片'
    }
  },
  data() {
    return {
      action: '/xxxx',
      ImgdialogVisible: false,
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
      }
    }
  },
  methods: {
    getSliceImg() {
      this.$refs.cropper.getCropBlob(async (data) => {
        const imgSize = await this.getImgSize(data)
        /* 把blob对象和最终图像的size传给父组件 */
        this.$emit('upload', { file: data, imgSize })
        this.ImgdialogVisible = false
      })
    },
    /* 处理element upload组件change事件 */
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
    /* 计算图片大小 */
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
    }
  }
}
</script>

<style lang="less" scoped>
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
.cropper-content {
  .cropper {
    width: auto;
    height: 400px;
  }
}
</style>