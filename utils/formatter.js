function isInvalidNumber(value) {
  return !Number.isFinite(Number(value))
}

function formatWithPrecision(value, precision = 2) {
  return Number(value).toFixed(precision)
}

function addThousands(value) {
  const [integer, decimal] = value.split('.')
  const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return decimal === undefined ? formattedInteger : `${formattedInteger}.${decimal}`
}

export function formatCurrency(value, precision = 2) {
  if (value === null || value === undefined || isInvalidNumber(value)) return '-'
  return addThousands(formatWithPrecision(value, precision))
}

export function formatPercent(value, precision = 2) {
  if (value === null || value === undefined || isInvalidNumber(value)) return '-'
  return formatWithPrecision(value, precision)
}

export function formatNumber(value, precision = 0) {
  if (value === null || value === undefined || isInvalidNumber(value)) return '-'
  return addThousands(formatWithPrecision(value, precision))
}

export function formatValue(value, format, precision) {
  switch (format) {
    case 'currency':
      return formatCurrency(value, precision ?? 2)
    case 'percent':
      return formatPercent(value, precision ?? 2)
    case 'number':
    default:
      return formatNumber(value, precision ?? 0)
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
    uni.setStorageSync('calcHistory', history.slice(0, 50))
  } catch (error) {
    console.error('保存历史记录失败', error)
  }
}

export function getHistory() {
  try {
    return uni.getStorageSync('calcHistory') || []
  } catch (error) {
    return []
  }
}

export function saveScheduleDetail(detail) {
  try {
    uni.setStorageSync('calcScheduleDetail', detail)
  } catch (error) {
    console.error('保存还款明细失败', error)
  }
}

export function getScheduleDetail() {
  try {
    return uni.getStorageSync('calcScheduleDetail') || null
  } catch (error) {
    return null
  }
}
