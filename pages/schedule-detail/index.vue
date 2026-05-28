<script setup>
import { computed, ref, onMounted } from 'vue'
import { getScheduleDetail, formatCurrency } from '../../utils/formatter.js'
import { buildScheduleFileName, buildScheduleXlsx, downloadXlsxFile } from '../../utils/xlsx-export.js'

const detail = ref(null)
const exporting = ref(false)

const calculatorName = computed(() => detail.value?.calculatorName || '还款明细')
const results = computed(() => detail.value?.results || null)
const schedule = computed(() => results.value?.schedule || [])
const resultRenderer = computed(() => detail.value?.resultRenderer || '')
const repaymentModeLabel = computed(() => {
  if (!results.value?.repaymentMode) return ''
  return results.value.repaymentMode === 'equal-principal' ? '等额本金' : '等额本息'
})
const paymentLabel = computed(() => (
  resultRenderer.value === 'credit-card' ? '每期还款' : '月供'
))
const feeLabel = computed(() => (
  resultRenderer.value === 'credit-card' ? '总手续费' : '总利息'
))
const feeValue = computed(() => (
  resultRenderer.value === 'credit-card' ? results.value?.totalFee : results.value?.totalInterest
))
const middleSummaryLabel = computed(() => {
  if (resultRenderer.value === 'credit-card') return '每期手续费'
  if (results.value?.monthlyDecrease !== undefined) return '每月递减'
  return ''
})
const middleSummaryValue = computed(() => {
  if (resultRenderer.value === 'credit-card') return results.value?.monthlyFee
  if (results.value?.monthlyDecrease !== undefined) return results.value?.monthlyDecrease
  return null
})
const detailInterestLabel = computed(() => (
  resultRenderer.value === 'credit-card' ? '手续费' : '利息'
))

onMounted(() => {
  detail.value = getScheduleDetail()

  if (!detail.value?.results?.schedule?.length) {
    uni.showToast({ title: '未找到还款明细', icon: 'none' })
    setTimeout(() => {
      uni.navigateBack()
    }, 500)
    return
  }

  uni.setNavigationBarTitle({
    title: `${detail.value.calculatorName}明细`
  })
})

async function exportSchedule() {
  if (!detail.value || exporting.value) return

  try {
    exporting.value = true
    const fileName = buildScheduleFileName(detail.value.calculatorName)
    const arrayBuffer = buildScheduleXlsx(detail.value)
    await downloadXlsxFile(arrayBuffer, fileName)
    uni.showToast({ title: '导出成功', icon: 'success' })
  } catch (error) {
    console.error('导出 XLSX 失败', error)
    uni.showToast({ title: '当前平台暂不支持导出', icon: 'none' })
  } finally {
    exporting.value = false
  }
}
</script>

<template>
  <view class="container" v-if="results">
    <view class="hero card">
      <view class="hero-header">
        <view>
          <view class="hero-title">{{ calculatorName }}</view>
          <text v-if="repaymentModeLabel" class="hero-subtitle">{{ repaymentModeLabel }}</text>
        </view>
        <view class="hero-badge">{{ results.months }}期</view>
      </view>

      <button class="export-button" :loading="exporting" @click="exportSchedule">
        导出 XLSX
      </button>

      <view class="summary-grid">
        <view class="summary-item">
          <text class="summary-label">{{ paymentLabel }}</text>
          <text class="summary-value">
            {{ formatCurrency(results.firstMonthPayment ?? results.monthlyPayment) }}元
          </text>
        </view>

        <view class="summary-item" v-if="middleSummaryLabel">
          <text class="summary-label">{{ middleSummaryLabel }}</text>
          <text class="summary-value">{{ formatCurrency(middleSummaryValue) }}元</text>
        </view>

        <view class="summary-item">
          <text class="summary-label">{{ feeLabel }}</text>
          <text class="summary-value">{{ formatCurrency(feeValue) }}元</text>
        </view>

        <view class="summary-item">
          <text class="summary-label">还款总额</text>
          <text class="summary-value">{{ formatCurrency(results.totalPayment) }}元</text>
        </view>
      </view>
    </view>

    <view class="table-card card">
      <view class="table-title">完整还款明细</view>

      <view class="table-head">
        <text class="col-period">期数</text>
        <text class="col-amount">{{ paymentLabel }}</text>
        <text class="col-amount">本金</text>
        <text class="col-amount">{{ detailInterestLabel }}</text>
        <text class="col-balance">剩余本金</text>
      </view>

      <view class="table-row" v-for="item in schedule" :key="item.period">
        <text class="col-period">第{{ item.period }}期</text>
        <text class="col-amount">{{ formatCurrency(item.payment) }}</text>
        <text class="col-amount">{{ formatCurrency(item.principal) }}</text>
        <text class="col-amount">{{ formatCurrency(item.interest) }}</text>
        <text class="col-balance">{{ formatCurrency(item.remainingPrincipal) }}</text>
      </view>
    </view>
  </view>
</template>

<style scoped>
.container {
  padding: 30rpx;
}

.hero {
  background: linear-gradient(135deg, #E0F2FE 0%, #ECFCCB 100%);
}

.hero-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20rpx;
  margin-bottom: 28rpx;
}

.hero-title {
  font-size: 34rpx;
  font-weight: 700;
  color: #1E293B;
}

.hero-subtitle {
  display: block;
  margin-top: 10rpx;
  font-size: 24rpx;
  color: #475569;
}

.hero-badge {
  padding: 12rpx 18rpx;
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.82);
  font-size: 24rpx;
  font-weight: 700;
  color: #0F766E;
}

.export-button {
  margin-bottom: 24rpx;
  height: 80rpx;
  line-height: 80rpx;
  border-radius: 40rpx;
  background: #0F766E;
  color: #FFFFFF;
  font-size: 26rpx;
  font-weight: 600;
}

.export-button::after {
  border: none;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18rpx;
}

.summary-item {
  padding: 22rpx;
  border-radius: 20rpx;
  background: rgba(255, 255, 255, 0.8);
}

.summary-label {
  display: block;
  margin-bottom: 8rpx;
  font-size: 22rpx;
  color: #64748B;
}

.summary-value {
  font-size: 28rpx;
  font-weight: 700;
  color: #0F172A;
}

.table-card {
  padding: 0;
  overflow: hidden;
}

.table-title {
  padding: 28rpx 28rpx 20rpx;
  font-size: 28rpx;
  font-weight: 600;
  color: #334155;
}

.table-head,
.table-row {
  display: flex;
  align-items: center;
  padding: 22rpx 20rpx;
}

.table-head {
  background: #F8FAFC;
  border-top: 1rpx solid #E2E8F0;
  border-bottom: 1rpx solid #E2E8F0;
}

.table-row {
  background: #FFFFFF;
  border-bottom: 1rpx solid #EDF2F7;
}

.table-row:last-child {
  border-bottom: none;
}

.col-period,
.col-amount,
.col-balance {
  font-size: 22rpx;
  color: #334155;
}

.col-period {
  width: 18%;
}

.col-amount {
  width: 20%;
  text-align: right;
}

.col-balance {
  width: 22%;
  text-align: right;
}
</style>
