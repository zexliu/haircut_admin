<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <el-form :inline="true" :model="listQuery">
        <el-form-item>
          <i class="el-icon-search" />
        </el-form-item>
        <el-form-item label="输入搜索：">
          <el-input v-model="listQuery.keywords" placeholder="优惠券名称" />
        </el-form-item>
        <el-form-item label="发放状态：">
          <el-select v-model="listQuery.publishStatus" placeholder="请选择">
            <el-option
              v-for="item in publishStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="发放类型：">
          <el-select v-model="listQuery.publishType" placeholder="请选择">
            <el-option
              v-for="item in publishType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="优惠券类型：">
          <el-select v-model="listQuery.couponType" placeholder="请选择">
            <el-option
              v-for="item in couponType"
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
          prop="amount"
          label="金额"
          width="120"
        />
        <el-table-column
          label="发放状态"
          width="100"
        >
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.publishStatus"
              :disabled="scope.row.publishType === 'SHOP_PUSH'"
              @change="onPublishStatusChanged(scope.$index, scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="优惠券类型"
          width="100"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.couponType === 'CASH'">现金券</el-tag>
            <el-tag v-else-if="scope.row.couponType === 'FULL_REDUCTION'" type="success">满减券</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="limitMin"
          label="满X元可用"
          width="120"
        />
        <el-table-column
          label="限制新人"
          width="100"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.memberStatus === 'NONE'">不限制</el-tag>
            <el-tag v-else-if="scope.row.memberStatus === 'NEW'" type="success">限制</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="限制领取"
          width="100"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.memberStatus === 'NONE'">不限制</el-tag>
            <el-tag v-else-if="scope.row.memberStatus === 'ONCE'" type="success">每用户一次</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          width="120"
          label="领券开始时间"
        >
          <template slot-scope="scope">
            {{ scope.row.pullStartAt | timeFormatter }}
          </template>
        </el-table-column>
        <el-table-column
          width="120"
          label="领券结束时间"
        >
          <template slot-scope="scope">
            {{ scope.row.pullEndAt | timeFormatter }}
          </template>
        </el-table-column>

        <el-table-column
          prop="publishCount"
          label="发布数量"
          width="100"
        />

        <el-table-column
          prop="surplusCount"
          label="剩余数量"
          width="100"
        />

        <el-table-column
          label="是否绝对时间"
          width="120"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.absoluteStatus">是</el-tag>
            <el-tag v-else type="warning">否</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          width="120"
          label="绝对开始时间"
        >
          <template slot-scope="scope">
            {{ scope.row.absoluteStartAt | timeFormatter }}
          </template>
        </el-table-column>
        <el-table-column
          width="120"
          label="绝对结束时间"
        >
          <template slot-scope="scope">
            {{ scope.row.absoluteEndAt | timeFormatter }}
          </template>
        </el-table-column>
        <el-table-column
          prop="relativeDay"
          label="相对天数"
          width="100"
        />
        <el-table-column
          prop="description"
          label="描述"
          width="200"
        />

        <el-table-column
          width="120"
          label="创建时间"
        >
          <template slot-scope="scope">
            {{ scope.row.createAt | timeFormatter }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button
              :disabled="scope.row.publishType !== 'SHOP_PUSH'"
              type="success"
              @click="handlePush(scope.$index, scope.row)"
            >发放</el-button>
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

    <el-dialog title="发放优惠券" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="发放用户：" prop="userId">
          <el-select
            v-model="form.userId"
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词"
            :remote-method="remoteMethod"
            :loading="loading"
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.nickname"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit('form')">确 定</el-button>
      </div>

    </el-dialog></div>
</template>

<script>
import { fetchList, updatePublishStatus, pushCoupon } from '@/api/coupon'
import { fetchList as fetchUserList } from '@/api/user'

const defaultListQuery = {
  keywords: null,
  publishType: null,
  publishStatus: null,
  couponType: null,
  current: 1,
  size: 10
}
const defaultForm = {
  userId: null
}
export default {
  data() {
    return {
      form: Object.assign({}, defaultForm),
      listQuery: Object.assign({}, defaultListQuery),
      tableData: [],
      total: null,
      loading: false,
      dialogFormVisible: false,
      options: [],
      publishType: [
        {
          value: null,
          label: '全部'
        },
        {
          value: 'USER_PULL',
          label: '用户领取'
        }, {
          value: 'SHOP_PUSH',
          label: '店铺发放'
        }
      ],
      publishStatus: [
        {
          value: null,
          label: '全部'
        },
        {
          value: true,
          label: '已发放'
        }, {
          value: false,
          label: '未发放'
        }
      ],
      couponType: [
        {
          value: null,
          label: '全部'
        },
        {
          value: 'CASH',
          label: '现金券'
        }, {
          value: 'FULL_REDUCTION',
          label: '满减券'
        }
      ],
      rules: {
        userId: [
          { required: true, message: '请选择发放用户', trigger: 'blur' }
        ]

      },
      currentId: null
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
          this.options = response.records
        })
      } else {
        this.options = []
      }
    },
    handlePush(index, row) {
      this.currentId = row.id
      this.dialogFormVisible = true
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
    },
    onPublishStatusChanged(id, row) {
      updatePublishStatus(row.id, { publishStatus: row.publishStatus }).then(respones => {
        this.$notify({
          message: '提交成功',
          type: 'success',
          duration: 1000
        })
      }).catch(e => {
        this.getList()
      })
    },
    handleAdd() {
      this.$router.push({ path: '/discount/coupon/add' })
    },
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          pushCoupon(this.currentId, { userId: this.form.userId }).then(response => {
            this.$notify({
              message: '发布成功',
              type: 'success',
              duration: 1000
            })
            this.form = Object.assign({}, defaultForm)
            this.dialogFormVisible = false
          })
        } else {
          this.$notify({
            message: '效验失败',
            type: 'error',
            duration: 1000
          })
          return false
        }
      })
    }
  }
}
</script>

<style>

</style>
