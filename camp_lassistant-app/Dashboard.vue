<template>
  <div class="dashboard-container">
    <el-page-header @back="goBack" content="数据统计" />
    <el-row :gutter="20" class="stat-row">
      <el-col :span="6">
        <div class="stat-card">
          <div class="label">用户数量</div>
          <div class="value">{{ statData.userCount }}</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card orange">
          <div class="label">骑手数量</div>
          <div class="value">{{ statData.riderCount }}</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card blue">
          <div class="label">订单数量</div>
          <div class="value">{{ statData.orderCount }}</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card green">
          <div class="label">成交总额</div>
          <div class="value">¥{{ statData.totalAmount }}</div>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="chart-row">
      <el-col :span="12">
        <div class="common-card">
          <h3 class="chart-title">近一周成交金额趋势</h3>
          <div ref="trendChart" class="chart-container"></div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="common-card">
          <h3 class="chart-title">订单状态分布统计</h3>
          <div ref="statusChart" class="chart-container"></div>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="chart-row">
      <el-col :span="12">
        <div class="common-card">
          <h3 class="chart-title">近12个月订单数量统计</h3>
          <div ref="monthChart" class="chart-container"></div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="common-card">
          <h3 class="chart-title">部门服务排行榜</h3>
          <div ref="rankChart" class="chart-container"></div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'
import { getDashboardStat } from '@/api/dashboard'

const router = useRouter()
const statData = ref({
  userCount: 11,
  riderCount: 7,
  orderCount: 81,
  totalAmount: 453
})
let trendChart, statusChart, monthChart, rankChart

const goBack = () => router.back()

const initCharts = () => {
  // 近一周趋势图
  trendChart = echarts.init(document.querySelector('#trendChart'))
  trendChart.setOption({
    xAxis: { type: 'category', data: ['09-10', '09-11', '09-12', '09-13', '09-14', '09-15', '09-16'] },
    yAxis: { type: 'value' },
    series: [{
      name: '成交金额',
      type: 'line',
      smooth: true,
      areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(102, 126, 234, 0.5)' }, { offset: 1, color: 'rgba(102, 126, 234, 0.1)' }] } },
      data: [400, 900, 1000, 1100, 700, 500, 200]
    }]
  })

  // 订单状态饼图
  statusChart = echarts.init(document.querySelector('#statusChart'))
  statusChart.setOption({
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      data: [
        { value: 10, name: '待接单' },
        { value: 20, name: '配送中' },
        { value: 40, name: '已完成' },
        { value: 10, name: '已评价' }
      ],
      emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' } }
    }]
  })

  // 近12个月柱状图
  monthChart = echarts.init(document.querySelector('#monthChart'))
  monthChart.setOption({
    xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'] },
    yAxis: { type: 'value' },
    series: [{ name: '订单数', type: 'bar', data: [10, 20, 30, 40, 50, 60, 70, 80, 70, 60, 50, 75], itemStyle: { color: '#43e97b' } }]
  })

  // 服务排行榜
  rankChart = echarts.init(document.querySelector('#rankChart'))
  rankChart.setOption({
    xAxis: { type: 'value' },
    yAxis: { type: 'category', data: ['快递', '水果', '蛋糕', '文具', '鲜花', '零食', '餐品'] },
    series: [{ name: '订单数', type: 'bar', data: [15, 12, 10, 8, 7, 5, 3], itemStyle: { color: { type: 'linear', x: 1, y: 0, x2: 0, y2: 0, colorStops: [{ offset: 0, color: '#f5576c' }, { offset: 1, color: '#f093fb' }] } } }]
  })
}

onMounted(async () => {
  const res = await getDashboardStat()
  statData.value = res.data
  initCharts()
})
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
}
.stat-row {
  margin-bottom: 20px;
}
.chart-row {
  margin-bottom: 20px;
}
.chart-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #303133;
}
.chart-container {
  width: 100%;
  height: 300px;
}
</style>