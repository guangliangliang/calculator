<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getCalculatorsByIndustry, industries } from '@/utils/calculator-config.js'

const industryInfo = ref(null)
const calculatorList = ref([])

onLoad((options) => {
  if (!options.industryId) return

  industryInfo.value = industries.find(item => item.id === options.industryId) || null
  calculatorList.value = getCalculatorsByIndustry(options.industryId)

  if (industryInfo.value) {
    uni.setNavigationBarTitle({
      title: industryInfo.value.name
    })
  }
})

function goToCalculator(calculator) {
  uni.navigateTo({
    url: `/pages/calculator/index?id=${calculator.id}`
  })
}
</script>

<template>
  <view class="page-shell">
    <view class="container header-shell">
      <view v-if="industryInfo" class="header-card" :style="{ background: industryInfo.gradient }">
        <view class="header-icon">{{ industryInfo.icon }}</view>
        <view class="header-content">
          <text class="header-title">{{ industryInfo.name }}</text>
          <text class="header-desc">{{ industryInfo.description }}</text>
        </view>
      </view>
    </view>

    <scroll-view class="content-scroll" scroll-y>
      <view class="container content-shell">
        <view class="calculator-grid">
          <view
            v-for="calculator in calculatorList"
            :key="calculator.id"
            class="calculator-item card"
            hover-class="calculator-item-hover"
            @click="goToCalculator(calculator)"
          >
            <view class="calc-icon-bg">
              <text class="calc-icon">{{ calculator.icon }}</text>
            </view>
            <view class="calc-info">
              <text class="calc-name">{{ calculator.name }}</text>
              <text class="calc-desc">{{ calculator.description }}</text>
            </view>
            <view class="calc-arrow">›</view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<style scoped>
.page-shell {
  height: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.container {
  padding-left: 30rpx;
  padding-right: 30rpx;
}

.header-shell {
  flex: 0 0 auto;
  padding-top: 30rpx;
  padding-bottom: 20rpx;
  background: #F8FAFC;
  position: relative;
  z-index: 2;
}

.content-scroll {
  flex: 1;
  height: 0;
}

page {
  height: 100%;
  overflow: hidden;
}

.content-shell {
  padding-top: 12rpx;
  padding-bottom: 30rpx;
}

.header-card {
  display: flex;
  align-items: center;
  padding: 32rpx;
  border-radius: 28rpx;
  margin-bottom: 32rpx;
  color: #FFFFFF;
}

.header-icon {
  width: 88rpx;
  height: 88rpx;
  margin-right: 24rpx;
  border-radius: 20rpx;
  background: rgba(255, 255, 255, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 42rpx;
}

.header-content {
  flex: 1;
}

.header-title {
  display: block;
  font-size: 34rpx;
  font-weight: 700;
  margin-bottom: 8rpx;
}

.header-desc {
  display: block;
  font-size: 24rpx;
  line-height: 1.5;
  opacity: 0.92;
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
  background: #FFFFFF;
  box-shadow:
    0 2rpx 12rpx rgba(0, 0, 0, 0.06),
    0 1rpx 3rpx rgba(0, 0, 0, 0.04);
}

.calculator-item-hover,
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
  color: #1E293B;
  margin-bottom: 6rpx;
}

.calc-desc {
  font-size: 24rpx;
  line-height: 1.5;
  color: #64748B;
}

.calc-arrow {
  font-size: 40rpx;
  color: #A0AEC0;
  font-weight: 300;
}
</style>
