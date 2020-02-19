<template>
  <el-card class="form-container" shadow="never">

    <el-form ref="form" :model="form" :rules="rules" label-width="150px">
      <el-form-item label="用户名(账号)：" prop="username">
        <el-input v-model="form.username" />
      </el-form-item>
      <el-form-item v-if="!isEdit" label="密码：" prop="password">
        <el-input v-model="form.password" show-password />
      </el-form-item>
      <el-form-item label="昵称：" prop="nickname">
        <el-input v-model="form.nickname" />
      </el-form-item>
      <el-form-item label="头像：" prop="avatar">
        <avatar-upload v-model="form.avatar" />
      </el-form-item>
      <el-form-item label="邮箱：" prop="email">
        <el-input v-model="form.email" />
      </el-form-item>
      <el-form-item label="手机号码：" prop="mobile">
        <el-input v-model="form.mobile" />
      </el-form-item>
      <el-form-item label="可用状态：" prop="enable">
        <el-switch
          v-model="form.enable"
        />
      </el-form-item>
      <el-form-item label="锁定状态：" prop="enable">
        <el-switch
          v-model="form.locked"
        />
      </el-form-item>
      <el-form-item label="排序：" prop="seq">
        <el-input-number v-model="form.seq" :min="0" :max="99999999" :precision="0" :controls="false" />
      </el-form-item>
      <el-form-item label="备注：" prop="remark">
        <el-input v-model="form.remark" />
      </el-form-item>
      <el-form-item label="关联用户组：" prop="remark">
        <el-select v-model="form.groupIds" multiple placeholder="请选择">
          <el-option
            v-for="item in userGroups"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
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
import { fetchList as fetchGroups } from '@/api/user-group'
import { fetchDetail, create, update } from '@/api/user'
import { hex_md5 } from '@/utils/md5'
import AvatarUpload from '@/components/Upload/AvatarUpload'

const defaultForm = {
  username: null,
  password: null,
  email: null,
  mobile: null,
  enable: true,
  locked: false,
  nickname: null,
  avatar: null,
  groupIds: [],
  seq: 0,
  roleIds: [],
  remark: null
}
export default {
  name: 'UserDetail',
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
        username: [
          { required: true, message: '请输入用户名(账号)', trigger: 'blur' },
          {
            min: 6,
            max: 20,
            message: '长度在 6 到 20 个字符',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 20,
            message: '长度在 6 到 20 个字符',
            trigger: 'blur'
          }
        ],
        email: [
          {
            min: 6,
            max: 30,
            message: '长度在 6 到 30 个字符',
            trigger: 'blur'
          }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          {
            min: 11,
            max: 11,
            message: '长度在11个字符',
            trigger: 'blur'
          }
        ],
        nickname: [
          { required: true, message: '请输入昵称', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '长度在 6 到 10 个字符',
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
      },
      userGroups: []

    }
  },

  created() {
    this.fetchRoleTree()
    this.fetchGroups()
    if (this.isEdit) {
      this.id = this.$route.params && this.$route.params.id
      fetchDetail(this.id).then(response => {
        this.form.username = response.username
        this.form.mobile = response.mobile
        this.form.enable = response.enable
        this.form.locked = response.locked
        this.form.avatar = response.avatar
        this.form.nickname = response.nickname
        this.form.groupIds = response.groupIds
        this.form.roleIds = response.roleIds
        this.form.seq = response.seq
        this.form.remark = response.remark
      })
    }
  },
  methods: {
    fetchGroups() {
      fetchGroups({ current: 1, size: 99999 }).then(response => {
        this.userGroups = response.records
      })
    },
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
              this.form.password = hex_md5(this.form.password)
              create(this.form).then(() => {
                this.$refs[formName].resetFields()
                this.form = Object.assign({}, defaultForm)
                this.form.roleIds = []
                this.form.groupIds = []
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

<style scoped>

</style>
