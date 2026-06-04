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

const schedulePreview = computed(() => props.results.schedule?.slice(0, 12) || [])
</script>

<template>
  <view class="result-panel result-panel-blue card">
    <view class="result-header">
      <view>
        <text class="result-kicker">车贷测算</text>
        <text class="result-title">贷款结果</text>
      </view>
      <text class="result-badge">{{ results.months }}期</text>
    </view>

    <view class="result-hero-block">
      <text class="result-hero-label">每期月供</text>
      <text class="result-hero-value">
        {{ formatCurrency(results.monthlyPayment) }}
        <text class="metric-unit">元</text>
      </text>
    </view>

    <view class="metric-grid">
      <view class="metric-card">
        <text class="metric-label">首付金额</text>
        <text class="metric-value">{{ formatCurrency(results.downPayment) }}<text class="metric-unit">元</text></text>
      </view>

      <view class="metric-card">
        <text class="metric-label">贷款金额</text>
        <text class="metric-value">{{ formatCurrency(results.loanAmount) }}<text class="metric-unit">元</text></text>
      </view>

      <view class="metric-card">
        <text class="metric-label">总利息</text>
        <text class="metric-value">{{ formatCurrency(results.totalInterest) }}<text class="metric-unit">元</text></text>
      </view>

      <view class="metric-card">
        <text class="metric-label">还款总额</text>
        <text class="metric-value">{{ formatCurrency(results.totalPayment) }}<text class="metric-unit">元</text></text>
      </view>

      <view class="metric-card">
        <text class="metric-label">购车总花费</text>
        <text class="metric-value">{{ formatCurrency(results.totalCost) }}<text class="metric-unit">元</text></text>
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

    <button v-if="results.months > 12" class="result-action result-action-blue" @click="emit('view-schedule')">
      查看全部明细
    </button>
  </view>
</template>

<style scoped>
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
