<template>
  <div class="app-container">
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
          prop="brandName"
          label="银行名称"
          width="120"
        />
        <el-table-column
          width="200"
          prop="brandNo"
          label="银行卡号"
        />
        <el-table-column
          width="120"
          prop="brandUsername"
          label="开户人姓名"
        />
        <el-table-column
          width="100"
          prop="brandOpening"
          label="开户行"
        />
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <router-link :to="'/bank/update/'+scope.row.id">
              <el-button>编辑</el-button>
            </router-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- <div class="pagination-container">
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
    </div> -->
  </div>
</template>

<script>
import { fetchList } from '@/api/bank'
const defaultListQuery = {
  current: 1,
  size: 10
}
export default {
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      tableData: [],
      total: null
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      fetchList(this.listQuery).then(response => {
        this.tableData = response
      })
    },
    handleSearch() {
      this.listQuery.current = 1
      this.getList()
    },
    handleResetSearch() {
      this.listQuery = Object.assign({}, defaultListQuery)
    },
    // handleSizeChange(val) {
    //   this.listQuery.size = val
    //   this.listQuery.current = 1
    //   this.getList()
    // },
    // handleCurrentChange(val) {
    //   this.listQuery.current = val
    //   this.getList()
    // },
    handleAdd() {
      this.$router.push({ path: '/bank/add' })
    }
  }
}
</script>

<style>

</style>
