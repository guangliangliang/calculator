<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getCalculatorById } from '@/utils/calculator-config.js'
import { saveHistory, saveScheduleDetail, formatDateTime, formatValue } from '@/utils/formatter.js'
import DefaultResultPanel from '@/pages/calculator/components/DefaultResultPanel.vue'
import MortgageResultPanel from '@/pages/calculator/components/MortgageResultPanel.vue'
import CarLoanResultPanel from '@/pages/calculator/components/CarLoanResultPanel.vue'
import CreditCardResultPanel from '@/pages/calculator/components/CreditCardResultPanel.vue'
import TaxResultPanel from '@/pages/calculator/components/TaxResultPanel.vue'
import RenovationBudgetResultPanel from '@/pages/calculator/components/RenovationBudgetResultPanel.vue'
import EoqResultPanel from '@/pages/calculator/components/EoqResultPanel.vue'
import {
  buildCalculationPayload,
  getInputErrorMessage,
  getInitialInputs,
  getSelectLabel,
  validateCalculatorInputs
} from '@/utils/calculator-form.js'

const calculator = ref(null)
const inputs = ref({})
const results = ref(null)
const fieldErrors = ref({})
const debounceTimer = ref(null)

onLoad((options) => {
  if (!options.id) return

  calculator.value = getCalculatorById(options.id)
  if (!calculator.value) return

  inputs.value = getInitialInputs(calculator.value)
  uni.setNavigationBarTitle({
    title: calculator.value.name
  })
})

function updateInputValue(key, value) {
  inputs.value = {
    ...inputs.value,
    [key]: value
  }

  clearFieldError(key)

  if (debounceTimer.value) clearTimeout(debounceTimer.value)
  debounceTimer.value = setTimeout(() => {
    validateSingleField(key)
  }, 300)
}

function handleSelectChange(event, input) {
  const selectedIndex = Number(event.detail.value)
  const selectedOption = input.options?.[selectedIndex]
  if (!selectedOption) return
  updateInputValue(input.key, selectedOption.value)
}

function getSelectDisplay(input) {
  return getSelectLabel(input, inputs.value[input.key]) || input.placeholder || `请选择${input.label}`
}

function clearFieldError(key) {
  if (!fieldErrors.value[key]) return

  const nextErrors = { ...fieldErrors.value }
  delete nextErrors[key]
  fieldErrors.value = nextErrors
}

function validateSingleField(key) {
  if (!calculator.value) return

  const input = calculator.value.inputs.find(item => item.key === key)
  if (!input) return

  const payload = buildCalculationPayload(calculator.value, inputs.value)
  const errorMessage = getInputErrorMessage(input, payload[key])

  if (!errorMessage) return

  fieldErrors.value = {
    ...fieldErrors.value,
    [key]: errorMessage
  }
}

function hasFieldError(key) {
  return Boolean(fieldErrors.value[key])
}

function calculate() {
  if (!calculator.value) return

  const payload = buildCalculationPayload(calculator.value, inputs.value)
  const errors = validateCalculatorInputs(calculator.value, payload)

  fieldErrors.value = errors

  if (Object.keys(errors).length > 0) {
    return
  }

  const result = calculator.value.calculate(payload)
  if (!result) {
    uni.showToast({ title: '暂时无法完成计算，请检查输入', icon: 'none' })
    return
  }

  results.value = result
  saveHistory(calculator.value.id, payload, result)
  uni.vibrateShort()
}

function reset() {
  inputs.value = getInitialInputs(calculator.value)
  results.value = null
  fieldErrors.value = {}
}

function openScheduleDetail() {
  if (!calculator.value || !results.value?.schedule?.length) return

  const payload = buildCalculationPayload(calculator.value, inputs.value)
  const scheduleDetail = {
    calculatorId: calculator.value.id,
    calculatorName: calculator.value.name,
    resultRenderer: calculator.value.resultRenderer || '',
    inputs: payload,
    results: results.value
  }

  saveScheduleDetail(scheduleDetail)

  uni.navigateTo({
    url: `/pages/schedule-detail/index?calculatorId=${calculator.value.id}`,
    success: (res) => {
      res.eventChannel?.emit?.('scheduleDetail', scheduleDetail)
    }
  })
}

function formatResultsToText() {
  if (!calculator.value || !results.value) return ''

      const keyMap = {
        // 通用
        'result': '结果',
        'total': '总计',
        'totalCost': '总成本',
        'average': '平均值',
        'principal': '本金',
        
        // 金融/贷款
        'loanAmount': '贷款金额',
        'downPayment': '首付',
        'monthlyPayment': '月供',
        'firstMonthPayment': '首月月供',
        'lastMonthPayment': '末月月供',
        'totalPayment': '总还款',
        'totalInterest': '总利息',
        'interestRate': '利率',
        'months': '期数',
        'years': '年数',
        'repaymentMode': '还款方式',
        'remainingPrincipal': '剩余本金',
        'monthlyDecrease': '每月递减',
        'totalCost': '总花费',
        'monthlyPrincipal': '每月本金',
        
        // 存款
        'interest': '利息',
        
        // 投资
        'amount': '期末资产',
        'profit': '利润',
        
        // 个税
        'threshold': '起征点',
        'deduction': '专项附加扣除',
        'taxableIncome': '应纳税所得额',
        'quickDeduction': '速算扣除数',
        'taxable': '应纳税所得额',
        'tax': '个税',
        'afterTax': '税后收入',
        'afterTaxSalary': '税后到手',
        'afterTaxBonus': '税后奖金',
        'averageMonthlyBonus': '月均奖金',
        'bracketLabel': '税率档位',
        'taxableBonus': '月均奖金',
        'taxableIncome': '应纳税所得额',
        'taxRate': '税率',
        'quickDeduction': '速算扣除数',
        
        // 提前还款
        'elapsedMonths': '已还期数',
        'prepaymentAmount': '提前还款金额',
        'actualPrepaymentAmount': '实际还款金额',
        'newRemainingMonths': '剩余还款期数',
        'termReducedMonths': '缩短期数',
        'interestSaved': '节省利息',
        'interestPaid': '已付利息',
        
        // 餐饮/零售
        'salePrice': '售价',
        'sellingPrice': '售价',
        'price': '价格',
        'costPrice': '成本价',
        'targetMargin': '目标毛利率',
        'margin': '毛利率',
        'grossProfit': '毛利',
        'grossProfitRate': '毛利率',
        'netProfit': '净利',
        'profit': '利润',
        'profitRate': '利润率',
        'turnoverRate': '周转率',
        'inventoryTurnover': '库存周转',
        'breakEven': '盈亏平衡',
        'paybackPeriod': '回收期',
        'beginningInventory': '期初库存',
        'endingInventory': '期末库存',
        'avgInventory': '平均库存',
        'turnover': '周转率',
        'days': '周转天数',
        'originalPrice': '原价',
        'discountRate': '折扣率',
        'discountedPrice': '折后价',
        'monthlyRent': '月房租',
        'monthlyRevenue': '月营业额',
        'ratio': '占比',
        'monthlyLaborCost': '月人力成本',
        'employeeCount': '员工人数',
        'outputPerPerson': '人均产出',
        'actualPay': '实付金额',
        'saved': '节省金额',
        'points': '获得积分',
        'monthlySales': '月销量',
        'orderCost': '单次订货成本',
        'storageCost': '单位存储成本',
        'eoq': '经济订货批量',
        'annualDemand': '年需求',
        'orderTimes': '订货次数',
        'reorderCycleDays': '补货周期',
        'averageMonthlyOrders': '月均订货次数',
        'fixedCost': '固定成本',
        'grossMarginRate': '毛利率',
        'breakEvenRevenue': '保本营业额',
        'grossProfitNeeded': '所需毛利额',
        'tableCount': '餐桌数量',
        'avgTurnoversPerTable': '单桌日均翻台次数',
        'avgGuestsPerTable': '平均每桌人数',
        'avgSpendPerCustomer': '人均消费',
        'dailyTurnovers': '日翻台次数',
        'dailyCustomers': '日接待人数',
        'estimatedRevenue': '预计日营业额',
        'revenue': '营业额',
        'orderCount': '订单数',
        'averageOrderValue': '客单价',
        'orderAmount': '订单金额',
        'platformRate': '平台扣点',
        'deliveryFee': '配送费',
        'activityCost': '活动成本',
        'subsidy': '补贴',
        'platformCommission': '平台佣金',
        'netIncome': '到手收入',
        'netRate': '到手率',
        'initialInvestment': '总投资',
        'monthlyNetProfit': '月净利润',
        'paybackMonths': '回本周期月数',
        'paybackYears': '回本周期年数',
        
        // 建筑
        'roomArea': '房间面积',
        'tileLength': '瓷砖长度',
        'tileWidth': '瓷砖宽度',
        'tileArea': '瓷砖面积',
        'tilesNeeded': '需要瓷砖',
        'tilesWithWaste': '含损耗瓷砖',
        'tiles': '所需瓷砖',
        'wasteRate': '损耗率',
        'lossRate': '损耗率',
        'piecesPerBox': '每箱片数',
        'boxes': '箱数',
        'floorLength': '地板长度',
        'floorWidth': '地板宽度',
        'floorsNeeded': '需要地板',
        'floorsWithWaste': '含损耗地板',
        'floors': '所需地板',
        'wallArea': '墙面面积',
        'coats': '涂刷遍数',
        'coverage': '覆盖率',
        'bucketSize': '桶大小',
        'liters': '升数',
        'length': '长度',
        'width': '宽度',
        'height': '高度',
        'pricePerSqm': '每平米价格',
        'workload': '工程量',
        'dailyWork': '每日工作量',
        'days': '工期天数',
        'unitPrice': '单价',
        'quantity': '数量',
        'shipping': '运费',
        'subtotal': '小计',
        'wallLength': '墙体长度',
        'wallHeight': '墙体高度',
        'wallThickness': '墙体厚度',
        'brickLength': '砖块长度',
        'brickWidth': '砖块宽度',
        'brickHeight': '砖块高度',
        'mortarThickness': '灰缝厚度',
        'wallVolume': '墙体体积',
        'moduleVolume': '模数体积',
        'brickVolume': '砖块体积',
        'netBrickCount': '净砖数量',
        'brickCount': '砖块数量',
        'mortarVolume': '砂浆体积',
        'dryMortarVolume': '干砂浆体积',
        'cementVolume': '水泥体积',
        'sandVolume': '沙子体积',
        'cementWeight': '水泥重量',
        'socketCount': '插座数量',
        'switchCount': '开关数量',
        'lampCount': '灯位数量',
        'avgLengthPerPoint': '单点平均布线长度',
        'wireRuns': '回路数',
        'pointCount': '总点位数',
        'conduitLength': '线管长度',
        'wireLength': '电线长度',
        
        // 装修预算
        'grade': '装修档次',
        'gradeLabel': '档次名称',
        'styleDescription': '风格描述',
        'laborEstimate': '人工估算',
        'materialEstimate': '材料估算',
        'miscellaneousEstimate': '杂项估算',
        
        // 农业
        'waterVolume': '兑水量',
        'dilutionRatio': '稀释倍数',
        'sprayerCount': '喷雾器桶数',
        'totalWater': '总兑水量',
        'pesticideAmount': '需加药量',
        'solutionVolume': '配好药液',
        'areaMu': '种植面积亩数',
        'ratePerMu': '每亩用肥量',
        'bagWeight': '每袋重量',
        'netAmount': '理论用量',
        'totalAmount': '建议备量',
        'bags': '袋数',
        'rowSpacing': '行距',
        'plantSpacing': '株距',
        'plantArea': '单株面积',
        'plantsPerMu': '每亩株数',
        'totalPlants': '总株数',
        'seedRatePerMu': '每亩用种量',
        'germinationRate': '发芽率',
        'netSeed': '理论用种量',
        'adjustedSeed': '发芽率修正用量',
        'totalSeed': '建议备种量',
        'waterDepth': '灌水深度',
        'waterPrice': '水价',
        'waterCost': '水费估算',
        'yieldPerMu': '每亩产量',
        'totalYield': '总产量',
        'costPerMu': '每亩成本',
        'netProfit': '净利润',
        'profitPerMu': '亩均利润',
        'profitRate': '成本收益率',
        
        // 物流
        'length': '长度',
        'width': '宽度',
        'height': '高度',
        'cartonLength': '纸箱长度',
        'cartonWidth': '纸箱宽度',
        'cartonHeight': '纸箱高度',
        'pieces': '件数',
        'divisor': '计泡系数',
        'actualWeight': '实际重量',
        'volumeCbm': '总体积',
        'volumeWeight': '体积重量',
        'chargeableWeight': '计费重量',
        'weight': '重量',
        'distance': '距离',
        'pricePerKgKm': '吨公里单价',
        'baseFee': '起步费',
        'extraFee': '附加费',
        'lineHaulFee': '干线费用',
        'totalFreight': '总运费',
        'costPerKg': '每公斤费用',
        'volume': '体积',
        'weightRate': '重货单价',
        'volumeRate': '泡货单价',
        'minimumCharge': '最低收费',
        'weightFee': '按重量计费',
        'volumeFee': '按体积计费',
        'billingBase': '基础运费',
        'fuelConsumption': '百公里油耗',
        'fuelPrice': '油价',
        'tollFee': '过路费',
        'driverCost': '司机人工',
        'otherCost': '其他成本',
        'profitRate': '目标利润率',
        'totalCost': '总成本',
        'suggestedQuote': '建议报价',
        'grossProfit': '毛利润',
        'fuelUsed': '耗油量',
        'costPerKm': '每公里费用',
        'containerType': '柜型',
        'containerVolume': '货柜容积',
        'usedVolume': '已用体积',
        'volumeUtilization': '体积利用率',
        'lengthCount': '长度方向箱数',
        'widthCount': '宽度方向箱数',
        'heightCount': '高度方向箱数',
        'cartonCount': '可装箱数',
        
        // 人力
        'grossSalary': '税前工资',
        'socialInsurance': '社保',
        'specialDeduction': '专项附加扣除',
        'base': '缴费基数',
        'personalSocialRate': '个人社保比例',
        'companySocialRate': '公司社保比例',
        'personalFundRate': '个人公积金比例',
        'companyFundRate': '公司公积金比例',
        'personalSocial': '个人社保',
        'companySocial': '公司社保',
        'personalFund': '个人公积金',
        'companyFund': '公司公积金',
        'personalTotal': '个人合计',
        'companyTotal': '公司合计',
        'monthlySalary': '月工资',
        'workDaysPerMonth': '月计薪天数',
        'hoursPerDay': '每日工时',
        'overtimeHours': '加班小时',
        'multiplier': '加班倍数',
        'hourlyRate': '小时工资',
        'overtimePay': '加班费',
        'bonus': '年终奖',
        'averageMonthlyBonus': '月均奖金',
        'rate': '税率',
        'quickDeduction': '速算扣除数',
        'tax': '应缴个税',
        'companySocialFund': '公司社保公积金',
        'benefitCost': '福利补贴成本',
        'headcount': '员工人数',
        'costPerPerson': '单人月成本',
        'totalMonthlyCost': '月总成本',
        'totalAnnualCost': '年总成本',
        'extraCostRate': '工资外成本占比',
        'absenceDays': '缺勤天数',
        'absenceHours': '缺勤小时',
        'dailyRate': '日工资',
        'deduction': '缺勤扣款',
        'payableSalary': '应发工资'
      }

  const valueMap = {
    'equal-payment': '等额本息',
    'equal-principal': '等额本金'
  }

  // 格式化数值
  function formatNumber(num) {
    if (typeof num === 'number' && !Number.isNaN(num)) {
      // 所有数值都保留两位小数
      return num.toFixed(2)
    }
    return num
  }

  let text = `${calculator.value.name}\n`
  text += `计算时间：${formatDateTime()}\n\n`
  text += `【输入参数】\n`

  for (const input of calculator.value.inputs) {
    let value = inputs.value[input.key]
    if (value !== '' && value !== null && value !== undefined) {
      // 如果是 select 类型，找到对应的中文显示
      if (input.type === 'select' && input.options) {
        const option = input.options.find(opt => opt.value === value)
        if (option) {
          value = option.label
        }
      }
      // 如果不是 select，检查值翻译表
      else if (valueMap[value] !== undefined) {
        value = valueMap[value]
      }
      text += `${input.label}：${value}${input.unit || ''}\n`
    }
  }

  text += `\n【计算结果】\n`

  for (const [key, value] of Object.entries(results.value)) {
    if (key !== 'schedule') {
      const label = keyMap[key] || key
      let displayValue = valueMap[value] !== undefined ? valueMap[value] : value
      displayValue = formatNumber(displayValue)
      text += `${label}：${displayValue}\n`
    }
  }

  return text
}

function copyResults() {
  if (!results.value) {
    uni.showToast({ title: '暂无可复制的结果', icon: 'none' })
    return
  }

  const text = formatResultsToText()

  uni.setClipboardData({
    data: text,
    success: () => {
      uni.showToast({ title: '已复制到剪贴板', icon: 'success' })
    },
    fail: () => {
      uni.showToast({ title: '复制失败', icon: 'none' })
    }
  })
}
</script>

<template>
  <view class="page-shell">
    <scroll-view class="content-scroll" scroll-y enhanced show-scrollbar="{{false}}">
      <view class="page-container calculator-page" v-if="calculator">
        <view class="calculator-hero card">
          <view class="calculator-icon-wrap">
            <text class="calculator-icon">{{ calculator.icon }}</text>
          </view>
          <view class="calculator-meta">
            <text class="calculator-title">{{ calculator.name }}</text>
            <text class="calculator-desc">{{ calculator.description }}</text>
          </view>
        </view>

        <view class="input-section card">
          <view class="section-title">请输入信息</view>

          <view class="input-item" v-for="input in calculator.inputs" :key="input.key">
            <view class="input-label">
              <text v-if="input.required !== false" class="required-mark">*</text>
              {{ input.label }}
              <text v-if="input.required === false" class="optional-tag">选填</text>
            </view>

            <view class="input-wrapper" :class="{ 'input-wrapper-error': hasFieldError(input.key) }" v-if="input.type === 'select'">
              <picker
                mode="selector"
                :range="input.options.map(option => option.label)"
                @change="event => handleSelectChange(event, input)"
              >
                <view class="picker-value" :class="{ 'placeholder-text': !inputs[input.key] }">
                  {{ getSelectDisplay(input) }}
                </view>
              </picker>
            </view>

            <view class="input-wrapper" :class="{ 'input-wrapper-error': hasFieldError(input.key) }" v-else>
              <input
                class="input-field"
                type="digit"
                inputmode="decimal"
                :placeholder="input.placeholder"
                :value="inputs[input.key]"
                @input="event => updateInputValue(input.key, event.detail.value)"
              />
              <text v-if="input.unit" class="input-unit">{{ input.unit }}</text>
            </view>

            <text v-if="fieldErrors[input.key]" class="error-text">{{ fieldErrors[input.key] }}</text>
          </view>

          <view class="button-group">
            <button class="btn-reset" @click="reset">重置</button>
            <button class="btn-calculate" @click="calculate">计算</button>
          </view>
        </view>

        <block v-if="results">
          <view class="result-actions card">
            <text class="result-actions-title">计算结果</text>
            <button class="btn-copy" @click="copyResults">复制结果</button>
          </view>

          <MortgageResultPanel
            v-if="calculator.resultRenderer === 'mortgage'"
            :results="results"
            @view-schedule="openScheduleDetail"
          />
          <CarLoanResultPanel
            v-else-if="calculator.resultRenderer === 'car-loan'"
            :results="results"
            @view-schedule="openScheduleDetail"
          />
          <CreditCardResultPanel
            v-else-if="calculator.resultRenderer === 'credit-card'"
            :results="results"
            @view-schedule="openScheduleDetail"
          />
          <TaxResultPanel
            v-else-if="calculator.resultRenderer === 'tax'"
            :results="results"
          />
          <RenovationBudgetResultPanel
            v-else-if="calculator.resultRenderer === 'renovation-budget'"
            :results="results"
          />
          <EoqResultPanel
            v-else-if="calculator.resultRenderer === 'eoq'"
            :results="results"
          />
          <DefaultResultPanel
            v-else
            :calculator="calculator"
            :results="results"
          />
        </block>
      </view>
    </scroll-view>
  </view>
</template>

<style>
page {
  height: 100%;
  overflow: hidden;
}
</style>

<style scoped>
.page-shell {
  height: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.content-scroll {
  flex: 1;
  height: 0;
  overflow-y: auto;
}

.page-container {
  padding: 24rpx 30rpx calc(34rpx + env(safe-area-inset-bottom));
}

.calculator-hero {
  display: flex;
  align-items: center;
  gap: 22rpx;
  margin-bottom: 22rpx;
  padding: 26rpx;
  background: linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%);
}

.calculator-icon-wrap {
  width: 78rpx;
  height: 78rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #EEF2FF;
  border: 1rpx solid #E0E7FF;
}

.calculator-icon {
  font-size: 38rpx;
}

.calculator-meta {
  flex: 1;
  min-width: 0;
}

.calculator-title {
  display: block;
  font-size: 32rpx;
  font-weight: 700;
  color: #0F172A;
  line-height: 1.32;
}

.calculator-desc {
  display: block;
  margin-top: 8rpx;
  font-size: 24rpx;
  line-height: 1.45;
  color: #64748B;
}

.input-section {
  padding: 28rpx;
  margin-bottom: 24rpx;
  background: #FFFFFF;
}

.section-title {
  padding-left: 16rpx;
  border-left: 8rpx solid #6366F1;
  font-size: 28rpx;
  font-weight: 600;
  color: #0F172A;
  margin-bottom: 22rpx;
}

.input-item {
  margin-bottom: 22rpx;
}

.input-label {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 12rpx;
  font-size: 26rpx;
  color: #475569;
}

.required-mark {
  color: #EF4444;
  font-size: 30rpx;
  font-weight: 700;
}

.optional-tag {
  font-size: 22rpx;
  color: #94A3B8;
}

.input-wrapper {
  display: flex;
  align-items: center;
  background: #F9FBFF;
  border-radius: 14rpx;
  padding: 0 22rpx;
  min-height: 82rpx;
  border: 1rpx solid #E2E8F0;
}

.input-wrapper-error {
  border-color: #FCA5A5;
  background: #FEF2F2;
}

.input-field,
.picker-value {
  flex: 1;
  min-height: 82rpx;
  font-size: 27rpx;
  color: #2D3748;
  display: flex;
  align-items: center;
}

.placeholder-text {
  color: #94A3B8;
}

.input-unit {
  font-size: 24rpx;
  color: #7B8BA3;
  margin-left: 12rpx;
}

.error-text {
  display: block;
  margin-top: 10rpx;
  font-size: 24rpx;
  color: #DC2626;
  line-height: 1.4;
}

.button-group {
  display: flex;
  gap: 18rpx;
  margin-top: 18rpx;
}

.btn-reset,
.btn-calculate {
  height: 84rpx;
  border-radius: 42rpx;
  font-size: 28rpx;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 84rpx;
  padding: 0;
  margin: 0;
  box-shadow: none;
}

.btn-reset {
  flex: 1;
  background: #F8FAFC;
  color: #4A5568;
  border: 1rpx solid #E2E8F0;
}

.btn-calculate {
  flex: 2;
  background: linear-gradient(135deg, #6366F1 0%, #4F46E5 100%);
  color: #FFFFFF;
  border: none;
  box-shadow: 0 10rpx 18rpx rgba(79, 70, 229, 0.18);
}

.btn-reset::after,
.btn-calculate::after {
  border: none;
}

.result-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16rpx 24rpx;
  margin-bottom: 12rpx;
}

.result-actions-title {
  font-size: 26rpx;
  font-weight: 600;
  color: #0F172A;
}

.btn-copy {
  width: auto;
  margin: 0 0 0 auto;
  padding: 12rpx 24rpx;
  font-size: 24rpx;
  color: #6366F1;
  background: #EEF2FF;
  border-radius: 20rpx;
  border: none;
}

.btn-copy::after {
  border: none;
}
</style>
