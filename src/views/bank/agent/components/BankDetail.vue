<template>
  <el-card class="form-container" shadow="never">

    <el-form ref="form" :model="form" :rules="rules" label-width="150px">
      <el-form-item label="银行名称：" prop="brandName">
        <el-input v-model="form.brandName" />
      </el-form-item>
      <el-form-item label="银行卡号：" prop="brandNo">
        <el-input v-model="form.brandNo" />
      </el-form-item>
      <el-form-item label="开户人姓名：" prop="brandUsername">
        <el-input v-model="form.brandUsername" />
      </el-form-item>
      <el-form-item label="开户行名称：" prop="brandOpening">
        <el-input v-model="form.brandOpening" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('form')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('form')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { fetchDetail, create, update } from '@/api/bank'

const defaultForm = {
  brandName: null,
  brandNo: null,
  brandUsername: null,
  brandOpening: null
}
export default {
  name: 'BankDetail',
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
        brandName: [
          { required: true, message: '请输入银行名称', trigger: 'blur' },
          {
            min: 2,
            max: 20,
            message: '长度在 2 到 20 个字符',
            trigger: 'blur'
          }
        ],
        brandNo: [
          { required: true, message: '请输入银行卡号', trigger: 'blur' },
          {
            min: 15,
            max: 32,
            message: '长度在 15 到 32 个字符',
            trigger: 'blur'
          }
        ],
        brandUsername: [
          { required: true, message: '开户人姓名', trigger: 'blur' },
          {
            min: 2,
            max: 20,
            message: '请输入开户人姓名',
            trigger: 'blur'
          }
        ],
        brandOpening: [
          { required: true, message: '请输入开户行名称', trigger: 'blur' },
          {
            min: 2,
            max: 20,
            message: '长度在 2 到 20 个字符',
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
        this.form = response
      })
    }
  },
  methods: {
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.form = Object.assign({}, defaultForm)
      this.$refs.tree.setCheckedKeys([])
    },
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$confirm('是否提交数据', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            // 组装数据 keys数组中排除权限模块的数据 值提交权限
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
                this.$refs[formName].resetFields()
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
