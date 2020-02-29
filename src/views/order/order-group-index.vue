<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <el-form :inline="true" :model="listQuery">
        <el-form-item>
          <i class="el-icon-search" />
        </el-form-item>
        <el-form-item label="关键字：">
          <el-input v-model="listQuery.keywords" placeholder="订单号/支付单号" />
        </el-form-item>

        <el-form-item label="订单状态：">
          <el-select
            v-model="listQuery.status"
            placeholder="请选择"
          >
            <el-option
              v-for="item in orderStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="所属店铺：">
          <el-select
            v-model="listQuery.shopId"
            placeholder="请输入关键词"
            filterable
            remote
            reserve-keyword
            :remote-method="remoteMethodShop"
            :loading="loading"
          >
            <el-option
              v-for="item in shops"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
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

        <el-form-item label="服务类型：">
          <el-select
            v-model="listQuery.serviceId"
            placeholder="请选择"
          >
            <el-option
              v-for="item in services"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="性别：">
          <el-select
            v-model="listQuery.sexType"
            placeholder="请选择"
          >
            <el-option
              v-for="item in sexTypes"
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
        :summary-method="getSummaries"
        show-summary
      >
        <el-table-column
          prop="id"
          label="ID"
          width="180"
        />
        <el-table-column
          prop="amount"
          label="金额（元）"
          width="120"
        />
        <el-table-column
          label="订单状态"
          width="100"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 'PENDING_USE'">待使用</el-tag>
            <el-tag v-else-if="scope.row.status === 'USED'" type="success">已使用</el-tag>
            <el-tag v-else-if="scope.row.status === 'REFUND'" type="info">已退款</el-tag>
            <!-- <el-tag v-else type="danger">否</el-tag> -->
          </template>
        </el-table-column>

        <el-table-column
          prop="remainCount"
          label="剩余次数"
          width="100"
        />
        <el-table-column
          prop="totalCount"
          label="总次数"
          width="100"
        />
        <el-table-column
          width="120"
          label="服务类型"
        >
          <template slot-scope="scope">
            {{ getServiceName(scope.row.serviceId) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="userId"
          label="用户ID"
          width="180"
        />
        <el-table-column
          prop="shopId"
          label="店铺ID"
          width="180"
        />

        <el-table-column
          prop="stylistId"
          label="发型师ID"
          width="180"
        />
        <el-table-column
          prop="orderId"
          label="支付单ID"
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
          label="过期时间"
        >
          <template slot-scope="scope">
            {{ scope.row.expireAt | timeFormatter }}
          </template>
        </el-table-column>
        <!-- <el-table-column label="操作" width="200" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column> -->
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
import { fetchList as fetchUserList } from '@/api/user'
import { fetchList as fetchShopList } from '@/api/shop'

import { fetchList } from '@/api/groupon'
import { fetchList as fetchServiceList } from '@/api/service-projects'

const defaultListQuery = {
  keywords: null,
  shopId: null,
  stylistId: null,
  userId: null,
  serviceId: null,
  status: null,
  sexType: null,
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
      loading: false,
      total: null,
      users: [],
      shops: [],
      timeRange: [],
      services: [],
      orderStatus: [
        {
          value: 'PENDING_USE',
          label: '待使用'
        }, {
          value: 'USED',
          label: '已使用'
        }, {
          value: 'REFUND',
          label: '已退款'
        }
      ],
      sexTypes: [
        {
          value: 'MALE',
          label: '男士'
        }, {
          value: 'FEMALE',
          label: '女士'
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
    this.getServices()
    this.getList()
  },
  methods: {
    getServiceName(serviceId) {
      const res = this.services.find(item => {
        return item.id === serviceId
      })
      if (res) {
        return res.name
      } else {
        return ''
      }
    },
    getServices() {
      fetchServiceList({ current: 1, size: 1000 }).then(response => {
        this.loading = false
        this.services = response.records
      })
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
    },
    remoteMethodShop(query) {
      if (query !== '') {
        this.loading = true
        fetchShopList({ current: 1, size: 20, keywords: query }).then(response => {
          this.loading = false
          this.shops = response.records
        })
      } else {
        this.shops = []
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
    }, getSummaries(param) {
      const { columns, data } = param

      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        } else if (index === 1) {
          let total = 0
          data.forEach(element => {
            total += element.amount
          })
          sums[index] = total
        //   const values = data.map(item => Number(item[column.property]))
        } else {
          sums[index] = ''
        }
      })

      return sums
    }
  }
}
</script>

<style>

</style>
