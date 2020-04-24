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
          prop="name"
          label="名称"
          width="120"
        />
        <el-table-column
          prop="icon"
          label="图标"
          width="80"
        >
          <template slot-scope="scope">
            <el-image
              style="width: 60px; height: 60px"
              :src="scope.row.icon"
              fit="cover"
            />
          </template>
        </el-table-column>

        <el-table-column
          prop="seq"
          label="排序"
          width="80"
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
          prop="description"
          label="描述"
        />
        <el-table-column label="操作" width="200" fixed="right" align="center">
          <template slot-scope="scope">
            <router-link :to="'/setting/shop/title/update/safe/'+scope.row.id">
              <el-button>编辑</el-button>
            </router-link>
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
import { fetchList } from '@/api/shop-title'

const defaultListQuery = {
  current: 1,
  size: 10,
  type: 'SAFETY'
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
    async getList() {
      const data = await fetchList(this.listQuery)
      this.total = data.total
      this.tableData = data.records
    },
    handleAdd() {
      this.$router.push({ path: '/setting/shop/title/add/safe' })
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
