<script setup>
import { ref, onMounted } from 'vue'
import { getCalculatorsByIndustry, industries } from '../../utils/calculator-config.js'

const industryId = ref('')
const industryInfo = ref(null)
const calculatorList = ref([])

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const options = currentPage.options
  if (options.industryId) {
    industryId.value = options.industryId
    industryInfo.value = industries.find(i => i.id === options.industryId)
    calculatorList.value = getCalculatorsByIndustry(options.industryId)
    
    if (industryInfo.value) {
      uni.setNavigationBarTitle({
        title: industryInfo.value.name
      })
    }
  }
})

function goToCalculator(calc) {
  uni.navigateTo({
    url: `/pages/calculator/index?id=${calc.id}`
  })
}
</script>

<template>
  <view class="container">
    <view class="header-card" v-if="industryInfo">
      <view class="icon-bg">
        <text class="header-icon">{{ industryInfo.icon }}</text>
      </view>
      <view class="header-content">
        <text class="header-title">{{ industryInfo.name }}</text>
        <text class="header-desc">{{ industryInfo.description }}</text>
      </view>
    </view>

    <view class="calculator-grid">
      <view 
        v-for="calc in calculatorList" 
        :key="calc.id" 
        class="calculator-item card"
        @click="goToCalculator(calc)"
      >
        <view class="calc-icon-bg">
          <text class="calc-icon">{{ calc.icon }}</text>
        </view>
        <view class="calc-info">
          <text class="calc-name">{{ calc.name }}</text>
          <text class="calc-desc">{{ calc.description }}</text>
        </view>
        <view class="calc-arrow">›</view>
      </view>
    </view>
  </view>
</template>

<style scoped>
.container {
  padding: 30rpx;
}

.header-card {
  display: flex;
  align-items: center;
  padding: 36rpx;
  border-radius: 28rpx;
  margin-bottom: 36rpx;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10rpx);
  -webkit-backdrop-filter: blur(10rpx);
  border: 1rpx solid rgba(255, 255, 255, 0.8);
  box-shadow: 
    8rpx 8rpx 16rpx rgba(190, 200, 215, 0.5),
    -8rpx -8rpx 16rpx rgba(255, 255, 255, 0.9);
}

.icon-bg {
  width: 100rpx;
  height: 100rpx;
  border-radius: 24rpx;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 
    4rpx 4rpx 8rpx rgba(190, 200, 215, 0.5),
    -4rpx -4rpx 8rpx rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 28rpx;
}

.header-icon {
  font-size: 48rpx;
}

.header-content {
  flex: 1;
}

.header-title {
  display: block;
  font-size: 32rpx;
  font-weight: 600;
  color: #2D3748;
  margin-bottom: 6rpx;
}

.header-desc {
  display: block;
  font-size: 24rpx;
  color: #7B8BA3;
}

.calculator-grid {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.calculator-item {
  display: flex;
  align-items: center;
  padding: 28rpx;
  border-radius: 24rpx;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10rpx);
  -webkit-backdrop-filter: blur(10rpx);
  border: 1rpx solid rgba(255, 255, 255, 0.8);
  box-shadow: 
    6rpx 6rpx 12rpx rgba(190, 200, 215, 0.5),
    -6rpx -6rpx 12rpx rgba(255, 255, 255, 0.9);
  transition: all 0.2s;
}

.calculator-item:active {
  box-shadow: 
    inset 3rpx 3rpx 6rpx rgba(190, 200, 215, 0.7),
    inset -3rpx -3rpx 6rpx rgba(255, 255, 255, 0.9);
}

.calc-icon-bg {
  width: 80rpx;
  height: 80rpx;
  border-radius: 20rpx;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 
    3rpx 3rpx 6rpx rgba(190, 200, 215, 0.5),
    -3rpx -3rpx 6rpx rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24rpx;
}

.calc-icon {
  font-size: 36rpx;
}

.calc-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.calc-name {
  font-size: 30rpx;
  font-weight: 600;
  color: #2D3748;
  margin-bottom: 6rpx;
}

.calc-desc {
  font-size: 24rpx;
  color: #7B8BA3;
}

.calc-arrow {
  font-size: 40rpx;
  color: #A0AEC0;
  font-weight: 300;
}
</style>
