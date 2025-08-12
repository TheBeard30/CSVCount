# CSV/Excel 数据统计工具

一个基于 React + TypeScript + Vite 构建的现代化数据统计工具，支持 CSV 和 Excel 文件的字段统计分析。

## 功能特性

- 📁 **文件上传**: 支持拖拽上传 CSV 和 Excel (.xlsx, .xls) 文件
- 🔍 **字段选择**: 智能识别文件字段，支持多选和搜索
- 📊 **统计分析**: 自动生成字段值分布统计，包含计数和百分比
- 💾 **本地存储**: 数据仅在本地处理，支持会话恢复
- 📤 **导出功能**: 支持将统计结果导出为 CSV 格式
- 🎨 **现代界面**: 基于 shadcn/ui 的美观界面设计
- 📱 **响应式**: 完美适配桌面和移动设备

## 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式方案**: TailwindCSS + shadcn/ui
- **文件解析**: Papa Parse (CSV) + SheetJS (Excel)
- **图标库**: Lucide React
- **测试框架**: Vitest + Testing Library
- **代码规范**: ESLint + Prettier

## 快速开始

### 环境要求

- Node.js >= 16
- npm >= 7

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:5173 查看应用

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

### 运行测试

```bash
# 运行测试
npm run test

# 运行测试并生成覆盖率报告
npm run test:coverage
```

### 代码检查

```bash
# ESLint 检查
npm run lint

# Prettier 格式化
npm run format
```

## 使用说明

1. **上传文件**: 点击上传区域或拖拽文件到页面
2. **选择字段**: 在字段选择器中勾选需要统计的字段
3. **查看统计**: 右侧会自动显示统计结果
4. **导出数据**: 点击导出按钮下载 CSV 格式的统计报告

## 项目结构

```
src/
├── components/          # React 组件
│   ├── ui/             # shadcn/ui 基础组件
│   ├── FileUploader.tsx    # 文件上传组件
│   ├── FileList.tsx        # 文件列表组件
│   ├── FieldSelector.tsx   # 字段选择组件
│   ├── StatsTable.tsx      # 统计表格组件
│   └── ExportButton.tsx    # 导出按钮组件
├── lib/                # 工具库
│   └── utils.ts        # 通用工具函数
├── services/           # 服务层
│   └── storage.ts      # 本地存储服务
├── utils/              # 业务工具函数
│   ├── parser.ts       # 文件解析工具
│   └── stats.ts        # 统计计算工具
├── types.ts            # TypeScript 类型定义
├── App.tsx             # 主应用组件
├── main.tsx            # 应用入口
└── index.css           # 全局样式
```

## 支持的文件格式

- **CSV**: 逗号分隔值文件 (.csv)
- **Excel**: Excel 工作簿文件 (.xlsx, .xls)

## 数据隐私

- 所有数据处理均在浏览器本地完成
- 不会向任何服务器上传文件或数据
- 使用 localStorage 进行本地数据持久化

## 浏览器兼容性

- Chrome >= 88
- Firefox >= 85
- Safari >= 14
- Edge >= 88

## 开发指南

### 添加新组件

1. 在 `src/components/` 目录下创建组件文件
2. 使用 TypeScript 定义 Props 接口
3. 遵循现有的代码风格和命名规范

### 添加新的统计功能

1. 在 `src/utils/stats.ts` 中添加统计函数
2. 更新 `src/types.ts` 中的类型定义
3. 在相应组件中集成新功能

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！