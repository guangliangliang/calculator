<script setup>
import { formatValue } from '../../../utils/formatter.js'

defineProps({
  calculator: {
    type: Object,
    required: true
  },
  results: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <view class="result-section card">
    <view class="section-title">计算结果</view>
    <view class="result-list">
      <view class="result-item" v-for="output in calculator.outputs" :key="output.key">
        <text class="result-label">{{ output.label }}</text>
        <text class="result-value">
          {{ formatValue(results[output.key], output.format, output.precision) }}
          <text v-if="output.unit" class="result-unit">{{ output.unit }}</text>
        </text>
      </view>
    </view>
  </view>
</template>

<style scoped>
.result-section {
  padding: 32rpx;
  margin-bottom: 28rpx;
  background: #F0FDF4;
  border-radius: 24rpx;
  border: 2rpx solid #D1FAE5;
}

.section-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #4A5568;
  margin-bottom: 28rpx;
}

.result-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.result-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 0;
  border-bottom: 1rpx solid rgba(16, 185, 129, 0.1);
}

.result-item:last-child {
  border-bottom: none;
}

.result-label {
  font-size: 28rpx;
  color: #4A5568;
}

.result-value {
  font-size: 34rpx;
  font-weight: 600;
  color: #059669;
}

.result-unit {
  font-size: 26rpx;
  margin-left: 8rpx;
  color: #10B981;
  opacity: 0.8;
}
</style>
