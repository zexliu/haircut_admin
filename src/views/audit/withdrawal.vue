<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <el-form :inline="true" :model="listQuery">
        <el-form-item>
          <i class="el-icon-search" />
        </el-form-item>
        <el-form-item label="处理状态：">
          <el-select v-model="listQuery.auditStatus" placeholder="请选择">
            <el-option
              v-for="item in auditStatus"
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
          label="用户类型"
          width="100"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.targetType === 'SHOP'">店铺</el-tag>
            <el-tag v-else-if="scope.row.targetType === 'AGENT'" type="success">代理商</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="amount"
          label="提现金额"
          width="100"
        />
        <el-table-column
          prop="brandName"
          label="银行名称"
          width="120"
        />
        <el-table-column
          prop="brandNo"
          label="银行卡号"
          width="180"
        />
        <el-table-column
          prop="brandUsername"
          label="开户人姓名"
          width="140"
        />
        <el-table-column
          prop="brandOpening"
          label="开户银行"
          width="140"
        />

        <el-table-column
          label="审核状态"
          width="100"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.auditStatus === 'PENDING'">待处理</el-tag>
            <el-tag v-else-if="scope.row.auditStatus === 'PASSED'" type="success">已打款</el-tag>
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
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button
              :disabled="scope.row.auditStatus !== 'PENDING'"
              type="success"
              @click="handlePass(scope.$index, scope.row)"
            >确认打款</el-button>
            <!-- <el-button
              :disabled="scope.row.auditStatus !== 'PENDING'"
              type="warning"
              @click="handleReject(scope.$index, scope.row)"
            >驳回</el-button> -->
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
import { fetchList } from '@/api/withdrawal'
// import { fetchList as fetchRegionList } from '@/api/region'
import { audit } from '@/api/audit'

const defaultListQuery = {
  keywords: null,
  auditStatus: 'PENDING',
  current: 1,
  size: 10
}
export default {
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      tableData: [],
      total: null,
      options: [],
      modules: [],
      regionTree: [],
      regions: [],
      currentImage: null,
      imageDialogShow: false,
      auditStatus: [
        {
          value: null,
          label: '全部'
        },
        {
          value: 'PENDING',
          label: '待处理'
        }, {
          value: 'PASSED',
          label: '已打款'
        }
      ]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handlePass(index, row) {
      this.$confirm('确定已经打款吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        audit({ targetType: 'WITHDRAWAL', targetId: row.id, auditStatus: 'PASSED' }).then(response => {
          this.$notify({
            type: 'success',
            message: '提交成功'
          })
          this.getList()
        })
      }).catch(() => {
        this.$notify({
          type: 'info',
          message: '取消确认打款'
        })
      })
    },
    // handleReject(index, row) {
    //   this.$prompt('请输入审核意见', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消'
    //   }).then(({ value }) => {
    //     audit({ targetType: 'AGENT', targetId: row.id, auditStatus: 'REJECTED', message: value }).then(response => {
    //       this.$notify({
    //         type: 'success',
    //         message: '审核成功'
    //       })
    //       this.getList()
    //     })
    //   }).catch(() => {
    //     this.$notify({
    //       type: 'info',
    //       message: '取消审核驳回'
    //     })
    //   })
    // },

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
.demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 120px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
