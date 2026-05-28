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

const calculatorDir = path.join(__dirname, '..', 'utils', 'calculators')
const calculatorConfigs = [
  ...loadExport(path.join(calculatorDir, 'catering.js'), 'cateringCalculators'),
  ...loadExport(path.join(calculatorDir, 'construction.js'), 'constructionCalculators'),
  ...loadExport(path.join(calculatorDir, 'finance.js'), 'financeCalculators')
]

function assert(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

function approxEqual(actual, expected, epsilon = 0.01) {
  return Math.abs(actual - expected) <= epsilon
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

function testMortgage() {
  const calculator = calculatorConfigs.find(item => item.id === 'mortgage')
  const result = calculator.calculate({ amount: 100, years: 30, rate: 3.6 })
  assert(approxEqual(result.monthlyPayment, 4546.49, 0.1), 'Mortgage monthly payment mismatch')
}

function testMortgageZeroRate() {
  const calculator = calculatorConfigs.find(item => item.id === 'mortgage')
  const result = calculator.calculate({ amount: 12, years: 1, rate: 0 })
  assert(approxEqual(result.monthlyPayment, 10000, 0.01), 'Zero-rate mortgage should divide principal evenly')
}

function testMortgageEqualPrincipal() {
  const calculator = calculatorConfigs.find(item => item.id === 'mortgage')
  const result = calculator.calculate({ amount: 12, years: 1, rate: 0, repaymentMode: 'equal-principal' })
  assert(approxEqual(result.firstMonthPayment, 10000, 0.01), 'Equal-principal first payment mismatch')
  assert(approxEqual(result.monthlyDecrease, 0, 0.01), 'Zero-rate equal-principal should not decrease monthly')
  assert(result.schedule.length === 12, 'Equal-principal schedule length mismatch')
}

function testCreditCardSchedule() {
  const calculator = calculatorConfigs.find(item => item.id === 'credit-card')
  const result = calculator.calculate({ amount: 12000, periods: 12, feeRate: 0.6 })
  assert(approxEqual(result.monthlyPrincipal, 1000, 0.01), 'Credit card monthly principal mismatch')
  assert(approxEqual(result.monthlyFee, 72, 0.01), 'Credit card monthly fee mismatch')
  assert(result.schedule.length === 12, 'Credit card schedule length mismatch')
  assert(approxEqual(result.schedule[0].remainingPrincipal, 11000, 0.01), 'Credit card remaining principal mismatch')
}

function testTaxMetadata() {
  const calculator = calculatorConfigs.find(item => item.id === 'tax')
  const result = calculator.calculate({ income: 19000, deduction: 2000 })
  assert(result.bracketLabel === '10% 税率档', 'Tax bracket label mismatch')
  assert(approxEqual(result.quickDeduction, 210, 0.01), 'Tax quick deduction mismatch')
}

function testRenovationBudgetMetadata() {
  const calculator = calculatorConfigs.find(item => item.id === 'renovation-budget')
  const result = calculator.calculate({ area: 100, grade: 'high' })
  assert(result.gradeLabel === '高档', 'Renovation grade label mismatch')
  assert(result.materialEstimate > result.laborEstimate, 'Renovation material estimate should exceed labor estimate')
}

function testEoqMetadata() {
  const calculator = calculatorConfigs.find(item => item.id === 'eoq')
  const result = calculator.calculate({ monthlySales: 100, orderCost: 50, storageCost: 2 })
  assert(result.annualDemand === 1200, 'EOQ annual demand mismatch')
  assert(result.reorderCycleDays > 0, 'EOQ reorder cycle should be positive')
}

function testPricingBoundary() {
  const calculator = calculatorConfigs.find(item => item.id === 'pricing')
  const result = calculator.calculate({ costPrice: 20, targetMargin: 100 })
  assert(result === null, 'Pricing should reject 100% margin')
}

function testMaterialTotal() {
  const calculator = calculatorConfigs.find(item => item.id === 'material-total')
  const result = calculator.calculate({ unitPrice: 50, quantity: 0, shipping: 20 })
  assert(result.total === 20, 'Material total should allow zero quantity')
}

function testTaxHighBracket() {
  const calculator = calculatorConfigs.find(item => item.id === 'tax')
  const result = calculator.calculate({ income: 100000, deduction: 0 })
  assert(result.tax > 20000, 'High-bracket tax should use the upper tax tiers')
}

function testRenovationBudget() {
  const calculator = calculatorConfigs.find(item => item.id === 'renovation-budget')
  const result = calculator.calculate({ area: 100, grade: 'high' })
  assert(result.total === 200000, 'Renovation budget select mapping mismatch')
}

function testBreakEvenPoint() {
  const calculator = calculatorConfigs.find(item => item.id === 'break-even-point')
  const result = calculator.calculate({ fixedCost: 30000, grossMarginRate: 60 })
  assert(approxEqual(result.breakEvenRevenue, 50000, 0.01), 'Break-even revenue mismatch')
}

function testTableTurnover() {
  const calculator = calculatorConfigs.find(item => item.id === 'table-turnover')
  const result = calculator.calculate({
    tableCount: 10,
    avgTurnoversPerTable: 3,
    avgGuestsPerTable: 4,
    avgSpendPerCustomer: 50
  })
  assert(result.dailyCustomers === 120, 'Table turnover customer count mismatch')
  assert(result.estimatedRevenue === 6000, 'Table turnover revenue mismatch')
}

function testDeliveryNetIncome() {
  const calculator = calculatorConfigs.find(item => item.id === 'delivery-net-income')
  const result = calculator.calculate({
    orderAmount: 100,
    platformRate: 18,
    deliveryFee: 6,
    activityCost: 5,
    subsidy: 3
  })
  assert(approxEqual(result.platformCommission, 18, 0.01), 'Delivery commission mismatch')
  assert(approxEqual(result.netIncome, 74, 0.01), 'Delivery net income mismatch')
}

function testStorePayback() {
  const calculator = calculatorConfigs.find(item => item.id === 'store-payback')
  const result = calculator.calculate({ initialInvestment: 240000, monthlyNetProfit: 20000 })
  assert(approxEqual(result.paybackMonths, 12, 0.01), 'Store payback month mismatch')
}

function testCementSandBrick() {
  const calculator = calculatorConfigs.find(item => item.id === 'cement-sand-brick')
  const result = calculator.calculate({ wallLength: 5, wallHeight: 3 })
  assert(result.brickCount > 0, 'Brick count should be positive')
  assert(result.cementWeight > 0, 'Cement weight should be positive')
}

function testWireConduit() {
  const calculator = calculatorConfigs.find(item => item.id === 'wire-conduit')
  const result = calculator.calculate({
    socketCount: 10,
    switchCount: 8,
    lampCount: 6,
    avgLengthPerPoint: 8
  })
  assert(result.pointCount === 24, 'Wire conduit point count mismatch')
  assert(approxEqual(result.conduitLength, 211.2, 0.01), 'Conduit length mismatch')
}

function testEarlyRepayment() {
  const calculator = calculatorConfigs.find(item => item.id === 'early-repayment')
  const result = calculator.calculate({
    amount: 100,
    years: 30,
    rate: 3.6,
    elapsedMonths: 24,
    prepaymentAmount: 100000
  })
  assert(result.remainingPrincipal > result.actualPrepaymentAmount, 'Remaining principal should exceed prepayment amount')
  assert(result.interestSaved > 0, 'Early repayment should save interest')
  assert(result.termReducedMonths > 0, 'Early repayment should reduce term')
}

function run() {
  testUniqueIds()
  testConfigShape()
  testMortgage()
  testMortgageZeroRate()
  testMortgageEqualPrincipal()
  testCreditCardSchedule()
  testTaxMetadata()
  testPricingBoundary()
  testMaterialTotal()
  testTaxHighBracket()
  testRenovationBudget()
  testRenovationBudgetMetadata()
  testEoqMetadata()
  testBreakEvenPoint()
  testTableTurnover()
  testDeliveryNetIncome()
  testStorePayback()
  testCementSandBrick()
  testWireConduit()
  testEarlyRepayment()
  console.log(`Calculator verification passed: ${calculatorConfigs.length} calculators checked`)
}

run()
