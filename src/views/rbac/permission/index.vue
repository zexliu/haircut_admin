<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <el-form :inline="true" :model="listQuery">
        <el-form-item>
          <i class="el-icon-search" />
        </el-form-item>
        <el-form-item label="输入搜索：">
          <el-input v-model="listQuery.keywords" placeholder="名称、URL" />
        </el-form-item>
        <el-form-item label="所属模块：">
          <el-cascader v-model="listQuery.moduleId" :options="options" :props="{checkStrictly: true ,emitPath:false ,value:'id' , label:'name'}" />
        </el-form-item>
        <el-form-item label="方法类型">
          <el-select v-model="listQuery.methodType" placeholder="请选择">
            <el-option
              v-for="item in methodTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
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
          prop="name"
          label="名称"
          width="180"
        />
        <el-table-column
          width="200"
          prop="url"
          label="链接"
        />
        <el-table-column
          width="120"
          label="所属模块"
          prop="moduleId"
          :formatter="moduleFormatter"
        />
        <el-table-column
          label="方法类型"
          width="100"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.methodType === 'GET'">GET</el-tag>
            <el-tag v-else-if="scope.row.methodType === 'POST'" type="success">POST</el-tag>
            <el-tag v-else-if="scope.row.methodType === 'PUT'" type="warning">PUT</el-tag>
            <el-tag v-else-if="scope.row.methodType === 'DELETE'" type="danger">DELETE</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          width="80"
          prop="seq"
          label="排序"
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
          prop="remark"
          label="备注"
        />
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <router-link :to="'/rbac/permissions/update/'+scope.row.id">
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
import { fetchList, remove } from '@/api/permission'
import { fetchList as fetchModuleList, tree } from '@/api/permission-module'

const defaultListQuery = {
  keywords: null,
  current: 1,
  size: 10,
  methodType: null,
  moduleId: null
}
export default {
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      tableData: [],
      total: null,
      options: [],
      modules: [],
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
      }]

    }
  },
  created() {
    this.fetchModuleList()
    this.fetchTree()
    this.getList()
  },
  methods: {
    moduleFormatter(row, column) {
      const module = this.modules.find(item => {
        return item.id === row.moduleId
      })
      return module ? module.name : ''
    },
    fetchModuleList() {
      fetchModuleList({ current: 1, size: 9999 }).then(response => {
        this.modules = response.records
      })
    },
    fetchTree() {
      tree().then(response => {
        this.options = response
      })
    },
    async getList() {
      const data = await fetchList(this.listQuery)
      this.total = data.total
      this.tableData = data.records
    }, handleSearch() {
      this.listQuery.current = 1
      this.getList()
    },
    handleResetSearch() {
      this.listQuery = Object.assign({}, defaultListQuery)
    }, handleAdd() {
      this.$router.push({ path: '/rbac/permissions/add' })
    }, handleSizeChange(val) {
      this.listQuery.size = val
      this.listQuery.current = 1
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.current = val
      this.getList()
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
