function buildEqualPaymentSchedule(principal, months, monthlyRate, monthlyPayment) {
  let remainingPrincipal = principal

  return Array.from({ length: months }, (_, index) => {
    const interest = monthlyRate === 0 ? 0 : remainingPrincipal * monthlyRate
    const principalPayment = monthlyRate === 0 ? monthlyPayment : monthlyPayment - interest

    remainingPrincipal = Math.max(0, remainingPrincipal - principalPayment)

    return {
      period: index + 1,
      payment: monthlyPayment,
      principal: principalPayment,
      interest,
      remainingPrincipal
    }
  })
}

function buildEqualPrincipalSchedule(principal, months, monthlyRate) {
  const principalPayment = principal / months

  return Array.from({ length: months }, (_, index) => {
    const remainingBeforePayment = principal - principalPayment * index
    const interest = monthlyRate === 0 ? 0 : remainingBeforePayment * monthlyRate
    const payment = principalPayment + interest
    const remainingPrincipal = Math.max(0, principal - principalPayment * (index + 1))

    return {
      period: index + 1,
      payment,
      principal: principalPayment,
      interest,
      remainingPrincipal
    }
  })
}

function buildInstallmentSchedule(amount, periods, monthlyPrincipal, monthlyFee) {
  return Array.from({ length: periods }, (_, index) => {
    const remainingPrincipal = Math.max(0, amount - monthlyPrincipal * (index + 1))

    return {
      period: index + 1,
      payment: monthlyPrincipal + monthlyFee,
      principal: monthlyPrincipal,
      interest: monthlyFee,
      remainingPrincipal
    }
  })
}

function getEqualPaymentMonthlyPayment(principal, months, monthlyRate) {
  if (months <= 0) return null
  if (monthlyRate === 0) return principal / months

  return principal * monthlyRate * Math.pow(1 + monthlyRate, months) /
    (Math.pow(1 + monthlyRate, months) - 1)
}

function getRemainingPrincipalAfterPayments(principal, monthlyRate, monthlyPayment, paidMonths) {
  if (paidMonths <= 0) return principal
  if (monthlyRate === 0) return Math.max(0, principal - monthlyPayment * paidMonths)

  return principal * Math.pow(1 + monthlyRate, paidMonths) -
    monthlyPayment * ((Math.pow(1 + monthlyRate, paidMonths) - 1) / monthlyRate)
}

function getMonthsToPayoff(principal, monthlyPayment, monthlyRate) {
  if (principal <= 0) return 0
  if (monthlyRate === 0) return principal / monthlyPayment
  if (monthlyPayment <= principal * monthlyRate) return null

  return Math.log(monthlyPayment / (monthlyPayment - principal * monthlyRate)) / Math.log(1 + monthlyRate)
}

export const financeCalculators = [
  {
    id: 'mortgage',
    name: '房贷计算器',
    industry: 'finance',
    icon: '🏠',
    description: '支持等额本息、等额本金及分期还款明细测算',
    resultRenderer: 'mortgage',
    inputs: [
      { key: 'amount', label: '贷款金额', type: 'number', unit: '万元', placeholder: '请输入贷款金额', min: 0 },
      { key: 'years', label: '贷款年限', type: 'number', unit: '年', placeholder: '请输入贷款年限', min: 0.1 },
      { key: 'rate', label: '年利率', type: 'number', unit: '%', placeholder: '例如 3.5', min: 0 },
      {
        key: 'repaymentMode',
        label: '还款方式',
        type: 'select',
        default: 'equal-payment',
        options: [
          { label: '等额本息', value: 'equal-payment' },
          { label: '等额本金', value: 'equal-principal' }
        ]
      }
    ],
    calculate: (data) => {
      const { amount, years, rate } = data
      const repaymentMode = data.repaymentMode || 'equal-payment'
      if (amount == null || years == null || rate == null) return null

      const principal = amount * 10000
      const months = Math.round(years * 12)
      const monthlyRate = rate / 100 / 12
      if (months <= 0) return null

      if (repaymentMode === 'equal-principal') {
        const schedule = buildEqualPrincipalSchedule(principal, months, monthlyRate)
        const firstMonthPayment = schedule[0]?.payment ?? 0
        const lastMonthPayment = schedule[schedule.length - 1]?.payment ?? 0
        const monthlyDecrease = schedule.length > 1 ? schedule[0].payment - schedule[1].payment : 0
        const totalPayment = schedule.reduce((sum, item) => sum + item.payment, 0)
        const totalInterest = totalPayment - principal

        return {
          repaymentMode,
          principal,
          months,
          firstMonthPayment,
          lastMonthPayment,
          monthlyDecrease,
          totalPayment,
          totalInterest,
          schedule
        }
      }

      const monthlyPayment = monthlyRate === 0
        ? principal / months
        : principal * monthlyRate * Math.pow(1 + monthlyRate, months) /
          (Math.pow(1 + monthlyRate, months) - 1)
      const totalPayment = monthlyPayment * months
      const totalInterest = totalPayment - principal
      const schedule = buildEqualPaymentSchedule(principal, months, monthlyRate, monthlyPayment)

      return {
        repaymentMode,
        principal,
        months,
        monthlyPayment,
        totalPayment,
        totalInterest,
        schedule
      }
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
    description: '支持首付、贷款额、月供和分期还款明细展示',
    resultRenderer: 'car-loan',
    inputs: [
      { key: 'carPrice', label: '车价', type: 'number', unit: '万元', placeholder: '请输入车价', min: 0 },
      { key: 'downPaymentRatio', label: '首付比例', type: 'number', unit: '%', placeholder: '例如 30', min: 0, max: 100 },
      { key: 'years', label: '贷款年限', type: 'number', unit: '年', placeholder: '请输入贷款年限', min: 0.1 },
      { key: 'rate', label: '年利率', type: 'number', unit: '%', placeholder: '例如 4.5', min: 0 }
    ],
    calculate: (data) => {
      const { carPrice, downPaymentRatio, years, rate } = data
      if (carPrice == null || downPaymentRatio == null || years == null || rate == null) return null

      const downPayment = carPrice * (downPaymentRatio / 100)
      const loanAmount = carPrice - downPayment
      const principal = loanAmount * 10000
      const months = Math.round(years * 12)
      const monthlyRate = rate / 100 / 12
      if (months <= 0) return null

      const monthlyPayment = monthlyRate === 0
        ? principal / months
        : principal * monthlyRate * Math.pow(1 + monthlyRate, months) /
          (Math.pow(1 + monthlyRate, months) - 1)
      const totalPayment = monthlyPayment * months
      const totalCost = downPayment * 10000 + totalPayment
      const totalInterest = totalPayment - principal
      const schedule = buildEqualPaymentSchedule(principal, months, monthlyRate, monthlyPayment)

      return {
        downPayment: downPayment * 10000,
        loanAmount: loanAmount * 10000,
        principal,
        months,
        monthlyPayment,
        totalCost,
        totalPayment,
        totalInterest,
        schedule
      }
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
    description: '按单利估算定期或短期存款利息',
    inputs: [
      { key: 'principal', label: '本金', type: 'number', unit: '元', placeholder: '请输入本金', min: 0 },
      { key: 'months', label: '存期', type: 'number', unit: '月', placeholder: '请输入存期', min: 0.1 },
      { key: 'rate', label: '年利率', type: 'number', unit: '%', placeholder: '例如 2.1', min: 0 }
    ],
    calculate: (data) => {
      const { principal, months, rate } = data
      if (principal == null || months == null || rate == null) return null

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
    description: '按每期手续费率估算分期成本',
    resultRenderer: 'credit-card',
    inputs: [
      { key: 'amount', label: '分期金额', type: 'number', unit: '元', placeholder: '请输入分期金额', min: 0 },
      { key: 'periods', label: '分期期数', type: 'number', unit: '期', placeholder: '例如 12', min: 1 },
      { key: 'feeRate', label: '每期手续费率', type: 'number', unit: '%', placeholder: '例如 0.6', min: 0 }
    ],
    calculate: (data) => {
      const { amount, periods, feeRate } = data
      if (amount == null || periods == null || feeRate == null) return null

      const monthlyPrincipal = amount / periods
      const monthlyFee = amount * (feeRate / 100)
      const monthlyPayment = monthlyPrincipal + monthlyFee
      const totalFee = monthlyFee * periods
      const totalPayment = amount + totalFee
      const schedule = buildInstallmentSchedule(amount, periods, monthlyPrincipal, monthlyFee)

      return {
        principal: amount,
        months: periods,
        monthlyPrincipal,
        monthlyFee,
        monthlyPayment,
        totalFee,
        totalPayment,
        schedule
      }
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
    description: '按年化收益率进行复利测算',
    inputs: [
      { key: 'principal', label: '初始本金', type: 'number', unit: '元', placeholder: '请输入初始本金', min: 0 },
      { key: 'years', label: '投资年限', type: 'number', unit: '年', placeholder: '请输入投资年限', min: 0 },
      { key: 'rate', label: '年化收益率', type: 'number', unit: '%', placeholder: '例如 6', min: -100 }
    ],
    calculate: (data) => {
      const { principal, years, rate } = data
      if (principal == null || years == null || rate == null) return null

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
    icon: '🧾',
    description: '按月度起征点和超额累进税率估算个税',
    resultRenderer: 'tax',
    inputs: [
      { key: 'income', label: '税前收入', type: 'number', unit: '元', placeholder: '请输入税前收入', min: 0 },
      { key: 'deduction', label: '专项附加扣除', type: 'number', unit: '元', placeholder: '例如 2000', min: 0, required: false }
    ],
    calculate: (data) => {
      const { income, deduction = 0 } = data
      if (income == null) return null

      const threshold = 5000
      const taxable = Math.max(0, income - threshold - deduction)
      let tax = 0
      let rate = 0
      let quickDeduction = 0
      let bracketLabel = '无需缴税'

      if (taxable <= 3000) {
        tax = taxable * 0.03
        rate = 0.03
        bracketLabel = '3% 税率档'
      } else if (taxable <= 12000) {
        tax = taxable * 0.1 - 210
        rate = 0.1
        quickDeduction = 210
        bracketLabel = '10% 税率档'
      } else if (taxable <= 25000) {
        tax = taxable * 0.2 - 1410
        rate = 0.2
        quickDeduction = 1410
        bracketLabel = '20% 税率档'
      } else if (taxable <= 35000) {
        tax = taxable * 0.25 - 2660
        rate = 0.25
        quickDeduction = 2660
        bracketLabel = '25% 税率档'
      } else if (taxable <= 55000) {
        tax = taxable * 0.3 - 4410
        rate = 0.3
        quickDeduction = 4410
        bracketLabel = '30% 税率档'
      } else if (taxable <= 80000) {
        tax = taxable * 0.35 - 7160
        rate = 0.35
        quickDeduction = 7160
        bracketLabel = '35% 税率档'
      } else {
        tax = taxable * 0.45 - 15160
        rate = 0.45
        quickDeduction = 15160
        bracketLabel = '45% 税率档'
      }

      const afterTax = income - tax
      return {
        threshold,
        deduction,
        taxable,
        rate,
        quickDeduction,
        bracketLabel,
        tax,
        afterTax
      }
    },
    outputs: [
      { key: 'taxable', label: '应纳税所得额', format: 'currency', unit: '元' },
      { key: 'tax', label: '应缴个税', format: 'currency', unit: '元' },
      { key: 'afterTax', label: '税后收入', format: 'currency', unit: '元' }
    ]
  },
  {
    id: 'early-repayment',
    name: '提前还贷计算器',
    industry: 'finance',
    icon: '💸',
    description: '按等额本息估算提前还款后的剩余期限和节省利息',
    inputs: [
      { key: 'amount', label: '贷款金额', type: 'number', unit: '万元', placeholder: '请输入贷款金额', min: 0.01 },
      { key: 'years', label: '贷款年限', type: 'number', unit: '年', placeholder: '请输入贷款年限', min: 0.1 },
      { key: 'rate', label: '年利率', type: 'number', unit: '%', placeholder: '例如 3.6', min: 0 },
      { key: 'elapsedMonths', label: '已还期数', type: 'number', unit: '期', placeholder: '请输入已还期数', min: 0 },
      { key: 'prepaymentAmount', label: '提前还款金额', type: 'number', unit: '元', placeholder: '请输入提前还款金额', min: 0.01 }
    ],
    calculate: (data) => {
      const { amount, years, rate, elapsedMonths, prepaymentAmount } = data
      if (amount == null || years == null || rate == null || elapsedMonths == null || prepaymentAmount == null) return null

      const principal = amount * 10000
      const months = Math.round(years * 12)
      const paidMonths = Math.floor(elapsedMonths)
      const monthlyRate = rate / 100 / 12
      if (months <= 0 || paidMonths < 0 || paidMonths >= months) return null

      const monthlyPayment = getEqualPaymentMonthlyPayment(principal, months, monthlyRate)
      if (monthlyPayment == null) return null

      const remainingPrincipal = Math.max(0, getRemainingPrincipalAfterPayments(principal, monthlyRate, monthlyPayment, paidMonths))
      if (prepaymentAmount >= remainingPrincipal) {
        const interestPaid = monthlyPayment * paidMonths - (principal - remainingPrincipal)
        const originalRemainingInterest = monthlyPayment * (months - paidMonths) - remainingPrincipal

        return {
          monthlyPayment,
          remainingPrincipal,
          actualPrepaymentAmount: remainingPrincipal,
          newRemainingMonths: 0,
          termReducedMonths: months - paidMonths,
          interestSaved: originalRemainingInterest,
          interestPaid
        }
      }

      const principalAfterPrepayment = remainingPrincipal - prepaymentAmount
      const newRemainingMonths = getMonthsToPayoff(principalAfterPrepayment, monthlyPayment, monthlyRate)
      if (newRemainingMonths == null) return null

      const originalRemainingMonths = months - paidMonths
      const originalRemainingInterest = monthlyPayment * originalRemainingMonths - remainingPrincipal
      const newRemainingInterest = monthlyPayment * newRemainingMonths - principalAfterPrepayment
      const termReducedMonths = originalRemainingMonths - newRemainingMonths
      const interestSaved = originalRemainingInterest - newRemainingInterest
      const interestPaid = monthlyPayment * paidMonths - (principal - remainingPrincipal)

      return {
        monthlyPayment,
        remainingPrincipal,
        actualPrepaymentAmount: prepaymentAmount,
        newRemainingMonths,
        termReducedMonths,
        interestSaved,
        interestPaid
      }
    },
    outputs: [
      { key: 'monthlyPayment', label: '原月供', format: 'currency', unit: '元' },
      { key: 'remainingPrincipal', label: '提前还款前剩余本金', format: 'currency', unit: '元' },
      { key: 'newRemainingMonths', label: '剩余还款期数', format: 'number', unit: '期', precision: 1 },
      { key: 'termReducedMonths', label: '缩短期数', format: 'number', unit: '期', precision: 1 },
      { key: 'interestSaved', label: '节省利息', format: 'currency', unit: '元' }
    ]
  }
]
