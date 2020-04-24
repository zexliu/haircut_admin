<template>
  <div class="dashboard-editor-container">
    <el-row>
      <el-date-picker
        v-model="dateRange"
        type="daterange"
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        align="right"
        value-format="yyyy-MM-dd"
        @change="dateChanged"
      />
      <el-button style=" float: right;" @click="onWithdrawalClick">申请提现</el-button>
    </el-row>

    <!-- <github-corner class="github-corner" /> -->
    <panel-group
      :balance="numbers.balance"
      :orders="numbers.orders"
      :transactions="numbers.transactions"
      :shops="numbers.shops"
      @handleSetLineChartOptions="handleSetLineChartOptions"
    />

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-options="lineChartOptions" />
    </el-row>

    <el-row :gutter="32">
      <!-- <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <raddar-chart />
        </div>
      </el-col> -->
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <pie-chart :chart-options="pieChartOptions" />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <bar-chart :chart-options="barChartOptions" />
        </div>
      </el-col>
    </el-row>

    <!-- <el-row :gutter="8">
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:30px;">
        <transaction-table />
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">
        <todo-list />
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">
        <box-card />
      </el-col>
    </el-row> -->
    <el-dialog title="提现申请" :visible.sync="dialogShow">
      <el-form ref="form" :model="form" label-width="120" :rules="rules">
        <el-form-item label="提现金额" prop="amount">
          <el-input-number v-model="form.amount" :controls="false" :precision="2" :min="1" :max="9999.99" />
        </el-form-item>
        <el-form-item label="银行卡" prop="bankId">
          <el-select v-model="form.bankId" placeholder="请选择提现银行卡">
            <el-option
              v-for="item in banks"
              :key="item.id"
              :label="item.brandNo"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogShow = false">取 消</el-button>
        <el-button type="primary" :loading="buttonLoading" @click="onWithdrawalSubmit('form')">确 定</el-button>
      </div>
    </el-dialog>

  </div>

</template>

<script>
// import GithubCorner from '@/components/GithubCorner'
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
// import RaddarChart from './components/RaddarChart'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'
// import TransactionTable from './components/TransactionTable'
// import TodoList from './components/TodoList'
// import BoxCard from './components/BoxCard'
import { fetchAgentNumbers as fetchNumbers, brokenLinesAgent as brokenLines, pieAgent as pie, barAgent as bar } from '@/api/statistics'
import { dateFormat } from '@/utils/date'
import { fetchList as fetchBankList } from '@/api/bank'
import { withdrawal } from '@/api/agent-transaction'
// const lineChartData = {
//   users: {
//     expectedData: [100, 120, 161, 134, 105, 160, 165],
//     actualData: [120, 82, 91, 154, 162, 140, 145],
//     date: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

//   },
//   transactions: {
//     expectedData: [200, 192, 120, 144, 160, 130, 140],
//     actualData: [180, 160, 151, 106, 145, 150, 130],
//     date: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

//   },
//   orders: {
//     expectedData: [80, 100, 121, 104, 105, 90, 100],
//     actualData: [120, 90, 100, 138, 142, 130, 130],
//     date: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

//   },
//   shops: {
//     expectedData: [130, 140, 141, 142, 145, 150, 160],
//     actualData: [120, 82, 91, 154, 162, 140, 130],
//     date: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

//   }
// }
const animationDuration = 6000

const defaultForm = {
  bankId: null,
  amount: null,
  brandName: null,
  brandNo: null,
  brandUsername: null,
  brandOpening: null

}

export default {
  name: 'DashboardAgent',
  components: {
    // GithubCorner,
    PanelGroup,
    LineChart,
    // RaddarChart,
    PieChart,
    BarChart
    // TransactionTable,
    // TodoList,
    // BoxCard
  },
  data() {
    var validateAmount = (rule, value, callback) => {
      if (value > this.numbers.balance) {
        callback(new Error('提现金额不得小于账户余额'))
      } else {
        callback()
      }
    }
    return {
      form: Object.assign({}, defaultForm),
      dialogShow: false,
      buttonLoading: false,
      banks: [],

      rules: {
        bankId: [
          { required: true, message: '请选择银行卡', trigger: 'blur' }
        ],
        amount: [
          { required: true, message: '请输入提现金额', trigger: 'blur' },
          { validator: validateAmount, trigger: 'blur' }
        ]
      },
      lineChartOptions: {},
      pieChartOptions: {},
      barChartOptions: {},
      startAt: null,
      endAt: null,
      dateRange: null,
      numbers: {
        balance: 0,
        orders: 0,
        transactions: 0,
        shops: 0
      },
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
  created() {
    this.getBankList()
    this.getNumbers()
    this.getBrokenLines('shops')
    this.getPie()
    this.getBar()
  },
  methods: {
    onWithdrawalSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.buttonLoading = true

          const temp = this.banks.find(item => {
            return item.id === this.form.bankId
          })
          this.form.brandName = temp.brandName
          this.form.brandNo = temp.brandNo
          this.form.brandUsername = temp.brandUsername
          this.form.brandOpening = temp.brandOpening
          withdrawal(this.form).then(response => {
            this.buttonLoading = false
            this.$notify({
              message: '申请成功 请等待管理员打款',
              type: 'success',
              duration: 1000
            })
            this.form = Object.assign({}, defaultForm)
            this.dialogShow = false
            this.getNumbers()
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
    getBankList() {
      fetchBankList().then(response => {
        this.banks = response
      })
    },
    onWithdrawalClick() {
      this.dialogShow = true
    },
    handleSetLineChartOptions(type) {
      this.getBrokenLines(type)
    },
    dateChanged(val) {
      if (val && val.length === 2) {
        this.startAt = val[0]
        this.endAt = val[1]
      } else {
        this.startAt = null
        this.endAt = null
      }
      this.getNumbers()
    },
    getNumbers() {
      fetchNumbers({ startAt: this.startAt, endAt: this.endAt }).then(response => {
        this.numbers = response
      })
    },
    getBrokenLines(type) {
      const end = new Date()
      // 7天前
      const start = new Date(end.getTime() - 3600 * 1000 * 24 * 6)
      const dates = []
      const legend = []
      const series = []
      const shops = []
      const transactions = []
      const services = []
      const groupons = []

      brokenLines({ type: type, startAt: dateFormat('YYYY-mm-dd', start), endAt: dateFormat('YYYY-mm-dd', end) }).then(response => {
        for (let i = 0; i < 7; i++) {
          const formatDate = dateFormat('YYYY-mm-dd', new Date(start.getTime() + 3600 * 1000 * 24 * i))
          dates.push(formatDate)
          if (type === 'shops') {
            const temp = response.shops.find(item => {
              return item.date === formatDate
            })
            shops.push(temp ? temp.amount : 0)
          } else if (type === 'transactions') {
            const temp = response.transactions.find(item => {
              return item.date === formatDate
            })
            transactions.push(temp ? temp.amount : 0)
          } else if (type === 'orders') {
            let temp = response.services.find(item => {
              return item.date === formatDate
            })
            services.push(temp ? temp.amount : 0)

            temp = response.groupons.find(item => {
              return item.date === formatDate
            })
            groupons.push(temp ? temp.amount : 0)
          }
        }
        if (type === 'shops') {
          legend.push('入驻店铺')
          series.push({
            name: '入驻店铺', itemStyle: {
              normal: {
                color: '#FF005A',
                lineStyle: {
                  color: '#FF005A',
                  width: 2
                }
              }
            },
            smooth: true,
            type: 'line',
            data: shops,
            animationDuration: 2800,
            animationEasing: 'cubicInOut'
          })
        } else if (type === 'transactions') {
          legend.push('代理收益')
          series.push({
            name: '代理收益', itemStyle: {
              normal: {
                color: '#FF005A',
                lineStyle: {
                  color: '#FF005A',
                  width: 2
                }
              }
            },
            smooth: true,
            type: 'line',
            data: transactions,
            animationDuration: 2800,
            animationEasing: 'cubicInOut'
          })
        } else if (type === 'orders') {
          legend.push('服务订单')
          series.push({
            name: '服务订单', itemStyle: {
              normal: {
                color: '#FF005A',
                lineStyle: {
                  color: '#FF005A',
                  width: 2
                }
              }
            },
            smooth: true,
            type: 'line',
            data: services,
            animationDuration: 2800,
            animationEasing: 'cubicInOut'
          })
          legend.push('团购订单')
          series.push({
            name: '团购订单', itemStyle: {
              normal: {
                color: '#3888fa',
                lineStyle: {
                  color: '#3888fa',
                  width: 2
                }
              }
            },
            smooth: true,
            type: 'line',
            data: groupons,
            animationDuration: 2800,
            animationEasing: 'quadraticOut'
          })
        }

        this.lineChartOptions = {
          xAxis: {
            data: dates,
            boundaryGap: false,
            axisTick: {
              show: false
            }
          },
          grid: {
            left: 10,
            right: 10,
            bottom: 20,
            top: 30,
            containLabel: true
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross'
            },
            padding: [5, 10]
          },
          yAxis: {
            axisTick: {
              show: false
            }
          },
          legend: {
            data: legend
          },
          series: series
        // series: [{
        //   name: 'expected', itemStyle: {
        //     normal: {
        //       color: '#FF005A',
        //       lineStyle: {
        //         color: '#FF005A',
        //         width: 2
        //       }
        //     }
        //   },
        //   smooth: true,
        //   type: 'line',
        //   data: expectedData,
        //   animationDuration: 2800,
        //   animationEasing: 'cubicInOut'
        // },
        // {
        //   name: 'actual',
        //   smooth: true,
        //   type: 'line',
        //   itemStyle: {
        //     normal: {
        //       color: '#3888fa',
        //       lineStyle: {
        //         color: '#3888fa',
        //         width: 2
        //       },
        //       areaStyle: {
        //         color: '#f3f8ff'
        //       }
        //     }
        //   },
        //   data: actualData,
        //   animationDuration: 2800,
        //   animationEasing: 'quadraticOut'
        // }]
        }
        // this.lineChartData = {
        //   type: type,
        //   dates: dates,
        //   registers: registers
        // }
      })
    }, getPie() {
      const end = new Date()
      // 7天前
      const start = new Date(end.getTime() - 3600 * 1000 * 24 * 6)
      pie({ startAt: dateFormat('YYYY-mm-dd', start), endAt: dateFormat('YYYY-mm-dd', end) }).then(response => {
        const data = response
        const names = []
        for (let i = 0; i < data.length; i++) {
          const element = data[i]
          names.push(element.name)
        }
        this.pieChartOptions = {
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            left: 'center',
            bottom: '10',
            data: names
          },
          series: [
            {
              name: '周订单分类统计',
              type: 'pie',
              roseType: 'radius',
              radius: [15, 95],
              center: ['50%', '38%'],
              data: data,
              animationEasing: 'cubicInOut',
              animationDuration: 2600
            }
          ]
        }
      })
    }, getBar() {
      const end = new Date()
      // 7天前
      const start = new Date(end.getTime() - 3600 * 1000 * 24 * 6)
      bar({ startAt: dateFormat('YYYY-mm-dd', start), endAt: dateFormat('YYYY-mm-dd', end) }).then(response => {
        const names = []
        const dates = []
        const series = []
        for (let i = 0; i < 7; i++) {
          const formatDate = dateFormat('YYYY-mm-dd', new Date(start.getTime() + 3600 * 1000 * 24 * i))
          dates.push(formatDate)
        }
        for (let i = 0; i < response.length; i++) {
          const element = response[i]
          const datas = []
          names.push(element.name)
          for (let j = 0; j < dates.length; j++) {
            const date = dates[j]
            const value = element.values.find(item => {
              return item.date === date
            })
            datas.push(value ? value.amount : 0)
          }
          series.push({
            name: element.name,
            type: 'bar',
            stack: 'vistors',
            barWidth: '30%',
            data: datas,
            animationDuration
          })
        }
        this.barChartOptions = {
          tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
              type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid: {
            top: 10,
            left: '2%',
            right: '2%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [{
            type: 'category',
            data: dates,
            axisTick: {
              alignWithLabel: true
            }
          }],
          yAxis: [{
            type: 'value',
            axisTick: {
              show: false
            }
          }],
          series: series
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding-top: 16px;
  padding-bottom: 32px;
  padding-left: 32px;
  padding-right: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
