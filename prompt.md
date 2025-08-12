目标：
实现一个前端单页应用（SPA）——文件数据统计工具，满足以下功能：
- 上传多个 CSV/Excel 文件并以列表展示（可查看文件名 / 大小 / 上传时间）。
- 选择/多选文件中字段进行统计：字段总数、去重个数、字段值对应的重复个数（以表格展示）。
- 字段支持多选，统计结果通过表格展示并可以导出（CSV 或 Excel）。
- 可以重置报告（清除当前统计并从 localStorage 恢复为空）。
- 所有统计结果和上传记录使用 localStorage 持久化（关闭/刷新后保留）。
- UI 使用 shadcn/ui 组件库并和其主题色一致；布局使用 flex，响应式设计。
- 代码风格遵循 ESLint + Prettier。

上下文 / 技术栈：
- 语言：TypeScript
- 框架：React 18 + Vite
- UI：shadcn/ui（优先使用其组件），TailwindCSS（与 shadcn/ui 风格一致）
- 解析 CSV/Excel：允许使用 papaparse（CSV）与 xlsx / sheetjs（Excel）
- 测试：vitest + @testing-library/react
- Lint/Format：ESLint + Prettier（请提供配置文件）
- 目录风格：Vite + React + TS 默认结构（src/）
- 浏览器环境：现代浏览器（无需后端）

限制与偏好（按优先级）：
1. 必须：功能完整且可运行的最小实现（上传 → 选择字段 → 统计 → 导出 → reset → localStorage）。
2. 必须：使用 shadcn/ui 作为组件来源（按钮、表格、列表、输入等），并保持其主题色。
3. 必须：布局以 flex 为主，满足响应式（手机、平板、桌面）。
4. 必须：组件单一职责，每个组件独立文件，放在 src/components。
5. 必须：提供 package.json、tailwind.config.js、vite.config.ts、tsconfig.json、ESLint 与 Prettier 配置。
6. 必须：包含至少 3 个自动化单元测试（覆盖上传、统计逻辑、导出或 reset）。
7. 必须：对关键函数增加简短注释并在 README 中写明如何运行 / 测试 / 构建。
8. 优先：导出结果支持 CSV 下载（若能同时支持 Excel/xlsx 更佳）。
9. 禁止：在前端使用任何后端 API；禁止将数据上传到外部服务。
10. 推荐：对可选大型文件做合理提示（例如超过 5MB 显示警告），但不是必须。

UI / 交互细节（可直接实现）：
- 顶部 Header：应用名 + 主题色按钮（shadcn/ui Button）；
- 左侧或上方：文件上传区域（支持拖拽和文件选择），并以列表展示已上传文件（文件名、大小、上传时间、删除按钮）；
- 中间：字段选择区（基于选中文件显示合并字段名），支持多选 Checkbox 列表或带搜索的下拉多选；
- 右侧或下方：统计结果表格（列：字段值、出现次数、百分比、去重总数 / 行数统计摘要）；
- 底部工具栏：导出按钮、重置报告按钮、清除 localStorage 按钮；
- 响应式：窄屏时文件列表与字段选择垂直堆叠。

输出格式（必须遵守）：
1. 首先返回“文件清单”（只列出新增/修改的文件），例如：
   - package.json
   - vite.config.ts
   - tailwind.config.js
   - src/main.tsx
   - src/App.tsx
   - src/components/FileUploader.tsx
   - src/components/FileList.tsx
   - src/components/FieldSelector.tsx
   - src/components/StatsTable.tsx
   - src/components/ExportButton.tsx
   - src/services/storage.ts
   - src/utils/parser.ts
   - src/types.ts
   - src/styles/tailwind.css
   - vitest.config.ts
   - .eslintrc.cjs
   - .prettierrc
   - README.md

