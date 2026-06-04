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
  <view class="result-panel result-panel-success card">
    <view class="result-header">
      <view>
        <text class="result-kicker">库存测算</text>
        <text class="result-title">订货建议</text>
      </view>
      <text class="result-badge">EOQ</text>
    </view>

    <view class="result-hero-block">
      <text class="result-hero-label">建议每次进货</text>
      <text class="result-hero-value">
        {{ formatNumber(results.eoq, 0) }}
        <text class="metric-unit">件</text>
      </text>
      <text class="result-hero-note">这是在订货成本和库存持有成本之间相对平衡的批量。</text>
    </view>

    <view class="metric-grid">
      <view class="metric-card">
        <text class="metric-label">年需求量</text>
        <text class="metric-value">{{ formatNumber(results.annualDemand, 0) }}<text class="metric-unit">件</text></text>
      </view>

      <view class="metric-card">
        <text class="metric-label">年订货次数</text>
        <text class="metric-value">{{ formatNumber(results.orderTimes, 1) }}<text class="metric-unit">次</text></text>
      </view>

      <view class="metric-card">
        <text class="metric-label">平均每月订货</text>
        <text class="metric-value">{{ formatNumber(results.averageMonthlyOrders, 1) }}<text class="metric-unit">次</text></text>
      </view>

      <view class="metric-card">
        <text class="metric-label">建议补货周期</text>
        <text class="metric-value">{{ formatNumber(results.reorderCycleDays, 1) }}<text class="metric-unit">天</text></text>
      </view>
    </view>
  </view>

  <view class="result-detail-panel card">
    <view class="result-header">
      <view>
        <text class="result-kicker">经营提醒</text>
        <text class="result-title">经营提醒</text>
      </view>
    </view>

    <view class="tips-list">
      <text class="tip-row">如果销量波动大，可以在建议批量基础上再增加安全库存。</text>
      <text class="tip-row">如果供应商发货慢，建议把补货周期适当提前 2 到 3 天。</text>
    </view>
  </view>
</template>
