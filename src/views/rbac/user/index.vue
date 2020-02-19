<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <el-form :inline="true" :model="listQuery">
        <el-form-item>
          <i class="el-icon-search" />
        </el-form-item>
        <el-form-item label="输入搜索：">
          <el-input v-model="listQuery.keywords" placeholder="用户名、昵称、手机号码" />
        </el-form-item>
        <el-form-item label="用户组">
          <el-select v-model="listQuery.groupId" placeholder="请选择">
            <el-option
              v-for="item in groupList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch()">查询结果</el-button>
          <el-button
            @click="handleResetSearch()"
          >重置</el-button>
        </el-form-item>
      </el-form>

    </el-card>

    <div class="table-container">
      <el-card class="operate-container" shadow="never">
        <i class="el-icon-tickets" />
        <span>数据列表</span>
        <el-button type="primary" class="btn-add" @click="handleAdd()">新增</el-button>
      </el-card>
      <el-table
        :data="tableData"
        stripe
        style="width: 100%"
      >
        <el-table-column
          prop="id"
          label="ID"
          width="180"
        />
        <el-table-column
          prop="username"
          label="账号"
          width="120"
        />
        <el-table-column
          width="120"
          prop="nickname"
          label="昵称"
        />
        <el-table-column
          prop="avatar"
          label="头像"
          width="80"
        >
          <template slot-scope="scope">
            <el-image
              style="width: 60px; height: 60px"
              :src="scope.row.avatar"
              fit="cover"
            />
          </template>
        </el-table-column>
        <el-table-column
          width="120"
          prop="mobile"
          label="手机号码"
        />
        <el-table-column
          width="120"
          label="创建时间"
        >
          <template slot-scope="scope">
            {{ scope.row.createAt | timeFormatter }}
          </template>
        </el-table-column>
        <el-table-column
          width="120"
          label="登录时间"
        >
          <template slot-scope="scope">
            {{ scope.row.loginAt | timeFormatter }}
          </template>
        </el-table-column>
        <el-table-column
          width="100"
          label="可用状态"
        >
          <template slot-scope="scope">
            <el-tag :type="scope.row.enable ? 'success' : 'info' "> {{ scope.row.enable ? '可用' : '不可用' }}</el-tag>

          </template>
        </el-table-column>

        <el-table-column
          width="100"
          label="锁定状态"
        >
          <template slot-scope="scope">
            <el-tag :type="scope.row.locked ? 'info' : 'success' "> {{ scope.row.locked ? '锁定' : '未锁定' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <router-link :to="'/rbac/users/update/'+scope.row.id">
              <el-button>编辑</el-button>
            </router-link>
            <el-button type="danger" @click="onPasswordButtonClick(scope.row)">修改密码</el-button>
          </template>
        </el-table-column>

      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        :current-page="listQuery.current"
        :page-size="listQuery.size"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog title="修改密码" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="passwordForm" :rules="rules">
        <el-form-item label="新密码：" label-width="120px" prop="password">
          <el-input v-model="passwordForm.password" placeholder="请输入新密码" show-password />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit('form')">提交</el-button>

      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, password } from '@/api/user'
import { fetchList as fetchGroupList } from '@/api/user-group'
import { hex_md5 } from '@/utils/md5'
const defaultListQuery = {
  keywords: null,
  enable: null,
  locked: null,
  current: 1,
  size: 10
}
const defaultPsswordForm = {
  password: null
}
export default {
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      tableData: [],
      total: null,
      groupList: [],
      currentRow: null,
      dialogFormVisible: false,
      passwordForm: Object.assign({}, defaultPsswordForm),
      rules: {
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 20,
            message: '长度在 6 到 20 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    this.getList()
    this.fetchGroupList()
  },
  methods: {
    fetchGroupList() {
      fetchGroupList({ current: 1, size: 9999 }).then(response => {
        this.groupList = response.records
      })
    },
    getList() {
      fetchList(this.listQuery).then(response => {
        this.total = response.total
        this.tableData = response.records
      })
    }, handleSearch() {
      this.listQuery.current = 1
      this.getList()
    },
    handleResetSearch() {
      this.listQuery = Object.assign({}, defaultListQuery)
    },
    handleSizeChange(val) {
      this.listQuery.size = val
      this.listQuery.current = 1
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.current = val
      this.getList()
    },
    handleAdd() {
      this.$router.push({ path: '/rbac/users/add' })
    },
    onPasswordButtonClick(val) {
      this.currentRow = val
      this.dialogFormVisible = true
    },
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.passwordForm.password = hex_md5(this.passwordForm.password)
          password(this.currentRow.id, this.passwordForm).then(() => {
            this.dialogFormVisible = false
            this.passwordForm = Object.assign({}, defaultPsswordForm)
            this.$notify({
              message: '修改成功',
              type: 'success',
              duration: 1000
            })
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
