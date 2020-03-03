<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <el-form :inline="true" :model="listQuery">
        <el-form-item>
          <i class="el-icon-search" />
        </el-form-item>

        <el-form-item label="所属用户：">
          <el-select
            v-model="listQuery.targetId"
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
        <el-form-item label="拉新状态：">
          <el-select v-model="listQuery.popularizeStatus" placeholder="请选择">
            <el-option
              v-for="item in popularizeStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="时间段：">
          <el-date-picker
            v-model="timeRange"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
            value-format="timestamp"
            @change="timeChanged"
          />
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
        stripe
        style="width: 100%"
      >
        <el-table-column
          prop="id"
          label="ID"
          width="180"
        />

        <el-table-column
          prop="nickname"
          label="用户昵称"
          width="100"
        />
        <el-table-column
          prop="mobile"
          label="手机号码"
          width="100"
        />
        <el-table-column
          prop="avatar"
          label="用户头像"
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
          prop="userId"
          label="用户ID"
          width="180"
        />

        <el-table-column
          prop="amount"
          label="总消费金额"
          width="120"
        />

        <el-table-column
          label="推广状态"
          width="100"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 'PENDING_FIRST_PAY'">待首次支付</el-tag>
            <el-tag v-else-if="scope.row.status === 'OK'" type="success">成功</el-tag>
            <!-- <el-tag v-else type="danger">否</el-tag> -->
          </template>
        </el-table-column>
        <el-table-column
          prop="targetId"
          label="所属用户ID"
          width="180"
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
          label="首次支付时间"
        >
          <template slot-scope="scope">
            {{ scope.row.firstPayAt | timeFormatter }}
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
import { fetchList } from '@/api/popularize'
import { fetchList as fetchUserList } from '@/api/user'
const defaultListQuery = {
  targetId: null,
  popularizeType: 'USER',
  popularizeStatus: null,
  startAt: null,
  endAt: null,
  current: 1,
  size: 10

}
export default {
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      tableData: [],
      total: null,
      loading: false,
      timeRange: null,
      users: [],
      popularizeStatus: [

        {
          value: 'OK',
          label: '成功'
        }, {
          value: 'PENDING_FIRST_PAY',
          label: '待首次支付'
        }
      ], pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      }

    }
  },
  created() {
    this.getList()
  },
  methods: {

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
    timeChanged(val) {
      if (val && val.length === 2) {
        this.listQuery.startAt = val[0]
        this.listQuery.endAt = val[1]
      } else {
        this.listQuery.startAt = null
        this.listQuery.endAt = null
      }
    },
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
    }
  }
}
</script>

<style>

</style>
