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
    resultRenderer: 'eoq',
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
      const suggestedBatch = Math.ceil(eoq)
      const reorderCycleDays = 365 / orderTimes
      const averageMonthlyOrders = orderTimes / 12

      return {
        eoq: suggestedBatch,
        annualDemand,
        orderTimes,
        reorderCycleDays,
        averageMonthlyOrders
      }
    },
    outputs: [
      { key: 'eoq', label: '经济订货批量', format: 'number', unit: '件' },
      { key: 'orderTimes', label: '年订货次数', format: 'number', unit: '次', precision: 1 }
    ]
  },
  {
    id: 'break-even-point',
    name: '盈亏平衡点计算器',
    industry: 'catering',
    icon: '⚖️',
    description: '根据固定成本和毛利率反推保本营业额',
    inputs: [
      { key: 'fixedCost', label: '固定成本', type: 'number', unit: '元', placeholder: '请输入固定成本', min: 0 },
      { key: 'grossMarginRate', label: '毛利率', type: 'number', unit: '%', placeholder: '例如 60', min: 0.01, max: 99.99 }
    ],
    calculate: (data) => {
      const { fixedCost, grossMarginRate } = data
      if (fixedCost == null || grossMarginRate == null || grossMarginRate >= 100) return null

      const breakEvenRevenue = fixedCost / (grossMarginRate / 100)
      const grossProfitNeeded = breakEvenRevenue - fixedCost

      return { breakEvenRevenue, grossProfitNeeded }
    },
    outputs: [
      { key: 'breakEvenRevenue', label: '保本营业额', format: 'currency', unit: '元' },
      { key: 'grossProfitNeeded', label: '所需毛利额', format: 'currency', unit: '元' }
    ]
  },
  {
    id: 'table-turnover',
    name: '翻台率计算器',
    industry: 'catering',
    icon: '🍽️',
    description: '估算翻台次数、接待人数和日营业额',
    inputs: [
      { key: 'tableCount', label: '餐桌数量', type: 'number', unit: '桌', placeholder: '请输入餐桌数量', min: 1 },
      { key: 'avgTurnoversPerTable', label: '单桌日均翻台次数', type: 'number', unit: '次', placeholder: '例如 3.5', min: 0.01 },
      { key: 'avgGuestsPerTable', label: '平均每桌就餐人数', type: 'number', unit: '人', placeholder: '例如 3', min: 0.1 },
      { key: 'avgSpendPerCustomer', label: '人均消费', type: 'number', unit: '元', placeholder: '请输入人均消费', min: 0.01 }
    ],
    calculate: (data) => {
      const { tableCount, avgTurnoversPerTable, avgGuestsPerTable, avgSpendPerCustomer } = data
      if (tableCount == null || avgTurnoversPerTable == null || avgGuestsPerTable == null || avgSpendPerCustomer == null) return null

      const dailyTurnovers = tableCount * avgTurnoversPerTable
      const dailyCustomers = dailyTurnovers * avgGuestsPerTable
      const estimatedRevenue = dailyCustomers * avgSpendPerCustomer

      return { dailyTurnovers, dailyCustomers, estimatedRevenue }
    },
    outputs: [
      { key: 'dailyTurnovers', label: '总翻台次数', format: 'number', unit: '次', precision: 1 },
      { key: 'dailyCustomers', label: '预计接待人数', format: 'number', unit: '人', precision: 0 },
      { key: 'estimatedRevenue', label: '预计日营业额', format: 'currency', unit: '元' }
    ]
  },
  {
    id: 'average-order-value',
    name: '客单价计算器',
    industry: 'catering',
    icon: '🧾',
    description: '根据营业额和订单量计算客单价',
    inputs: [
      { key: 'revenue', label: '营业额', type: 'number', unit: '元', placeholder: '请输入营业额', min: 0 },
      { key: 'orderCount', label: '订单数', type: 'number', unit: '单', placeholder: '请输入订单数', min: 1 }
    ],
    calculate: (data) => {
      const { revenue, orderCount } = data
      if (revenue == null || orderCount == null || orderCount <= 0) return null

      return { averageOrderValue: revenue / orderCount }
    },
    outputs: [
      { key: 'averageOrderValue', label: '客单价', format: 'currency', unit: '元' }
    ]
  },
  {
    id: 'delivery-net-income',
    name: '外卖到手收入计算器',
    industry: 'catering',
    icon: '🛵',
    description: '扣除平台佣金、配送费和活动成本后估算净收入',
    inputs: [
      { key: 'orderAmount', label: '订单金额', type: 'number', unit: '元', placeholder: '请输入订单金额', min: 0.01 },
      { key: 'platformRate', label: '平台扣点', type: 'number', unit: '%', placeholder: '例如 18', min: 0, max: 100 },
      { key: 'deliveryFee', label: '配送费', type: 'number', unit: '元', placeholder: '选填', min: 0, required: false },
      { key: 'activityCost', label: '活动补贴成本', type: 'number', unit: '元', placeholder: '选填', min: 0, required: false },
      { key: 'subsidy', label: '平台补贴', type: 'number', unit: '元', placeholder: '选填', min: 0, required: false }
    ],
    calculate: (data) => {
      const { orderAmount, platformRate, deliveryFee = 0, activityCost = 0, subsidy = 0 } = data
      if (orderAmount == null || platformRate == null) return null

      const platformCommission = orderAmount * (platformRate / 100)
      const netIncome = orderAmount - platformCommission - deliveryFee - activityCost + subsidy
      const netRate = orderAmount === 0 ? null : (netIncome / orderAmount) * 100

      return { platformCommission, netIncome, netRate }
    },
    outputs: [
      { key: 'platformCommission', label: '平台佣金', format: 'currency', unit: '元' },
      { key: 'netIncome', label: '到手收入', format: 'currency', unit: '元' },
      { key: 'netRate', label: '到手率', format: 'percent', unit: '%' }
    ]
  },
  {
    id: 'store-payback',
    name: '门店回本周期计算器',
    industry: 'catering',
    icon: '🏪',
    description: '根据总投资和月净利润估算回本周期',
    inputs: [
      { key: 'initialInvestment', label: '总投资', type: 'number', unit: '元', placeholder: '请输入总投资', min: 0.01 },
      { key: 'monthlyNetProfit', label: '月净利润', type: 'number', unit: '元', placeholder: '请输入月净利润', min: 0.01 }
    ],
    calculate: (data) => {
      const { initialInvestment, monthlyNetProfit } = data
      if (initialInvestment == null || monthlyNetProfit == null || monthlyNetProfit <= 0) return null

      const paybackMonths = initialInvestment / monthlyNetProfit
      const paybackYears = paybackMonths / 12

      return { paybackMonths, paybackYears }
    },
    outputs: [
      { key: 'paybackMonths', label: '回本周期', format: 'number', unit: '个月', precision: 1 },
      { key: 'paybackYears', label: '折合年数', format: 'number', unit: '年', precision: 2 }
    ]
  }
]
