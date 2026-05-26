# 行业计算器合集 - UniApp

基于 UniApp 开发的跨平台行业计算器小程序，支持微信小程序、H5、支付宝小程序等多个平台。

## 正确的项目初始化方式

### 方式一：使用 HBuilderX（最简单）

1. 下载安装 [HBuilderX](https://www.dcloud.io/hbuilderx.html)
2. 文件 → 新建 → 项目 → 选择 `uni-app` → 默认模板
3. 把本项目的文件复制进去
4. 运行 → 运行到小程序模拟器 → 微信开发者工具

### 方式二：使用官方 CLI（命令行）

```bash
# 使用 npx 创建 uni-app 项目
npx degit dcloudio/uni-preset-vue#vite my-vue3-project

# 进入目录
cd my-vue3-project

# 安装依赖
npm install

# 运行到微信小程序
npm run dev:mp-weixin
```

### 方式三：使用我已准备好的项目文件

直接用 HBuilderX 打开本项目文件夹即可！

## 功能特性

### 三大行业分类

1. **餐饮/零售行业** - 8个计算器
   - 毛利率计算器
   - 菜品定价计算器
   - 库存周转计算器
   - 促销折扣计算器
   - 房租占比计算器
   - 人力成本计算器
   - 会员折扣计算器
   - 进货批量计算器

2. **建筑/装修行业** - 8个计算器
   - 瓷砖用量计算器
   - 地板用量计算器
   - 涂料用量计算器
   - 面积体积计算器
   - 水电改造预算
   - 工期计算器
   - 材料总价计算器
   - 装修预算计算器

3. **银行/金融行业** - 6个计算器
   - 房贷计算器
   - 车贷计算器
   - 存款利息计算器
   - 信用卡分期计算器
   - 投资收益计算器
   - 个人所得税计算器

### 技术特点

- **配置驱动架构**：所有计算器通过配置定义，易于扩展
- **活泼实用风格**：采用渐变色、圆角卡片设计
- **跨平台支持**：一套代码，多端运行
- **本地历史记录**：自动保存计算历史
- **广告位预留**：为商业化预留广告展示位置

## 项目结构

```
calculator/
├── pages/
│   ├── index/              # 首页 - 行业选择
│   ├── industry-list/      # 行业计算器列表页
│   └── calculator/         # 通用计算器页面
├── utils/
│   ├── calculators/        # 各行业计算器配置
│   │   ├── catering.js     # 餐饮行业
│   │   ├── construction.js # 建筑行业
│   │   └── finance.js      # 金融行业
│   ├── calculator-config.js # 配置中心
│   └── formatter.js        # 格式化与存储工具
├── static/
│   └── css/
│       └── common.css      # 公共样式
├── App.vue
├── main.js
├── pages.json
├── manifest.json
└── package.json
```

## 推荐开发方式

**最简单：直接使用 HBuilderX！**

1. 下载 [HBuilderX](https://www.dcloud.io/hbuilderx.html)
2. 打开本项目文件夹
3. 点击顶部菜单：运行 → 运行到小程序模拟器 → 微信开发者工具

就可以开始开发了！

## 支持平台

- 微信小程序
- H5（网页版）
- 支付宝小程序
- App（iOS/Android）

## 技术栈

- UniApp 3.x
- Vue 3.x (Composition API)
- 原生 CSS（渐变色、Flex布局）

## 许可证

MIT
