<script setup>
import { formatCurrency } from '@/utils/formatter.js'

defineProps({
  results: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <view class="result-panel result-panel-orange card">
    <view class="result-header">
      <view>
        <text class="result-kicker">装修预算</text>
        <text class="result-title">预算结果</text>
      </view>
      <text class="grade-tag">{{ results.gradeLabel }}</text>
    </view>

    <view class="result-hero-block">
      <text class="result-hero-label">总预算</text>
      <text class="result-hero-value">
        {{ formatCurrency(results.total) }}
        <text class="metric-unit">元</text>
      </text>
      <text class="result-hero-note">{{ results.styleDescription }}</text>
    </view>

    <view class="metric-grid">
      <view class="metric-card">
        <text class="metric-label">每平米造价</text>
        <text class="metric-value">{{ formatCurrency(results.pricePerSqm) }}<text class="metric-unit">元</text></text>
      </view>

      <view class="metric-card">
        <text class="metric-label">材料预算</text>
        <text class="metric-value">{{ formatCurrency(results.materialEstimate) }}<text class="metric-unit">元</text></text>
      </view>

      <view class="metric-card">
        <text class="metric-label">人工预算</text>
        <text class="metric-value">{{ formatCurrency(results.laborEstimate) }}<text class="metric-unit">元</text></text>
      </view>

      <view class="metric-card">
        <text class="metric-label">辅料及杂项</text>
        <text class="metric-value">{{ formatCurrency(results.miscellaneousEstimate) }}<text class="metric-unit">元</text></text>
      </view>
    </view>
  </view>

  <view class="result-detail-panel card">
    <view class="result-header">
      <view>
        <text class="result-kicker">预算提醒</text>
        <text class="result-title">预算建议</text>
      </view>
    </view>

    <view class="tips-list">
      <text class="tip-row">建议在总预算之外预留 5% 到 10% 作为现场增项和损耗缓冲。</text>
      <text class="tip-row">如果你后续要做报价单，可继续拆成主材、辅材、人工、家具家电四大类。</text>
    </view>
  </view>
</template>

<style scoped>
.grade-tag {
  padding: 10rpx 18rpx;
  border-radius: 999rpx;
  background: #FFEDD5;
  color: #C2410C;
  font-size: 22rpx;
  font-weight: 600;
}
</style>
