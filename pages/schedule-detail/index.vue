<script setup>
import { computed, getCurrentInstance, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getScheduleDetail, formatCurrency } from '@/utils/formatter.js'
import { getCalculatorById } from '@/utils/calculator-config.js'
import { buildScheduleFileName, buildScheduleXlsx, downloadXlsxFile } from '@/utils/xlsx-export.js'

const detail = ref(null)
const exporting = ref(false)
const loading = ref(true)
const pageInstance = getCurrentInstance()

const BATCH_SIZE = 50
const displayedCount = ref(BATCH_SIZE)

const calculatorName = computed(() => detail.value?.calculatorName || '还款明细')
const results = computed(() => detail.value?.results || null)
const schedule = computed(() => results.value?.schedule || [])
const displayedSchedule = computed(() => schedule.value.slice(0, displayedCount.value))
const hasMore = computed(() => displayedCount.value < schedule.value.length)
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

function loadMore() {
  if (!hasMore.value) return
  displayedCount.value = Math.min(displayedCount.value + BATCH_SIZE, schedule.value.length)
}

function buildDetailFromSource(source) {
  if (!source?.calculatorId) return source || null

  const calculator = getCalculatorById(source.calculatorId)
  if (!calculator) return source || null

  if (source.inputs) {
    const recalculatedResults = calculator.calculate(source.inputs)
    if (recalculatedResults?.schedule?.length) {
      return {
        calculatorId: calculator.id,
        calculatorName: source.calculatorName || calculator.name,
        resultRenderer: source.resultRenderer || calculator.resultRenderer || '',
        inputs: source.inputs,
        results: recalculatedResults
      }
    }
  }

  return source || null
}

function applyDetail(nextDetail) {
  detail.value = buildDetailFromSource(nextDetail)
  loading.value = false
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
}

function getPageEventChannel() {
  const proxy = pageInstance?.proxy
  if (typeof proxy?.getOpenerEventChannel === 'function') {
    return proxy.getOpenerEventChannel()
  }

  if (typeof getCurrentPages === 'function') {
    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 1]
    if (typeof currentPage?.getOpenerEventChannel === 'function') {
      return currentPage.getOpenerEventChannel()
    }
  }

  return null
}

onLoad(() => {
  const eventChannel = getPageEventChannel()
  let resolved = false

  if (eventChannel?.on) {
    eventChannel.on('scheduleDetail', (payload) => {
      resolved = true
      applyDetail(payload)
    })
  }

  setTimeout(() => {
    if (resolved || detail.value) return
    applyDetail(getScheduleDetail())
  }, 0)
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

function goBack() {
  uni.navigateBack()
}
</script>

<template>
  <view class="page-container schedule-page">
    <view v-if="loading" class="loading-state">
      <text class="loading-text">加载中...</text>
    </view>

    <view v-else-if="!results" class="empty-state">
      <text class="empty-icon">📋</text>
      <text class="empty-text">暂无还款明细数据</text>
      <button class="empty-back-btn" @click="goBack">返回上一页</button>
    </view>

    <view v-else>
      <view class="hero card">
        <view class="hero-header">
          <view>
            <view class="hero-title">{{ calculatorName }}</view>
            <text v-if="repaymentModeLabel" class="hero-subtitle">{{ repaymentModeLabel }}</text>
          </view>
          <view class="hero-badge">{{ results.months }}期</view>
        </view>

        <view class="hero-actions">
          <button class="back-button" @click="goBack">修改参数</button>
          <button class="export-button" :loading="exporting" @click="exportSchedule">
            导出 XLSX
          </button>
        </view>

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

        <scroll-view
          class="table-scroll"
          scroll-y
          @scrolltolower="loadMore"
        >
          <view class="table-head">
            <text class="col-period">期数</text>
            <text class="col-amount">{{ paymentLabel }}</text>
            <text class="col-amount">本金</text>
            <text class="col-amount">{{ detailInterestLabel }}</text>
            <text class="col-balance">剩余本金</text>
          </view>

          <view class="table-row" v-for="item in displayedSchedule" :key="item.period">
            <text class="col-period">第{{ item.period }}期</text>
            <text class="col-amount">{{ formatCurrency(item.payment) }}</text>
            <text class="col-amount">{{ formatCurrency(item.principal) }}</text>
            <text class="col-amount">{{ formatCurrency(item.interest) }}</text>
            <text class="col-balance">{{ formatCurrency(item.remainingPrincipal) }}</text>
          </view>

          <view v-if="hasMore" class="load-more">
            <text class="load-more-text">已显示 {{ displayedSchedule.length }} / {{ schedule.length }} 期，下拉加载更多</text>
          </view>

          <view v-else class="load-more">
            <text class="load-more-text">共 {{ schedule.length }} 期，已全部显示</text>
          </view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<style scoped>
.schedule-page {
  padding-top: 24rpx;
}

.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 200rpx 0;
}

.loading-text {
  font-size: 28rpx;
  color: #94A3B8;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 200rpx 0;
}

.empty-icon {
  font-size: 80rpx;
  margin-bottom: 24rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #94A3B8;
  margin-bottom: 40rpx;
}

.empty-back-btn {
  width: 280rpx;
  height: 76rpx;
  line-height: 76rpx;
  border-radius: 38rpx;
  background: #6366F1;
  color: #FFFFFF;
  font-size: 26rpx;
  font-weight: 600;
  border: none;
}

.empty-back-btn::after {
  border: none;
}

.hero {
  background: linear-gradient(135deg, #E0F2FE 0%, #ECFCCB 100%);
}

.hero-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18rpx;
  margin-bottom: 22rpx;
}

.hero-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #1E293B;
}

.hero-subtitle {
  display: block;
  margin-top: 8rpx;
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

.hero-actions {
  display: flex;
  gap: 18rpx;
  margin-bottom: 22rpx;
}

.back-button {
  flex: 1;
  height: 76rpx;
  line-height: 76rpx;
  border-radius: 38rpx;
  background: rgba(15, 118, 110, 0.12);
  color: #0F766E;
  font-size: 26rpx;
  font-weight: 600;
  border: none;
}

.back-button::after {
  border: none;
}

.export-button {
  flex: 1;
  height: 76rpx;
  line-height: 76rpx;
  border-radius: 38rpx;
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
  gap: 16rpx;
}

.summary-item {
  padding: 20rpx;
  border-radius: 18rpx;
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
  padding: 24rpx 24rpx 18rpx;
  font-size: 28rpx;
  font-weight: 600;
  color: #334155;
}

.table-scroll {
  max-height: 1200rpx;
}

.table-head,
.table-row {
  display: flex;
  align-items: center;
  padding: 20rpx 18rpx;
}

.table-head {
  background: #F8FAFC;
  border-top: 1rpx solid #E2E8F0;
  border-bottom: 1rpx solid #E2E8F0;
  position: sticky;
  top: 0;
  z-index: 1;
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

.load-more {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24rpx 0;
}

.load-more-text {
  font-size: 22rpx;
  color: #94A3B8;
}
</style>
