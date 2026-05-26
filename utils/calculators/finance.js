export const financeCalculators = [
  {
    id: 'mortgage',
    name: '房贷计算器',
    industry: 'finance',
    icon: '🏠',
    description: '等额本息/等额本金计算',
    inputs: [
      { key: 'amount', label: '贷款金额', type: 'number', unit: '万元', placeholder: '请输入贷款金额' },
      { key: 'years', label: '贷款年限', type: 'number', unit: '年', placeholder: '请输入贷款年限' },
      { key: 'rate', label: '年利率', type: 'number', unit: '%', placeholder: '如4.5' }
    ],
    calculate: (data) => {
      const { amount, years, rate } = data
      if (!amount || !years || !rate) return null
      const principal = amount * 10000
      const months = years * 12
      const monthlyRate = rate / 100 / 12
      
      const monthlyPayment = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / 
                            (Math.pow(1 + monthlyRate, months) - 1)
      const totalPayment = monthlyPayment * months
      const totalInterest = totalPayment - principal
      
      return { monthlyPayment, totalPayment, totalInterest }
    },
    outputs: [
      { key: 'monthlyPayment', label: '月供', format: 'currency', unit: '元' },
      { key: 'totalPayment', label: '还款总额', format: 'currency', unit: '元' },
      { key: 'totalInterest', label: '总利息', format: 'currency', unit: '元' }
    ]
  },
  {
    id: 'car-loan',
    name: '车贷计算器',
    industry: 'finance',
    icon: '🚗',
    description: '汽车贷款计算',
    inputs: [
      { key: 'carPrice', label: '车价', type: 'number', unit: '万元', placeholder: '请输入车价' },
      { key: 'downPaymentRatio', label: '首付比例', type: 'number', unit: '%', placeholder: '如30' },
      { key: 'years', label: '贷款年限', type: 'number', unit: '年', placeholder: '请输入贷款年限' },
      { key: 'rate', label: '年利率', type: 'number', unit: '%', placeholder: '如4.5' }
    ],
    calculate: (data) => {
      const { carPrice, downPaymentRatio, years, rate } = data
      if (!carPrice || !downPaymentRatio || !years || !rate) return null
      const downPayment = carPrice * (downPaymentRatio / 100)
      const loanAmount = carPrice - downPayment
      const principal = loanAmount * 10000
      const months = years * 12
      const monthlyRate = rate / 100 / 12
      
      const monthlyPayment = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / 
                            (Math.pow(1 + monthlyRate, months) - 1)
      const totalPayment = monthlyPayment * months
      const totalCost = downPayment * 10000 + totalPayment
      
      return { downPayment: downPayment * 10000, loanAmount: loanAmount * 10000, monthlyPayment, totalCost }
    },
    outputs: [
      { key: 'downPayment', label: '首付', format: 'currency', unit: '元' },
      { key: 'loanAmount', label: '贷款金额', format: 'currency', unit: '元' },
      { key: 'monthlyPayment', label: '月供', format: 'currency', unit: '元' },
      { key: 'totalCost', label: '总花费', format: 'currency', unit: '元' }
    ]
  },
  {
    id: 'deposit',
    name: '存款利息计算器',
    industry: 'finance',
    icon: '🏦',
    description: '活期/定期存款利息计算',
    inputs: [
      { key: 'principal', label: '本金', type: 'number', unit: '元', placeholder: '请输入本金' },
      { key: 'months', label: '存期', type: 'number', unit: '月', placeholder: '请输入存期' },
      { key: 'rate', label: '年利率', type: 'number', unit: '%', placeholder: '如2.1' }
    ],
    calculate: (data) => {
      const { principal, months, rate } = data
      if (!principal || !months || !rate) return null
      const years = months / 12
      const interest = principal * (rate / 100) * years
      const total = principal + interest
      return { interest, total }
    },
    outputs: [
      { key: 'interest', label: '利息', format: 'currency', unit: '元' },
      { key: 'total', label: '本息合计', format: 'currency', unit: '元' }
    ]
  },
  {
    id: 'credit-card',
    name: '信用卡分期计算器',
    industry: 'finance',
    icon: '💳',
    description: '分期手续费计算',
    inputs: [
      { key: 'amount', label: '分期金额', type: 'number', unit: '元', placeholder: '请输入分期金额' },
      { key: 'periods', label: '分期期数', type: 'number', unit: '期', placeholder: '如12' },
      { key: 'feeRate', label: '每期手续费率', type: 'number', unit: '%', placeholder: '如0.6' }
    ],
    calculate: (data) => {
      const { amount, periods, feeRate } = data
      if (!amount || !periods || !feeRate) return null
      const monthlyPrincipal = amount / periods
      const monthlyFee = amount * (feeRate / 100)
      const monthlyPayment = monthlyPrincipal + monthlyFee
      const totalFee = monthlyFee * periods
      const totalPayment = amount + totalFee
      return { monthlyPayment, totalFee, totalPayment }
    },
    outputs: [
      { key: 'monthlyPayment', label: '每期还款', format: 'currency', unit: '元' },
      { key: 'totalFee', label: '总手续费', format: 'currency', unit: '元' },
      { key: 'totalPayment', label: '还款总额', format: 'currency', unit: '元' }
    ]
  },
  {
    id: 'investment',
    name: '投资收益计算器',
    industry: 'finance',
    icon: '📈',
    description: '复利投资收益计算',
    inputs: [
      { key: 'principal', label: '初始本金', type: 'number', unit: '元', placeholder: '请输入初始本金' },
      { key: 'years', label: '投资年限', type: 'number', unit: '年', placeholder: '请输入投资年限' },
      { key: 'rate', label: '年化收益率', type: 'number', unit: '%', placeholder: '如8' }
    ],
    calculate: (data) => {
      const { principal, years, rate } = data
      if (!principal || !years || !rate) return null
      const amount = principal * Math.pow(1 + rate / 100, years)
      const profit = amount - principal
      return { amount, profit }
    },
    outputs: [
      { key: 'amount', label: '期末资产', format: 'currency', unit: '元' },
      { key: 'profit', label: '收益', format: 'currency', unit: '元' }
    ]
  },
  {
    id: 'tax',
    name: '个人所得税计算器',
    industry: 'finance',
    icon: '💵',
    description: '个税计算',
    inputs: [
      { key: 'income', label: '税前收入', type: 'number', unit: '元', placeholder: '请输入税前收入' },
      { key: 'deduction', label: '专项附加扣除', type: 'number', unit: '元', placeholder: '如2000' }
    ],
    calculate: (data) => {
      const { income, deduction = 0 } = data
      if (!income) return null
      const threshold = 5000
      const taxable = Math.max(0, income - threshold - deduction)
      let tax = 0
      if (taxable <= 3000) {
        tax = taxable * 0.03
      } else if (taxable <= 12000) {
        tax = taxable * 0.1 - 210
      } else if (taxable <= 25000) {
        tax = taxable * 0.2 - 1410
      } else {
        tax = taxable * 0.25 - 2660
      }
      const afterTax = income - tax
      return { tax, afterTax, taxable }
    },
    outputs: [
      { key: 'taxable', label: '应纳税所得额', format: 'currency', unit: '元' },
      { key: 'tax', label: '应缴个税', format: 'currency', unit: '元' },
      { key: 'afterTax', label: '税后收入', format: 'currency', unit: '元' }
    ]
  }
]
