export const logisticsCalculators = [
  {
    id: 'volumetric-weight',
    name: '体积重量计算器',
    industry: 'logistics',
    icon: '📦',
    description: '按货物尺寸、件数和计泡系数计算计费重量',
    inputs: [
      { key: 'length', label: '长度', type: 'number', unit: 'cm', placeholder: '请输入长度', min: 0.01 },
      { key: 'width', label: '宽度', type: 'number', unit: 'cm', placeholder: '请输入宽度', min: 0.01 },
      { key: 'height', label: '高度', type: 'number', unit: 'cm', placeholder: '请输入高度', min: 0.01 },
      { key: 'pieces', label: '件数', type: 'number', unit: '件', placeholder: '默认 1', default: 1, min: 1, required: false },
      { key: 'divisor', label: '计泡系数', type: 'number', unit: '', placeholder: '默认 6000', default: 6000, min: 1, required: false },
      { key: 'actualWeight', label: '实际重量', type: 'number', unit: 'kg', placeholder: '选填', min: 0, required: false }
    ],
    calculate: (data) => {
      const { length, width, height, pieces = 1, divisor = 6000, actualWeight } = data
      if (length == null || width == null || height == null || pieces == null || divisor == null) return null

      const volumeCbm = length * width * height * pieces / 1000000
      const volumeWeight = length * width * height * pieces / divisor
      const chargeableWeight = actualWeight == null ? volumeWeight : Math.max(actualWeight, volumeWeight)

      return { volumeCbm, volumeWeight, chargeableWeight }
    },
    outputs: [
      { key: 'volumeCbm', label: '总体积', format: 'number', unit: 'm³', precision: 3 },
      { key: 'volumeWeight', label: '体积重量', format: 'number', unit: 'kg', precision: 2 },
      { key: 'chargeableWeight', label: '计费重量', format: 'number', unit: 'kg', precision: 2 }
    ]
  },
  {
    id: 'freight-cost',
    name: '运费计算器',
    industry: 'logistics',
    icon: '🚚',
    description: '按重量、距离、单价和附加费估算运费',
    inputs: [
      { key: 'weight', label: '货物重量', type: 'number', unit: 'kg', placeholder: '请输入货物重量', min: 0.01 },
      { key: 'distance', label: '运输距离', type: 'number', unit: 'km', placeholder: '请输入运输距离', min: 0.01 },
      { key: 'pricePerKgKm', label: '吨公里单价', type: 'number', unit: '元/kg·km', placeholder: '例如 0.02', min: 0 },
      { key: 'baseFee', label: '起步费', type: 'number', unit: '元', placeholder: '选填', min: 0, required: false },
      { key: 'extraFee', label: '附加费', type: 'number', unit: '元', placeholder: '选填', min: 0, required: false }
    ],
    calculate: (data) => {
      const { weight, distance, pricePerKgKm, baseFee = 0, extraFee = 0 } = data
      if (weight == null || distance == null || pricePerKgKm == null) return null

      const lineHaulFee = weight * distance * pricePerKgKm
      const totalFreight = lineHaulFee + baseFee + extraFee
      const costPerKg = totalFreight / weight

      return { lineHaulFee, totalFreight, costPerKg }
    },
    outputs: [
      { key: 'lineHaulFee', label: '干线费用', format: 'currency', unit: '元' },
      { key: 'totalFreight', label: '总运费', format: 'currency', unit: '元' },
      { key: 'costPerKg', label: '每公斤费用', format: 'currency', unit: '元/kg' }
    ]
  },
  {
    id: 'truckload-freight',
    name: '整车运费计算器',
    industry: 'logistics',
    icon: '🚛',
    description: '按里程、油耗、过路费和利润率估算整车报价',
    inputs: [
      { key: 'distance', label: '运输距离', type: 'number', unit: 'km', placeholder: '请输入运输距离', min: 0.01 },
      { key: 'fuelConsumption', label: '百公里油耗', type: 'number', unit: 'L/100km', placeholder: '请输入百公里油耗', min: 0 },
      { key: 'fuelPrice', label: '油价', type: 'number', unit: '元/L', placeholder: '请输入油价', min: 0 },
      { key: 'tollFee', label: '过路费', type: 'number', unit: '元', placeholder: '选填', min: 0, required: false },
      { key: 'driverCost', label: '司机人工', type: 'number', unit: '元', placeholder: '选填', min: 0, required: false },
      { key: 'otherCost', label: '其他成本', type: 'number', unit: '元', placeholder: '选填', min: 0, required: false },
      { key: 'profitRate', label: '目标利润率', type: 'number', unit: '%', placeholder: '默认 15', default: 15, min: 0, required: false }
    ],
    calculate: (data) => {
      const {
        distance,
        fuelConsumption,
        fuelPrice,
        tollFee = 0,
        driverCost = 0,
        otherCost = 0,
        profitRate = 15
      } = data
      if (distance == null || fuelConsumption == null || fuelPrice == null) return null

      const fuelCost = distance * fuelConsumption / 100 * fuelPrice
      const totalCost = fuelCost + tollFee + driverCost + otherCost
      const suggestedQuote = totalCost * (1 + profitRate / 100)
      const grossProfit = suggestedQuote - totalCost

      return { fuelCost, totalCost, suggestedQuote, grossProfit }
    },
    outputs: [
      { key: 'fuelCost', label: '油费成本', format: 'currency', unit: '元' },
      { key: 'totalCost', label: '总成本', format: 'currency', unit: '元' },
      { key: 'suggestedQuote', label: '建议报价', format: 'currency', unit: '元' },
      { key: 'grossProfit', label: '毛利润', format: 'currency', unit: '元' }
    ]
  },
  {
    id: 'ltl-freight',
    name: '零担运费计算器',
    industry: 'logistics',
    icon: '🧾',
    description: '按重量价、体积价和最低收费计算零担运费',
    inputs: [
      { key: 'weight', label: '重量', type: 'number', unit: 'kg', placeholder: '请输入重量', min: 0.01 },
      { key: 'volume', label: '体积', type: 'number', unit: 'm³', placeholder: '请输入体积', min: 0.01 },
      { key: 'weightRate', label: '重货单价', type: 'number', unit: '元/kg', placeholder: '请输入重货单价', min: 0 },
      { key: 'volumeRate', label: '泡货单价', type: 'number', unit: '元/m³', placeholder: '请输入泡货单价', min: 0 },
      { key: 'minimumCharge', label: '最低收费', type: 'number', unit: '元', placeholder: '默认 0', default: 0, min: 0, required: false },
      { key: 'extraFee', label: '提送/装卸费', type: 'number', unit: '元', placeholder: '选填', min: 0, required: false }
    ],
    calculate: (data) => {
      const { weight, volume, weightRate, volumeRate, minimumCharge = 0, extraFee = 0 } = data
      if (weight == null || volume == null || weightRate == null || volumeRate == null) return null

      const weightFee = weight * weightRate
      const volumeFee = volume * volumeRate
      const billingBase = Math.max(weightFee, volumeFee, minimumCharge)
      const totalFreight = billingBase + extraFee

      return { weightFee, volumeFee, billingBase, totalFreight }
    },
    outputs: [
      { key: 'weightFee', label: '按重量计费', format: 'currency', unit: '元' },
      { key: 'volumeFee', label: '按体积计费', format: 'currency', unit: '元' },
      { key: 'billingBase', label: '基础运费', format: 'currency', unit: '元' },
      { key: 'totalFreight', label: '总运费', format: 'currency', unit: '元' }
    ]
  },
  {
    id: 'fuel-cost',
    name: '油耗成本计算器',
    industry: 'logistics',
    icon: '⛽',
    description: '按里程、百公里油耗和油价计算运输油费',
    inputs: [
      { key: 'distance', label: '行驶里程', type: 'number', unit: 'km', placeholder: '请输入行驶里程', min: 0.01 },
      { key: 'fuelConsumption', label: '百公里油耗', type: 'number', unit: 'L/100km', placeholder: '请输入百公里油耗', min: 0 },
      { key: 'fuelPrice', label: '油价', type: 'number', unit: '元/L', placeholder: '请输入油价', min: 0 }
    ],
    calculate: (data) => {
      const { distance, fuelConsumption, fuelPrice } = data
      if (distance == null || fuelConsumption == null || fuelPrice == null) return null

      const fuelUsed = distance * fuelConsumption / 100
      const fuelCost = fuelUsed * fuelPrice
      const costPerKm = fuelCost / distance

      return { fuelUsed, fuelCost, costPerKm }
    },
    outputs: [
      { key: 'fuelUsed', label: '耗油量', format: 'number', unit: 'L', precision: 2 },
      { key: 'fuelCost', label: '油费', format: 'currency', unit: '元' },
      { key: 'costPerKm', label: '每公里油费', format: 'currency', unit: '元/km' }
    ]
  },
  {
    id: 'container-loading',
    name: '装柜计算器',
    industry: 'logistics',
    icon: '🚢',
    description: '按纸箱尺寸和柜型估算可装箱数',
    inputs: [
      {
        key: 'containerType',
        label: '柜型',
        type: 'select',
        default: '40hq',
        options: [
          { label: '20GP', value: '20gp' },
          { label: '40GP', value: '40gp' },
          { label: '40HQ', value: '40hq' }
        ]
      },
      { key: 'cartonLength', label: '纸箱长度', type: 'number', unit: 'cm', placeholder: '请输入纸箱长度', min: 0.01 },
      { key: 'cartonWidth', label: '纸箱宽度', type: 'number', unit: 'cm', placeholder: '请输入纸箱宽度', min: 0.01 },
      { key: 'cartonHeight', label: '纸箱高度', type: 'number', unit: 'cm', placeholder: '请输入纸箱高度', min: 0.01 }
    ],
    calculate: (data) => {
      const { containerType = '40hq', cartonLength, cartonWidth, cartonHeight } = data
      if (cartonLength == null || cartonWidth == null || cartonHeight == null) return null

      const containerMap = {
        '20gp': { length: 589, width: 235, height: 239 },
        '40gp': { length: 1203, width: 235, height: 239 },
        '40hq': { length: 1203, width: 235, height: 269 }
      }
      const container = containerMap[containerType] || containerMap['40hq']
      const lengthCount = Math.floor(container.length / cartonLength)
      const widthCount = Math.floor(container.width / cartonWidth)
      const heightCount = Math.floor(container.height / cartonHeight)
      const cartonCount = lengthCount * widthCount * heightCount
      const containerVolume = container.length * container.width * container.height / 1000000
      const usedVolume = cartonCount * cartonLength * cartonWidth * cartonHeight / 1000000
      const volumeUtilization = containerVolume === 0 ? null : usedVolume / containerVolume * 100

      return { lengthCount, widthCount, heightCount, cartonCount, containerVolume, usedVolume, volumeUtilization }
    },
    outputs: [
      { key: 'cartonCount', label: '可装箱数', format: 'number', unit: '箱' },
      { key: 'lengthCount', label: '长度方向', format: 'number', unit: '箱' },
      { key: 'widthCount', label: '宽度方向', format: 'number', unit: '箱' },
      { key: 'heightCount', label: '高度方向', format: 'number', unit: '箱' },
      { key: 'volumeUtilization', label: '体积利用率', format: 'percent', unit: '%' }
    ]
  }
]
