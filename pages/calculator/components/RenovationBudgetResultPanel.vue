<script setup>
import { formatCurrency } from '../../../utils/formatter.js'

defineProps({
  results: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <view class="result-section card">
    <view class="section-header">
      <view class="section-title">预算结果</view>
      <text class="grade-tag">{{ results.gradeLabel }}</text>
    </view>

    <view class="hero-card">
      <text class="hero-label">总预算</text>
      <text class="hero-value">{{ formatCurrency(results.total) }}元</text>
      <text class="hero-note">{{ results.styleDescription }}</text>
    </view>

    <view class="summary-grid">
      <view class="summary-card">
        <text class="summary-label">每平米造价</text>
        <text class="summary-value">{{ formatCurrency(results.pricePerSqm) }}元</text>
      </view>

      <view class="summary-card">
        <text class="summary-label">材料预算</text>
        <text class="summary-value">{{ formatCurrency(results.materialEstimate) }}元</text>
      </view>

      <view class="summary-card">
        <text class="summary-label">人工预算</text>
        <text class="summary-value">{{ formatCurrency(results.laborEstimate) }}元</text>
      </view>

      <view class="summary-card">
        <text class="summary-label">辅料及杂项</text>
        <text class="summary-value">{{ formatCurrency(results.miscellaneousEstimate) }}元</text>
      </view>
    </view>
  </view>

  <view class="tips-section card">
    <view class="section-title">预算建议</view>
    <text class="tip-text">建议在总预算之外预留 5% 到 10% 作为现场增项和损耗缓冲。</text>
    <text class="tip-text">如果你后续要做报价单，可继续拆成主材、辅材、人工、家具家电四大类。</text>
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
  background: linear-gradient(180deg, #FFF7ED 0%, #FFFBEB 100%);
  border: 2rpx solid #FED7AA;
}

.tips-section {
  background: #FFFFFF;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20rpx;
  margin-bottom: 24rpx;
}

.section-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #334155;
}

.grade-tag {
  padding: 10rpx 18rpx;
  border-radius: 999rpx;
  background: #FFEDD5;
  color: #C2410C;
  font-size: 22rpx;
  font-weight: 600;
}

.hero-card {
  padding: 28rpx;
  border-radius: 22rpx;
  background: rgba(255, 255, 255, 0.88);
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
  color: #C2410C;
  margin-bottom: 12rpx;
}

.hero-note {
  font-size: 24rpx;
  color: #7C2D12;
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
  color: #7C2D12;
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
