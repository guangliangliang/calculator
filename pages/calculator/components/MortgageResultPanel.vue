<script setup>
import { computed } from 'vue'
import { formatCurrency } from '@/utils/formatter.js'

const props = defineProps({
  results: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['view-schedule'])

const repaymentModeLabel = computed(() => (
  props.results.repaymentMode === 'equal-principal' ? '等额本金' : '等额本息'
))

const schedulePreview = computed(() => props.results.schedule?.slice(0, 12) || [])
</script>

<template>
  <view class="result-panel result-panel-success card">
    <view class="result-header">
      <view>
        <text class="result-kicker">房贷测算</text>
        <text class="result-title">还款结果</text>
      </view>
      <text class="mode-tag">{{ repaymentModeLabel }}</text>
    </view>

    <view class="result-hero-block">
      <text class="result-hero-label">
        {{ results.repaymentMode === 'equal-principal' ? '首月月供' : '每月月供' }}
      </text>
      <text class="result-hero-value">
        {{ formatCurrency(results.firstMonthPayment ?? results.monthlyPayment) }}
        <text class="metric-unit">元</text>
      </text>
    </view>

    <view class="metric-grid">
      <view class="metric-card" v-if="results.repaymentMode === 'equal-principal'">
        <text class="metric-label">每月递减</text>
        <text class="metric-value">{{ formatCurrency(results.monthlyDecrease) }}<text class="metric-unit">元</text></text>
      </view>

      <view class="metric-card" v-if="results.repaymentMode === 'equal-principal'">
        <text class="metric-label">末月月供</text>
        <text class="metric-value">{{ formatCurrency(results.lastMonthPayment) }}<text class="metric-unit">元</text></text>
      </view>

      <view class="metric-card">
        <text class="metric-label">还款总额</text>
        <text class="metric-value">{{ formatCurrency(results.totalPayment) }}<text class="metric-unit">元</text></text>
      </view>

      <view class="metric-card">
        <text class="metric-label">总利息</text>
        <text class="metric-value">{{ formatCurrency(results.totalInterest) }}<text class="metric-unit">元</text></text>
      </view>

      <view class="metric-card">
        <text class="metric-label">还款期数</text>
        <text class="metric-value">{{ results.months }}<text class="metric-unit">期</text></text>
      </view>
    </view>
  </view>

  <view class="result-detail-panel card" v-if="schedulePreview.length">
    <view class="result-header">
      <view>
        <text class="result-kicker">明细预览</text>
        <text class="result-title">前12期还款明细</text>
      </view>
    </view>

    <view class="result-table">
      <view class="result-table-row result-table-head">
        <text class="col-period">期数</text>
        <text class="col-amount">月供</text>
        <text class="col-amount">本金</text>
        <text class="col-amount">利息</text>
      </view>

      <view class="result-table-row" v-for="item in schedulePreview" :key="item.period">
        <text class="col-period">第{{ item.period }}期</text>
        <text class="col-amount">{{ formatCurrency(item.payment) }}</text>
        <text class="col-amount">{{ formatCurrency(item.principal) }}</text>
        <text class="col-amount">{{ formatCurrency(item.interest) }}</text>
      </view>
    </view>

    <text v-if="results.months > 12" class="result-note">
      仅展示前12期，完整还款期数共 {{ results.months }} 期。
    </text>

    <button v-if="results.months > 12" class="result-action result-action-success" @click="emit('view-schedule')">
      查看全部明细
    </button>
  </view>
</template>

<style scoped>
.mode-tag {
  padding: 10rpx 18rpx;
  border-radius: 999rpx;
  background: #DCFCE7;
  color: #15803D;
  font-size: 22rpx;
  font-weight: 600;
}

.col-period,
.col-amount {
  flex: 0 0 auto;
}

.col-period {
  width: 22%;
}

.col-amount {
  width: 26%;
  text-align: right;
}
</style>
