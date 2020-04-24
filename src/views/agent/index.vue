<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <el-form :inline="true" :model="listQuery">
        <el-form-item>
          <i class="el-icon-search" />
        </el-form-item>
        <el-form-item label="输入搜索：">
          <el-input v-model="listQuery.keywords" placeholder="名称、手机号码、邮箱" />
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
          <template slot-scope="scope">
            <el-form inline class="demo-table-expand">
              <el-form-item label="备注信息：">
                <span>{{ scope.row.remark }}</span>
              </el-form-item>
              <el-row style="marin-top: 99px;">
                <el-form-item label="身份证正面：">
                  <el-image
                    style="width: 340px; height: 216px"
                    :src="scope.row.identityCardFront"
                    fit="cover"
                    :preview-src-list="[scope.row.identityCardFront,scope.row.identityCardBack]"
                  />
                </el-form-item>
                <el-form-item label="身份证反面：">
                  <el-image
                    style="width: 340px; height: 216px"
                    :src="scope.row.identityCardBack"
                    fit="cover"
                    :preview-src-list="[scope.row.identityCardFront,scope.row.identityCardBack]"
                  />
                </el-form-item>
              </el-row>
            </el-form>
          </template>
        </el-table-column>
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
          prop="linkMobile"
          label="联系电话"
          width="120"
        />
        <el-table-column
          prop="email"
          label="邮箱"
          width="150"
        />
        <el-table-column
          prop="identityCardNo"
          label="身份证号"
          width="150"
        />
        <el-table-column
          label="可用状态"
          width="100"
        >
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.enable"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="onSwitchChange(scope.$index, scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column
          width="100"
          label="省"
        >
          <template slot-scope="scope">
            <slot>
              {{ getRegionName(scope.row.provinceCode) }}
            </slot>
          </template>
        </el-table-column>
        <el-table-column
          width="100"
          label="市"
        >
          <template slot-scope="scope">
            <slot>
              {{ getRegionName(scope.row.cityCode) }}
            </slot>
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
        <!-- <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <router-link :to="'/agent/update/'+scope.row.id">
              <el-button>编辑</el-button>
            </router-link>
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
import { fetchList, updateEnableStatus } from '@/api/agent'
import { fetchList as fetchRegionList } from '@/api/region'

const defaultListQuery = {
  keywords: null,
  enable: null,
  locked: null,
  current: 1,
  size: 10
}
export default {
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      tableData: [],
      total: null,
      regions: []
    }
  },
  created() {
    this.fetchRegion()
    this.getList()
  },
  methods: {
    onSwitchChange(id, row) {
      updateEnableStatus(row.id, { enableStatus: row.enable }).then(response => {
        this.$notify({
          message: '提交成功',
          type: 'success',
          duration: 1000
        })
      }).catch(e => {
        this.getList()
      })
    },
    getList() {
      fetchList(this.listQuery).then(response => {
        console.log(response)
        this.total = response.total
        this.tableData = response.records
      })
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
    // handleAdd() {
    //   this.$router.push({ path: '/rbac/users/add' })
    // },
    onPasswordButtonClick(val) {
      this.currentRow = val
      this.dialogFormVisible = true
    },
    fetchRegion() {
      fetchRegionList().then(response => {
        this.regions = response
      })
    },
    getRegionName(adCode) {
      const region = this.regions.find(item => {
        return item.adCode === adCode
      })
      return region ? region.name : ''
    }

  }
}
</script>

<style>

</style>
