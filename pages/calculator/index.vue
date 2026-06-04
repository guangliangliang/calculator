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
  <view class="container" v-if="calculator">
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
.container {
  padding: 30rpx;
}

.input-section {
  padding: 32rpx;
  margin-bottom: 28rpx;
  background: #FFFFFF;
  border-radius: 24rpx;
  box-shadow:
    0 2rpx 12rpx rgba(0, 0, 0, 0.06),
    0 1rpx 3rpx rgba(0, 0, 0, 0.04);
}

.section-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #4A5568;
  margin-bottom: 28rpx;
}

.input-item {
  margin-bottom: 28rpx;
}

.input-label {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 14rpx;
  font-size: 28rpx;
  color: #4A5568;
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
  background: #F8FAFC;
  border-radius: 16rpx;
  padding: 0 24rpx;
  min-height: 88rpx;
  border: 1rpx solid #E8EEF5;
}

.input-wrapper-error {
  border-color: #FCA5A5;
  background: #FEF2F2;
}

.input-field,
.picker-value {
  flex: 1;
  min-height: 88rpx;
  font-size: 28rpx;
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
  gap: 20rpx;
  margin-top: 20rpx;
}

.btn-reset,
.btn-calculate {
  height: 88rpx;
  border-radius: 44rpx;
  font-size: 28rpx;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 88rpx;
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
  background: #6366F1;
  color: #FFFFFF;
  border: none;
}

.btn-reset::after,
.btn-calculate::after {
  border: none;
}

</style>
