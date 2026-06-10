function isInvalidNumber(value) {
  return !Number.isFinite(Number(value))
}

let scheduleDetailMemoryCache = null

function formatWithPrecision(value, precision = 2) {
  return Number(value).toFixed(precision)
}

function addThousands(value) {
  const [integer, decimal] = value.split('.')
  const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return decimal === undefined ? formattedInteger : `${formattedInteger}.${decimal}`
}

function padDatePart(value) {
  return String(value).padStart(2, '0')
}

export function formatDateTime(date = new Date()) {
  const current = date instanceof Date ? date : new Date(date)

  if (Number.isNaN(current.getTime())) return ''

  const year = current.getFullYear()
  const month = padDatePart(current.getMonth() + 1)
  const day = padDatePart(current.getDate())
  const hour = padDatePart(current.getHours())
  const minute = padDatePart(current.getMinutes())
  const second = padDatePart(current.getSeconds())

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`
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
  scheduleDetailMemoryCache = detail
  try {
    uni.setStorageSync('calcScheduleDetail', detail)
  } catch (error) {
    console.error('保存还款明细失败', error)
  }
}

export function getScheduleDetail() {
  if (scheduleDetailMemoryCache) return scheduleDetailMemoryCache

  try {
    const storedDetail = uni.getStorageSync('calcScheduleDetail') || null
    if (storedDetail) {
      scheduleDetailMemoryCache = storedDetail
    }
    return storedDetail
  } catch (error) {
    return null
  }
}
