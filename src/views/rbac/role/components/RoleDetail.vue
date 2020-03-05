<template>
  <el-card class="large-form-container" shadow="never">
    <el-form ref="form" :model="form" :rules="rules" label-width="150px">
      <el-form-item label="角色名称：" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="所属角色：" prop="name">
        <el-cascader-panel
          v-model="form.parentId"
          :options="options"
          :props="{checkStrictly: true ,emitPath:false ,value:'id' , label:'name'}"
        />
      </el-form-item>
      <el-form-item label="排序：" prop="seq">
        <el-input-number v-model="form.seq" :min="0" :max="99999999" :precision="0" :controls="false" />
      </el-form-item>
      <el-form-item label="关联权限：">
        <el-tree
          ref="tree"
          :data="permissionTree"
          show-checkbox
          node-key="id"
          :default-checked-keys="form.permissionIds"
          :props="treeProps"
          default-expand-all
        />
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
import { create, update, fetchDetail, tree } from '@/api/role'
import { permissionTree } from '@/api/permission'

const defaultForm = {
  name: null,
  parentId: '0', // 文章题目
  seq: 0, // 文章内容
  permissionIds: [],
  remark: null
}
export default {
  name: 'RoleDetail',
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
          { required: true, message: '请输入模块名称', trigger: 'blur' },
          {
            min: 2,
            max: 20,
            message: '长度在 2 到 20 个字符',
            trigger: 'blur'
          }
        ],
        parentId: [{ required: true, message: '请选择父角色', trigger: 'blur' }]
      },
      options: [],
      permissionTree: [],
      treeProps: {
        children: 'children',
        label: 'name'
      },
      permissions: []

    }
  },

  created() {
    this.fetchTree()
    this.fetchPermissionTree()
    if (this.isEdit) {
      this.id = this.$route.params && this.$route.params.id
      fetchDetail(this.id).then(response => {
        this.form.name = response.name
        this.form.parentId = response.parentId
        this.form.seq = response.seq
        this.form.permissionIds = response.permissionIds
        this.form.remark = response.remark
      })
    }
  },
  methods: {
    fetchPermissionTree() {
      permissionTree().then(response => {
        this.permissionTree = response
        // 递归便利取出权限列表 并设置 disable状态
        this.recursive(this.permissionTree)
      })
    },
    recursive(list) {
      for (let i = 0; i < list.length; i++) {
        const element = list[i]
        if (element.children && element.children.length > 0) {
          this.recursive(element.children)
          element.disabled = false
        } else {
          element.disabled = element.module
        }
        if (!element.module) {
          this.permissions.push(element)
        }
      }
    },
    fetchTree() {
      tree().then(response => {
        this.options = response
        for (let i = 0; i < this.options.length; i++) {
          const element = this.options[i]
          element.disabled = element.id === this.id
        }
        this.options.unshift({ id: '0', name: '无' })
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
            this.form.permissionIds = []
            const list = this.$refs.tree.getCheckedKeys()
            for (let i = 0; i < list.length; i++) {
              const element = list[i]
              const item = this.permissions.find(item => {
                return item.id === element
              })
              if (item) {
                this.form.permissionIds.push(item.id)
              }
            }

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
                this.form.permissionIds = []
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
