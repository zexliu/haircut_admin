<template>
  <el-card class="form-container" shadow="never">

    <el-form ref="form" :model="form" :rules="rules" label-width="150px">
      <el-form-item label="星期：">
        <el-select v-model="form.weekDay" placeholder="请选择星期">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="时间段：">
        <el-time-picker
          v-model="form.timeRange"
          is-range
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          placeholder="选择时间范围"
          value-format="HH:mm:ss"
          @change="onTimeRangeChanged"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('form')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('form')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { fetchDetail, create, update } from '@/api/half-time'

const defaultForm = {
  weekDay: null,
  timeRange: null,
  startAt: null,
  endAt: null
}
export default {
  name: 'HalfTimeDetail',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      id: null,
      form: Object.assign({}, defaultForm),
      options: [{
        value: 'MONDAY',
        label: '周一'
      }, {
        value: 'TUESDAY',
        label: '周二'
      }, {
        value: 'WEDNESDAY',
        label: '周三'
      }, {
        value: 'THURSDAY',
        label: '周四'
      }, {
        value: 'FRIDAY',
        label: '周五'
      }, {
        value: 'SATURDAY',
        label: '周六'
      }, {
        value: 'SUNDAY',
        label: '周日'
      }],
      rules: {
        weekDay: [
          { required: true, message: '请选择星期', trigger: 'blur' }
        ],
        timeRange: [
          { required: true, message: '请选择时间段', trigger: 'blur' }
        ]
      }

    }
  },

  created() {
    if (this.isEdit) {
      this.id = this.$route.params && this.$route.params.id
      fetchDetail(this.id).then(response => {
        this.form.startAt = response.startAt
        this.form.endAt = response.endAt
        this.form.timeRange = [response.startAt, response.endAt]
        this.form.weekDay = response.weekDay
      })
    }
  },
  methods: {
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.form = Object.assign({}, defaultForm)
      this.form.timeRange = []
    },
    onTimeRangeChanged(val) {
      if (val) {
        this.form.startAt = val[0]
        this.form.endAt = val[1]
      }
    },
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$confirm('是否提交数据', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if (this.isEdit) {
              update(this.id, this.form).then(() => {
                this.$notify({
                  message: '修改成功',
                  type: 'success',
                  duration: 1000
                })
                this.$router.back()
              })
            } else {
              create(this.form).then(() => {
                this.form = Object.assign({}, defaultForm)
                this.$notify({
                  message: '提交成功',
                  type: 'success',
                  duration: 1000
                })
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
    }
  }

}

</script>

<style scoped>

</style>
