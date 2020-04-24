<template>
  <el-table :data="list" style="width: 100%;padding-top: 15px;">
    <el-table-column label="订单编号" min-width="200">
      <template slot-scope="scope">
        {{ scope.row.id }}
      </template>
    </el-table-column>
    <el-table-column label="订单金额" width="195" align="center">
      <template slot-scope="scope">
        ¥{{ scope.row.amount | toThousandFilter }}
      </template>
    </el-table-column>
    <el-table-column
      label="订单类型"
      width="100"
    >
      <template slot-scope="scope">
        <el-tag v-if="scope.row.orderType === 'SHOP_SERVICE'">店铺服务</el-tag>
        <el-tag v-else-if="scope.row.orderType === 'SHOP_GROUPON'" type="success">团购服务</el-tag>
        <el-tag v-else-if="scope.row.orderType === 'USER_RECHARGE'" type="info">用户充值</el-tag>
        <el-tag v-else-if="scope.row.orderType === 'USER_FLOWER'" type="warning">购买鲜花</el-tag>
        <!-- <el-tag v-else type="danger">否</el-tag> -->
      </template>
    </el-table-column>
    <el-table-column
      label="订单状态"
      width="100"
    >
      <template slot-scope="scope">
        <el-tag v-if="scope.row.status === 'PENDING'">待支付</el-tag>
        <el-tag v-else-if="scope.row.status === 'PAID'" type="success">已支付</el-tag>
        <el-tag v-else-if="scope.row.status === 'REFUND'" type="info">已退款</el-tag>
        <el-tag v-else-if="scope.row.status === 'EXPIRE'" type="warning">已超时</el-tag>
        <el-tag v-else-if="scope.row.status === 'CANCEL'" type="danger">已取消</el-tag>
        <!-- <el-tag v-else type="danger">否</el-tag> -->
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { fetchList } from '@/api/order'

export default {

  data() {
    return {
      list: null
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      fetchList({ current: 1, size: 8 }).then(response => {
        this.list = response.records
      })
    }
  }
}
</script>
