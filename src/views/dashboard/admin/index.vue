<template>
  <div class="dashboard-editor-container">
    <el-row>
      <el-date-picker
        v-model="dateRange"
        style=" float: right;"
        type="daterange"
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        align="right"
        value-format="yyyy-MM-dd"
        @change="dateChanged"
      />
    </el-row>

    <!-- <github-corner class="github-corner" /> -->
    <panel-group
      :users="numbers.users"
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
import { fetchNumbers, brokenLines, pie, bar } from '@/api/statistics'
import { dateFormat } from '@/utils/date'
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

export default {
  name: 'DashboardAdmin',
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
    return {
      lineChartOptions: {},
      pieChartOptions: {},
      barChartOptions: {},
      startAt: null,
      endAt: null,
      dateRange: null,
      numbers: {
        users: 0,
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
    this.getNumbers()
    this.getBrokenLines('users')
    this.getPie()
    this.getBar()
  },
  methods: {
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
      const users = []
      const legend = []
      const series = []
      const shops = []
      const transactions = []
      const orders = []
      brokenLines({ type: type, startAt: dateFormat('YYYY-mm-dd', start), endAt: dateFormat('YYYY-mm-dd', end) }).then(response => {
        for (let i = 0; i < 7; i++) {
          const formatDate = dateFormat('YYYY-mm-dd', new Date(start.getTime() + 3600 * 1000 * 24 * i))
          dates.push(formatDate)
          if (type === 'users') {
            const temp = response.users.find(item => {
              return item.date === formatDate
            })
            users.push(temp ? temp.amount : 0)
          } else if (type === 'shops') {
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
            const temp = response.orders.find(item => {
              return item.date === formatDate
            })
            orders.push(temp ? temp.amount : 0)
          }
        }
        if (type === 'users') {
          legend.push('注册用户')
          series.push({
            name: '注册用户', itemStyle: {
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
            data: users,
            animationDuration: 2800,
            animationEasing: 'cubicInOut'
          })
        } else if (type === 'shops') {
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
          legend.push('平台收益')
          series.push({
            name: '平台收益', itemStyle: {
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
          legend.push('订单金额')
          series.push({
            name: '订单金额', itemStyle: {
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
            data: orders,
            animationDuration: 2800,
            animationEasing: 'cubicInOut'
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
