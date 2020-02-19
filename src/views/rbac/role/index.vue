<template>
  <div class="app-container">
    <div class="table-container">
      <el-card class="operate-container" shadow="never">
        <i class="el-icon-tickets in-line" style="margin-top: 5px" />
        <el-breadcrumb class="in-line" separator-class="el-icon-arrow-right">
          <el-breadcrumb-item
            v-for="item in crumbs "
            :key="item.path"
            :to="item.path"
          >{{ item.name }}</el-breadcrumb-item>
        </el-breadcrumb>
        <el-button
          class="btn-add in-line"
          style="float:right"
          type="primary"
          @click="handleAdd()"
        >新增</el-button>
      </el-card>
      <el-table
        v-loading="listLoading"
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
          prop="name"
          label="名称"
          width="120"
        />
        <el-table-column
          prop="seq"
          label="排序"
          width="80"
        />
        <el-table-column
          prop="remark"
          label="备注"
        />

        <el-table-column
          width="120"
          label="创建时间"
        >
          <template slot-scope="scope">
            {{ scope.row.createAt | timeFormatter }}
          </template>
        </el-table-column>
        <el-table-column label="设置" width="120" align="center">
          <template slot-scope="scope">
            <el-button
              :disabled="scope.row.leafStatus"
              @click="handleShowNextLevel(scope.$index, scope.row)"
            >查看下级</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <router-link :to="'/rbac/roles/update/'+scope.row.id">
              <el-button>编辑</el-button>
            </router-link>
            <el-button type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
  </div>
</template>

<script>
import { fetchList, remove } from '@/api/role'
const defaultListQuery = {
  current: 1,
  size: 10,
  parentId: '0'
}
export default {
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      tableData: [],
      total: null,
      crumbs: [],
      listLoading: true

    }
  },
  watch: {
    $route() {
      this.resetParentId()
      this.getAllList()
      this.getList()
    }
  },
  created() {
    this.resetParentId()
    this.getAllList()
    this.getList()
  },
  methods: {

    getAllList() {
      fetchList({ current: 1, size: 10000 }).then(response => {
        this.crumbs = []
        this.recursiveData(response.records, this.listQuery.parentId)
        this.crumbs.reverse()
      })
    },
    recursiveData(list, parentId) {
      const parent = list.find(item => {
        return item.id === parentId
      })
      if (parent) { // 根分类
        this.crumbs.push({
          path: '/rbac/roles/index?parentId=' + parent.id,
          name: parent.name

        })

        return this.recursiveData(list, parent.parentId)
      } else {
        this.crumbs.push({
          path: '/rbac/roles/index',
          name: '根角色'
        })
        return
      }
    },
    resetParentId() {
      if (this.$route.query.parentId != null) {
        this.listQuery.parentId = this.$route.query.parentId
      } else {
        this.listQuery.parentId = '0'
      }
    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.listLoading = false
        this.total = response.total
        this.tableData = response.records
      })
    }, handleSearch() {
      this.listQuery.current = 1
      this.getList()
    },
    handleResetSearch() {
      this.listQuery = Object.assign({}, defaultListQuery)
    }, handleAdd() {
      this.$router.push({ path: '/rbac/roles/add' })
    }, handleSizeChange(val) {
      this.listQuery.size = val
      this.listQuery.current = 1
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.current = val
      this.getList()
    }, handleShowNextLevel(index, row) {
      this.$router.push({
        path: '/rbac/roles/index',
        query: { parentId: row.id }
      })
    }, handleDelete(index, row) {
      this.$confirm('是否要删除该分类', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        remove(row.id).then(() => {
          this.$notify({
            message: '删除成功',
            type: 'success',
            duration: 1000
          })
          this.getList()
        })
      })
    }
  }
}
</script>

<style>

</style>
