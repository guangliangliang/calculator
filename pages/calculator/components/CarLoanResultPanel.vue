<script setup>
import { computed } from 'vue'
import { formatCurrency } from '../../../utils/formatter.js'

const props = defineProps({
  results: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['view-schedule'])

const schedulePreview = computed(() => props.results.schedule?.slice(0, 12) || [])
</script>

<template>
  <view class="result-section card">
    <view class="section-title">贷款结果</view>

    <view class="summary-grid">
      <view class="summary-card">
        <text class="summary-label">首付金额</text>
        <text class="summary-value">{{ formatCurrency(results.downPayment) }}元</text>
      </view>

      <view class="summary-card">
        <text class="summary-label">贷款金额</text>
        <text class="summary-value">{{ formatCurrency(results.loanAmount) }}元</text>
      </view>

      <view class="summary-card">
        <text class="summary-label">每期月供</text>
        <text class="summary-value">{{ formatCurrency(results.monthlyPayment) }}元</text>
      </view>

      <view class="summary-card">
        <text class="summary-label">总利息</text>
        <text class="summary-value">{{ formatCurrency(results.totalInterest) }}元</text>
      </view>

      <view class="summary-card">
        <text class="summary-label">还款总额</text>
        <text class="summary-value">{{ formatCurrency(results.totalPayment) }}元</text>
      </view>

      <view class="summary-card">
        <text class="summary-label">购车总花费</text>
        <text class="summary-value">{{ formatCurrency(results.totalCost) }}元</text>
      </view>
    </view>
  </view>

  <view class="schedule-section card" v-if="schedulePreview.length">
    <view class="section-title">前12期还款明细</view>

    <view class="schedule-table">
      <view class="schedule-row schedule-head">
        <text class="col-period">期数</text>
        <text class="col-amount">月供</text>
        <text class="col-amount">本金</text>
        <text class="col-amount">利息</text>
      </view>

      <view class="schedule-row" v-for="item in schedulePreview" :key="item.period">
        <text class="col-period">第{{ item.period }}期</text>
        <text class="col-amount">{{ formatCurrency(item.payment) }}</text>
        <text class="col-amount">{{ formatCurrency(item.principal) }}</text>
        <text class="col-amount">{{ formatCurrency(item.interest) }}</text>
      </view>
    </view>

    <text v-if="results.months > 12" class="schedule-note">
      仅展示前12期，完整还款期数共 {{ results.months }} 期。
    </text>

    <button v-if="results.months > 12" class="detail-button" @click="emit('view-schedule')">
      查看全部明细
    </button>
  </view>
</template>

<style scoped>
.result-section,
.schedule-section {
  padding: 32rpx;
  margin-bottom: 28rpx;
  border-radius: 24rpx;
}

.result-section {
  background: linear-gradient(180deg, #EFF6FF 0%, #F8FAFC 100%);
  border: 2rpx solid #BFDBFE;
}

.schedule-section {
  background: #FFFFFF;
}

.section-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #4A5568;
  margin-bottom: 28rpx;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20rpx;
}

.summary-card {
  padding: 24rpx;
  border-radius: 20rpx;
  background: rgba(255, 255, 255, 0.86);
}

.summary-label {
  display: block;
  font-size: 24rpx;
  color: #64748B;
  margin-bottom: 10rpx;
}

.summary-value {
  font-size: 30rpx;
  font-weight: 700;
  color: #1D4ED8;
}

.schedule-table {
  overflow: hidden;
  border-radius: 18rpx;
  border: 1rpx solid #E2E8F0;
}

.schedule-row {
  display: flex;
  align-items: center;
  padding: 20rpx 16rpx;
  border-bottom: 1rpx solid #EDF2F7;
  background: #FFFFFF;
}

.schedule-row:last-child {
  border-bottom: none;
}

.schedule-head {
  background: #F8FAFC;
}

.col-period,
.col-amount {
  font-size: 22rpx;
  color: #334155;
}

.col-period {
  width: 22%;
}

.col-amount {
  width: 26%;
  text-align: right;
}

.schedule-note {
  display: block;
  margin-top: 18rpx;
  font-size: 22rpx;
  color: #64748B;
}

.detail-button {
  margin-top: 20rpx;
  height: 80rpx;
  line-height: 80rpx;
  border-radius: 40rpx;
  background: #1D4ED8;
  color: #FFFFFF;
  font-size: 26rpx;
  font-weight: 600;
}

.detail-button::after {
  border: none;
}
</style>
