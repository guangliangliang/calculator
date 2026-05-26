import { cateringCalculators } from './calculators/catering.js'
import { constructionCalculators } from './calculators/construction.js'
import { financeCalculators } from './calculators/finance.js'

export const industries = [
  {
    id: 'catering',
    name: '餐饮/零售',
    icon: '🍽️',
    color: '#F97316',
    gradient: 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)',
    description: '毛利率、定价、库存等经营计算'
  },
  {
    id: 'construction',
    name: '建筑/装修',
    icon: '🏗️',
    color: '#06B6D4',
    gradient: 'linear-gradient(135deg, #06B6D4 0%, #22D3EE 100%)',
    description: '瓷砖、地板、涂料等材料计算'
  },
  {
    id: 'finance',
    name: '银行/金融',
    icon: '💰',
    color: '#8B5CF6',
    gradient: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
    description: '房贷、车贷、投资收益计算'
  }
]

export const calculatorConfigs = [
  ...cateringCalculators,
  ...constructionCalculators,
  ...financeCalculators
]

export function getCalculatorsByIndustry(industryId) {
  return calculatorConfigs.filter(c => c.industry === industryId)
}

export function getCalculatorById(id) {
  return calculatorConfigs.find(c => c.id === id)
}
