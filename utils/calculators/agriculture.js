export const agricultureCalculators = [
  {
    id: 'pesticide-dilution',
    name: '农药稀释计算器',
    industry: 'agriculture',
    icon: '🧪',
    description: '按兑水量和稀释倍数计算用药量',
    inputs: [
      { key: 'waterVolume', label: '兑水量', type: 'number', unit: 'L', placeholder: '请输入兑水量', min: 0.01 },
      { key: 'dilutionRatio', label: '稀释倍数', type: 'number', unit: '倍', placeholder: '例如 500', min: 1 },
      { key: 'sprayerCount', label: '喷雾器桶数', type: 'number', unit: '桶', placeholder: '默认 1', default: 1, min: 1, required: false }
    ],
    calculate: (data) => {
      const { waterVolume, dilutionRatio, sprayerCount = 1 } = data
      if (waterVolume == null || dilutionRatio == null || sprayerCount == null) return null

      const totalWater = waterVolume * sprayerCount
      const pesticideAmount = totalWater * 1000 / dilutionRatio
      const solutionVolume = totalWater + pesticideAmount / 1000

      return { totalWater, pesticideAmount, solutionVolume }
    },
    outputs: [
      { key: 'totalWater', label: '总兑水量', format: 'number', unit: 'L', precision: 1 },
      { key: 'pesticideAmount', label: '需加药量', format: 'number', unit: 'ml', precision: 1 },
      { key: 'solutionVolume', label: '配好药液', format: 'number', unit: 'L', precision: 2 }
    ]
  },
  {
    id: 'fertilizer-amount',
    name: '肥料用量计算器',
    industry: 'agriculture',
    icon: '🌾',
    description: '按种植面积和每亩施肥量估算总肥料与袋数',
    inputs: [
      { key: 'areaMu', label: '种植面积', type: 'number', unit: '亩', placeholder: '请输入种植面积', min: 0.01 },
      { key: 'ratePerMu', label: '每亩用肥量', type: 'number', unit: 'kg/亩', placeholder: '请输入每亩用肥量', min: 0.01 },
      { key: 'bagWeight', label: '每袋重量', type: 'number', unit: 'kg', placeholder: '默认 40', default: 40, min: 0.01, required: false },
      { key: 'lossRate', label: '损耗/余量', type: 'number', unit: '%', placeholder: '默认 5', default: 5, min: 0, required: false }
    ],
    calculate: (data) => {
      const { areaMu, ratePerMu, bagWeight = 40, lossRate = 5 } = data
      if (areaMu == null || ratePerMu == null || bagWeight == null) return null

      const netAmount = areaMu * ratePerMu
      const totalAmount = netAmount * (1 + lossRate / 100)
      const bags = Math.ceil(totalAmount / bagWeight)

      return { netAmount, totalAmount, bags }
    },
    outputs: [
      { key: 'netAmount', label: '理论用肥量', format: 'number', unit: 'kg', precision: 1 },
      { key: 'totalAmount', label: '建议备肥量', format: 'number', unit: 'kg', precision: 1 },
      { key: 'bags', label: '约需袋数', format: 'number', unit: '袋' }
    ]
  },
  {
    id: 'planting-density',
    name: '种植密度计算器',
    industry: 'agriculture',
    icon: '🌱',
    description: '根据行距、株距和面积计算可种株数',
    inputs: [
      { key: 'areaMu', label: '种植面积', type: 'number', unit: '亩', placeholder: '请输入种植面积', min: 0.01 },
      { key: 'rowSpacing', label: '行距', type: 'number', unit: 'cm', placeholder: '请输入行距', min: 0.01 },
      { key: 'plantSpacing', label: '株距', type: 'number', unit: 'cm', placeholder: '请输入株距', min: 0.01 }
    ],
    calculate: (data) => {
      const { areaMu, rowSpacing, plantSpacing } = data
      if (areaMu == null || rowSpacing == null || plantSpacing == null) return null

      const plantArea = (rowSpacing / 100) * (plantSpacing / 100)
      if (plantArea <= 0) return null

      const plantsPerMu = 666.67 / plantArea
      const totalPlants = plantsPerMu * areaMu

      return { plantsPerMu, totalPlants }
    },
    outputs: [
      { key: 'plantsPerMu', label: '每亩株数', format: 'number', unit: '株' },
      { key: 'totalPlants', label: '总株数', format: 'number', unit: '株' }
    ]
  },
  {
    id: 'seed-amount',
    name: '播种量计算器',
    industry: 'agriculture',
    icon: '🌰',
    description: '按面积、亩用种量和发芽率估算备种量',
    inputs: [
      { key: 'areaMu', label: '播种面积', type: 'number', unit: '亩', placeholder: '请输入播种面积', min: 0.01 },
      { key: 'seedRatePerMu', label: '每亩用种量', type: 'number', unit: 'kg/亩', placeholder: '请输入每亩用种量', min: 0.01 },
      { key: 'germinationRate', label: '发芽率', type: 'number', unit: '%', placeholder: '默认 90', default: 90, min: 0.01, max: 100, required: false },
      { key: 'lossRate', label: '补播余量', type: 'number', unit: '%', placeholder: '默认 5', default: 5, min: 0, required: false }
    ],
    calculate: (data) => {
      const { areaMu, seedRatePerMu, germinationRate = 90, lossRate = 5 } = data
      if (areaMu == null || seedRatePerMu == null || germinationRate == null || germinationRate <= 0) return null

      const netSeed = areaMu * seedRatePerMu
      const adjustedSeed = netSeed / (germinationRate / 100)
      const totalSeed = adjustedSeed * (1 + lossRate / 100)

      return { netSeed, adjustedSeed, totalSeed }
    },
    outputs: [
      { key: 'netSeed', label: '理论用种量', format: 'number', unit: 'kg', precision: 2 },
      { key: 'adjustedSeed', label: '按发芽率修正', format: 'number', unit: 'kg', precision: 2 },
      { key: 'totalSeed', label: '建议备种量', format: 'number', unit: 'kg', precision: 2 }
    ]
  },
  {
    id: 'irrigation-water',
    name: '灌溉用水量计算器',
    industry: 'agriculture',
    icon: '💧',
    description: '按面积和灌水深度估算用水立方数',
    inputs: [
      { key: 'areaMu', label: '灌溉面积', type: 'number', unit: '亩', placeholder: '请输入灌溉面积', min: 0.01 },
      { key: 'waterDepth', label: '灌水深度', type: 'number', unit: 'mm', placeholder: '例如 30', min: 0.01 },
      { key: 'waterPrice', label: '水价', type: 'number', unit: '元/m³', placeholder: '选填', min: 0, required: false }
    ],
    calculate: (data) => {
      const { areaMu, waterDepth, waterPrice } = data
      if (areaMu == null || waterDepth == null) return null

      const waterVolume = areaMu * 666.67 * (waterDepth / 1000)
      const waterCost = waterPrice == null ? null : waterVolume * waterPrice

      return { waterVolume, waterCost }
    },
    outputs: [
      { key: 'waterVolume', label: '用水量', format: 'number', unit: 'm³', precision: 2 },
      { key: 'waterCost', label: '水费估算', format: 'currency', unit: '元' }
    ]
  },
  {
    id: 'crop-profit',
    name: '亩产收益计算器',
    industry: 'agriculture',
    icon: '📈',
    description: '根据亩产、售价和成本估算种植收益',
    inputs: [
      { key: 'areaMu', label: '种植面积', type: 'number', unit: '亩', placeholder: '请输入种植面积', min: 0.01 },
      { key: 'yieldPerMu', label: '每亩产量', type: 'number', unit: 'kg/亩', placeholder: '请输入每亩产量', min: 0 },
      { key: 'salePrice', label: '销售单价', type: 'number', unit: '元/kg', placeholder: '请输入销售单价', min: 0 },
      { key: 'costPerMu', label: '每亩成本', type: 'number', unit: '元/亩', placeholder: '请输入每亩成本', min: 0 }
    ],
    calculate: (data) => {
      const { areaMu, yieldPerMu, salePrice, costPerMu } = data
      if (areaMu == null || yieldPerMu == null || salePrice == null || costPerMu == null) return null

      const totalYield = areaMu * yieldPerMu
      const revenue = totalYield * salePrice
      const totalCost = areaMu * costPerMu
      const netProfit = revenue - totalCost
      const profitPerMu = netProfit / areaMu
      const profitRate = totalCost === 0 ? null : (netProfit / totalCost) * 100

      return { totalYield, revenue, totalCost, netProfit, profitPerMu, profitRate }
    },
    outputs: [
      { key: 'totalYield', label: '总产量', format: 'number', unit: 'kg', precision: 1 },
      { key: 'revenue', label: '销售收入', format: 'currency', unit: '元' },
      { key: 'totalCost', label: '总成本', format: 'currency', unit: '元' },
      { key: 'netProfit', label: '净利润', format: 'currency', unit: '元' },
      { key: 'profitPerMu', label: '亩均利润', format: 'currency', unit: '元/亩' },
      { key: 'profitRate', label: '成本收益率', format: 'percent', unit: '%' }
    ]
  }
]
