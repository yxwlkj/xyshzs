<template>
  <view class="mine-container">
    <view class="user-info">
      <image class="user-avatar" src="/static/avatar/caiya.png" mode="circle"></image>
      <view class="user-detail">
        <text class="user-name">菜牙</text>
        <text class="user-balance">余额：¥28</text>
      </view>
    </view>

    <view class="service-box">
      <view class="service-title">
        <text class="title-text">用户服务</text>
      </view>
      <view class="service-grid">
        <view class="grid-item" v-for="item in userService" :key="item.id" @click="goToPage(item.path)">
          <image class="grid-icon" :src="item.icon" mode="aspectFit"></image>
          <text class="grid-text">{{ item.name }}</text>
        </view>
      </view>
    </view>

    <view class="service-box">
      <view class="service-title">
        <text class="title-text">骑手服务</text>
      </view>
      <view class="service-grid">
        <view class="grid-item" v-for="item in riderService" :key="item.id" @click="goToPage(item.path)">
          <image class="grid-icon" :src="item.icon" mode="aspectFit"></image>
          <text class="grid-text">{{ item.name }}</text>
        </view>
      </view>
    </view>

    <view class="menu-box">
      <view class="menu-item" @click="goToPage('/pages/mine/info')">
        <text class="menu-text">我的信息</text>
        <text class="menu-arrow">></text>
      </view>
      <view class="menu-item" @click="goToPage('/pages/mine/about')">
        <text class="menu-text">关于我们</text>
        <text class="menu-arrow">></text>
      </view>
      <view class="menu-item" @click="logout">
        <text class="menu-text text-danger">退出登录</text>
        <text class="menu-arrow">></text>
      </view>
    </view>

    <view class="tabbar">
      <view class="tabbar-item" v-for="item in tabbarList" :key="item.path" :class="{ active: currentTab === item.path }" @click="switchTab(item.path)">
        <image class="tabbar-icon" :src="item.icon" mode="aspectFit"></image>
        <text class="tabbar-text">{{ item.name }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'uni-app'

const router = useRouter()
const currentTab = ref('mine')
const tabbarList = ref([
  { path: 'index', name: '首页', icon: '/static/tabbar/home.png' },
  { path: 'order', name: '订单', icon: '/static/tabbar/order.png' },
  { path: 'rank', name: '排行榜', icon: '/static/tabbar/rank.png' },
  { path: 'mine', name: '我的', icon: '/static/tabbar/mine.png' }
])
const userService = ref([
  { id: 1, name: '我的地址', icon: '/static/icons/address.png', path: '/pages/address/list' },
  { id: 2, name: '我的订单', icon: '/static/icons/order.png', path: '/pages/order/list' },
  { id: 3, name: '评价中心', icon: '/static/icons/star.png', path: '/pages/evaluate/list' },
  { id: 4, name: '我的钱包', icon: '/static/icons/wallet.png', path: '/pages/wallet/index' }
])
const riderService = ref([
  { id: 1, name: '骑手认证', icon: '/static/icons/auth.png', path: '/pages/rider/auth' },
  { id: 2, name: '骑手订单', icon: '/static/icons/rider-order.png', path: '/pages/rider/order' },
  { id: 3, name: '骑手评价', icon: '/static/icons/rider-star.png', path: '/pages/rider/evaluate' }
])

const goToPage = (path) => router.push({ path })
const logout = () => {
  uni.showModal({
    title: '提示',
    content: '确定退出登录？',
    success: (res) => {
      if (res.confirm) {
        uni.removeStorageSync('token')
        router.push({ path: '/pages/login/login' })
      }
    }
  })
}
const switchTab = (path) => {
  currentTab.value = path
  router.push({ path: `/pages/${path}/${path}` })
}
</script>

<style scoped>
.mine-container {
  min-height: 100vh;
  background-color: #f5f5f5;
}
.user-info {
  background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
  padding: 60rpx 30rpx;
  display: flex;
  align-items: center;
}
.user-avatar {
  width: 100rpx;
  height: 100rpx;
  margin-right: 20rpx;
}
.user-detail {
  display: flex;
  flex-direction: column;
}
.user-name {
  font-size: 36rpx;
  font-weight: 600;
  color: #fff;
  margin-bottom: 10rpx;
}
.user-balance {
  font-size: 28rpx;
  color: #fff;
}
.service-box {
  background-color: #fff;
  margin: 20rpx;
  border-radius: 16rpx;
  padding: 24rpx;
}
.service-title {
  margin-bottom: 20rpx;
}
.title-text {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}
.service-grid {
  display: flex;
  justify-content: space-around;
}
.grid-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.grid-icon {
  width: 60rpx;
  height: 60rpx;
  margin-bottom: 10rpx;
}
.grid-text {
  font-size: 24rpx;
  color: #333;
}
.menu-box {
  background-color: #fff;
  margin: 20rpx;
  border-radius: 16rpx;
  padding: 24rpx;
}
.menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
}
.menu-item:last-child {
  border-bottom: none;
}
.menu-text {
  font-size: 28rpx;
  color: #333;
}
.menu-arrow {
  font-size: 28rpx;
  color: #ccc;
}
.tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100rpx;
  background-color: #fff;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.1);
}
.tabbar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.tabbar-item.active .tabbar-text {
  color: #ff6b35;
}
.tabbar-icon {
  width: 48rpx;
  height: 48rpx;
  margin-bottom: 8rpx;
}
.tabbar-text {
  font-size: 22rpx;
  color: #999;
}
</style>