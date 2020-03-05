<template>
  <el-card class="form-container" shadow="never">

    <el-form ref="form" :model="form" :rules="rules" label-width="150px">
      <el-form-item label="名称：" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="图片：" prop="image">
        <avatar-upload v-model="form.image" />
      </el-form-item>
      <el-form-item label="链接：" prop="description">
        <el-input v-model="form.linkUrl" />
      </el-form-item>
      <el-form-item label="描述：" prop="description">
        <el-input v-model="form.description" />
      </el-form-item>
      <el-form-item label="排序：" prop="seq">
        <el-input-number v-model="form.seq" :min="0" :max="99999999" :precision="0" :controls="false" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('form')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('form')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { fetchDetail, create, update } from '@/api/banner'
import AvatarUpload from '@/components/Upload/AvatarUpload'

const defaultForm = {
  name: null,
  description: null,
  icon: null,
  groupStatus: true,
  seq: 0,
  linkUrl: null
}
export default {
  name: 'ServiceProjectDetail',
  components: { AvatarUpload },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      id: null,
      form: Object.assign({}, defaultForm),
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          {
            min: 2,
            max: 20,
            message: '长度在 2 到 20 个字符',
            trigger: 'blur'
          }
        ],
        image: [
          { required: true, message: '请上传图片', trigger: 'blur' }

        ],
        description: [
          {
            min: 6,
            max: 200,
            message: '长度在 6 到 200 个字符',
            trigger: 'blur'
          }
        ]
      }

    }
  },

  created() {
    if (this.isEdit) {
      this.id = this.$route.params && this.$route.params.id
      fetchDetail(this.id).then(response => {
        this.form.name = response.name
        this.form.image = response.image
        this.form.description = response.description
        this.form.seq = response.seq
        this.form.linkUrl = response.linkUrl
      })
    }
  },
  methods: {

    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.form = Object.assign({}, defaultForm)
    },
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$confirm('是否提交数据', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if (this.isEdit) {
              update(this.id, this.form).then(() => {
                this.$notify({
                  message: '修改成功',
                  type: 'success',
                  duration: 1000
                })
                this.$router.back()
              })
            } else {
              create(this.form).then(() => {
                this.form = Object.assign({}, defaultForm)
                this.$notify({
                  message: '提交成功',
                  type: 'success',
                  duration: 1000
                })
              })
            }
          })
        } else {
          this.$notify({
            message: '效验失败',
            type: 'error',
            duration: 1000
          })
          return false
        }
      })
    }
  }

}

</script>

<style scoped>

</style>
