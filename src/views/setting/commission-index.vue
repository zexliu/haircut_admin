<template>
  <div class="app-container">

    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" />
      <span>基础信息</span>
      <el-button type="primary" class="btn-add" @click="handleUpdateBasic()">修改</el-button>
      <el-form label-width="240px" style="margin-top: 20px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户拉新首次消费现金奖励(元):">
              {{ basic.userFirstAmount }}
            </el-form-item>
            <el-form-item label="用户拉新消费提成比例:">
              {{ basic.userCommissionProportion }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="店铺佣金比例:">
              {{ basic.shopCommissionProportion }}
            </el-form-item>
            <el-form-item label="新店免佣时长(月):">
              {{ basic.shopFreeMonth }}
            </el-form-item>
          </el-col>

        </el-row>
      </el-form>

    </el-card>

    <div class="table-container">
      <el-card class="operate-container" shadow="never">
        <i class="el-icon-tickets" />
        <span>店铺抽成折扣</span>
        <el-button type="primary" class="btn-add" @click="handleDiscountAdd()">新增</el-button>
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
          prop="count"
          label="拉新人数"
          width="120"
        />

        <el-table-column
          prop="discount"
          label="折扣"
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

        <el-table-column label="操作" width="200" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button type="primary" class="btn-add" @click="handleDiscountUpdate(scope.$index, scope.row)">编辑</el-button>
            <el-button type="danger" class="btn-add" @click="handleDiscountDelete(scope.$index, scope.row)">删除</el-button>
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
    <el-dialog title="基础信息" :visible.sync="basicDialogVisible">
      <el-form ref="basicForm" :model="basicForm" label-width="200px" :rules="basicRules">
        <el-form-item label="用户首次拉新奖励(元)：" prop="userFirstAmount">
          <el-input-number v-model="basicForm.userFirstAmount" :controls="false" :precision="2" :min="0" :max="9999.99" />
        </el-form-item>
        <el-form-item label="用户拉新消费提成比例：" prop="userCommissionProportion">
          <el-input-number v-model="basicForm.userCommissionProportion" :controls="false" :precision="2" :min="0" :max="1" />
        </el-form-item>
        <el-form-item label="店铺佣金比例：" prop="shopCommissionProportion">
          <el-input-number v-model="basicForm.shopCommissionProportion" :controls="false" :precision="2" :min="0" :max="1" />

        </el-form-item>
        <el-form-item label="新店免佣时长(月)：" prop="shopFreeMonth">
          <el-input-number v-model="basicForm.shopFreeMonth" :controls="false" :precision="0" :min="0" :max="9999" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSubmitBasic('basicForm')">提交</el-button>
        <el-button @click="basicDialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="基础信息" :visible.sync="discountDialogVisible">
      <el-form ref="discountForm" :model="discountForm" label-width="200px" :rules="discountRules">

        <el-form-item label="折扣：" prop="discount">
          <el-input-number v-model="discountForm.discount" :controls="false" :precision="2" :min="0.01" :max="1" />
        </el-form-item>
        <el-form-item label="拉新人数：" prop="count">
          <el-input-number v-model="discountForm.count" :controls="false" :precision="0" :min="1" :max="9999" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSubmitDiscount('discountForm')">提交</el-button>
        <el-button @click="discountDialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { fetchDiscountsList as fetchList, fetchCurrentBasic, saveCurrentBasic, saveDiscount, updateDiscount, deleteDiscount as remove } from '@/api/commission'

const defaultListQuery = {
  current: 1,
  size: 10
}
const defaultDiscountForm = {
  count: 1,
  discount: 0.01
}
export default {
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      tableData: [],
      total: null,
      basic: {},
      basicForm: {},
      discountForm: Object.assign({}, defaultDiscountForm),
      currentDiscountId: null,
      basicDialogVisible: false,
      discountDialogVisible: false,
      isEdit: false,
      basicRules: {
        userFirstAmount: [
          { required: true, message: '请输入首次拉新奖励', trigger: 'blur' }
        ],
        userCommissionProportion: [
          { required: true, message: '请输入消费提成比例', trigger: 'blur' }
        ],
        shopCommissionProportion: [
          { required: true, message: '请输入店铺佣金比例', trigger: 'blur' }
        ],
        shopFreeMonth: [
          { required: true, message: '请输入新店免佣时长', trigger: 'blur' }
        ]
      },
      discountRules: {
        discount: [
          { required: true, message: '请输入折扣', trigger: 'blur' }
        ],
        count: [
          { required: true, message: '请输入拉新人数', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getCurrent()
    this.getList()
  },
  methods: {
    getCurrent() {
      fetchCurrentBasic().then(response => {
        this.basic = response
      })
    },
    async getList() {
      const data = await fetchList(this.listQuery)
      this.total = data.total
      this.tableData = data.records
    },
    handleDiscountAdd() {
      this.isEdit = false
      this.discountDialogVisible = true
      this.discountForm = Object.assign({}, defaultDiscountForm)
    },
    handleUpdateBasic() {
      this.basicForm.shopCommissionProportion = this.basic.shopCommissionProportion
      this.basicForm.userCommissionProportion = this.basic.userCommissionProportion
      this.basicForm.userFirstAmount = this.basic.userFirstAmount
      this.basicForm.shopFreeMonth = this.basic.shopFreeMonth
      this.basicDialogVisible = true
    },
    handleDiscountUpdate(index, row) {
      this.isEdit = true
      this.currentDiscountId = row.id
      this.discountForm.count = row.count
      this.discountForm.discount = row.discount
      this.discountDialogVisible = true
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
    onSubmitDiscount(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$confirm('是否提交数据', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            console.log(this.discountForm)
            if (this.isEdit) {
              updateDiscount(this.currentDiscountId, this.discountForm).then(() => {
                this.$notify({
                  message: '修改成功',
                  type: 'success',
                  duration: 1000
                })
                this.getList()
                this.discountDialogVisible = false
              })
            } else {
              saveDiscount(this.discountForm).then(() => {
                this.$notify({
                  message: '新增成功',
                  type: 'success',
                  duration: 1000
                })
                this.getList()
                this.discountDialogVisible = false
              })
            }
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
    },
    onSubmitBasic(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$confirm('是否提交数据', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            saveCurrentBasic(this.basicForm).then(() => {
              this.$notify({
                message: '修改成功',
                type: 'success',
                duration: 1000
              })
              this.getCurrent()
              this.basicDialogVisible = false
            })
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
    },
    handleDiscountDelete(index, row) {
      this.$confirm('是否删除数据', '提示', {
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
