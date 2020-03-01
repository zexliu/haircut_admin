<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <el-form :inline="true" :model="listQuery">
        <el-form-item>
          <i class="el-icon-search" />
        </el-form-item>

        <el-form-item label="所属用户：">
          <el-select
            v-model="listQuery.userId"
            placeholder="请输入关键词"
            filterable
            remote
            reserve-keyword
            :remote-method="remoteMethod"
            :loading="loading"
          >
            <el-option
              v-for="item in users"
              :key="item.id"
              :label="item.nickname"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="处理状态：">
          <el-select
            v-model="listQuery.status"
            placeholder="请选择"
          >
            <el-option
              v-for="item in statusOptions"
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
      </el-card>
      <el-table
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column
          prop="id"
          label="ID"
          width="180"
        />
        <el-table-column
          prop="content"
          label="反馈内容"
          width="300"
        />

        <el-table-column
          label="反馈图片"
          width="80"
        >
          <template slot-scope="scope">
            <el-image
              v-if="scope.row.images"
              style="width: 60px; height: 60px"
              :src="scope.row.images.split(',')[0]"
              fit="cover"
              :preview-src-list="scope.row.images.split(',')"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="userId"
          label="用户ID"
          width="180"
        />
        <el-table-column
          prop="linkMobile"
          label="联系电话"
          width="180"
        />
        <el-table-column
          prop="linkName"
          label="联系人"
          width="120"
        />

        <el-table-column
          label="处理状态"
          width="100"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 'PENDING'">待处理</el-tag>
            <el-tag v-else-if="scope.row.status === 'PROCESSED'" type="success">已处理</el-tag>
            <el-tag v-else-if="scope.row.status === 'IGNORE'" type="info">已忽略</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          width="120"
          label="创建时间"
        >
          <template slot-scope="scope">
            {{ scope.row.createAt | timeFormatter }}
          </template>
        </el-table-column>

        <el-table-column label="操作" width="200" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button :disabled="scope.row.status !== 'PENDING'" type="primary" @click="handleProcessed(scope.$index, scope.row)">处理</el-button>
            <el-button :disabled="scope.row.status !== 'PENDING'" type="danger" @click="handleIgone(scope.$index, scope.row)">忽略</el-button>
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
import { fetchList, updateStatus } from '@/api/feedback'
import { fetchList as fetchUserList } from '@/api/user'
const defaultListQuery = {
  keywords: null,
  status: 'PENDING',
  userId: null,
  current: 1,
  size: 10

}
export default {
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      tableData: [],
      loading: false,
      total: null,
      users: [],
      timeRange: [],
      statusOptions: [
        {
          value: 'PENDING',
          label: '待处理'
        },
        {
          value: 'PROCESSED',
          label: '已处理'
        },
        {
          value: 'IGNORE',
          label: '易忽略'
        },
        {
          value: null,
          label: '全部'
        }
      ]

    }
  },
  created() {
    this.getList()
  },
  methods: {
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        fetchUserList({ current: 1, size: 20, keywords: query }).then(response => {
          this.loading = false
          this.users = response.records
        })
      } else {
        this.users = []
      }
    },

    async getList() {
      const data = await fetchList(this.listQuery)
      this.total = data.total
      this.tableData = data.records
    },
    handleSearch() {
      this.listQuery.current = 1
      this.getList()
    },
    handleResetSearch() {
      this.selectedRegion = []
      this.listQuery = Object.assign({}, defaultListQuery)
      this.timeRange = []
    },

    handleSizeChange(val) {
      this.listQuery.size = val
      this.listQuery.current = 1
      this.getList()
    }, timeChanged(val) {
      if (val && val.length === 2) {
        this.listQuery.startAt = val[0]
        this.listQuery.endAt = val[1]
      } else {
        this.listQuery.startAt = null
        this.listQuery.endAt = null
      }
    },
    handleCurrentChange(val) {
      this.listQuery.current = val
      this.getList()
    },
    handleProcessed(index, row) {
      this.$confirm('确定已处理此反馈吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateStatus(row.id, { status: 'PROCESSED' }).then(response => {
          this.$notify({
            type: 'success',
            message: '操作成功!'
          })
          this.getList()
        })
      })
    },
    handleIgone(index, row) {
      this.$confirm('确定忽略此反馈吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateStatus(row.id, { status: 'IGNORE' }).then(response => {
          this.$notify({
            type: 'success',
            message: '操作成功!'
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
