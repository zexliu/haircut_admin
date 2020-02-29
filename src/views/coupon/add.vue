<template>
  <el-card class="large-form-container" shadow="never">
    <el-form ref="form" :model="form" :rules="rules" label-width="150px">
      <el-form-item label="优惠券名称：" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="描述：" prop="description">
        <el-input v-model="form.description" />
      </el-form-item>
      <el-form-item label="优惠金额：" prop="amount">
        <el-input-number v-model="form.amount" :min="0.01" :max="99999" :precision="2" :controls="false" />
      </el-form-item>

      <el-row>
        <el-col :span="10">
          <el-form-item label="优惠券类型：" prop="couponType">
            <el-radio v-model="form.couponType" label="CASH">现金券</el-radio>
            <el-radio v-model="form.couponType" label="FULL_REDUCTION">满减券</el-radio>
          </el-form-item>
        </el-col>
        <el-col v-if="form.couponType === 'FULL_REDUCTION'" :span="12">
          <el-form-item prop="limitMin" label="满" label-width="80px">
            <el-input-number v-model="form.limitMin" :min="0.01" :max="99999" :precision="2" :controls="false" />&emsp;<label>元可用</label>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="发放数量：" prop="publishCount">
        <el-input-number v-model="form.publishCount" :min="1" :max="99999" :precision="0" :controls="false" />
      </el-form-item>
      <el-row>
        <el-col :span="10">
          <el-form-item label="使用时间：" prop="absoluteStatus">
            <el-switch
              v-model="form.absoluteStatus"
              active-text="绝对时间"
              inactive-text="相对时间"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item v-if="form.absoluteStatus" label="时间段：" label-width="80px" prop="useTimeRange">
            <el-date-picker
              v-model="form.useTimeRange"
              type="datetimerange"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right"
              value-format="timestamp"
              @change="useTimeChanged"
            />
          </el-form-item>
          <el-form-item v-else label="领取后" prop="relativeDay" label-width="80px">
            <el-input-number v-model="form.relativeDay" :min="1" :max="99999" :precision="0" :controls="false" />
            <label>天内可用</label>

          </el-form-item>

        </el-col>
      </el-row>

      <el-form-item label="发放方式：" prop="publishType">
        <el-radio v-model="form.publishType" label="USER_PULL">用户领取</el-radio>
        <el-radio v-model="form.publishType" label="SHOP_PUSH">店铺发放</el-radio>
      </el-form-item>
      <el-form-item v-if="form.publishType === 'USER_PULL'" label="发放状态：" prop="publishStatus">
        <el-switch
          v-model="form.publishStatus"
          active-text="发放"
          inactive-text="不发放"
        />
      </el-form-item>
      <el-row v-if="form.publishType === 'USER_PULL'">
        <el-col :span="12">
          <el-form-item label="数量限制：" prop="pullLimitStatus">
            <el-radio v-model="form.pullLimitStatus" label="NONE">不限制</el-radio>
            <el-radio v-model="form.pullLimitStatus" label="ONCE">每个用户只能领取一次</el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用户限制：" prop="memberStatus">
            <el-radio v-model="form.memberStatus" label="NONE">不限制</el-radio>
            <el-radio v-model="form.memberStatus" label="NEW">新用户</el-radio>
          </el-form-item>
        </el-col>

      </el-row>
      <el-form-item v-if="form.publishType === 'USER_PULL'" label="领取时间：" prop="pullTimeRange">
        <el-date-picker
          v-model="form.pullTimeRange"
          type="datetimerange"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
          value-format="timestamp"
          @change="pullTimeChanged"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('form')">提交</el-button>
        <el-button @click="resetForm('form')">重置</el-button>
      </el-form-item>
    </el-form>

  </el-card>
</template>

<script>
import { create } from '@/api/coupon'

const defaultForm = {
  name: null,
  description: null,
  amount: 0.01,
  couponType: 'CASH',
  limitMin: 0.01,
  publishType: 'USER_PULL',
  memberStatus: 'NONE',
  pullLimitStatus: 'NONE',
  pullStartAt: null,
  pullEndAt: null,
  publishStatus: true,
  publishCount: 1,
  absoluteStatus: true,
  absoluteStartAt: null,
  absoluteEndAt: null,
  relativeDay: 1,
  useTimeRange: [],
  pullTimeRange: []

}
export default {

  data() {
    return {
      form: Object.assign({}, defaultForm),
      rules: {
        name: [
          { required: true, message: '请输入优惠券名称', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '长度在 2 到 20 个字符',
            trigger: 'blur'
          }
        ],
        amount: [
          { required: true, message: '请输入金额', trigger: 'blur' }
        ],
        publishStatus: [
          { required: true, message: '请选择发放状态', trigger: 'blur' }
        ],
        couponType: [
          { required: true, message: '请选择优惠券类型', trigger: 'blur' }
        ],
        limitMin: [
          { required: true, message: '请输入金额', trigger: 'blur' }
        ],
        publishCount: [
          { required: true, message: '请输入金额', trigger: 'blur' }
        ],
        absoluteStatus: [
          { required: true, message: '请选择使用时间', trigger: 'blur' }
        ],
        relativeDay: [
          { required: true, message: '请输入相对时间', trigger: 'blur' }
        ],
        useTimeRange: [
          { required: true, message: '请选择绝对时间', trigger: 'blur' }
        ],
        publishType: [
          { required: true, message: '请选择发布方式', trigger: 'blur' }
        ],
        pullLimitStatus: [
          { required: true, message: '请选择数量限制', trigger: 'blur' }
        ],
        memberStatus: [
          { required: true, message: '请选择用户限制', trigger: 'blur' }
        ],
        pullTimeRange: [
          { required: true, message: '请选择领取时间段', trigger: 'blur' }
        ]

      },
      pullTimeRange: null,
      useTimeRange: null,
      pickerOptions: {
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
  methods: {
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$confirm('是否提交数据', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if (this.form.couponType === 'CASH') {
              this.form.limitMin = null
            }
            if (this.form.absoluteStatus) {
              this.form.relativeDay = null
            } else {
              this.form.absoluteStartAt = null
              this.form.absoluteEndAt = null
            }
            if (this.form.publishType === 'SHOP_PUSH') {
              this.form.publishStatus = null
              this.form.pullLimitStatus = null
              this.form.memberStatus = null
              this.form.absoluteStartAt = null
              this.form.absoluteEndAt = null
            }
            create(this.form).then(() => {
              this.$refs[formName].resetFields()
              this.form = Object.assign({}, defaultForm)
              this.$notify({
                message: '提交成功',
                type: 'success',
                duration: 1000
              })
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
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.form = Object.assign({}, defaultForm)
    },
    pullTimeChanged(val) {
      console.log('val', val)
      if (val && val.length === 2) {
        this.form.pullStartAt = val[0]
        this.form.pullEndAt = val[1]
      } else {
        this.form.pullStartAt = null
        this.form.pullEndAt = null
      }
    }, useTimeChanged(val) {
      if (val && val.length === 2) {
        this.form.absoluteStartAt = val[0]
        this.form.absoluteEndAt = val[1]
      } else {
        this.form.absoluteStartAt = null
        this.form.absoluteEndAt = null
      }
    }
  }
}
</script>

<style>

</style>
