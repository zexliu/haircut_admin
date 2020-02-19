<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <el-form :inline="true" :model="listQuery">
        <el-form-item>
          <i class="el-icon-search" />
        </el-form-item>
        <el-form-item label="输入搜索：">
          <el-input v-model="listQuery.keywords" placeholder="名称、手机号" />
        </el-form-item>
        <el-form-item label="所在地区：">
          <el-cascader v-model="selectedRegion" :options="regionTree" :props="{checkStrictly: true ,value:'adCode' , label:'name'}" />
        </el-form-item>
        <el-form-item label="工作状态：">
          <el-select v-model="listQuery.workStatus" placeholder="请选择">
            <el-option
              v-for="item in workStatus"
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
          prop="logo"
          label="LOGO"
          width="80"
        >
          <template slot-scope="scope">
            <el-image
              style="width: 60px; height: 60px"
              :src="scope.row.logo"
              fit="cover"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="leaderName"
          label="负责人姓名"
          width="100"
        />
        <el-table-column
          prop="leaderMobile"
          label="联系电话"
          width="100"
        />
        <el-table-column
          label="可用状态"
          width="100"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.enable">可用</el-tag>
            <el-tag v-else type="danger">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="工作状态"
          width="100"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.workStatus === 'WORK'">营业</el-tag>
            <el-tag v-else type="info">停业</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="score"
          label="评分"
          width="80"
        />
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
          prop="address"
          label="地址"
        />

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
            <router-link :to="'/shop/update/'+scope.row.id">
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
import { fetchList } from '@/api/shop'
import { fetchTree as fetchRegionTree, fetchList as fetchRegionList } from '@/api/region'

const defaultListQuery = {
  keywords: null,
  workStatus: null,
  provinceCode: null,
  cityCode: null,
  districtCode: null,
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
      selectedRegion: [],
      workStatus: [
        {
          value: 'WORK',
          label: '营业'
        }, {
          value: 'REST',
          label: '停业'
        }
      ]

    }
  },
  created() {
    this.fetchRegion()
    this.getList()
  },
  methods: {
    fetchRegion() {
      fetchRegionTree({ level: 2 }).then(response => {
        this.regionTree = response
      })
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
      if (this.selectedRegion) {
        if (this.selectedRegion[0]) {
          this.listQuery.provinceCode = this.selectedRegion[0]
        }
        if (this.selectedRegion[1]) {
          this.listQuery.cityCode = this.selectedRegion[1]
        }
      }
      this.listQuery.current = 1
      this.getList()
    },
    handleResetSearch() {
      this.listQuery = Object.assign({}, defaultListQuery)
    },
    handleAdd() {
      this.$router.push({ path: '/shop/add' })
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
