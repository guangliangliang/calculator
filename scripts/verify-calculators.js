const fs = require('fs')
const path = require('path')
const vm = require('vm')

function loadExport(filePath, exportName) {
  const source = fs.readFileSync(filePath, 'utf8')
  const transformed = source.replace(
    new RegExp(`export const ${exportName}\\s*=`, 'u'),
    `globalThis.${exportName} =`
  )

  const context = vm.createContext({
    Math,
    console,
    globalThis: {}
  })

  new vm.Script(transformed, { filename: filePath }).runInContext(context)
  return context.globalThis[exportName]
}

function loadFunctions(filePath, functionNames) {
  const source = fs.readFileSync(filePath, 'utf8')
  const transformed = source.replace(/export function /gu, 'function ') +
    `\n${functionNames.map(name => `globalThis.${name} = ${name}`).join('\n')}`

  const context = vm.createContext({
    Number,
    Object,
    String,
    globalThis: {}
  })

  new vm.Script(transformed, { filename: filePath }).runInContext(context)
  return functionNames.reduce((acc, name) => {
    acc[name] = context.globalThis[name]
    assert(typeof acc[name] === 'function', `${name} function is missing`)
    return acc
  }, {})
}

const calculatorDir = path.join(__dirname, '..', 'utils', 'calculators')
const calculatorConfigs = [
  ...loadExport(path.join(calculatorDir, 'catering.js'), 'cateringCalculators'),
  ...loadExport(path.join(calculatorDir, 'construction.js'), 'constructionCalculators'),
  ...loadExport(path.join(calculatorDir, 'finance.js'), 'financeCalculators'),
  ...loadExport(path.join(calculatorDir, 'agriculture.js'), 'agricultureCalculators'),
  ...loadExport(path.join(calculatorDir, 'logistics.js'), 'logisticsCalculators'),
  ...loadExport(path.join(calculatorDir, 'hr.js'), 'hrCalculators')
]
const {
  buildCalculationPayload,
  validateCalculatorInputs
} = loadFunctions(path.join(__dirname, '..', 'utils', 'calculator-form.js'), [
  'buildCalculationPayload',
  'validateCalculatorInputs'
])

const samplePayloads = {
  'gross-margin': { costPrice: 60, salePrice: 100 },
  pricing: { costPrice: 60, targetMargin: 40 },
  'inventory-turnover': { beginningInventory: 10000, endingInventory: 20000, costOfSales: 90000 },
  'promotion-discount': { originalPrice: 100, discountRate: 8.5, costPrice: 60 },
  'rent-ratio': { monthlyRent: 15000, monthlyRevenue: 100000 },
  'labor-cost': { monthlyLaborCost: 25000, monthlyRevenue: 100000, employeeCount: 5 },
  'member-discount': { amount: 200, discountRate: 9, pointRatio: 2 },
  eoq: { monthlySales: 100, orderCost: 50, storageCost: 2 },
  'break-even-point': { fixedCost: 30000, grossMarginRate: 60 },
  'table-turnover': { tableCount: 10, avgTurnoversPerTable: 3, avgGuestsPerTable: 4, avgSpendPerCustomer: 50 },
  'average-order-value': { revenue: 20000, orderCount: 100 },
  'delivery-net-income': { orderAmount: 100, platformRate: 18, deliveryFee: 6, activityCost: 5, subsidy: 3 },
  'store-payback': { initialInvestment: 240000, monthlyNetProfit: 20000 },
  tile: { roomArea: 36, tileLength: 600, tileWidth: 600, wasteRate: 5, piecesPerBox: 10 },
  flooring: { roomArea: 18, floorLength: 1200, floorWidth: 150, wasteRate: 5, piecesPerBox: 20 },
  paint: { wallArea: 100, coats: 2, coverage: 10, bucketSize: 5 },
  'area-volume': { length: 5, width: 4, height: 3 },
  hydropower: { area: 100, pricePerSqm: 150 },
  duration: { workload: 100, dailyWork: 15 },
  'material-total': { unitPrice: 50, quantity: 10, shipping: 20 },
  'renovation-budget': { area: 100, grade: 'high' },
  'cement-sand-brick': { wallLength: 5, wallHeight: 3 },
  'wire-conduit': { socketCount: 10, switchCount: 8, lampCount: 6, avgLengthPerPoint: 8 },
  mortgage: { amount: 100, years: 30, rate: 3.6 },
  'car-loan': { carPrice: 20, downPaymentRatio: 30, years: 3, rate: 4.5 },
  deposit: { principal: 100000, months: 12, rate: 2.1 },
  'credit-card': { amount: 12000, periods: 12, feeRate: 0.6 },
  investment: { principal: 10000, years: 3, rate: 6 },
  tax: { income: 19000, deduction: 2000 },
  'early-repayment': { amount: 100, years: 30, rate: 3.6, elapsedMonths: 24, prepaymentAmount: 100000 },
  'pesticide-dilution': { waterVolume: 15, dilutionRatio: 500, sprayerCount: 2 },
  'fertilizer-amount': { areaMu: 10, ratePerMu: 25, bagWeight: 40, lossRate: 5 },
  'planting-density': { areaMu: 2, rowSpacing: 50, plantSpacing: 40 },
  'seed-amount': { areaMu: 5, seedRatePerMu: 2, germinationRate: 80, lossRate: 10 },
  'irrigation-water': { areaMu: 3, waterDepth: 30, waterPrice: 1.2 },
  'crop-profit': { areaMu: 10, yieldPerMu: 500, salePrice: 3, costPerMu: 800 },
  'volumetric-weight': { length: 60, width: 40, height: 50, pieces: 10, divisor: 6000, actualWeight: 180 },
  'freight-cost': { weight: 1000, distance: 500, pricePerKgKm: 0.02, baseFee: 100, extraFee: 50 },
  'truckload-freight': { distance: 800, fuelConsumption: 30, fuelPrice: 7.5, tollFee: 1000, driverCost: 800, otherCost: 200, profitRate: 15 },
  'ltl-freight': { weight: 500, volume: 3, weightRate: 0.8, volumeRate: 180, minimumCharge: 500, extraFee: 100 },
  'fuel-cost': { distance: 800, fuelConsumption: 30, fuelPrice: 7.5 },
  'container-loading': { containerType: '40hq', cartonLength: 60, cartonWidth: 40, cartonHeight: 50 },
  'after-tax-salary': { grossSalary: 20000, socialInsurance: 2200, housingFund: 1400, specialDeduction: 2000 },
  'social-fund': { base: 10000, personalSocialRate: 10.5, companySocialRate: 25, personalFundRate: 7, companyFundRate: 7 },
  'overtime-pay': { monthlySalary: 10000, workDaysPerMonth: 21.75, hoursPerDay: 8, overtimeHours: 10, multiplier: 1.5 },
  'annual-bonus-tax': { bonus: 120000 },
  'company-labor-cost': { grossSalary: 12000, companySocialFund: 3600, benefitCost: 800, headcount: 5 },
  'attendance-deduction': { monthlySalary: 10000, workDaysPerMonth: 21.75, hoursPerDay: 8, absenceDays: 1, absenceHours: 4 }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

function approxEqual(actual, expected, epsilon = 0.01) {
  return Math.abs(actual - expected) <= epsilon
}

function getCalculator(id) {
  const calculator = calculatorConfigs.find(item => item.id === id)
  assert(calculator, `${id} calculator is missing`)
  return calculator
}

function calculate(id, payload = samplePayloads[id]) {
  assert(payload, `${id} is missing a sample payload`)
  const result = getCalculator(id).calculate(payload)
  assert(result !== null, `${id} returned null for sample payload`)
  return result
}

function buildRawInputs(calculator, payload) {
  const rawInputs = {}

  for (const input of calculator.inputs) {
    if (input.default !== undefined) {
      rawInputs[input.key] = String(input.default)
    }
  }

  for (const [key, value] of Object.entries(payload)) {
    rawInputs[key] = value === null || value === undefined ? value : String(value)
  }

  return rawInputs
}

function testUniqueIds() {
  const ids = calculatorConfigs.map(calculator => calculator.id)
  assert(new Set(ids).size === ids.length, 'Calculator ids must be unique')
}

function testConfigShape() {
  for (const calculator of calculatorConfigs) {
    assert(typeof calculator.name === 'string' && calculator.name.length > 0, `${calculator.id} is missing a name`)
    assert(Array.isArray(calculator.inputs) && calculator.inputs.length > 0, `${calculator.id} has no inputs`)
    assert(Array.isArray(calculator.outputs) && calculator.outputs.length > 0, `${calculator.id} has no outputs`)
    assert(typeof calculator.calculate === 'function', `${calculator.id} is missing calculate()`)
  }
}

function testSampleCoverage() {
  for (const calculator of calculatorConfigs) {
    assert(samplePayloads[calculator.id], `${calculator.id} is missing sample payload coverage`)
  }

  for (const id of Object.keys(samplePayloads)) {
    getCalculator(id)
  }
}

function testDeclaredOutputsAreProduced() {
  for (const calculator of calculatorConfigs) {
    const result = calculate(calculator.id)

    for (const output of calculator.outputs) {
      assert(Object.prototype.hasOwnProperty.call(result, output.key), `${calculator.id} is missing output ${output.key}`)
      assert(result[output.key] !== undefined, `${calculator.id}.${output.key} is undefined`)
    }
  }
}

function testUiCalculationFlow() {
  for (const calculator of calculatorConfigs) {
    const rawInputs = buildRawInputs(calculator, samplePayloads[calculator.id])
    const payload = buildCalculationPayload(calculator, rawInputs)
    const errors = validateCalculatorInputs(calculator, payload)
    const errorKeys = Object.keys(errors)
    assert(errorKeys.length === 0, `${calculator.id} has UI validation errors: ${errorKeys.join(',')}`)

    const result = calculator.calculate(payload)
    assert(result !== null, `${calculator.id} UI calculation returned null`)

    for (const output of calculator.outputs) {
      assert(Object.prototype.hasOwnProperty.call(result, output.key), `${calculator.id} UI result is missing output ${output.key}`)
      assert(result[output.key] !== undefined, `${calculator.id} UI result ${output.key} is undefined`)
    }
  }
}

function testCateringCalculators() {
  let result = calculate('gross-margin')
  assert(approxEqual(result.profit, 40), 'Gross margin profit mismatch')
  assert(approxEqual(result.margin, 40), 'Gross margin percentage mismatch')

  result = calculate('pricing')
  assert(approxEqual(result.salePrice, 100), 'Pricing sale price mismatch')
  assert(approxEqual(result.profit, 40), 'Pricing profit mismatch')

  result = calculate('inventory-turnover')
  assert(approxEqual(result.turnover, 6), 'Inventory turnover mismatch')
  assert(approxEqual(result.days, 365 / 6), 'Inventory turnover days mismatch')

  result = calculate('promotion-discount')
  assert(approxEqual(result.discountedPrice, 85), 'Promotion discounted price mismatch')
  assert(approxEqual(result.profit, 25), 'Promotion profit mismatch')
  assert(approxEqual(result.profitRate, 25 / 85 * 100), 'Promotion profit rate mismatch')

  result = calculate('rent-ratio')
  assert(approxEqual(result.ratio, 15), 'Rent ratio mismatch')

  result = calculate('labor-cost')
  assert(approxEqual(result.ratio, 25), 'Labor cost ratio mismatch')
  assert(approxEqual(result.outputPerPerson, 20000), 'Labor output per person mismatch')

  result = calculate('member-discount')
  assert(approxEqual(result.actualPay, 180), 'Member discount actual pay mismatch')
  assert(approxEqual(result.saved, 20), 'Member discount saved mismatch')
  assert(approxEqual(result.points, 400), 'Member discount points mismatch')

  result = calculate('eoq')
  assert(result.eoq === 71, 'EOQ suggested batch mismatch')
  assert(result.annualDemand === 1200, 'EOQ annual demand mismatch')
  assert(approxEqual(result.orderTimes, 1200 / Math.sqrt(5000)), 'EOQ order times mismatch')

  result = calculate('break-even-point')
  assert(approxEqual(result.breakEvenRevenue, 50000), 'Break-even revenue mismatch')
  assert(approxEqual(result.grossProfitNeeded, 30000), 'Break-even gross profit mismatch')

  result = calculate('table-turnover')
  assert(approxEqual(result.dailyTurnovers, 30), 'Table turnover count mismatch')
  assert(approxEqual(result.dailyCustomers, 120), 'Table customer count mismatch')
  assert(approxEqual(result.estimatedRevenue, 6000), 'Table revenue mismatch')

  result = calculate('average-order-value')
  assert(approxEqual(result.averageOrderValue, 200), 'Average order value mismatch')

  result = calculate('delivery-net-income')
  assert(approxEqual(result.platformCommission, 18), 'Delivery commission mismatch')
  assert(approxEqual(result.netIncome, 74), 'Delivery net income mismatch')
  assert(approxEqual(result.netRate, 74), 'Delivery net rate mismatch')

  result = calculate('store-payback')
  assert(approxEqual(result.paybackMonths, 12), 'Store payback month mismatch')
  assert(approxEqual(result.paybackYears, 1), 'Store payback year mismatch')
}

function testConstructionCalculators() {
  let result = calculate('tile')
  assert(result.tiles === 105, 'Tile count mismatch')
  assert(result.boxes === 11, 'Tile box count mismatch')

  result = calculate('flooring')
  assert(result.floors === 105, 'Flooring count mismatch')
  assert(result.boxes === 6, 'Flooring box count mismatch')

  result = calculate('paint')
  assert(approxEqual(result.liters, 20), 'Paint liters mismatch')
  assert(result.buckets === 4, 'Paint bucket count mismatch')

  result = calculate('area-volume')
  assert(approxEqual(result.area, 20), 'Area mismatch')
  assert(approxEqual(result.volume, 60), 'Volume mismatch')

  result = calculate('hydropower')
  assert(approxEqual(result.total, 15000), 'Hydropower total mismatch')

  result = calculate('duration')
  assert(result.days === 7, 'Duration days mismatch')

  result = calculate('material-total')
  assert(approxEqual(result.subtotal, 500), 'Material subtotal mismatch')
  assert(approxEqual(result.total, 520), 'Material total mismatch')

  result = calculate('renovation-budget')
  assert(approxEqual(result.pricePerSqm, 2000), 'Renovation price per sqm mismatch')
  assert(approxEqual(result.total, 200000), 'Renovation budget total mismatch')
  assert(approxEqual(result.materialEstimate, 100000), 'Renovation material estimate mismatch')
  assert(approxEqual(result.laborEstimate, 70000), 'Renovation labor estimate mismatch')
  assert(approxEqual(result.miscellaneousEstimate, 30000), 'Renovation miscellaneous estimate mismatch')

  result = calculate('cement-sand-brick')
  assert(result.brickCount > 0, 'Brick count should be positive')
  assert(result.mortarVolume > 0, 'Mortar volume should be positive')
  assert(result.cementWeight > 0, 'Cement weight should be positive')
  assert(result.sandVolume > 0, 'Sand volume should be positive')

  result = calculate('wire-conduit')
  assert(result.pointCount === 24, 'Wire conduit point count mismatch')
  assert(approxEqual(result.conduitLength, 211.2), 'Wire conduit length mismatch')
  assert(approxEqual(result.wireLength, 633.6), 'Wire length mismatch')
}

function testFinanceCalculators() {
  let result = calculate('mortgage')
  assert(approxEqual(result.monthlyPayment, 4546.49, 0.1), 'Mortgage monthly payment mismatch')
  assert(result.schedule.length === 360, 'Mortgage schedule length mismatch')

  result = getCalculator('mortgage').calculate({ amount: 12, years: 1, rate: 0 })
  assert(approxEqual(result.monthlyPayment, 10000), 'Zero-rate mortgage monthly payment mismatch')

  result = getCalculator('mortgage').calculate({ amount: 12, years: 1, rate: 0, repaymentMode: 'equal-principal' })
  assert(approxEqual(result.firstMonthPayment, 10000), 'Equal-principal first payment mismatch')
  assert(approxEqual(result.monthlyDecrease, 0), 'Zero-rate equal-principal monthly decrease mismatch')
  assert(result.schedule.length === 12, 'Equal-principal schedule length mismatch')

  result = calculate('car-loan')
  assert(approxEqual(result.downPayment, 60000), 'Car loan down payment mismatch')
  assert(approxEqual(result.loanAmount, 140000), 'Car loan amount mismatch')
  assert(result.schedule.length === 36, 'Car loan schedule length mismatch')

  result = calculate('deposit')
  assert(approxEqual(result.interest, 2100), 'Deposit interest mismatch')
  assert(approxEqual(result.total, 102100), 'Deposit total mismatch')

  result = calculate('credit-card')
  assert(approxEqual(result.monthlyPrincipal, 1000), 'Credit card monthly principal mismatch')
  assert(approxEqual(result.monthlyFee, 72), 'Credit card monthly fee mismatch')
  assert(approxEqual(result.monthlyPayment, 1072), 'Credit card monthly payment mismatch')
  assert(approxEqual(result.totalFee, 864), 'Credit card total fee mismatch')
  assert(approxEqual(result.totalPayment, 12864), 'Credit card total payment mismatch')
  assert(result.schedule.length === 12, 'Credit card schedule length mismatch')

  result = calculate('investment')
  assert(approxEqual(result.amount, 11910.16), 'Investment amount mismatch')
  assert(approxEqual(result.profit, 1910.16), 'Investment profit mismatch')

  result = calculate('tax')
  assert(approxEqual(result.taxable, 12000), 'Taxable income mismatch')
  assert(approxEqual(result.rate, 0.1), 'Tax rate mismatch')
  assert(approxEqual(result.quickDeduction, 210), 'Tax quick deduction mismatch')
  assert(approxEqual(result.tax, 990), 'Tax amount mismatch')
  assert(approxEqual(result.afterTax, 18010), 'After-tax income mismatch')

  result = getCalculator('tax').calculate({ income: 100000, deduction: 0 })
  assert(result.tax > 20000, 'High-bracket tax should use upper tax tiers')

  result = calculate('early-repayment')
  assert(result.remainingPrincipal > result.actualPrepaymentAmount, 'Remaining principal should exceed prepayment amount')
  assert(result.interestSaved > 0, 'Early repayment should save interest')
  assert(result.termReducedMonths > 0, 'Early repayment should reduce term')
}

function testAgricultureCalculators() {
  let result = calculate('pesticide-dilution')
  assert(approxEqual(result.totalWater, 30), 'Pesticide dilution total water mismatch')
  assert(approxEqual(result.pesticideAmount, 60), 'Pesticide dilution amount mismatch')
  assert(approxEqual(result.solutionVolume, 30.06), 'Pesticide dilution solution volume mismatch')

  result = calculate('fertilizer-amount')
  assert(approxEqual(result.netAmount, 250), 'Fertilizer net amount mismatch')
  assert(approxEqual(result.totalAmount, 262.5), 'Fertilizer total amount mismatch')
  assert(result.bags === 7, 'Fertilizer bag count mismatch')

  result = calculate('planting-density')
  assert(approxEqual(result.plantsPerMu, 3333.35), 'Planting density per mu mismatch')
  assert(approxEqual(result.totalPlants, 6666.7), 'Planting density total plants mismatch')

  result = calculate('seed-amount')
  assert(approxEqual(result.netSeed, 10), 'Seed net amount mismatch')
  assert(approxEqual(result.adjustedSeed, 12.5), 'Seed adjusted amount mismatch')
  assert(approxEqual(result.totalSeed, 13.75), 'Seed total amount mismatch')

  result = calculate('irrigation-water')
  assert(approxEqual(result.waterVolume, 60.0003), 'Irrigation water volume mismatch')
  assert(approxEqual(result.waterCost, 72.00036), 'Irrigation water cost mismatch')

  result = calculate('crop-profit')
  assert(approxEqual(result.totalYield, 5000), 'Crop profit total yield mismatch')
  assert(approxEqual(result.revenue, 15000), 'Crop profit revenue mismatch')
  assert(approxEqual(result.totalCost, 8000), 'Crop profit total cost mismatch')
  assert(approxEqual(result.netProfit, 7000), 'Crop profit net profit mismatch')
  assert(approxEqual(result.profitPerMu, 700), 'Crop profit per mu mismatch')
  assert(approxEqual(result.profitRate, 87.5), 'Crop profit rate mismatch')
}

function testLogisticsCalculators() {
  let result = calculate('volumetric-weight')
  assert(approxEqual(result.volumeCbm, 1.2), 'Volumetric weight volume mismatch')
  assert(approxEqual(result.volumeWeight, 200), 'Volumetric weight mismatch')
  assert(approxEqual(result.chargeableWeight, 200), 'Volumetric chargeable weight mismatch')

  result = calculate('freight-cost')
  assert(approxEqual(result.lineHaulFee, 10000), 'Freight line-haul fee mismatch')
  assert(approxEqual(result.totalFreight, 10150), 'Freight total mismatch')
  assert(approxEqual(result.costPerKg, 10.15), 'Freight cost per kg mismatch')

  result = calculate('truckload-freight')
  assert(approxEqual(result.fuelCost, 1800), 'Truckload fuel cost mismatch')
  assert(approxEqual(result.totalCost, 3800), 'Truckload total cost mismatch')
  assert(approxEqual(result.suggestedQuote, 4370), 'Truckload quote mismatch')
  assert(approxEqual(result.grossProfit, 570), 'Truckload gross profit mismatch')

  result = calculate('ltl-freight')
  assert(approxEqual(result.weightFee, 400), 'LTL weight fee mismatch')
  assert(approxEqual(result.volumeFee, 540), 'LTL volume fee mismatch')
  assert(approxEqual(result.billingBase, 540), 'LTL billing base mismatch')
  assert(approxEqual(result.totalFreight, 640), 'LTL total freight mismatch')

  result = calculate('fuel-cost')
  assert(approxEqual(result.fuelUsed, 240), 'Fuel used mismatch')
  assert(approxEqual(result.fuelCost, 1800), 'Fuel cost mismatch')
  assert(approxEqual(result.costPerKm, 2.25), 'Fuel cost per km mismatch')

  result = calculate('container-loading')
  assert(result.lengthCount === 20, 'Container length count mismatch')
  assert(result.widthCount === 5, 'Container width count mismatch')
  assert(result.heightCount === 5, 'Container height count mismatch')
  assert(result.cartonCount === 500, 'Container carton count mismatch')
  assert(approxEqual(result.volumeUtilization, 78.86, 0.1), 'Container utilization mismatch')
}

function testHrCalculators() {
  let result = calculate('after-tax-salary')
  assert(approxEqual(result.taxableIncome, 9400), 'After-tax salary taxable income mismatch')
  assert(approxEqual(result.tax, 730), 'After-tax salary tax mismatch')
  assert(approxEqual(result.afterTaxSalary, 15670), 'After-tax salary net income mismatch')

  result = calculate('social-fund')
  assert(approxEqual(result.personalSocial, 1050), 'Social fund personal social mismatch')
  assert(approxEqual(result.companySocial, 2500), 'Social fund company social mismatch')
  assert(approxEqual(result.personalFund, 700), 'Social fund personal fund mismatch')
  assert(approxEqual(result.companyFund, 700), 'Social fund company fund mismatch')
  assert(approxEqual(result.personalTotal, 1750), 'Social fund personal total mismatch')
  assert(approxEqual(result.companyTotal, 3200), 'Social fund company total mismatch')

  result = calculate('overtime-pay')
  assert(approxEqual(result.hourlyRate, 57.47, 0.01), 'Overtime hourly rate mismatch')
  assert(approxEqual(result.overtimePay, 862.07, 0.01), 'Overtime pay mismatch')

  result = calculate('annual-bonus-tax')
  assert(approxEqual(result.averageMonthlyBonus, 10000), 'Annual bonus average mismatch')
  assert(approxEqual(result.rate, 10), 'Annual bonus tax rate mismatch')
  assert(approxEqual(result.quickDeduction, 210), 'Annual bonus quick deduction mismatch')
  assert(approxEqual(result.tax, 11790), 'Annual bonus tax mismatch')
  assert(approxEqual(result.afterTaxBonus, 108210), 'Annual bonus after-tax mismatch')

  result = calculate('company-labor-cost')
  assert(approxEqual(result.costPerPerson, 16400), 'Company labor cost per person mismatch')
  assert(approxEqual(result.totalMonthlyCost, 82000), 'Company labor monthly cost mismatch')
  assert(approxEqual(result.totalAnnualCost, 984000), 'Company labor annual cost mismatch')
  assert(approxEqual(result.extraCostRate, 36.6667), 'Company labor extra cost rate mismatch')

  result = calculate('attendance-deduction')
  assert(approxEqual(result.dailyRate, 459.77, 0.01), 'Attendance daily rate mismatch')
  assert(approxEqual(result.hourlyRate, 57.47, 0.01), 'Attendance hourly rate mismatch')
  assert(approxEqual(result.deduction, 689.66, 0.01), 'Attendance deduction mismatch')
  assert(approxEqual(result.payableSalary, 9310.34, 0.01), 'Attendance payable salary mismatch')
}

function testBoundaries() {
  assert(getCalculator('pricing').calculate({ costPrice: 20, targetMargin: 100 }) === null, 'Pricing should reject 100% margin')
  assert(getCalculator('material-total').calculate({ unitPrice: 50, quantity: 0, shipping: 20 }).total === 20, 'Material total should allow zero quantity')
}

function run() {
  testUniqueIds()
  testConfigShape()
  testSampleCoverage()
  testDeclaredOutputsAreProduced()
  testUiCalculationFlow()
  testCateringCalculators()
  testConstructionCalculators()
  testFinanceCalculators()
  testAgricultureCalculators()
  testLogisticsCalculators()
  testHrCalculators()
  testBoundaries()
  console.log(`Calculator verification passed: ${calculatorConfigs.length} calculators checked`)
}

run()
