<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <el-form :inline="true" :model="listQuery">
        <el-form-item>
          <i class="el-icon-search" />
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
        <el-form-item label="悬赏状态：">
          <el-select v-model="listQuery.rewardStatus" placeholder="请选择">
            <el-option
              v-for="item in rewardStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="发布状态：">
          <el-select v-model="listQuery.publishStatus" placeholder="请选择">
            <el-option
              v-for="item in publishStatus"
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

        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-form inline class="demo-table-expand">
              <el-row>
                <el-col :span="8">
                  <el-form-item label="性别：">
                    <el-tag v-if="scope.row.genderType === 'UN_KNOW'">未知</el-tag>
                    <el-tag v-else-if="scope.row.genderType === 'MALE'" type="success">男士</el-tag>
                    <el-tag v-else-if="scope.row.genderType === 'FEMALE'" type="info">女士</el-tag>
                  </el-form-item>

                </el-col>
                <el-col :span="8">
                  <el-form-item label="身高：">
                    {{ scope.row.height }}
                  </el-form-item>

                </el-col>

                <el-col :span="8">
                  <el-form-item label="体重：">
                    {{ scope.row.weight }}
                  </el-form-item>
                </el-col>

              </el-row>

              <el-row>
                <el-col :span="8">

                  <el-form-item label="职业：">
                    {{ scope.row.job }}
                  </el-form-item>
                </el-col>
                <el-col :span="8">

                  <el-form-item label="发量：">
                    {{ scope.row.hairVolume }}
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item label="年龄：">
                    {{ scope.row.age }}
                  </el-form-item>
                </el-col>

              </el-row>
              <el-row>
                <el-form-item label="内容：">
                  <span>{{ scope.row.content }}</span>
                </el-form-item>
              </el-row>

              <el-row>
                <el-form-item v-if="scope.row.images" label="图片：">
                  <el-image
                    v-for="(item,index) in scope.row.images.split(',')"
                    :key="index"
                    style="width: 90px; height: 90px"
                    :src="item"
                    fit="cover"
                    :preview-src-list="scope.row.images.split(',')"
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
          prop="orderId"
          label="订单ID"
          width="180"
        />
        <el-table-column
          prop="userId"
          label="用户ID"
          width="180"
        />
        <el-table-column
          prop="nickname"
          label="用户昵称"
          width="100"
        />
        <el-table-column
          prop="rewardAmount"
          label="悬赏金额（元）"
          width="120"
        />

        <el-table-column
          label="悬赏状态"
          width="100"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.rewardStatus === 'PENDING_REWARD'">待悬赏</el-tag>
            <el-tag v-else-if="scope.row.rewardStatus === 'REWARDED'" type="success">已悬赏</el-tag>
            <!-- <el-tag v-else type="danger">否</el-tag> -->
          </template>
        </el-table-column>

        <el-table-column
          label="发布状态"
          width="100"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.publishStatus === 'PENDING_PAY'">待支付</el-tag>
            <el-tag v-else-if="scope.row.publishStatus === 'PUBLISHED'" type="success">已发布</el-tag>
            <el-tag v-else-if="scope.row.publishStatus === 'CANCEL'" type="info">已取消</el-tag>
            <!-- <el-tag v-else type="danger">否</el-tag> -->
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
import { fetchList as fetchUserList } from '@/api/user'
import { fetchList, remove } from '@/api/reward'

const defaultListQuery = {
  keywords: null,
  shopId: null,
  stylistId: null,
  userId: null,
  serviceId: null,
  status: null,
  genderType: null,
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
      publishStatus: [
        {
          value: 'PENDING_PAY',
          label: '待支付'
        }, {
          value: 'PUBLISHED',
          label: '已发布'
        }, {
          value: 'CANCEL',
          label: '已取消'
        }
      ],
      rewardStatus: [
        {
          value: 'PENDING_REWARD',
          label: '待悬赏'
        }, {
          value: 'REWARDED',
          label: '已悬赏'
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
    },
    handleDelete(index, row) {
      this.$confirm('是否要删除该动态?', '提示', {
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
    }
  }
}
</script>

<style>

</style>
