<template>
  <div class="order-management-container">
    <el-page-header @back="goBack" content="订单管理" />
    <div class="search-box">
      <el-input v-model="searchForm.orderNo" placeholder="订单编号" style="width: 200px; margin-right: 10px" />
      <el-input v-model="searchForm.itemName" placeholder="物品名称" style="width: 200px; margin-right: 10px" />
      <el-button type="primary" @click="getOrderList">搜索</el-button>
      <el-button @click="resetSearch">重置</el-button>
    </div>

    <el-table :data="orderList" border stripe style="width: 100%" v-loading="loading">
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="orderNo" label="订单编号" width="180" />
      <el-table-column prop="itemName" label="物品名称" />
      <el-table-column prop="itemType" label="物品类型" width="100" />
      <el-table-column prop="weight" label="重量(kg)" width="100" />
      <el-table-column prop="fee" label="小费" width="100" />
      <el-table-column prop="publisher" label="发布人" width="100" />
      <el-table-column prop="rider" label="接单⼈" width="100" />
      <el-table-column prop="status" label="订单状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">{{ getStatusText(row.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button size="small" type="primary" @click="viewDetail(row)">查看详情</el-button>
          <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-model:current-page="pagination.current"
      v-model:page-size="pagination.size"
      :total="pagination.total"
      layout="total, prev, pager, next"
      style="margin-top: 20px; text-align: right"
      @size-change="getOrderList"
      @current-change="getOrderList"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getOrderList, deleteOrder } from '@/api/order'

const router = useRouter()
const searchForm = ref({ orderNo: '', itemName: '' })
const loading = ref(false)
const orderList = ref([])
const pagination = ref({ current: 1, size: 10, total: 0 })

const goBack = () => router.back()
const resetSearch = () => {
  searchForm.value = { orderNo: '', itemName: '' }
  getOrderList()
}
const getOrderList = async () => {
  loading.value = true
  const res = await getOrderList({ ...searchForm.value, ...pagination.value })
  orderList.value = res.data.records
  pagination.value.total = res.data.total
  loading.value = false
}
const getStatusText = (status) => {
  const map = { 1: '待接单', 2: '配送中', 3: '已完成', 4: '已评价' }
  return map[status] || '未知'
}
const getStatusType = (status) => {
  const map = { 1: 'warning', 2: 'primary', 3: 'success', 4: 'info' }
  return map[status] || 'info'
}
const viewDetail = (row) => router.push({ path: '/order/detail', query: { id: row.id } })
const handleDelete = (row) => {
  ElMessage.confirm('确认删除该订单？', '提示', { type: 'warning' }).then(async () => {
    await deleteOrder(row.id)
    ElMessage.success('删除成功')
    getOrderList()
  }).catch(() => {})
}

onMounted(() => getOrderList())
</script>

<style scoped>
.order-management-container {
  padding: 20px;
}
.search-box {
  margin-bottom: 20px;
}
</style>