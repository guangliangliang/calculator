import { cateringCalculators } from "@/utils/calculators/catering.js";
import { constructionCalculators } from "@/utils/calculators/construction.js";
import { financeCalculators } from "@/utils/calculators/finance.js";
import { agricultureCalculators } from "@/utils/calculators/agriculture.js";
import { logisticsCalculators } from "@/utils/calculators/logistics.js";
import { hrCalculators } from "@/utils/calculators/hr.js";

export const industries = [
  {
    id: "catering",
    name: "餐饮/零售",
    icon: "🍽️",
    color: "#F97316",
    gradient: "linear-gradient(135deg, #F97316 0%, #FB923C 100%)",
    description: "毛利、定价、库存与经营指标计算",
  },
  {
    id: "construction",
    name: "建筑/装修",
    icon: "🏗️",
    color: "#06B6D4",
    gradient: "linear-gradient(135deg, #06B6D4 0%, #22D3EE 100%)",
    description: "材料用量、预算、工期等施工测算",
  },
  {
    id: "finance",
    name: "银行/金融",
    icon: "💼",
    color: "#8B5CF6",
    gradient: "linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)",
    description: "贷款、投资、分期和个税测算",
  },
  {
    id: "agriculture",
    name: "农业种植",
    icon: "🌾",
    color: "#16A34A",
    gradient: "linear-gradient(135deg, #16A34A 0%, #4ADE80 100%)",
    description: "农药稀释、施肥、播种、灌溉和收益测算",
  },
  {
    id: "logistics",
    name: "货运物流",
    icon: "🚚",
    color: "#2563EB",
    gradient: "linear-gradient(135deg, #2563EB 0%, #38BDF8 100%)",
    description: "体积重、运费、油耗、零担和装柜测算",
  },
  {
    id: "hr",
    name: "人力薪酬",
    icon: "👥",
    color: "#0F766E",
    gradient: "linear-gradient(135deg, #0F766E 0%, #2DD4BF 100%)",
    description: "税后工资、社保公积金、用工成本测算",
  },
];

export const calculatorConfigs = [
  ...cateringCalculators,
  ...constructionCalculators,
  ...financeCalculators,
  ...agricultureCalculators,
  ...logisticsCalculators,
  ...hrCalculators,
];

export function getCalculatorsByIndustry(industryId) {
  return calculatorConfigs.filter(
    (calculator) => calculator.industry === industryId,
  );
}

export function getCalculatorById(id) {
  return calculatorConfigs.find((calculator) => calculator.id === id);
}
