<script setup>
import { industries } from '../../utils/calculator-config.js'

function goToIndustryList(industry) {
  uni.navigateTo({
    url: `/pages/industry-list/index?industryId=${industry.id}`
  })
}
</script>

<template>
  <view class="container">
    <view class="header">
      <text class="subtitle">选择您需要的行业分类</text>
    </view>

    <view class="industry-list">
      <view 
        v-for="item in industries" 
        :key="item.id" 
        class="industry-card"
        @click="goToIndustryList(item)"
      >
        <view class="icon-bg">
          <text class="icon">{{ item.icon }}</text>
        </view>
        <view class="info">
          <text class="name">{{ item.name }}</text>
          <text class="desc">{{ item.description }}</text>
        </view>
        <view class="arrow">›</view>
      </view>
    </view>
  </view>
</template>

<style scoped>
.container {
  padding: 40rpx 30rpx;
}

.header {
  margin-bottom: 50rpx;
  text-align: center;
  margin-top: 20rpx;
}

.subtitle {
  display: block;
  font-size: 28rpx;
  color: #7B8BA3;
}

.industry-list {
  display: flex;
  flex-direction: column;
  gap: 28rpx;
}

.industry-card {
  display: flex;
  align-items: center;
  padding: 32rpx;
  border-radius: 24rpx;
  background: #FFFFFF;
  box-shadow: 
    0 2rpx 12rpx rgba(0, 0, 0, 0.06),
    0 1rpx 3rpx rgba(0, 0, 0, 0.04);
  transition: all 0.15s;
}

.industry-card:active {
  transform: scale(0.98);
  opacity: 0.95;
}

.icon-bg {
  width: 90rpx;
  height: 90rpx;
  border-radius: 20rpx;
  background: #F8FAFC;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 28rpx;
}

.icon {
  font-size: 44rpx;
}

.info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.name {
  font-size: 32rpx;
  font-weight: 600;
  color: #2D3748;
  margin-bottom: 8rpx;
}

.desc {
  font-size: 24rpx;
  color: #7B8BA3;
}

.arrow {
  font-size: 44rpx;
  color: #A0AEC0;
  font-weight: 300;
}
</style>
