<script setup>
import { ref, onMounted } from 'vue'
import { getCalculatorById } from '../../utils/calculator-config.js'
import { formatValue, saveHistory } from '../../utils/formatter.js'

const calculator = ref(null)
const inputs = ref({})
const results = ref(null)

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const options = currentPage.options
  if (options.id) {
    calculator.value = getCalculatorById(options.id)
    if (calculator.value) {
      uni.setNavigationBarTitle({
        title: calculator.value.name
      })
    }
  }
})

function calculate() {
  if (!calculator.value) return
  const result = calculator.value.calculate(inputs.value)
  if (result) {
    results.value = result
    saveHistory(calculator.value.id, { ...inputs.value }, result)
    uni.vibrateShort()
  } else {
    uni.showToast({ title: '请填写完整信息', icon: 'none' })
  }
}

function reset() {
  inputs.value = {}
  results.value = null
}
</script>

<template>
  <view class="container" v-if="calculator">
    <view class="input-section card">
      <view class="section-title">请输入信息</view>
      
      <view class="input-item" v-for="input in calculator.inputs" :key="input.key">
        <view class="input-label">{{ input.label }}</view>
        <view class="input-wrapper">
          <input 
            class="input-field"
            type="digit"
            :placeholder="input.placeholder"
            v-model="inputs[input.key]"
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
            {{ formatValue(results[output.key], output.format) }}
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

.calc-header { 
  display: flex; 
  align-items: center; 
  padding: 32rpx; 
  margin-bottom: 28rpx;
  background: #FFFFFF;
  border-radius: 24rpx;
  box-shadow: 
    6rpx 6rpx 12rpx rgba(200, 210, 225, 0.6),
    -4rpx -4rpx 10rpx rgba(255, 255, 255, 0.9);
}

.icon-bg {
  width: 90rpx;
  height: 90rpx;
  border-radius: 20rpx;
  background: #F8FAFC;
  box-shadow: 
    3rpx 3rpx 6rpx rgba(200, 210, 225, 0.5),
    -2rpx -2rpx 5rpx rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 28rpx;
}

.calc-icon-large { 
  font-size: 44rpx; 
}

.calc-name-large { 
  display: block; 
  font-size: 32rpx; 
  font-weight: 600; 
  color: #2D3748;
  margin-bottom: 8rpx;
}

.calc-desc-large { 
  display: block; 
  font-size: 24rpx; 
  color: #7B8BA3;
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
  display: flex; 
  align-items: center; 
  margin-bottom: 28rpx;
}

.input-label { 
  width: 200rpx; 
  font-size: 28rpx; 
  color: #4A5568;
}

.input-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  background: #F8FAFC;
  border-radius: 16rpx;
  padding: 0 24rpx;
  height: 88rpx;
  border: 1rpx solid #E8EEF5;
}

.input-field { 
  flex: 1;
  height: 100%;
  font-size: 28rpx;
  color: #2D3748;
  background: transparent;
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

.btn-reset { 
  flex: 1; 
  height: 88rpx; 
  background: #F8FAFC;
  color: #4A5568; 
  border: 1rpx solid #E2E8F0;
  border-radius: 44rpx;
  font-size: 28rpx;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 88rpx;
  padding: 0;
  margin: 0;
  box-shadow: none;
}

.btn-reset::after {
  border: none;
}

.btn-reset:active {
  opacity: 0.8;
}

.btn-calculate { 
  flex: 2; 
  height: 88rpx; 
  background: #6366F1;
  color: #FFFFFF; 
  border: none;
  border-radius: 44rpx; 
  font-size: 30rpx; 
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 88rpx;
  padding: 0;
  margin: 0;
  box-shadow: none;
}

.btn-calculate::after {
  border: none;
}

.btn-calculate:active {
  opacity: 0.9;
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
