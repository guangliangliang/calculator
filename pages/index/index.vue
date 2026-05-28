<script setup>
import { industries } from '@/utils/calculator-config.js'

function goToIndustryList(industry) {
  uni.navigateTo({
    url: `/pages/industry-list/index?industryId=${industry.id}`
  })
}
</script>

<template>
  <view class="container">
    <view class="header">
      <text class="title">行业计算工具箱</text>
      <text class="subtitle">选择你需要的行业分类，快速进入对应计算器</text>
    </view>

    <view class="industry-list">
      <view
        v-for="item in industries"
        :key="item.id"
        class="industry-card"
        @click="goToIndustryList(item)"
      >
        <view class="icon-bg" :style="{ background: item.gradient }">
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
  margin: 24rpx 0 50rpx;
}

.title {
  display: block;
  margin-bottom: 12rpx;
  font-size: 46rpx;
  font-weight: 700;
  color: #1E293B;
}

.subtitle {
  display: block;
  font-size: 28rpx;
  line-height: 1.6;
  color: #64748B;
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
}

.industry-card:active {
  transform: scale(0.98);
  opacity: 0.95;
}

.icon-bg {
  width: 90rpx;
  height: 90rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 28rpx;
}

.icon {
  font-size: 42rpx;
}

.info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.name {
  font-size: 32rpx;
  font-weight: 600;
  color: #1E293B;
  margin-bottom: 8rpx;
}

.desc {
  font-size: 24rpx;
  line-height: 1.5;
  color: #64748B;
}

.arrow {
  font-size: 44rpx;
  color: #A0AEC0;
  font-weight: 300;
}
</style>
