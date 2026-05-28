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

export function validateCalculatorInputs(calculator, payload) {
  for (const input of calculator.inputs) {
    const value = payload[input.key]
    const isRequired = input.required !== false

    if (isRequired && (value === null || value === undefined || value === '')) {
      return `${input.label} is required`
    }

    if (value === null || value === undefined || value === '') {
      continue
    }

    if (input.type === 'select') {
      const isValidOption = input.options?.some(option => option.value === value)
      if (!isValidOption) {
        return `Please choose a valid ${input.label}`
      }
      continue
    }

    if (!Number.isFinite(value)) {
      return `${input.label} is invalid`
    }

    if (input.min !== undefined && value < input.min) {
      return `${input.label} must be at least ${input.min}`
    }

    if (input.max !== undefined && value > input.max) {
      return `${input.label} must be at most ${input.max}`
    }
  }

  return ''
}

export function getSelectLabel(input, value) {
  return input.options?.find(option => option.value === value)?.label || ''
}
