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

function run() {
  testUniqueIds()
  testConfigShape()
  testMortgage()
  testMortgageZeroRate()
  testPricingBoundary()
  testMaterialTotal()
  testTaxHighBracket()
  testRenovationBudget()
  console.log(`Calculator verification passed: ${calculatorConfigs.length} calculators checked`)
}

run()
