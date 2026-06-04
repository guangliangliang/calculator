<script setup>
import { formatCurrency, formatPercent } from '@/utils/formatter.js'

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
      <view class="section-title">个税结果</view>
      <text class="bracket-tag">{{ results.bracketLabel }}</text>
    </view>

    <view class="hero-card">
      <text class="hero-label">税后到手</text>
      <text class="hero-value">{{ formatCurrency(results.afterTax) }}元</text>
    </view>

    <view class="summary-grid">
      <view class="summary-card">
        <text class="summary-label">税前收入</text>
        <text class="summary-value">{{ formatCurrency(results.afterTax + results.tax) }}元</text>
      </view>

      <view class="summary-card">
        <text class="summary-label">起征点</text>
        <text class="summary-value">{{ formatCurrency(results.threshold) }}元</text>
      </view>

      <view class="summary-card">
        <text class="summary-label">专项附加扣除</text>
        <text class="summary-value">{{ formatCurrency(results.deduction) }}元</text>
      </view>

      <view class="summary-card">
        <text class="summary-label">应纳税所得额</text>
        <text class="summary-value">{{ formatCurrency(results.taxable) }}元</text>
      </view>

      <view class="summary-card">
        <text class="summary-label">适用税率</text>
        <text class="summary-value">{{ formatPercent(results.rate * 100) }}%</text>
      </view>

      <view class="summary-card">
        <text class="summary-label">速算扣除数</text>
        <text class="summary-value">{{ formatCurrency(results.quickDeduction) }}元</text>
      </view>
    </view>
  </view>

  <view class="formula-section card">
    <view class="section-title">计算说明</view>
    <view class="formula-row">
      <text class="formula-label">应纳税所得额</text>
      <text class="formula-text">
        税前收入 - 起征点 - 专项附加扣除 = {{ formatCurrency(results.taxable) }} 元
      </text>
    </view>
    <view class="formula-row">
      <text class="formula-label">应缴个税</text>
      <text class="formula-text">
        应纳税所得额 x 税率 - 速算扣除数 = {{ formatCurrency(results.tax) }} 元
      </text>
    </view>
  </view>
</template>

<style scoped>
.result-section,
.formula-section {
  padding: 28rpx;
  margin-bottom: 24rpx;
  border-radius: 20rpx;
}

.result-section {
  background: linear-gradient(180deg, #EFF6FF 0%, #F8FAFC 100%);
  border: 2rpx solid #BFDBFE;
}

.formula-section {
  background: #FFFFFF;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18rpx;
  margin-bottom: 22rpx;
}

.section-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #0F172A;
}

.bracket-tag {
  padding: 10rpx 18rpx;
  border-radius: 999rpx;
  background: #DBEAFE;
  color: #1D4ED8;
  font-size: 22rpx;
  font-weight: 600;
}

.hero-card {
  padding: 24rpx;
  border-radius: 18rpx;
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
  font-size: 38rpx;
  font-weight: 700;
  color: #1D4ED8;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16rpx;
}

.summary-card {
  padding: 20rpx;
  border-radius: 16rpx;
  background: rgba(255, 255, 255, 0.8);
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
  color: #0F172A;
}

.formula-row + .formula-row {
  margin-top: 20rpx;
}

.formula-label {
  display: block;
  font-size: 24rpx;
  font-weight: 600;
  color: #334155;
  margin-bottom: 8rpx;
}

.formula-text {
  font-size: 24rpx;
  color: #64748B;
  line-height: 1.6;
}
</style>
