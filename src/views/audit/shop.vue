<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <el-form :inline="true" :model="listQuery">
        <el-form-item>
          <i class="el-icon-search" />
        </el-form-item>
        <el-form-item label="输入搜索：">
          <el-input v-model="listQuery.keywords" placeholder="店铺名称" />
        </el-form-item>
        <el-form-item label="审核状态：">
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
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-form inline class="demo-table-expand">
              <el-form-item label="详细地址：">
                <span>{{ scope.row.address }}</span>
              </el-form-item>
              <el-form-item label="社会信用代码：">
                <span>{{ scope.row.socialCreditCode }}</span>
              </el-form-item>
              <el-form-item label="营业执照：">
                <el-image
                  style="width: 340px; height: 480px"
                  :src="scope.row.businessLicense"
                  fit="cover"
                  :preview-src-list="[scope.row.businessLicense,scope.row.photo,scope.row.identityCardFront,scope.row.identityCardBack]"
                />
              </el-form-item>
              <el-form-item label="门店照片：">
                <el-image
                  style="width: 340px; height: 480px"
                  :src="scope.row.photo"
                  fit="cover"
                  :preview-src-list="[scope.row.businessLicense,scope.row.photo,scope.row.identityCardFront,scope.row.identityCardBack]"
                />
              </el-form-item>

              <el-form-item label="身份证正面：">
                <el-image
                  style="width: 340px; height: 216px"
                  :src="scope.row.identityCardFront"
                  fit="cover"
                  :preview-src-list="[scope.row.businessLicense,scope.row.photo,scope.row.identityCardFront,scope.row.identityCardBack]"
                />
              </el-form-item>
              <el-form-item label="身份证反面：">
                <el-image
                  style="width: 340px; height: 216px"
                  :src="scope.row.identityCardBack"
                  fit="cover"
                  :preview-src-list="[scope.row.businessLicense,scope.row.photo,scope.row.identityCardFront,scope.row.identityCardBack]"
                />
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
          prop="name"
          label="名称"
          width="120"
        />

        <el-table-column
          prop="leaderName"
          label="负责人姓名"
          width="100"
        />
        <el-table-column
          prop="leaderMobile"
          label="联系电话"
          width="120"
        />
        <el-table-column
          label="审核状态"
          width="100"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.auditStatus === 'PENDING'">待审核</el-tag>
            <el-tag v-else-if="scope.row.auditStatus === 'PASSED'" type="success">已通过</el-tag>
            <el-tag v-else type="warning">已驳回</el-tag>
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
          width="100"
          label="区"
        >
          <template slot-scope="scope">
            <slot>
              {{ getRegionName(scope.row.districtCode) }}
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
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button
              :disabled="scope.row.auditStatus !== 'PENDING'"
              type="success"
              @click="handlePass(scope.$index, scope.row)"
            >通过</el-button>
            <el-button
              :disabled="scope.row.auditStatus !== 'PENDING'"
              type="warning"
              @click="handleReject(scope.$index, scope.row)"
            >驳回</el-button>
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
import { fetchApplys as fetchList } from '@/api/shop'
import { fetchList as fetchRegionList } from '@/api/region'
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
          label: '待审核'
        }, {
          value: 'PASSED',
          label: '已通过'
        },
        {
          value: 'REJECTED',
          label: '已驳回'
        }
      ]
    }
  },
  created() {
    this.fetchRegion()
    this.getList()
  },
  methods: {
    handlePass(index, row) {
      this.$confirm('确定通过该条记录的审核吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        audit({ targetType: 'SHOP', targetId: row.id, auditStatus: 'PASSED' }).then(response => {
          this.$notify({
            type: 'success',
            message: '审核成功'
          })
          this.getList()
        })
      }).catch(() => {
        this.$notify({
          type: 'info',
          message: '取消审核通过'
        })
      })
    },
    handleReject(index, row) {
      this.$prompt('请输入审核意见', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        audit({ targetType: 'SHOP', targetId: row.id, auditStatus: 'REJECTED', message: value }).then(response => {
          this.$notify({
            type: 'success',
            message: '审核成功'
          })
          this.getList()
        })
      }).catch(() => {
        this.$notify({
          type: 'info',
          message: '取消审核驳回'
        })
      })
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
