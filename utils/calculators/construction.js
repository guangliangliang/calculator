export const constructionCalculators = [
  {
    id: 'tile',
    name: '瓷砖用量计算器',
    industry: 'construction',
    icon: '🔲',
    description: '计算瓷砖用量，含损耗率',
    inputs: [
      { key: 'roomArea', label: '房间面积', type: 'number', unit: '㎡', placeholder: '请输入房间面积' },
      { key: 'tileLength', label: '瓷砖长度', type: 'number', unit: 'mm', placeholder: '如800' },
      { key: 'tileWidth', label: '瓷砖宽度', type: 'number', unit: 'mm', placeholder: '如800' },
      { key: 'wasteRate', label: '损耗率', type: 'number', unit: '%', placeholder: '默认5%', default: 5 }
    ],
    calculate: (data) => {
      const { roomArea, tileLength, tileWidth, wasteRate = 5 } = data
      if (!roomArea || !tileLength || !tileWidth) return null
      const tileArea = (tileLength / 1000) * (tileWidth / 1000)
      const tilesNeeded = roomArea / tileArea
      const tilesWithWaste = tilesNeeded * (1 + wasteRate / 100)
      const boxes = Math.ceil(tilesWithWaste / 10)
      return { tiles: Math.ceil(tilesWithWaste), boxes }
    },
    outputs: [
      { key: 'tiles', label: '需要瓷砖', format: 'number', unit: '片' },
      { key: 'boxes', label: '大约箱数', format: 'number', unit: '箱' }
    ]
  },
  {
    id: 'flooring',
    name: '地板用量计算器',
    industry: 'construction',
    icon: '🟫',
    description: '计算地板用量，含损耗率',
    inputs: [
      { key: 'roomArea', label: '房间面积', type: 'number', unit: '㎡', placeholder: '请输入房间面积' },
      { key: 'floorLength', label: '地板长度', type: 'number', unit: 'mm', placeholder: '如1200' },
      { key: 'floorWidth', label: '地板宽度', type: 'number', unit: 'mm', placeholder: '如150' },
      { key: 'wasteRate', label: '损耗率', type: 'number', unit: '%', placeholder: '默认5%', default: 5 }
    ],
    calculate: (data) => {
      const { roomArea, floorLength, floorWidth, wasteRate = 5 } = data
      if (!roomArea || !floorLength || !floorWidth) return null
      const floorArea = (floorLength / 1000) * (floorWidth / 1000)
      const floorsNeeded = roomArea / floorArea
      const floorsWithWaste = floorsNeeded * (1 + wasteRate / 100)
      const boxes = Math.ceil(floorsWithWaste / 20)
      return { floors: Math.ceil(floorsWithWaste), boxes }
    },
    outputs: [
      { key: 'floors', label: '需要地板', format: 'number', unit: '片' },
      { key: 'boxes', label: '大约箱数', format: 'number', unit: '箱' }
    ]
  },
  {
    id: 'paint',
    name: '涂料用量计算器',
    industry: 'construction',
    icon: '🎨',
    description: '计算涂料用量',
    inputs: [
      { key: 'wallArea', label: '墙面面积', type: 'number', unit: '㎡', placeholder: '请输入墙面面积' },
      { key: 'coats', label: '涂刷遍数', type: 'number', unit: '遍', placeholder: '如2' },
      { key: 'coverage', label: '每升涂刷面积', type: 'number', unit: '㎡/L', placeholder: '如10', default: 10 }
    ],
    calculate: (data) => {
      const { wallArea, coats, coverage = 10 } = data
      if (!wallArea || !coats) return null
      const liters = (wallArea * coats) / coverage
      const buckets = Math.ceil(liters / 5)
      return { liters: liters.toFixed(1), buckets }
    },
    outputs: [
      { key: 'liters', label: '需要涂料', format: 'number', unit: '升' },
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
      { key: 'length', label: '长度', type: 'number', unit: 'm', placeholder: '请输入长度' },
      { key: 'width', label: '宽度', type: 'number', unit: 'm', placeholder: '请输入宽度' },
      { key: 'height', label: '高度（可选）', type: 'number', unit: 'm', placeholder: '计算体积时输入' }
    ],
    calculate: (data) => {
      const { length, width, height } = data
      if (!length || !width) return null
      const area = length * width
      const volume = height ? length * width * height : null
      return { area, volume }
    },
    outputs: [
      { key: 'area', label: '面积', format: 'number', unit: '㎡' },
      { key: 'volume', label: '体积', format: 'number', unit: 'm³' }
    ]
  },
  {
    id: 'hydropower',
    name: '水电改造预算',
    industry: 'construction',
    icon: '⚡',
    description: '估算水电改造费用',
    inputs: [
      { key: 'area', label: '建筑面积', type: 'number', unit: '㎡', placeholder: '请输入建筑面积' },
      { key: 'pricePerSqm', label: '单价标准', type: 'number', unit: '元/㎡', placeholder: '如150', default: 150 }
    ],
    calculate: (data) => {
      const { area, pricePerSqm = 150 } = data
      if (!area) return null
      const total = area * pricePerSqm
      return { total }
    },
    outputs: [
      { key: 'total', label: '预估费用', format: 'currency', unit: '元' }
    ]
  },
  {
    id: 'duration',
    name: '工期计算器',
    industry: 'construction',
    icon: '📅',
    description: '计算预计工期',
    inputs: [
      { key: 'workload', label: '工程量', type: 'number', unit: '㎡', placeholder: '请输入工程量' },
      { key: 'dailyWork', label: '每日工作量', type: 'number', unit: '㎡/天', placeholder: '请输入每日工作量' }
    ],
    calculate: (data) => {
      const { workload, dailyWork } = data
      if (!workload || !dailyWork) return null
      const days = Math.ceil(workload / dailyWork)
      return { days }
    },
    outputs: [
      { key: 'days', label: '预计工期', format: 'number', unit: '天' }
    ]
  },
  {
    id: 'material-total',
    name: '材料总价计算器',
    industry: 'construction',
    icon: '💰',
    description: '计算材料总费用',
    inputs: [
      { key: 'unitPrice', label: '单价', type: 'number', unit: '元', placeholder: '请输入单价' },
      { key: 'quantity', label: '数量', type: 'number', unit: '', placeholder: '请输入数量' },
      { key: 'shipping', label: '运费（可选）', type: 'number', unit: '元', placeholder: '请输入运费' }
    ],
    calculate: (data) => {
      const { unitPrice, quantity, shipping = 0 } = data
      if (!unitPrice || quantity === undefined) return null
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
    icon: '🏠',
    description: '整体装修预算估算',
    inputs: [
      { key: 'area', label: '建筑面积', type: 'number', unit: '㎡', placeholder: '请输入建筑面积' },
      { key: 'grade', label: '装修档次', type: 'select', options: [
        { label: '简装', value: 'simple', price: 500 },
        { label: '中档', value: 'medium', price: 1000 },
        { label: '高档', value: 'high', price: 2000 }
      ]}
    ],
    calculate: (data) => {
      const { area, grade } = data
      if (!area || !grade) return null
      const priceMap = { simple: 500, medium: 1000, high: 2000 }
      const pricePerSqm = priceMap[grade] || 1000
      const total = area * pricePerSqm
      return { total, pricePerSqm }
    },
    outputs: [
      { key: 'pricePerSqm', label: '每平米造价', format: 'currency', unit: '元' },
      { key: 'total', label: '总预算', format: 'currency', unit: '元' }
    ]
  }
]
