<script setup>
import { industries } from '@/utils/calculator-config.js'

function goToIndustryList(industry) {
  uni.navigateTo({
    url: `/pages/industry-list/index?industryId=${industry.id}`
  })
}
</script>

<template>
  <view class="page-shell">
    <view class="container header-shell">
      <view class="header">
        <text class="title">行业计算工具箱</text>
        <text class="subtitle">选择你需要的行业分类，快速进入对应计算器</text>
      </view>
    </view>

    <scroll-view class="content-scroll" scroll-y>
      <view class="container content-shell">
        <view class="industry-list list-stack">
          <view
            v-for="item in industries"
            :key="item.id"
            class="industry-card card tap-card"
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
  padding-top: 24rpx;
  padding-bottom: 12rpx;
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
  padding-top: 8rpx;
  padding-bottom: calc(34rpx + env(safe-area-inset-bottom));
}

.header {
  padding: 34rpx 30rpx;
  border-radius: 26rpx;
  background: linear-gradient(135deg, #FFFFFF 0%, #EEF2FF 100%);
  border: 1rpx solid #E5EAF2;
  box-shadow: 0 14rpx 34rpx rgba(79, 70, 229, 0.1);
}

.title {
  display: block;
  margin-bottom: 10rpx;
  font-size: 42rpx;
  font-weight: 700;
  color: #0F172A;
  line-height: 1.28;
}

.subtitle {
  display: block;
  font-size: 26rpx;
  line-height: 1.5;
  color: #64748B;
}

.industry-list {
  display: flex;
  flex-direction: column;
}

.industry-card {
  display: flex;
  align-items: center;
  min-height: 138rpx;
  padding: 26rpx;
  border-left-width: 8rpx;
  border-left-style: solid;
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
}

.desc {
  font-size: 24rpx;
  line-height: 1.45;
  color: #64748B;
}

.arrow {
  margin-left: 16rpx;
  font-size: 36rpx;
  color: #A0AEC0;
  font-weight: 300;
  flex-shrink: 0;
}
</style>
