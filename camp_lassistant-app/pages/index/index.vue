<template>
  <view class="index-container">
    <view class="header-banner">
      <view class="logo-box">
        <text class="logo-text">校园跑腿</text>
      </view>
      <view class="quick-service">
        <view class="service-item" v-for="item in quickService" :key="item.id">
          <image class="service-icon" :src="item.icon" mode="aspectFit"></image>
          <text class="service-text">{{ item.name }}</text>
        </view>
      </view>
    </view>

    <view class="category-box">
      <view class="category-item" v-for="item in categoryList" :key="item.id">
        <image class="category-icon" :src="item.icon" mode="aspectFit"></image>
        <text class="category-text">{{ item.name }}</text>
      </view>
    </view>

    <view class="notice-box common-card">
      <view class="notice-title">
        <text class="title-text">最新公告</text>
      </view>
      <view class="notice-list">
        <view class="notice-item" v-for="item in noticeList" :key="item.id">
          <view class="notice-content">
            <text class="notice-title-text">{{ item.title }}</text>
            <text class="notice-desc">{{ item.desc }}</text>
          </view>
          <text class="notice-time">{{ item.time }}</text>
        </view>
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
const currentTab = ref('index')
const quickService = ref([
  { id: 1, name: '代取外卖', icon: '/static/icons/takeaway.png' },
  { id: 2, name: '代寄快递', icon: '/static/icons/express.png' },
  { id: 3, name: '代办事项', icon: '/static/icons/todo.png' }
])
const categoryList = ref([
  { id: 1, name: '代拿快递', icon: '/static/icons/package.png' },
  { id: 2, name: '待取餐品', icon: '/static/icons/food.png' },
  { id: 3, name: '代买零食', icon: '/static/icons/snack.png' },
  { id: 4, name: '代送鲜花', icon: '/static/icons/flower.png' }
])
const noticeList = ref([
  { id: 1, title: '第一条公告', desc: '欢迎来到系统', time: '05-04 17:28' },
  { id: 2, title: '暑期服务公告', desc: '暑期期间配送时间调整为8:00-22:00', time: '07-01 09:00' },
  { id: 3, title: '新用户优惠', desc: '新注册用户首单立减5元', time: '08-01 10:00' }
])
const tabbarList = ref([
  { path: 'index', name: '首页', icon: '/static/tabbar/home.png' },
  { path: 'order', name: '订单', icon: '/static/tabbar/order.png' },
  { path: 'rank', name: '排行榜', icon: '/static/tabbar/rank.png' },
  { path: 'mine', name: '我的', icon: '/static/tabbar/mine.png' }
])

const switchTab = (path) => {
  currentTab.value = path
  router.push({ path: `/pages/${path}/${path}` })
}
</script>

<style scoped>
.index-container {
  min-height: 100vh;
  background-color: #f5f5f5;
}
.header-banner {
  background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
  padding: 40rpx 30rpx;
  border-bottom-left-radius: 30rpx;
  border-bottom-right-radius: 30rpx;
}
.logo-box {
  margin-bottom: 30rpx;
}
.logo-text {
  font-size: 48rpx;
  font-weight: 700;
  color: #fff;
}
.quick-service {
  display: flex;
  justify-content: space-around;
}
.service-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.service-icon {
  width: 80rpx;
  height: 80rpx;
  margin-bottom: 10rpx;
}
.service-text {
  font-size: 24rpx;
  color: #fff;
}
.category-box {
  display: flex;
  justify-content: space-around;
  padding: 30rpx 0;
  background-color: #fff;
  margin: 20rpx;
  border-radius: 16rpx;
}
.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.category-icon {
  width: 80rpx;
  height: 80rpx;
  margin-bottom: 10rpx;
}
.category-text {
  font-size: 26rpx;
  color: #333;
}
.notice-title {
  margin-bottom: 20rpx;
}
.title-text {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}
.notice-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
}
.notice-item:last-child {
  border-bottom: none;
}
.notice-content {
  flex: 1;
}
.notice-title-text {
  font-size: 28rpx;
  color: #333;
  display: block;
  margin-bottom: 8rpx;
}
.notice-desc {
  font-size: 24rpx;
  color: #999;
}
.notice-time {
  font-size: 22rpx;
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