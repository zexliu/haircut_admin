<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <el-form :inline="true" :model="listQuery">
        <el-form-item>
          <i class="el-icon-search" />
        </el-form-item>

        <el-form-item label="交易类型：">
          <el-select v-model="listQuery.type" placeholder="请选择">
            <el-option
              v-for="item in transactionTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="交易方式：">
          <el-select v-model="listQuery.incrStatus" placeholder="请选择">
            <el-option
              v-for="item in incrStatus"
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
        stripe
        style="width: 100%"
      >
        <el-table-column
          prop="id"
          label="ID"
          width="180"
        />
        <el-table-column
          prop="targetId"
          label="目标ID"
          width="180"
        />

        <el-table-column
          prop="amount"
          label="金额"
          width="100"
        />
        <el-table-column
          label="交易方式"
          width="100"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.incrStatus">收入</el-tag>
            <el-tag v-else type="danger">支出</el-tag>
          </template>
        </el-table-column>

        <el-table-column
          label="交易类型"
          width="100"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.type === 'SERVICE_INCOME'">服务收入</el-tag>
            <el-tag v-if="scope.row.type === 'GROUPON_INCOME'" type="success">团购收入</el-tag>
            <el-tag v-if="scope.row.type === 'WITHDRAW'" type="danger">提现</el-tag>
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
import { fetchList } from '@/api/agent-transaction'

const defaultListQuery = {
  type: null,
  incrStatus: null,
  current: 1,
  size: 10

}
export default {
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      tableData: [],
      total: null,
      transactionTypes: [
        {
          value: null,
          label: '全部'
        },
        {
          value: 'SERVICE_INCOME',
          label: '服务收入'
        }, {
          value: 'GROUP_INCOME',
          label: '团购收入'
        }
      ],
      incrStatus: [
        {
          value: null,
          label: '全部'
        },
        {
          value: true,
          label: '收入'
        }, {
          value: false,
          label: '支出'
        }
      ]

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
    }
  }
}
</script>

<style>

</style>
