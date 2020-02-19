<template>
  <el-card class="large-form-container" shadow="never">
    <el-form ref="form" :model="form" :rules="rules" label-width="150px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="店铺名称：" prop="name">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="关联用户：" prop="userId">
            <el-select
              v-model="form.userId"
              filterable
              remote
              reserve-keyword
              placeholder="请输入关键词"
              :remote-method="remoteMethod"
              :loading="loading"
            >
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.nickname"
                :value="item.id"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="店铺LOGO：" prop="logo">
            <avatar-upload v-model="form.logo" />
          </el-form-item>
          <el-form-item label="封面图片：" prop="coverImage">
            <avatar-upload v-model="form.coverImage" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系人：" prop="leaderName">
            <el-input v-model="form.leaderName" />
          </el-form-item>

          <el-form-item label="联系电话：" prop="leaderMobile">
            <el-input v-model="form.leaderMobile" />
          </el-form-item>

          <el-form-item label="营业执照：" prop="businessLicense">
            <avatar-upload v-model="form.businessLicense" />

          </el-form-item>
          <el-form-item label="可用状态：" prop="enable">
            <el-switch
              v-model="form.enable"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>

        <el-form-item label="简介信息：" prop="introduction">
          <el-input v-model="form.introduction" />
        </el-form-item>
        <el-form-item label="详情信息：" prop="htmlInfo">
          <tinymce v-model="form.htmlInfo" :height="100" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSubmit('form')">提交</el-button>
          <el-button v-if="!isEdit" @click="resetForm('form')">重置</el-button>
        </el-form-item>
      </el-row></el-form>
  </el-card>
</template>

<script>
import { fetchList as fetchUserList, fetchDetail, create, update } from '@/api/user'

import AvatarUpload from '@/components/Upload/AvatarUpload'
import Tinymce from '@/components/Tinymce'

const defaultForm = {
  name: null,
  userId: null,
  leaderName: null,
  leaderMobile: null,
  logo: null,
  businessLicense: null,
  coverImage: null,
  enable: true,
  introduction: null,
  htmlInfo: null

}
export default {
  name: 'ShopDetail',
  components: { AvatarUpload, Tinymce },

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
          { required: true, message: '请输入店铺名称', trigger: 'blur' },
          {
            min: 2,
            max: 20,
            message: '长度在 2 到 20 个字符',
            trigger: 'blur'
          }
        ],
        leaderName: [
          { required: true, message: '请输入联系人姓名', trigger: 'blur' },
          {
            min: 2,
            max: 8,
            message: '长度在 2 到 8 个字符',
            trigger: 'blur'
          }
        ],
        userId: [
          { required: true, message: '请选择关联用户', trigger: 'blur' }
        ],

        leaderMobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          {
            min: 11,
            max: 11,
            message: '长度在11个字符',
            trigger: 'blur'
          }
        ],
        logo: [
          { required: true, message: '请上传店铺LOGO', trigger: 'blur' }
        ],
        coverImage: [
          { required: true, message: '请上传封面图', trigger: 'blur' }
        ]
      },
      options: [],
      loading: false

    }
  },

  created() {
    if (this.isEdit) {
      this.id = this.$route.params && this.$route.params.id
      fetchDetail(this.id).then(response => {
        this.form = response
        this.remoteMethod(this.form.userId)
      })
    }
  },
  methods: {
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        fetchUserList({ current: 1, size: 20, keywords: query }).then(response => {
          this.loading = false
          this.options = response.records
        })
      } else {
        this.options = []
      }
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

<style>

</style>
