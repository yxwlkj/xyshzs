<template>
  <view id="app">
    <router-view />
  </view>
</template>

<script setup>
// 全局逻辑
</script>

<style>
/* 全局重置 */
page {
  background-color: #f5f5f5;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
}

/* 通用工具类 */
.container {
  padding: 20rpx;
}
.common-card {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}
.text-primary {
  color: #ff6b35 !important;
}
.text-success {
  color: #07c160 !important;
}
.text-warning {
  color: #ff976a !important;
}
.text-danger {
  color: #ee0a24 !important;
}
.text-info {
  color: #969799 !important;
}
</style>