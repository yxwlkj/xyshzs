<template>
  <view class="rider-order-container">
    <view class="header">
      <text class="title">骑手订单</text>
    </view>
    <view class="order-list">
      <view class="order-item common-card" v-for="item in orderList" :key="item.id">
        <view class="order-info">
          <view class="order-title">
            <text class="title-text">{{ item.title }}</text>
            <text class="order-type" :class="item.status === 2 ? 'type-warning' : 'type-success'">{{ item.type }}</text>
            <text class="order-status" :class="item.status === 2 ? 'status-warning' : 'status-success'">{{ item.statusText }}</text>
          </view>
          <view class="order-desc">
            <text class="desc-text">{{ item.desc }}</text>
          </view>
          <view class="order-price">
            <text class="price-text">¥{{ item.price }}</text>
          </view>
        </view>
        <view class="order-user">
          <image class="user-avatar" :src="item.avatar" mode="circle"></image>
          <text class="user-name">{{ item.userName }}</text>
          <text class="order-time">{{ item.time }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getRiderOrderList } from '@/api/rider'

const orderList = ref([
  { id: 1, title: '小鱼', desc: '小鱼', type: '餐品', status: 3, statusText: '已完成', price: 1, avatar: '/static/avatar/fish.png', userName: '小鱼', time: '09-16 20:22' },
  { id: 2, title: '快递代取', desc: '京东快递', type: '快递', status: 2, statusText: '配送中', price: 7, avatar: '/static/avatar/sunqi.png', userName: '孙七', time: '09-15 18:00' },
  { id: 3, title: '蛋糕店甜品', desc: '提拉米苏蛋糕', type: '甜品', status: 3, statusText: '已完成', price: 18, avatar: '/static/avatar/caiya.png', userName: '菜牙', time: '09-14 21:00' },
  { id: 4, title: '超市水果', desc: '苹果+香蕉', type: '水果', status: 3, statusText: '已完成', price: 8, avatar: '/static/avatar/sunqi.png', userName: '孙七', time: '09-13 17:00' }
])

onMounted(async () => {
  const res = await getRiderOrderList()
  orderList.value = res.data
})
</script>

<style scoped>
.rider-order-container {
  padding: 20rpx;
  min-height: 100vh;
}
.header {
  padding: 30rpx 0;
  text-align: center;
}
.title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
}
.order-item {
  display: flex;
  flex-direction: column;
}
.order-info {
  margin-bottom: 20rpx;
}
.order-title {
  display: flex;
  align-items: center;
  margin-bottom: 10rpx;
}
.title-text {
  font-size: 32rpx;
  font-weight: 500;
  color: #333;
  margin-right: 10rpx;
}
.order-type {
  font-size: 22rpx;
  padding: 4rpx 10rpx;
  border-radius: 8rpx;
  background-color: #e8f4ff;
  color: #57a1f5;
  margin-right: 10rpx;
}
.type-warning {
  background-color: #fef5e6;
  color: #ff976a;
}
.type-success {
  background-color: #f0f9eb;
  color: #07c160;
}
.order-status {
  font-size: 22rpx;
  padding: 4rpx 10rpx;
  border-radius: 8rpx;
}
.status-warning {
  background-color: #fef5e6;
  color: #ff976a;
}
.status-success {
  background-color: #f0f9eb;
  color: #07c160;
}
.order-desc {
  margin-bottom: 10rpx;
}
.desc-text {
  font-size: 26rpx;
  color: #999;
}
.order-price {
}
.price-text {
  font-size: 32rpx;
  font-weight: 600;
  color: #ff6b35;
}
.order-user {
  display: flex;
  align-items: center;
}
.user-avatar {
  width: 60rpx;
  height: 60rpx;
  margin-right: 15rpx;
}
.user-name {
  font-size: 26rpx;
  color: #333;
  margin-right: 15rpx;
}
.order-time {
  font-size: 24rpx;
  color: #ccc;
  margin-left: auto;
}
</style>