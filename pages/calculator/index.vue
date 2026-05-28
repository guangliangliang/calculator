<script setup>
import { ref, onMounted } from 'vue'
import { getCalculatorById } from '../../utils/calculator-config.js'
import { formatValue, saveHistory } from '../../utils/formatter.js'
import {
  buildCalculationPayload,
  getInitialInputs,
  getSelectLabel,
  validateCalculatorInputs
} from '../../utils/calculator-form.js'

const calculator = ref(null)
const inputs = ref({})
const results = ref(null)

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const options = currentPage.options

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

function calculate() {
  if (!calculator.value) return

  const payload = buildCalculationPayload(calculator.value, inputs.value)
  const errorMessage = validateCalculatorInputs(calculator.value, payload)

  if (errorMessage) {
    uni.showToast({ title: errorMessage, icon: 'none' })
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
}
</script>

<template>
  <view class="container" v-if="calculator">
    <view class="input-section card">
      <view class="section-title">请输入信息</view>

      <view class="input-item" v-for="input in calculator.inputs" :key="input.key">
        <view class="input-label">
          {{ input.label }}
          <text v-if="input.required === false" class="optional-tag">选填</text>
        </view>

        <view class="input-wrapper" v-if="input.type === 'select'">
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

        <view class="input-wrapper" v-else>
          <input
            class="input-field"
            type="digit"
            :placeholder="input.placeholder"
            :value="inputs[input.key]"
            @input="event => updateInputValue(input.key, event.detail.value)"
          />
          <text v-if="input.unit" class="input-unit">{{ input.unit }}</text>
        </view>
      </view>

      <view class="button-group">
        <button class="btn-reset" @click="reset">重置</button>
        <button class="btn-calculate" @click="calculate">计算</button>
      </view>
    </view>

    <view class="result-section card" v-if="results">
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

.result-section {
  padding: 32rpx;
  margin-bottom: 28rpx;
  background: #F0FDF4;
  border-radius: 24rpx;
  border: 2rpx solid #D1FAE5;
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
