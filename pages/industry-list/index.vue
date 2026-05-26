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
    <view class="calculator-grid">
      <view 
        v-for="calc in calculatorList" 
        :key="calc.id" 
        class="calculator-item card"
        hover-class="calculator-item-hover"
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
  padding: 32rpx;
  border-radius: 24rpx;
  margin-bottom: 32rpx;
  background: #FFFFFF;
  box-shadow: 
    6rpx 6rpx 12rpx rgba(200, 210, 225, 0.6),
    -4rpx -4rpx 10rpx rgba(255, 255, 255, 0.9);
}

.header-icon {
  font-size: 44rpx;
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



.calculator-grid {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  padding-bottom: 30rpx;
}

.calculator-item {
  display: flex;
  align-items: center;
  padding: 28rpx;
  border-radius: 24rpx;
  background: #FFFFFF;
  box-shadow: 
    0 2rpx 12rpx rgba(0, 0, 0, 0.06),
    0 1rpx 3rpx rgba(0, 0, 0, 0.04);
  transition: all 0.15s;
  cursor: pointer;
}

.calculator-item-hover {
  transform: scale(0.98);
  opacity: 0.95;
}

.calculator-item:active {
  transform: scale(0.98);
  opacity: 0.95;
}

.calc-icon-bg {
  width: 80rpx;
  height: 80rpx;
  border-radius: 18rpx;
  background: #F8FAFC;
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
