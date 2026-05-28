export const constructionCalculators = [
  {
    id: 'tile',
    name: '瓷砖用量计算器',
    industry: 'construction',
    icon: '🧱',
    description: '按面积、规格和损耗率估算瓷砖与箱数',
    inputs: [
      { key: 'roomArea', label: '房间面积', type: 'number', unit: '㎡', placeholder: '请输入房间面积', min: 0.01 },
      { key: 'tileLength', label: '瓷砖长度', type: 'number', unit: 'mm', placeholder: '例如 600', min: 1 },
      { key: 'tileWidth', label: '瓷砖宽度', type: 'number', unit: 'mm', placeholder: '例如 600', min: 1 },
      { key: 'wasteRate', label: '损耗率', type: 'number', unit: '%', placeholder: '默认 5', default: 5, min: 0, required: false },
      { key: 'piecesPerBox', label: '每箱片数', type: 'number', unit: '片', placeholder: '默认 10', default: 10, min: 1, required: false }
    ],
    calculate: (data) => {
      const { roomArea, tileLength, tileWidth, wasteRate = 5, piecesPerBox = 10 } = data
      if (roomArea == null || tileLength == null || tileWidth == null) return null

      const tileArea = (tileLength / 1000) * (tileWidth / 1000)
      const tilesNeeded = roomArea / tileArea
      const tilesWithWaste = tilesNeeded * (1 + wasteRate / 100)
      const boxes = Math.ceil(tilesWithWaste / piecesPerBox)

      return { tiles: Math.ceil(tilesWithWaste), boxes }
    },
    outputs: [
      { key: 'tiles', label: '所需瓷砖', format: 'number', unit: '片' },
      { key: 'boxes', label: '大约箱数', format: 'number', unit: '箱' }
    ]
  },
  {
    id: 'flooring',
    name: '地板用量计算器',
    industry: 'construction',
    icon: '🪵',
    description: '按面积、规格和损耗率估算地板与箱数',
    inputs: [
      { key: 'roomArea', label: '房间面积', type: 'number', unit: '㎡', placeholder: '请输入房间面积', min: 0.01 },
      { key: 'floorLength', label: '地板长度', type: 'number', unit: 'mm', placeholder: '例如 1200', min: 1 },
      { key: 'floorWidth', label: '地板宽度', type: 'number', unit: 'mm', placeholder: '例如 150', min: 1 },
      { key: 'wasteRate', label: '损耗率', type: 'number', unit: '%', placeholder: '默认 5', default: 5, min: 0, required: false },
      { key: 'piecesPerBox', label: '每箱片数', type: 'number', unit: '片', placeholder: '默认 20', default: 20, min: 1, required: false }
    ],
    calculate: (data) => {
      const { roomArea, floorLength, floorWidth, wasteRate = 5, piecesPerBox = 20 } = data
      if (roomArea == null || floorLength == null || floorWidth == null) return null

      const floorArea = (floorLength / 1000) * (floorWidth / 1000)
      const floorsNeeded = roomArea / floorArea
      const floorsWithWaste = floorsNeeded * (1 + wasteRate / 100)
      const boxes = Math.ceil(floorsWithWaste / piecesPerBox)

      return { floors: Math.ceil(floorsWithWaste), boxes }
    },
    outputs: [
      { key: 'floors', label: '所需地板', format: 'number', unit: '片' },
      { key: 'boxes', label: '大约箱数', format: 'number', unit: '箱' }
    ]
  },
  {
    id: 'paint',
    name: '涂料用量计算器',
    industry: 'construction',
    icon: '🎨',
    description: '按墙面面积、遍数和覆盖率估算涂料',
    inputs: [
      { key: 'wallArea', label: '墙面面积', type: 'number', unit: '㎡', placeholder: '请输入墙面面积', min: 0.01 },
      { key: 'coats', label: '涂刷遍数', type: 'number', unit: '遍', placeholder: '例如 2', min: 1 },
      { key: 'coverage', label: '每升可刷面积', type: 'number', unit: '㎡/L', placeholder: '默认 10', default: 10, min: 0.1, required: false },
      { key: 'bucketSize', label: '单桶容量', type: 'number', unit: 'L', placeholder: '默认 5', default: 5, min: 0.1, required: false }
    ],
    calculate: (data) => {
      const { wallArea, coats, coverage = 10, bucketSize = 5 } = data
      if (wallArea == null || coats == null) return null

      const liters = (wallArea * coats) / coverage
      const buckets = Math.ceil(liters / bucketSize)

      return { liters, buckets }
    },
    outputs: [
      { key: 'liters', label: '所需涂料', format: 'number', unit: 'L', precision: 1 },
      { key: 'buckets', label: '大约桶数', format: 'number', unit: '桶' }
    ]
  },
  {
    id: 'area-volume',
    name: '面积体积计算器',
    industry: 'construction',
    icon: '📐',
    description: '计算长方形面积和体积',
    inputs: [
      { key: 'length', label: '长度', type: 'number', unit: 'm', placeholder: '请输入长度', min: 0.01 },
      { key: 'width', label: '宽度', type: 'number', unit: 'm', placeholder: '请输入宽度', min: 0.01 },
      { key: 'height', label: '高度', type: 'number', unit: 'm', placeholder: '选填，计算体积时输入', min: 0, required: false }
    ],
    calculate: (data) => {
      const { length, width, height } = data
      if (length == null || width == null) return null

      const area = length * width
      const volume = height == null ? null : length * width * height

      return { area, volume }
    },
    outputs: [
      { key: 'area', label: '面积', format: 'number', unit: '㎡', precision: 2 },
      { key: 'volume', label: '体积', format: 'number', unit: 'm³', precision: 2 }
    ]
  },
  {
    id: 'hydropower',
    name: '水电改造预算',
    industry: 'construction',
    icon: '⚡',
    description: '按建筑面积和单价估算改造费用',
    inputs: [
      { key: 'area', label: '建筑面积', type: 'number', unit: '㎡', placeholder: '请输入建筑面积', min: 0.01 },
      { key: 'pricePerSqm', label: '单价标准', type: 'number', unit: '元/㎡', placeholder: '默认 150', default: 150, min: 0, required: false }
    ],
    calculate: (data) => {
      const { area, pricePerSqm = 150 } = data
      if (area == null) return null

      return { total: area * pricePerSqm }
    },
    outputs: [
      { key: 'total', label: '预估费用', format: 'currency', unit: '元' }
    ]
  },
  {
    id: 'duration',
    name: '工期计算器',
    industry: 'construction',
    icon: '⏳',
    description: '按工程量和日产能估算工期',
    inputs: [
      { key: 'workload', label: '工程量', type: 'number', unit: '㎡', placeholder: '请输入工程量', min: 0.01 },
      { key: 'dailyWork', label: '每日工作量', type: 'number', unit: '㎡/天', placeholder: '请输入每日工作量', min: 0.01 }
    ],
    calculate: (data) => {
      const { workload, dailyWork } = data
      if (workload == null || dailyWork == null) return null

      return { days: Math.ceil(workload / dailyWork) }
    },
    outputs: [
      { key: 'days', label: '预计工期', format: 'number', unit: '天' }
    ]
  },
  {
    id: 'material-total',
    name: '材料总价计算器',
    industry: 'construction',
    icon: '🧾',
    description: '按单价、数量和运费计算总成本',
    inputs: [
      { key: 'unitPrice', label: '单价', type: 'number', unit: '元', placeholder: '请输入单价', min: 0 },
      { key: 'quantity', label: '数量', type: 'number', unit: '', placeholder: '请输入数量', min: 0 },
      { key: 'shipping', label: '运费', type: 'number', unit: '元', placeholder: '选填', min: 0, required: false }
    ],
    calculate: (data) => {
      const { unitPrice, quantity, shipping = 0 } = data
      if (unitPrice == null || quantity == null) return null

      const subtotal = unitPrice * quantity
      const total = subtotal + shipping

      return { subtotal, total }
    },
    outputs: [
      { key: 'subtotal', label: '材料小计', format: 'currency', unit: '元' },
      { key: 'total', label: '总费用', format: 'currency', unit: '元' }
    ]
  },
  {
    id: 'renovation-budget',
    name: '装修预算计算器',
    industry: 'construction',
    icon: '🏡',
    description: '按面积和装修档次估算总预算',
    resultRenderer: 'renovation-budget',
    inputs: [
      { key: 'area', label: '建筑面积', type: 'number', unit: '㎡', placeholder: '请输入建筑面积', min: 0.01 },
      {
        key: 'grade',
        label: '装修档次',
        type: 'select',
        placeholder: '请选择装修档次',
        options: [
          { label: '简装', value: 'simple' },
          { label: '中档', value: 'medium' },
          { label: '高档', value: 'high' }
        ]
      }
    ],
    calculate: (data) => {
      const { area, grade } = data
      if (area == null || !grade) return null

      const priceMap = { simple: 500, medium: 1000, high: 2000 }
      const gradeLabelMap = { simple: '简装', medium: '中档', high: '高档' }
      const styleDescriptionMap = {
        simple: '适合出租房、过渡居住，优先控制总成本。',
        medium: '适合多数家庭自住，兼顾预算与居住体验。',
        high: '适合重视设计感与材料品质的精装方案。'
      }
      const pricePerSqm = priceMap[grade] || 1000
      const total = area * pricePerSqm
      const laborEstimate = total * 0.35
      const materialEstimate = total * 0.5
      const miscellaneousEstimate = total - laborEstimate - materialEstimate

      return {
        grade,
        gradeLabel: gradeLabelMap[grade] || '中档',
        styleDescription: styleDescriptionMap[grade] || styleDescriptionMap.medium,
        pricePerSqm,
        total,
        laborEstimate,
        materialEstimate,
        miscellaneousEstimate
      }
    },
    outputs: [
      { key: 'pricePerSqm', label: '每平米造价', format: 'currency', unit: '元' },
      { key: 'total', label: '总预算', format: 'currency', unit: '元' }
    ]
  }
]
