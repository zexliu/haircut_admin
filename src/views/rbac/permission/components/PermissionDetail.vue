<template>
  <el-card class="large-form-container" shadow="never">
    <el-form ref="form" :model="form" :rules="rules" label-width="150px">
      <el-form-item label="权限名称：" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="链接：" prop="url">
        <el-input v-model="form.url" />
      </el-form-item>
      <el-form-item label="方法类型：" prop="methodType">
        <el-select v-model="form.methodType" placeholder="请选择">
          <el-option
            v-for="item in methodTypes"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="所属模块：" prop="moduleId">
        <el-cascader-panel v-model="form.moduleId" :options="options" :props="{checkStrictly: true ,emitPath:false ,value:'id' , label:'name'}" />
      </el-form-item>
      <el-form-item label="排序：" prop="seq">
        <el-input-number v-model="form.seq" :min="0" :max="99999999" :precision="0" :controls="false" />
      </el-form-item>
      <el-form-item label="备注：" prop="remark">
        <el-input v-model="form.remark" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('form')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('form')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { tree } from '@/api/permission-module'
import { create, update, fetchDetail } from '@/api/permission'

const defaultForm = {
  name: null,
  url: null,
  methodType: null,
  moduleId: null,
  remark: null,
  seq: 0 // 文章内容
}
export default {
  name: 'PermissionDetail',
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
        moduleId: [{ required: true, message: '请选择所属模块', trigger: 'blur' }],
        url: [{ required: true, message: '请输入链接', trigger: 'blur' }],
        methodType: [{ required: true, message: '请选择方法类型', trigger: 'blur' }],
        remark: [{
          max: 200,
          message: '长度在 200 个字符以内',
          trigger: 'blur'
        }]

      },
      methodTypes: [{
        value: 'GET',
        label: 'GET'
      }, {
        value: 'POST',
        label: 'POST'
      }, {
        value: 'PUT',
        label: 'PUT'
      }, {
        value: 'DELETE',
        label: 'DELETE'
      }],
      options: []

    }
  },

  created() {
    this.fetchTree()
    if (this.isEdit) {
      this.id = this.$route.params && this.$route.params.id
      fetchDetail(this.id).then(response => {
        this.form = response
      })
    }
  },
  methods: {
    fetchTree() {
      tree().then(response => {
        this.options = response
      })
    },
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
                this.$refs[formName].resetFields()
                this.form = Object.assign({}, defaultForm)
                this.fetchTree()
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

<style>

</style>
