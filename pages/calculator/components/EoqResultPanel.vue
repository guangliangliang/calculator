<script setup>
import { formatNumber } from '@/utils/formatter.js'

defineProps({
  results: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <view class="result-section card">
    <view class="section-title">订货建议</view>

    <view class="hero-card">
      <text class="hero-label">建议每次进货</text>
      <text class="hero-value">{{ formatNumber(results.eoq, 0) }}件</text>
      <text class="hero-note">这是在订货成本和库存持有成本之间相对平衡的批量。</text>
    </view>

    <view class="summary-grid">
      <view class="summary-card">
        <text class="summary-label">年需求量</text>
        <text class="summary-value">{{ formatNumber(results.annualDemand, 0) }}件</text>
      </view>

      <view class="summary-card">
        <text class="summary-label">年订货次数</text>
        <text class="summary-value">{{ formatNumber(results.orderTimes, 1) }}次</text>
      </view>

      <view class="summary-card">
        <text class="summary-label">平均每月订货</text>
        <text class="summary-value">{{ formatNumber(results.averageMonthlyOrders, 1) }}次</text>
      </view>

      <view class="summary-card">
        <text class="summary-label">建议补货周期</text>
        <text class="summary-value">{{ formatNumber(results.reorderCycleDays, 1) }}天</text>
      </view>
    </view>
  </view>

  <view class="tips-section card">
    <view class="section-title">经营提醒</view>
    <text class="tip-text">如果销量波动大，可以在建议批量基础上再增加安全库存。</text>
    <text class="tip-text">如果供应商发货慢，建议把补货周期适当提前 2 到 3 天。</text>
  </view>
</template>

<style scoped>
.result-section,
.tips-section {
  padding: 32rpx;
  margin-bottom: 28rpx;
  border-radius: 24rpx;
}

.result-section {
  background: linear-gradient(180deg, #ECFDF5 0%, #F0FDF4 100%);
  border: 2rpx solid #BBF7D0;
}

.tips-section {
  background: #FFFFFF;
}

.section-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #334155;
  margin-bottom: 24rpx;
}

.hero-card {
  padding: 28rpx;
  border-radius: 22rpx;
  background: rgba(255, 255, 255, 0.9);
  margin-bottom: 22rpx;
}

.hero-label {
  display: block;
  font-size: 24rpx;
  color: #64748B;
  margin-bottom: 12rpx;
}

.hero-value {
  display: block;
  font-size: 38rpx;
  font-weight: 700;
  color: #047857;
  margin-bottom: 12rpx;
}

.hero-note {
  font-size: 24rpx;
  color: #065F46;
  line-height: 1.6;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18rpx;
}

.summary-card {
  padding: 22rpx;
  border-radius: 18rpx;
  background: rgba(255, 255, 255, 0.82);
}

.summary-label {
  display: block;
  font-size: 22rpx;
  color: #64748B;
  margin-bottom: 8rpx;
}

.summary-value {
  font-size: 28rpx;
  font-weight: 700;
  color: #065F46;
}

.tip-text {
  display: block;
  font-size: 24rpx;
  color: #64748B;
  line-height: 1.7;
}

.tip-text + .tip-text {
  margin-top: 14rpx;
}
</style>
