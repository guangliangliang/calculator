export const cateringCalculators = [
  {
    id: 'gross-margin',
    name: '毛利率计算器',
    industry: 'catering',
    icon: '🍽️',
    description: '计算毛利额和毛利率',
    inputs: [
      { key: 'costPrice', label: '成本价', type: 'number', unit: '元', placeholder: '请输入成本价', min: 0 },
      { key: 'salePrice', label: '售价', type: 'number', unit: '元', placeholder: '请输入售价', min: 0.01 }
    ],
    calculate: (data) => {
      const { costPrice, salePrice } = data
      if (costPrice == null || salePrice == null) return null

      const profit = salePrice - costPrice
      const margin = (profit / salePrice) * 100

      return { profit, margin }
    },
    outputs: [
      { key: 'profit', label: '毛利额', format: 'currency', unit: '元' },
      { key: 'margin', label: '毛利率', format: 'percent', unit: '%' }
    ]
  },
  {
    id: 'pricing',
    name: '菜品定价计算器',
    industry: 'catering',
    icon: '🏷️',
    description: '根据目标毛利率反推建议售价',
    inputs: [
      { key: 'costPrice', label: '成本价', type: 'number', unit: '元', placeholder: '请输入成本价', min: 0 },
      { key: 'targetMargin', label: '目标毛利率', type: 'number', unit: '%', placeholder: '请输入目标毛利率', min: 0, max: 99.99 }
    ],
    calculate: (data) => {
      const { costPrice, targetMargin } = data
      if (costPrice == null || targetMargin == null || targetMargin >= 100) return null

      const salePrice = costPrice / (1 - targetMargin / 100)
      const profit = salePrice - costPrice

      return { salePrice, profit }
    },
    outputs: [
      { key: 'salePrice', label: '建议售价', format: 'currency', unit: '元' },
      { key: 'profit', label: '毛利额', format: 'currency', unit: '元' }
    ]
  },
  {
    id: 'inventory-turnover',
    name: '库存周转计算器',
    industry: 'catering',
    icon: '📦',
    description: '计算库存周转率和周转天数',
    inputs: [
      { key: 'beginningInventory', label: '期初库存', type: 'number', unit: '元', placeholder: '请输入期初库存', min: 0 },
      { key: 'endingInventory', label: '期末库存', type: 'number', unit: '元', placeholder: '请输入期末库存', min: 0 },
      { key: 'costOfSales', label: '销售成本', type: 'number', unit: '元', placeholder: '请输入销售成本', min: 0.01 }
    ],
    calculate: (data) => {
      const { beginningInventory, endingInventory, costOfSales } = data
      if (beginningInventory == null || endingInventory == null || costOfSales == null) return null

      const avgInventory = (beginningInventory + endingInventory) / 2
      if (avgInventory <= 0) return null

      const turnover = costOfSales / avgInventory
      const days = 365 / turnover

      return { turnover, days }
    },
    outputs: [
      { key: 'turnover', label: '年周转率', format: 'number', unit: '次', precision: 2 },
      { key: 'days', label: '周转天数', format: 'number', unit: '天', precision: 1 }
    ]
  },
  {
    id: 'promotion-discount',
    name: '促销折扣计算器',
    industry: 'catering',
    icon: '🎁',
    description: '计算打折后的售价和利润',
    inputs: [
      { key: 'originalPrice', label: '原价', type: 'number', unit: '元', placeholder: '请输入原价', min: 0.01 },
      { key: 'discountRate', label: '折扣', type: 'number', unit: '折', placeholder: '例如 8.5', min: 0, max: 10 },
      { key: 'costPrice', label: '成本价', type: 'number', unit: '元', placeholder: '选填', min: 0, required: false }
    ],
    calculate: (data) => {
      const { originalPrice, discountRate, costPrice } = data
      if (originalPrice == null || discountRate == null) return null

      const discountedPrice = originalPrice * (discountRate / 10)
      const profit = costPrice == null ? null : discountedPrice - costPrice
      const profitRate = costPrice == null || discountedPrice === 0
        ? null
        : ((discountedPrice - costPrice) / discountedPrice) * 100

      return { discountedPrice, profit, profitRate }
    },
    outputs: [
      { key: 'discountedPrice', label: '折后价', format: 'currency', unit: '元' },
      { key: 'profit', label: '利润', format: 'currency', unit: '元' },
      { key: 'profitRate', label: '利润率', format: 'percent', unit: '%' }
    ]
  },
  {
    id: 'rent-ratio',
    name: '房租占比计算器',
    industry: 'catering',
    icon: '🏪',
    description: '计算房租占月营业额的比例',
    inputs: [
      { key: 'monthlyRent', label: '月房租', type: 'number', unit: '元', placeholder: '请输入月房租', min: 0 },
      { key: 'monthlyRevenue', label: '月营业额', type: 'number', unit: '元', placeholder: '请输入月营业额', min: 0.01 }
    ],
    calculate: (data) => {
      const { monthlyRent, monthlyRevenue } = data
      if (monthlyRent == null || monthlyRevenue == null) return null

      return { ratio: (monthlyRent / monthlyRevenue) * 100 }
    },
    outputs: [
      { key: 'ratio', label: '房租占比', format: 'percent', unit: '%' }
    ]
  },
  {
    id: 'labor-cost',
    name: '人力成本计算器',
    industry: 'catering',
    icon: '👥',
    description: '计算人力成本占比和人均产出',
    inputs: [
      { key: 'monthlyLaborCost', label: '月人力成本', type: 'number', unit: '元', placeholder: '请输入月人力成本', min: 0 },
      { key: 'monthlyRevenue', label: '月营业额', type: 'number', unit: '元', placeholder: '请输入月营业额', min: 0.01 },
      { key: 'employeeCount', label: '员工人数', type: 'number', unit: '人', placeholder: '选填', min: 1, required: false }
    ],
    calculate: (data) => {
      const { monthlyLaborCost, monthlyRevenue, employeeCount } = data
      if (monthlyLaborCost == null || monthlyRevenue == null) return null

      const ratio = (monthlyLaborCost / monthlyRevenue) * 100
      const outputPerPerson = employeeCount == null ? null : monthlyRevenue / employeeCount

      return { ratio, outputPerPerson }
    },
    outputs: [
      { key: 'ratio', label: '人力成本占比', format: 'percent', unit: '%' },
      { key: 'outputPerPerson', label: '人均产出', format: 'currency', unit: '元' }
    ]
  },
  {
    id: 'member-discount',
    name: '会员折扣计算器',
    industry: 'catering',
    icon: '💰',
    description: '计算会员实付、优惠金额和积分',
    inputs: [
      { key: 'amount', label: '消费金额', type: 'number', unit: '元', placeholder: '请输入消费金额', min: 0.01 },
      { key: 'discountRate', label: '会员折扣', type: 'number', unit: '折', placeholder: '例如 9', min: 0, max: 10, required: false },
      { key: 'pointRatio', label: '积分比例', type: 'number', unit: '倍', placeholder: '每元可得几分', min: 0, required: false }
    ],
    calculate: (data) => {
      const { amount, discountRate, pointRatio } = data
      if (amount == null) return null

      const actualPay = discountRate == null ? amount : amount * (discountRate / 10)
      const points = pointRatio == null ? null : amount * pointRatio
      const saved = discountRate == null ? 0 : amount - actualPay

      return { actualPay, points, saved }
    },
    outputs: [
      { key: 'actualPay', label: '实付金额', format: 'currency', unit: '元' },
      { key: 'saved', label: '节省金额', format: 'currency', unit: '元' },
      { key: 'points', label: '获得积分', format: 'number', unit: '分' }
    ]
  },
  {
    id: 'eoq',
    name: '进货批量计算器',
    industry: 'catering',
    icon: '🛒',
    description: '估算经济订货批量和年订货次数',
    inputs: [
      { key: 'monthlySales', label: '月销量', type: 'number', unit: '件', placeholder: '请输入月销量', min: 0.01 },
      { key: 'orderCost', label: '单次订货成本', type: 'number', unit: '元', placeholder: '请输入单次订货成本', min: 0.01 },
      { key: 'storageCost', label: '单位月存储成本', type: 'number', unit: '元', placeholder: '请输入单位存储成本', min: 0.01 }
    ],
    calculate: (data) => {
      const { monthlySales, orderCost, storageCost } = data
      if (monthlySales == null || orderCost == null || storageCost == null) return null

      const eoq = Math.sqrt((2 * monthlySales * orderCost) / storageCost)
      const annualDemand = monthlySales * 12
      const orderTimes = annualDemand / eoq

      return { eoq: Math.ceil(eoq), orderTimes }
    },
    outputs: [
      { key: 'eoq', label: '经济订货批量', format: 'number', unit: '件' },
      { key: 'orderTimes', label: '年订货次数', format: 'number', unit: '次', precision: 1 }
    ]
  }
]
