<script setup>
import { computed } from 'vue'
import { formatValue } from '@/utils/formatter.js'

const props = defineProps({
  calculator: {
    type: Object,
    required: true
  },
  results: {
    type: Object,
    required: true
  }
})

const visibleOutputs = computed(() => props.calculator.outputs || [])
const primaryOutput = computed(() => visibleOutputs.value[0] || null)
const secondaryOutputs = computed(() => visibleOutputs.value.slice(1))

function getOutputValue(output) {
  return formatValue(props.results[output.key], output.format, output.precision)
}
</script>

<template>
  <view class="result-panel result-panel-indigo card">
    <view class="result-header">
      <view>
        <text class="result-kicker">核心结果</text>
        <text class="result-title">计算结果</text>
      </view>
      <text class="result-badge">{{ visibleOutputs.length }}项</text>
    </view>

    <view class="result-hero-block" v-if="primaryOutput">
      <text class="result-hero-label">{{ primaryOutput.label }}</text>
      <text class="result-hero-value">
        {{ getOutputValue(primaryOutput) }}
        <text v-if="primaryOutput.unit" class="metric-unit">{{ primaryOutput.unit }}</text>
      </text>
    </view>

    <view class="metric-grid" v-if="secondaryOutputs.length">
      <view class="metric-card" v-for="output in secondaryOutputs" :key="output.key">
        <text class="metric-label">{{ output.label }}</text>
        <text class="metric-value">
          {{ getOutputValue(output) }}
          <text v-if="output.unit" class="metric-unit">{{ output.unit }}</text>
        </text>
      </view>
    </view>
  </view>
</template>
