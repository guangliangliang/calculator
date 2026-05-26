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
  border-radius: 28rpx;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10rpx);
  -webkit-backdrop-filter: blur(10rpx);
  border: 1rpx solid rgba(255, 255, 255, 0.8);
  box-shadow: 
    8rpx 8rpx 16rpx rgba(190, 200, 215, 0.5),
    -8rpx -8rpx 16rpx rgba(255, 255, 255, 0.9);
  transition: all 0.2s;
}

.industry-card:active {
  box-shadow: 
    inset 4rpx 4rpx 8rpx rgba(190, 200, 215, 0.7),
    inset -4rpx -4rpx 8rpx rgba(255, 255, 255, 0.9);
}

.icon-bg {
  width: 100rpx;
  height: 100rpx;
  border-radius: 24rpx;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 
    4rpx 4rpx 8rpx rgba(190, 200, 215, 0.5),
    -4rpx -4rpx 8rpx rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 28rpx;
}

.icon {
  font-size: 48rpx;
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
