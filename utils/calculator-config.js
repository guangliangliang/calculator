import { cateringCalculators } from '@/utils/calculators/catering.js'
import { constructionCalculators } from '@/utils/calculators/construction.js'
import { financeCalculators } from '@/utils/calculators/finance.js'

export const industries = [
  {
    id: 'catering',
    name: '餐饮/零售',
    icon: '🍽️',
    color: '#F97316',
    gradient: 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)',
    description: '毛利、定价、库存与经营指标计算'
  },
  {
    id: 'construction',
    name: '建筑/装修',
    icon: '🏗️',
    color: '#06B6D4',
    gradient: 'linear-gradient(135deg, #06B6D4 0%, #22D3EE 100%)',
    description: '材料用量、预算、工期等施工测算'
  },
  {
    id: 'finance',
    name: '银行/金融',
    icon: '💼',
    color: '#8B5CF6',
    gradient: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
    description: '贷款、投资、分期和个税测算'
  }
]

export const calculatorConfigs = [
  ...cateringCalculators,
  ...constructionCalculators,
  ...financeCalculators
]

export function getCalculatorsByIndustry(industryId) {
  return calculatorConfigs.filter(calculator => calculator.industry === industryId)
}

export function getCalculatorById(id) {
  return calculatorConfigs.find(calculator => calculator.id === id)
}
