<script setup>
import { industries } from '@/utils/calculator-config.js'

function goToIndustryList(industry) {
  uni.navigateTo({
    url: `/pages/industry-list/index?industryId=${industry.id}`
  })
}
</script>

<template>
  <view class="page-container home-page">
    <view class="header-wrapper">
      <view class="header">
        <text class="title">行业计算工具箱</text>
        <text class="subtitle">选择你需要的行业分类，快速进入对应计算器</text>
      </view>
    </view>

    <scroll-view 
      scroll-y 
      class="industry-scroll"
      :show-scrollbar="false"
    >
      <view class="industry-list list-stack">
        <view
          v-for="(item, index) in industries"
          :key="item.id"
          class="industry-card card tap-card"
          :class="{ 'last-card': index === industries.length - 1 }"
          :style="{ borderLeftColor: item.color }"
          @click="goToIndustryList(item)"
        >
          <view class="icon-bg" :style="{ background: item.gradient }">
            <text class="icon">{{ item.icon }}</text>
          </view>
          <view class="info">
            <text class="name">{{ item.name }}</text>
            <text class="desc">{{ item.description }}</text>
          </view>
          <view class="arrow">›</view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<style scoped>
.home-page {
  padding: 0;
  width: 100%;
  height: 100vh;
  box-sizing: content-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.header-wrapper {
  padding: 34rpx 30rpx 0;
  flex-shrink: 0;
  width: 100%;
  box-sizing: border-box;
}

.header {
  margin: 8rpx 0 28rpx;
  padding: 34rpx 30rpx;
  border-radius: 26rpx;
  background: linear-gradient(135deg, #FFFFFF 0%, #EEF2FF 100%);
  border: 1rpx solid #E5EAF2;
  box-shadow: 0 14rpx 34rpx rgba(79, 70, 229, 0.1);
  width: 100%;
  box-sizing: border-box;
}

.title {
  display: block;
  margin-bottom: 10rpx;
  font-size: 42rpx;
  font-weight: 700;
  color: #0F172A;
  line-height: 1.28;
  width: 100%;
  word-wrap: break-word;
}

.subtitle {
  display: block;
  font-size: 26rpx;
  line-height: 1.5;
  color: #64748B;
  width: 100%;
  word-wrap: break-word;
}

.industry-scroll {
  flex: 1;
  width: 100%;
  overflow-y: auto;
  padding: 0 30rpx;
  box-sizing: border-box;
}

.industry-list {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-bottom: 0;
}

.last-card {
  margin-bottom: calc(120rpx + env(safe-area-inset-bottom));
}

.industry-card {
  display: flex;
  align-items: center;
  min-height: 138rpx;
  padding: 26rpx;
  border-left-width: 8rpx;
  border-left-style: solid;
  width: 100%;
  box-sizing: border-box;
}

.icon-bg {
  width: 76rpx;
  height: 76rpx;
  border-radius: 18rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 22rpx;
  flex-shrink: 0;
}

.icon {
  font-size: 36rpx;
}

.info {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
}

.name {
  font-size: 30rpx;
  font-weight: 600;
  color: #0F172A;
  margin-bottom: 6rpx;
  line-height: 1.35;
  width: 100%;
  word-wrap: break-word;
}

.desc {
  font-size: 24rpx;
  line-height: 1.45;
  color: #64748B;
  width: 100%;
  word-wrap: break-word;
}

.arrow {
  margin-left: 16rpx;
  font-size: 36rpx;
  color: #A0AEC0;
  font-weight: 300;
  flex-shrink: 0;
}
</style>
