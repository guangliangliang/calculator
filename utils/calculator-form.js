function isEmptyValue(value) {
  return value === '' || value === null || value === undefined
}

export function getInitialInputs(calculator) {
  if (!calculator?.inputs) return {}

  return calculator.inputs.reduce((acc, input) => {
    if (input.default !== undefined) {
      acc[input.key] = String(input.default)
      return acc
    }

    if (input.type === 'select' && input.default !== undefined) {
      acc[input.key] = input.default
    }

    return acc
  }, {})
}

export function normalizeInputValue(input, rawValue) {
  if (input.type === 'select') {
    return isEmptyValue(rawValue) ? null : rawValue
  }

  if (isEmptyValue(rawValue)) {
    if (input.default !== undefined) return Number(input.default)
    return null
  }

  const parsed = Number(rawValue)
  return Number.isFinite(parsed) ? parsed : null
}

export function buildCalculationPayload(calculator, rawInputs) {
  return calculator.inputs.reduce((acc, input) => {
    acc[input.key] = normalizeInputValue(input, rawInputs[input.key])
    return acc
  }, {})
}

export function getInputErrorMessage(input, value) {
  const isRequired = input.required !== false

  if (isRequired && (value === null || value === undefined || value === '')) {
    return `请输入${input.label}`
  }

  if (value === null || value === undefined || value === '') {
    return ''
  }

  if (input.type === 'select') {
    const isValidOption = input.options?.some(option => option.value === value)
    return isValidOption ? '' : `请选择有效的${input.label}`
  }

  if (!Number.isFinite(value)) {
    return `${input.label}输入格式不正确`
  }

  if (input.min !== undefined && value < input.min) {
    return `${input.label}不能小于${input.min}`
  }

  if (input.max !== undefined && value > input.max) {
    return `${input.label}不能大于${input.max}`
  }

  return ''
}

export function validateCalculatorInputs(calculator, payload) {
  return calculator.inputs.reduce((errors, input) => {
    const errorMessage = getInputErrorMessage(input, payload[input.key])

    if (errorMessage) {
      errors[input.key] = errorMessage
    }

    return errors
  }, {})
}

export function getSelectLabel(input, value) {
  return input.options?.find(option => option.value === value)?.label || ''
}
