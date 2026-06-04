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
  <view class="result-panel result-panel-blue card">
    <view class="result-header">
      <view>
        <text class="result-kicker">个税测算</text>
        <text class="result-title">个税结果</text>
      </view>
      <text class="bracket-tag">{{ results.bracketLabel }}</text>
    </view>

    <view class="result-hero-block">
      <text class="result-hero-label">税后到手</text>
      <text class="result-hero-value">
        {{ formatCurrency(results.afterTax) }}
        <text class="metric-unit">元</text>
      </text>
    </view>

    <view class="metric-grid">
      <view class="metric-card">
        <text class="metric-label">税前收入</text>
        <text class="metric-value">{{ formatCurrency(results.afterTax + results.tax) }}<text class="metric-unit">元</text></text>
      </view>

      <view class="metric-card">
        <text class="metric-label">应缴个税</text>
        <text class="metric-value">{{ formatCurrency(results.tax) }}<text class="metric-unit">元</text></text>
      </view>

      <view class="metric-card">
        <text class="metric-label">起征点</text>
        <text class="metric-value">{{ formatCurrency(results.threshold) }}<text class="metric-unit">元</text></text>
      </view>

      <view class="metric-card">
        <text class="metric-label">专项附加扣除</text>
        <text class="metric-value">{{ formatCurrency(results.deduction) }}<text class="metric-unit">元</text></text>
      </view>

      <view class="metric-card">
        <text class="metric-label">应纳税所得额</text>
        <text class="metric-value">{{ formatCurrency(results.taxable) }}<text class="metric-unit">元</text></text>
      </view>

      <view class="metric-card">
        <text class="metric-label">适用税率</text>
        <text class="metric-value">{{ formatPercent(results.rate * 100) }}<text class="metric-unit">%</text></text>
      </view>

      <view class="metric-card">
        <text class="metric-label">速算扣除数</text>
        <text class="metric-value">{{ formatCurrency(results.quickDeduction) }}<text class="metric-unit">元</text></text>
      </view>
    </view>
  </view>

  <view class="result-detail-panel card">
    <view class="result-header">
      <view>
        <text class="result-kicker">计算依据</text>
        <text class="result-title">计算说明</text>
      </view>
    </view>

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
.bracket-tag {
  padding: 10rpx 18rpx;
  border-radius: 999rpx;
  background: #DBEAFE;
  color: #1D4ED8;
  font-size: 22rpx;
  font-weight: 600;
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
