export const hrCalculators = [
  {
    id: 'after-tax-salary',
    name: '税后工资计算器',
    industry: 'hr',
    icon: '💵',
    description: '按税前工资、社保公积金和专项扣除估算税后收入',
    inputs: [
      { key: 'grossSalary', label: '税前工资', type: 'number', unit: '元', placeholder: '请输入税前工资', min: 0 },
      { key: 'socialInsurance', label: '个人社保', type: 'number', unit: '元', placeholder: '选填', min: 0, required: false },
      { key: 'housingFund', label: '个人公积金', type: 'number', unit: '元', placeholder: '选填', min: 0, required: false },
      { key: 'specialDeduction', label: '专项附加扣除', type: 'number', unit: '元', placeholder: '选填', min: 0, required: false }
    ],
    calculate: (data) => {
      const { grossSalary, socialInsurance = 0, housingFund = 0, specialDeduction = 0 } = data
      if (grossSalary == null) return null

      const threshold = 5000
      const taxableIncome = Math.max(0, grossSalary - socialInsurance - housingFund - specialDeduction - threshold)
      let tax = 0

      if (taxableIncome <= 3000) {
        tax = taxableIncome * 0.03
      } else if (taxableIncome <= 12000) {
        tax = taxableIncome * 0.1 - 210
      } else if (taxableIncome <= 25000) {
        tax = taxableIncome * 0.2 - 1410
      } else if (taxableIncome <= 35000) {
        tax = taxableIncome * 0.25 - 2660
      } else if (taxableIncome <= 55000) {
        tax = taxableIncome * 0.3 - 4410
      } else if (taxableIncome <= 80000) {
        tax = taxableIncome * 0.35 - 7160
      } else {
        tax = taxableIncome * 0.45 - 15160
      }

      const afterTaxSalary = grossSalary - socialInsurance - housingFund - tax

      return { taxableIncome, tax, afterTaxSalary }
    },
    outputs: [
      { key: 'taxableIncome', label: '应纳税所得额', format: 'currency', unit: '元' },
      { key: 'tax', label: '个人所得税', format: 'currency', unit: '元' },
      { key: 'afterTaxSalary', label: '税后到手', format: 'currency', unit: '元' }
    ]
  },
  {
    id: 'social-fund',
    name: '社保公积金计算器',
    industry: 'hr',
    icon: '🏦',
    description: '按缴费基数和比例计算个人及公司缴纳金额',
    inputs: [
      { key: 'base', label: '缴费基数', type: 'number', unit: '元', placeholder: '请输入缴费基数', min: 0 },
      { key: 'personalSocialRate', label: '个人社保比例', type: 'number', unit: '%', placeholder: '例如 10.5', min: 0 },
      { key: 'companySocialRate', label: '公司社保比例', type: 'number', unit: '%', placeholder: '例如 25', min: 0 },
      { key: 'personalFundRate', label: '个人公积金比例', type: 'number', unit: '%', placeholder: '例如 7', min: 0 },
      { key: 'companyFundRate', label: '公司公积金比例', type: 'number', unit: '%', placeholder: '例如 7', min: 0 }
    ],
    calculate: (data) => {
      const { base, personalSocialRate, companySocialRate, personalFundRate, companyFundRate } = data
      if (base == null || personalSocialRate == null || companySocialRate == null || personalFundRate == null || companyFundRate == null) return null

      const personalSocial = base * personalSocialRate / 100
      const companySocial = base * companySocialRate / 100
      const personalFund = base * personalFundRate / 100
      const companyFund = base * companyFundRate / 100
      const personalTotal = personalSocial + personalFund
      const companyTotal = companySocial + companyFund

      return { personalSocial, companySocial, personalFund, companyFund, personalTotal, companyTotal }
    },
    outputs: [
      { key: 'personalSocial', label: '个人社保', format: 'currency', unit: '元' },
      { key: 'personalFund', label: '个人公积金', format: 'currency', unit: '元' },
      { key: 'personalTotal', label: '个人合计', format: 'currency', unit: '元' },
      { key: 'companyTotal', label: '公司合计', format: 'currency', unit: '元' }
    ]
  },
  {
    id: 'overtime-pay',
    name: '加班费计算器',
    industry: 'hr',
    icon: '⏱️',
    description: '按月工资、加班小时和倍数计算加班费',
    inputs: [
      { key: 'monthlySalary', label: '月工资', type: 'number', unit: '元', placeholder: '请输入月工资', min: 0 },
      { key: 'workDaysPerMonth', label: '月计薪天数', type: 'number', unit: '天', placeholder: '默认 21.75', default: 21.75, min: 0.01, required: false },
      { key: 'hoursPerDay', label: '每日工时', type: 'number', unit: '小时', placeholder: '默认 8', default: 8, min: 0.01, required: false },
      { key: 'overtimeHours', label: '加班小时', type: 'number', unit: '小时', placeholder: '请输入加班小时', min: 0 },
      { key: 'multiplier', label: '加班倍数', type: 'number', unit: '倍', placeholder: '例如 1.5/2/3', min: 0 }
    ],
    calculate: (data) => {
      const { monthlySalary, workDaysPerMonth = 21.75, hoursPerDay = 8, overtimeHours, multiplier } = data
      if (monthlySalary == null || workDaysPerMonth == null || hoursPerDay == null || overtimeHours == null || multiplier == null) return null

      const hourlyRate = monthlySalary / workDaysPerMonth / hoursPerDay
      const overtimePay = hourlyRate * overtimeHours * multiplier

      return { hourlyRate, overtimePay }
    },
    outputs: [
      { key: 'hourlyRate', label: '小时工资', format: 'currency', unit: '元/小时' },
      { key: 'overtimePay', label: '加班费', format: 'currency', unit: '元' }
    ]
  },
  {
    id: 'annual-bonus-tax',
    name: '年终奖个税计算器',
    industry: 'hr',
    icon: '🎁',
    description: '按全年一次性奖金方式估算年终奖个税',
    inputs: [
      { key: 'bonus', label: '年终奖金额', type: 'number', unit: '元', placeholder: '请输入年终奖金额', min: 0 }
    ],
    calculate: (data) => {
      const { bonus } = data
      if (bonus == null) return null

      const averageMonthlyBonus = bonus / 12
      let rate = 0.03
      let quickDeduction = 0

      if (averageMonthlyBonus <= 3000) {
        rate = 0.03
        quickDeduction = 0
      } else if (averageMonthlyBonus <= 12000) {
        rate = 0.1
        quickDeduction = 210
      } else if (averageMonthlyBonus <= 25000) {
        rate = 0.2
        quickDeduction = 1410
      } else if (averageMonthlyBonus <= 35000) {
        rate = 0.25
        quickDeduction = 2660
      } else if (averageMonthlyBonus <= 55000) {
        rate = 0.3
        quickDeduction = 4410
      } else if (averageMonthlyBonus <= 80000) {
        rate = 0.35
        quickDeduction = 7160
      } else {
        rate = 0.45
        quickDeduction = 15160
      }

      const tax = Math.max(0, bonus * rate - quickDeduction)
      const afterTaxBonus = bonus - tax

      return { averageMonthlyBonus, rate: rate * 100, quickDeduction, tax, afterTaxBonus }
    },
    outputs: [
      { key: 'averageMonthlyBonus', label: '月均奖金', format: 'currency', unit: '元' },
      { key: 'rate', label: '适用税率', format: 'percent', unit: '%' },
      { key: 'tax', label: '应缴个税', format: 'currency', unit: '元' },
      { key: 'afterTaxBonus', label: '税后奖金', format: 'currency', unit: '元' }
    ]
  },
  {
    id: 'company-labor-cost',
    name: '企业用工成本计算器',
    industry: 'hr',
    icon: '👥',
    description: '按工资、公司社保公积金和福利成本估算总用工成本',
    inputs: [
      { key: 'grossSalary', label: '员工税前工资', type: 'number', unit: '元', placeholder: '请输入税前工资', min: 0 },
      { key: 'companySocialFund', label: '公司社保公积金', type: 'number', unit: '元', placeholder: '请输入公司缴纳额', min: 0 },
      { key: 'benefitCost', label: '福利/补贴成本', type: 'number', unit: '元', placeholder: '选填', min: 0, required: false },
      { key: 'headcount', label: '员工人数', type: 'number', unit: '人', placeholder: '默认 1', default: 1, min: 1, required: false }
    ],
    calculate: (data) => {
      const { grossSalary, companySocialFund, benefitCost = 0, headcount = 1 } = data
      if (grossSalary == null || companySocialFund == null || headcount == null) return null

      const costPerPerson = grossSalary + companySocialFund + benefitCost
      const totalMonthlyCost = costPerPerson * headcount
      const totalAnnualCost = totalMonthlyCost * 12
      const extraCostRate = grossSalary === 0 ? null : ((costPerPerson - grossSalary) / grossSalary) * 100

      return { costPerPerson, totalMonthlyCost, totalAnnualCost, extraCostRate }
    },
    outputs: [
      { key: 'costPerPerson', label: '单人月成本', format: 'currency', unit: '元' },
      { key: 'totalMonthlyCost', label: '月总成本', format: 'currency', unit: '元' },
      { key: 'totalAnnualCost', label: '年总成本', format: 'currency', unit: '元' },
      { key: 'extraCostRate', label: '工资外成本占比', format: 'percent', unit: '%' }
    ]
  },
  {
    id: 'attendance-deduction',
    name: '缺勤扣款计算器',
    industry: 'hr',
    icon: '📅',
    description: '按月工资、缺勤天数和小时估算应扣工资',
    inputs: [
      { key: 'monthlySalary', label: '月工资', type: 'number', unit: '元', placeholder: '请输入月工资', min: 0 },
      { key: 'workDaysPerMonth', label: '月计薪天数', type: 'number', unit: '天', placeholder: '默认 21.75', default: 21.75, min: 0.01, required: false },
      { key: 'hoursPerDay', label: '每日工时', type: 'number', unit: '小时', placeholder: '默认 8', default: 8, min: 0.01, required: false },
      { key: 'absenceDays', label: '缺勤天数', type: 'number', unit: '天', placeholder: '选填', min: 0, required: false },
      { key: 'absenceHours', label: '缺勤小时', type: 'number', unit: '小时', placeholder: '选填', min: 0, required: false }
    ],
    calculate: (data) => {
      const { monthlySalary, workDaysPerMonth = 21.75, hoursPerDay = 8, absenceDays = 0, absenceHours = 0 } = data
      if (monthlySalary == null || workDaysPerMonth == null || hoursPerDay == null) return null

      const dailyRate = monthlySalary / workDaysPerMonth
      const hourlyRate = dailyRate / hoursPerDay
      const deduction = dailyRate * absenceDays + hourlyRate * absenceHours
      const payableSalary = Math.max(0, monthlySalary - deduction)

      return { dailyRate, hourlyRate, deduction, payableSalary }
    },
    outputs: [
      { key: 'dailyRate', label: '日工资', format: 'currency', unit: '元/天' },
      { key: 'hourlyRate', label: '小时工资', format: 'currency', unit: '元/小时' },
      { key: 'deduction', label: '缺勤扣款', format: 'currency', unit: '元' },
      { key: 'payableSalary', label: '应发工资', format: 'currency', unit: '元' }
    ]
  }
]
