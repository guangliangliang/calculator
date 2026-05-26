export function formatCurrency(value) {
  if (value === null || value === undefined) return '-'
  return Number(value).toFixed(2)
}

export function formatPercent(value) {
  if (value === null || value === undefined) return '-'
  return Number(value).toFixed(2)
}

export function formatNumber(value) {
  if (value === null || value === undefined) return '-'
  if (typeof value === 'string') return value
  return Number(value).toFixed(0)
}

export function formatValue(value, format) {
  switch (format) {
    case 'currency':
      return formatCurrency(value)
    case 'percent':
      return formatPercent(value)
    case 'number':
    default:
      return formatNumber(value)
  }
}

export function saveHistory(calculatorId, inputs, outputs) {
  try {
    const history = getHistory()
    const newItem = {
      id: Date.now(),
      calculatorId,
      inputs,
      outputs,
      timestamp: new Date().toISOString()
    }
    history.unshift(newItem)
    const trimmed = history.slice(0, 50)
    uni.setStorageSync('calcHistory', trimmed)
  } catch (e) {
    console.error('保存历史记录失败', e)
  }
}

export function getHistory() {
  try {
    return uni.getStorageSync('calcHistory') || []
  } catch (e) {
    return []
  }
}
