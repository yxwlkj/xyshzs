/* 订单列表基础样式 */
.order-item {
  display: flex;
  flex-direction: column;
  padding: 24rpx;
  background-color: #fff;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

.order-no {
  font-size: 24rpx;
  color: #666;
}

.order-status {
  font-size: 24rpx;
  padding: 4rpx 10rpx;
  border-radius: 8rpx;
}

.status-wait {
  background-color: #fff3cd;
  color: #fd7e14;
}

.status-delivering {
  background-color: #cce5ff;
  color: #007bff;
}

.status-completed {
  background-color: #d4edda;
  color: #28a745;
}

.status-evaluated {
  background-color: #e2e3e5;
  color: #6c757d;
}

.order-body {
  margin-bottom: 20rpx;
}

.address-info {
  display: flex;
  align-items: flex-start;
  margin-bottom: 12rpx;
}

.address-info .label {
  font-size: 26rpx;
  color: #666;
  width: 140rpx;
  flex-shrink: 0;
}

.address-info .value {
  font-size: 26rpx;
  color: #333;
  flex: 1;
}

.price-info {
  display: flex;
  align-items: center;
}

.price-info .label {
  font-size: 26rpx;
  color: #666;
  width: 140rpx;
  flex-shrink: 0;
}

.price-info .value {
  font-size: 32rpx;
  font-weight: 600;
  color: #ff6b35;
}

.order-footer {
  display: flex;
  justify-content: flex-end;
}

.evaluate-btn {
  margin-left: 10rpx;
}

/* 以下是你当前需要的价格相关样式，无空规则、语法正确 */
.price-text {
  font-size: 32rpx;
  font-weight: 600;
  color: #ff6b35;
}