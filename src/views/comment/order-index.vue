<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <el-form :inline="true" :model="listQuery">
        <el-form-item>
          <i class="el-icon-search" />
        </el-form-item>

        <el-form-item label="所属店铺：">
          <el-select
            v-model="listQuery.shopId"
            placeholder="请输入关键词"
            filterable
            remote
            reserve-keyword
            :remote-method="remoteMethod"
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
        <el-form-item label="评分级别：">
          <el-select
            v-model="listQuery.starLevel"
            placeholder="请输入关键词"
          >
            <el-option
              v-for="item in starLevel"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="订单ID：">
          <el-input v-model="listQuery.orderId" placeholder="订单ID" />
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

        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">

              <el-form-item label="订单ID">
                <span>{{ props.row.topicId }}</span>
              </el-form-item>
              <el-form-item label="店铺ID">
                <span>{{ props.row.shopId }}</span>
              </el-form-item>
              <el-form-item label="发型师ID">
                <span>{{ props.row.stylistId }}</span>
              </el-form-item>
              <el-form-item label="评论内容">
                <span>{{ props.row.content }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          prop="id"
          label="ID"
          width="180"
        />

        <el-table-column
          prop="score"
          label="评分"
          width="80"
        />
        <el-table-column
          prop="skillScore"
          label="技术评分"
          width="100"
        />
        <el-table-column
          prop="hygieneScore"
          label="卫生评分"
          width="100"
        />
        <el-table-column
          prop="serviceScore"
          label="服务评分"
          width="100"
        />
        <el-table-column
          prop="fromName"
          label="昵称"
          width="120"
        />
        <el-table-column
          prop="fromAvatar"
          label="头像"
          width="80"
        >
          <template slot-scope="scope">
            <el-image
              style="width: 60px; height: 60px"
              :src="scope.row.fromAvatar"
              fit="cover"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="praiseCount"
          label="点赞数"
          width="80"
        />
        <el-table-column
          prop="commentCount"
          label="评论数"
          width="80"
        />
        <el-table-column
          label="是否匿名"
          width="100"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.anonymousStatus">是</el-tag>
            <el-tag v-else type="danger">否</el-tag>
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
import { fetchList as fetchShopList } from '@/api/shop'
import { fetchOrderList as fetchList, remove } from '@/api/comment'

const defaultListQuery = {
  keywords: null,
  shopId: null,
  orderId: null,
  starLevel: null,
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
      shops: [],
      starLevel: [
        {
          value: 'GOOD',
          label: '好评'
        }, {
          value: 'MIDDLE',
          label: '中评'
        }, {
          value: 'BAD',
          label: '差评'
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
    },

    handleSizeChange(val) {
      this.listQuery.size = val
      this.listQuery.current = 1
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.current = val
      this.getList()
    }, handleDelete(index, row) {
      remove(row.id).then(response => {
        this.$confirm('是否要删除该评论吗', '提示', {
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
      })
    }
  }
}
</script>

<style>

</style>
