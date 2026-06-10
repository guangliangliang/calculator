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
        <view class="header-icon icon-tile">{{ industryInfo.icon }}</view>
        <view class="header-content">
          <text class="header-title">{{ industryInfo.name }}</text>
          <text class="header-desc">{{ industryInfo.description }}</text>
        </view>
      </view>
    </view>

    <scroll-view class="content-scroll" scroll-y enhanced show-scrollbar="{{false}}">
      <view class="container content-shell">
        <view v-if="!calculatorList.length" class="empty-state">
          <text class="empty-text">暂无计算器</text>
        </view>

        <view v-else class="calculator-grid list-stack">
          <view
            v-for="calculator in calculatorList"
            :key="calculator.id"
            class="calculator-item card tap-card"
            :style="{ borderLeftColor: industryInfo && industryInfo.color ? industryInfo.color : '#6366F1' }"
            hover-class="tap-card-hover"
            @click="goToCalculator(calculator)"
          >
            <view class="calc-icon-bg">
              <text class="calc-icon">{{ calculator.icon }}</text>
            </view>
            <view class="calc-info">
              <text class="calc-name">{{ calculator.name }}</text>
              <text class="calc-desc">{{ calculator.description }}</text>
            </view>
            <text class="calc-arrow">＞</text>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<style>
page {
  height: 100%;
  overflow: hidden;
}
</style>

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
  padding-top: 24rpx;
  padding-bottom: 12rpx;
  background: linear-gradient(180deg, #F6F8FB 0%, #F6F8FB 100%);
  position: relative;
  z-index: 2;
}

.content-scroll {
  flex: 1;
  height: 0;
  overflow-y: auto;
}

.content-shell {
  padding-top: 8rpx;
  padding-bottom: calc(34rpx + env(safe-area-inset-bottom));
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 200rpx 0;
}

.empty-text {
  font-size: 26rpx;
  color: #94A3B8;
}

.header-card {
  display: flex;
  align-items: center;
  padding: 28rpx;
  border-radius: 22rpx;
  margin-bottom: 18rpx;
  color: #FFFFFF;
  box-shadow: 0 14rpx 30rpx rgba(15, 23, 42, 0.12);
}

.header-icon {
  width: 76rpx;
  height: 76rpx;
  margin-right: 22rpx;
  background: rgba(255, 255, 255, 0.18);
  font-size: 36rpx;
}

.header-content {
  flex: 1;
}

.header-title {
  display: block;
  font-size: 32rpx;
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
}

.calculator-item {
  display: flex;
  align-items: center;
  min-height: 126rpx;
  padding: 24rpx;
  border-left-width: 8rpx;
  border-left-style: solid;
}

.calc-icon-bg {
  width: 70rpx;
  height: 70rpx;
  border-radius: 18rpx;
  background: #F8FAFC;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
}

.calc-icon {
  font-size: 32rpx;
}

.calc-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.calc-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #0F172A;
  margin-bottom: 6rpx;
}

.calc-desc {
  font-size: 24rpx;
  line-height: 1.5;
  color: #64748B;
}

.calc-arrow {
  margin-left: 14rpx;
  font-size: 30rpx;
  color: #A0AEC0;
  font-weight: 400;
}

.tap-card-hover {
  opacity: 0.85;
  transform: scale(0.985);
}
</style>
