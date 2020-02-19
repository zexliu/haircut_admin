<template>
  <el-upload
    class="avatar-uploader"
    :action="action"
    :show-file-list="false"
    :on-success="handleSuccess"
    :before-upload="beforeUpload"
  >
    <img v-if="imageUrl" :src="imageUrl" class="avatar">
    <i v-else class="el-icon-plus avatar-uploader-icon" />
  </el-upload>
</template>

<script>

export default {
  name: 'AvatarUpload',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tempUrl: '',
      action: process.env.VUE_APP_BASE_API + '/api/v1/upload'
    }
  },
  computed: {
    imageUrl() {
      return this.value
    }
  },
  methods: {

    emitInput(val) {
      this.$emit('input', val)
    },
    handleSuccess(response, file, fileList) {
      this.emitInput(response)
    },
    beforeUpload(file) {
      const isImage = (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif')
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isImage) {
        this.$message.error('上传头像图片只能是 JPG  png 或 gif格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isImage && isLt2M
    }

  }
}
</script>
<style>
   .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 128px;
    height: 128px;
    line-height: 128px;
    text-align: center;
  }
  .avatar {
    width: 128px;
    height: 128px;
    display: block;
  }
</style>
