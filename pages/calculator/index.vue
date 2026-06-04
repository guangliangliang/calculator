<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getCalculatorById } from '@/utils/calculator-config.js'
import { saveHistory, saveScheduleDetail } from '@/utils/formatter.js'
import {
  buildCalculationPayload,
  getInputErrorMessage,
  getInitialInputs,
  getSelectLabel,
  validateCalculatorInputs
} from '@/utils/calculator-form.js'
import DefaultResultPanel from '@/pages/calculator/components/DefaultResultPanel.vue'
import MortgageResultPanel from '@/pages/calculator/components/MortgageResultPanel.vue'
import CarLoanResultPanel from '@/pages/calculator/components/CarLoanResultPanel.vue'
import CreditCardResultPanel from '@/pages/calculator/components/CreditCardResultPanel.vue'
import TaxResultPanel from '@/pages/calculator/components/TaxResultPanel.vue'
import RenovationBudgetResultPanel from '@/pages/calculator/components/RenovationBudgetResultPanel.vue'
import EoqResultPanel from '@/pages/calculator/components/EoqResultPanel.vue'

const calculator = ref(null)
const inputs = ref({})
const results = ref(null)
const fieldErrors = ref({})

onLoad((options) => {
  if (!options.id) return

  calculator.value = getCalculatorById(options.id)
  if (!calculator.value) return

  inputs.value = getInitialInputs(calculator.value)
  uni.setNavigationBarTitle({
    title: calculator.value.name
  })
})

function updateInputValue(key, value) {
  inputs.value = {
    ...inputs.value,
    [key]: value
  }

  clearFieldError(key)
  validateSingleField(key)
}

function handleSelectChange(event, input) {
  const selectedIndex = Number(event.detail.value)
  const selectedOption = input.options?.[selectedIndex]
  if (!selectedOption) return
  updateInputValue(input.key, selectedOption.value)
}

function getSelectDisplay(input) {
  return getSelectLabel(input, inputs.value[input.key]) || input.placeholder || `请选择${input.label}`
}

function clearFieldError(key) {
  if (!fieldErrors.value[key]) return

  const nextErrors = { ...fieldErrors.value }
  delete nextErrors[key]
  fieldErrors.value = nextErrors
}

function validateSingleField(key) {
  if (!calculator.value) return

  const input = calculator.value.inputs.find(item => item.key === key)
  if (!input) return

  const payload = buildCalculationPayload(calculator.value, inputs.value)
  const errorMessage = getInputErrorMessage(input, payload[key])

  if (!errorMessage) return

  fieldErrors.value = {
    ...fieldErrors.value,
    [key]: errorMessage
  }
}

function hasFieldError(key) {
  return Boolean(fieldErrors.value[key])
}

function calculate() {
  if (!calculator.value) return

  const payload = buildCalculationPayload(calculator.value, inputs.value)
  const errors = validateCalculatorInputs(calculator.value, payload)

  fieldErrors.value = errors

  if (Object.keys(errors).length > 0) {
    return
  }

  const result = calculator.value.calculate(payload)
  if (!result) {
    uni.showToast({ title: '暂时无法完成计算，请检查输入', icon: 'none' })
    return
  }

  results.value = result
  saveHistory(calculator.value.id, payload, result)
  uni.vibrateShort()
}

function reset() {
  inputs.value = getInitialInputs(calculator.value)
  results.value = null
  fieldErrors.value = {}
}

function openScheduleDetail() {
  if (!calculator.value || !results.value?.schedule?.length) return

  const payload = buildCalculationPayload(calculator.value, inputs.value)
  const scheduleDetail = {
    calculatorId: calculator.value.id,
    calculatorName: calculator.value.name,
    resultRenderer: calculator.value.resultRenderer || '',
    inputs: payload,
    results: results.value
  }

  saveScheduleDetail(scheduleDetail)

  uni.navigateTo({
    url: `/pages/schedule-detail/index?calculatorId=${calculator.value.id}`
    ,
    success: (res) => {
      res.eventChannel?.emit?.('scheduleDetail', scheduleDetail)
    }
  })
}
</script>

<template>
  <view class="page-container calculator-page" v-if="calculator">
    <view class="calculator-hero card">
      <view class="calculator-icon-wrap">
        <text class="calculator-icon">{{ calculator.icon }}</text>
      </view>
      <view class="calculator-meta">
        <text class="calculator-title">{{ calculator.name }}</text>
        <text class="calculator-desc">{{ calculator.description }}</text>
      </view>
    </view>

    <view class="input-section card">
      <view class="section-title">请输入信息</view>

      <view class="input-item" v-for="input in calculator.inputs" :key="input.key">
        <view class="input-label">
          <text v-if="input.required !== false" class="required-mark">*</text>
          {{ input.label }}
          <text v-if="input.required === false" class="optional-tag">选填</text>
        </view>

        <view class="input-wrapper" :class="{ 'input-wrapper-error': hasFieldError(input.key) }" v-if="input.type === 'select'">
          <picker
            mode="selector"
            :range="input.options.map(option => option.label)"
            @change="event => handleSelectChange(event, input)"
          >
            <view class="picker-value" :class="{ 'placeholder-text': !inputs[input.key] }">
              {{ getSelectDisplay(input) }}
            </view>
          </picker>
        </view>

        <view class="input-wrapper" :class="{ 'input-wrapper-error': hasFieldError(input.key) }" v-else>
          <input
            class="input-field"
            type="digit"
            :placeholder="input.placeholder"
            :value="inputs[input.key]"
            @input="event => updateInputValue(input.key, event.detail.value)"
          />
          <text v-if="input.unit" class="input-unit">{{ input.unit }}</text>
        </view>

        <text v-if="fieldErrors[input.key]" class="error-text">{{ fieldErrors[input.key] }}</text>
      </view>

      <view class="button-group">
        <button class="btn-reset" @click="reset">重置</button>
        <button class="btn-calculate" @click="calculate">计算</button>
      </view>
    </view>

    <block v-if="results">
      <MortgageResultPanel
        v-if="calculator.resultRenderer === 'mortgage'"
        :results="results"
        @view-schedule="openScheduleDetail"
      />
      <CarLoanResultPanel
        v-else-if="calculator.resultRenderer === 'car-loan'"
        :results="results"
        @view-schedule="openScheduleDetail"
      />
      <CreditCardResultPanel
        v-else-if="calculator.resultRenderer === 'credit-card'"
        :results="results"
        @view-schedule="openScheduleDetail"
      />
      <TaxResultPanel
        v-else-if="calculator.resultRenderer === 'tax'"
        :results="results"
      />
      <RenovationBudgetResultPanel
        v-else-if="calculator.resultRenderer === 'renovation-budget'"
        :results="results"
      />
      <EoqResultPanel
        v-else-if="calculator.resultRenderer === 'eoq'"
        :results="results"
      />
      <DefaultResultPanel
        v-else
        :calculator="calculator"
        :results="results"
      />
    </block>
  </view>
</template>

<style scoped>
.calculator-page {
  padding-top: 24rpx;
}

.calculator-hero {
  display: flex;
  align-items: center;
  gap: 22rpx;
  margin-bottom: 22rpx;
  padding: 26rpx;
  background: linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%);
}

.calculator-icon-wrap {
  width: 78rpx;
  height: 78rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #EEF2FF;
  border: 1rpx solid #E0E7FF;
}

.calculator-icon {
  font-size: 38rpx;
}

.calculator-meta {
  flex: 1;
  min-width: 0;
}

.calculator-title {
  display: block;
  font-size: 32rpx;
  font-weight: 700;
  color: #0F172A;
  line-height: 1.32;
}

.calculator-desc {
  display: block;
  margin-top: 8rpx;
  font-size: 24rpx;
  line-height: 1.45;
  color: #64748B;
}

.input-section {
  padding: 28rpx;
  margin-bottom: 24rpx;
  background: #FFFFFF;
}

.section-title {
  padding-left: 16rpx;
  border-left: 8rpx solid #6366F1;
  font-size: 28rpx;
  font-weight: 600;
  color: #0F172A;
  margin-bottom: 22rpx;
}

.input-item {
  margin-bottom: 22rpx;
}

.input-label {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 12rpx;
  font-size: 26rpx;
  color: #475569;
}

.required-mark {
  color: #EF4444;
  font-size: 30rpx;
  font-weight: 700;
}

.optional-tag {
  font-size: 22rpx;
  color: #94A3B8;
}

.input-wrapper {
  display: flex;
  align-items: center;
  background: #F9FBFF;
  border-radius: 14rpx;
  padding: 0 22rpx;
  min-height: 82rpx;
  border: 1rpx solid #E2E8F0;
}

.input-wrapper-error {
  border-color: #FCA5A5;
  background: #FEF2F2;
}

.input-field,
.picker-value {
  flex: 1;
  min-height: 82rpx;
  font-size: 27rpx;
  color: #2D3748;
  display: flex;
  align-items: center;
}

.placeholder-text {
  color: #94A3B8;
}

.input-unit {
  font-size: 24rpx;
  color: #7B8BA3;
  margin-left: 12rpx;
}

.error-text {
  display: block;
  margin-top: 10rpx;
  font-size: 24rpx;
  color: #DC2626;
  line-height: 1.4;
}

.button-group {
  display: flex;
  gap: 18rpx;
  margin-top: 18rpx;
}

.btn-reset,
.btn-calculate {
  height: 84rpx;
  border-radius: 42rpx;
  font-size: 28rpx;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 84rpx;
  padding: 0;
  margin: 0;
  box-shadow: none;
}

.btn-reset {
  flex: 1;
  background: #F8FAFC;
  color: #4A5568;
  border: 1rpx solid #E2E8F0;
}

.btn-calculate {
  flex: 2;
  background: linear-gradient(135deg, #6366F1 0%, #4F46E5 100%);
  color: #FFFFFF;
  border: none;
  box-shadow: 0 10rpx 18rpx rgba(79, 70, 229, 0.18);
}

.btn-reset::after,
.btn-calculate::after {
  border: none;
}

</style>
