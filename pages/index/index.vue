<script setup>
import { ref, computed } from 'vue'
import { industries, calculatorConfigs } from '@/utils/calculator-config.js'

const searchKeyword = ref('')

const searchResults = computed(() => {
  const keyword = searchKeyword.value.trim()
  if (!keyword) return []

  const lower = keyword.toLowerCase()
  return calculatorConfigs.filter(calc =>
    calc.name.toLowerCase().includes(lower) ||
    calc.description?.toLowerCase().includes(lower)
  ).slice(0, 10)
})

const isSearching = computed(() => searchKeyword.value.trim().length > 0)

function goToIndustryList(industry) {
  uni.navigateTo({
    url: `/pages/industry-list/index?industryId=${industry.id}`
  })
}

function goToCalculator(calculator) {
  searchKeyword.value = ''
  uni.navigateTo({
    url: `/pages/calculator/index?id=${calculator.id}`
  })
}

function clearSearch() {
  searchKeyword.value = ''
}

function getIndustryName(industryId) {
  const industry = industries.find(item => item.id === industryId)
  return industry ? industry.name : ''
}

function getIndustryColor(industryId) {
  const industry = industries.find(item => item.id === industryId)
  return industry ? industry.color : '#6366F1'
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

    <view class="container search-shell">
      <view class="search-bar">
        <text class="search-icon">🔍</text>
        <input
          class="search-input"
          type="text"
          placeholder="搜索计算器..."
          :value="searchKeyword"
          @input="event => searchKeyword = event.detail.value"
          confirm-type="search"
        />
        <view v-if="isSearching" class="search-clear" @click="clearSearch">
          <text class="clear-icon">✕</text>
        </view>
      </view>
    </view>

    <scroll-view class="content-scroll" scroll-y enhanced show-scrollbar="{{false}}">
      <view class="container content-shell">
        <view v-if="isSearching" class="search-results list-stack">
          <view v-if="searchResults.length === 0" class="empty-state">
            <text class="empty-text">未找到匹配的计算器</text>
          </view>
          <view
            v-for="calc in searchResults"
            :key="calc.id"
            class="search-result-item card tap-card"
            :style="{ borderLeftColor: getIndustryColor(calc.industry) }"
            @click="goToCalculator(calc)"
          >
            <view class="calc-icon-bg">
              <text class="calc-icon">{{ calc.icon }}</text>
            </view>
            <view class="calc-info">
              <text class="calc-name">{{ calc.name }}</text>
              <text class="calc-desc">{{ getIndustryName(calc.industry) }} · {{ calc.description }}</text>
            </view>
            <text class="calc-arrow">＞</text>
          </view>
        </view>

        <view v-else class="industry-list list-stack">
          <view
            v-for="item in industries"
            :key="item.id"
            class="industry-card card tap-card"
            :style="{ borderLeftColor: item.color }"
            hover-class="tap-card-hover"
            @click="goToIndustryList(item)"
          >
            <view class="icon-bg" :style="{ background: item.gradient }">
              <text class="icon">{{ item.icon }}</text>
            </view>
            <view class="info">
              <text class="name">{{ item.name }}</text>
              <text class="desc">{{ item.description }}</text>
            </view>
            <text class="arrow">＞</text>
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
  width: 100%;
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
  flex-shrink: 0;
  background: linear-gradient(180deg, #F8FAFC 0%, #EEF2F7 100%);
}

.search-shell {
  flex: 0 0 auto;
  padding-bottom: 16rpx;
  flex-shrink: 0;
  background: linear-gradient(180deg, #EEF2F7 0%, #EEF2F7 100%);
}

.content-scroll {
  flex: 1;
  flex-grow: 1;
  overflow-y: auto;
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

.search-bar {
  display: flex;
  align-items: center;
  height: 76rpx;
  padding: 0 24rpx;
  background: #FFFFFF;
  border-radius: 38rpx;
  border: 1rpx solid #E2E8F0;
  box-shadow: 0 4rpx 12rpx rgba(15, 23, 42, 0.04);
}

.search-icon {
  font-size: 28rpx;
  margin-right: 16rpx;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  height: 76rpx;
  font-size: 26rpx;
  color: #1E293B;
}

.search-clear {
  width: 44rpx;
  height: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #F1F5F9;
  flex-shrink: 0;
}

.clear-icon {
  font-size: 22rpx;
  color: #94A3B8;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80rpx 0;
}

.empty-text {
  font-size: 26rpx;
  color: #94A3B8;
}

.search-results {
  display: flex;
  flex-direction: column;
}

.search-result-item {
  display: flex;
  align-items: center;
  min-height: 120rpx;
  padding: 22rpx 24rpx;
  border-left-width: 8rpx;
  border-left-style: solid;
}

.calc-icon-bg {
  width: 64rpx;
  height: 64rpx;
  border-radius: 16rpx;
  background: #F8FAFC;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
  flex-shrink: 0;
}

.calc-icon {
  font-size: 30rpx;
}

.calc-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
}

.calc-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #0F172A;
  margin-bottom: 4rpx;
  line-height: 1.35;
}

.calc-desc {
  font-size: 22rpx;
  line-height: 1.45;
  color: #64748B;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.calc-arrow {
  margin-left: 14rpx;
  font-size: 30rpx;
  color: #A0AEC0;
  font-weight: 400;
  flex-shrink: 0;
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
  font-weight: 400;
  flex-shrink: 0;
}

.tap-card-hover {
  opacity: 0.85;
  transform: scale(0.985);
}
</style>
