<template>
  <el-card class="large-form-container" shadow="never">
    <el-form ref="form" :model="form" :rules="rules" label-width="150px">
      <el-form-item label="用户组名称：" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="排序：" prop="seq">
        <el-input-number v-model="form.seq" :min="0" :max="99999999" :precision="0" :controls="false" />
      </el-form-item>
      <el-form-item label="备注：" prop="remark">
        <el-input v-model="form.remark" />
      </el-form-item>
      <el-form-item label="关联角色：">
        <el-tree
          ref="tree"
          :data="roleTree"
          show-checkbox
          node-key="id"
          :default-checked-keys="form.roleIds"
          :props="treeProps"
          default-expand-all
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit('form')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('form')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { tree } from '@/api/role'
import { create, update, fetchDetail } from '@/api/user-group'

const defaultForm = {
  name: null,
  seq: 0,
  roleIds: [],
  remark: null
}
export default {
  name: 'UserGroupDetail',
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
          { required: true, message: '请输入用户组名称', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '长度在 2 到 10 个字符',
            trigger: 'blur'
          }
        ],
        remark: [{
          max: 200,
          message: '长度在 200 个字符以内',
          trigger: 'blur'
        }]
      },
      options: [],
      roleTree: [],
      treeProps: {
        children: 'children',
        label: 'name'
      }

    }
  },

  created() {
    this.fetchRoleTree()
    if (this.isEdit) {
      this.id = this.$route.params && this.$route.params.id
      fetchDetail(this.id).then(response => {
        this.form.name = response.name
        this.form.parentId = response.parentId
        this.form.seq = response.seq
        this.form.roleIds = response.roleIds
      })
    }
  },
  methods: {
    fetchRoleTree() {
      tree().then(response => {
        this.roleTree = response
      })
    },

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
            const list = this.$refs.tree.getCheckedKeys()
            this.form.roleIds = list
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
                this.form.roleIds = []
                this.$refs.tree.setCheckedKeys([])
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
