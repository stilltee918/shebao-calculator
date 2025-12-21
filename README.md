# 五险一金计算器

一个基于Next.js和Supabase的Web应用，用于计算公司为员工应缴纳的社保公积金费用。

## 功能特点

- 📊 支持Excel文件上传（城市标准和员工工资数据）
- 🔢 自动计算年度月平均工资
- 💰 根据佛山2024年社保标准计算缴费金额
- 📋 清晰的结果展示和导出功能
- 📱 响应式设计，支持移动端访问

## 技术栈

- **前端**: Next.js 15, TypeScript, Tailwind CSS
- **后端**: Next.js API Routes
- **数据库**: Supabase (PostgreSQL)
- **文件处理**: xlsx库

## 快速开始

### 1. 克隆项目

```bash
git clone <your-repo-url>
cd shebao-calculator
```

### 2. 安装依赖

```bash
npm install
# 或
yarn install
```

### 3. 配置Supabase

1. 在 [Supabase](https://supabase.com) 创建新项目
2. 在项目的SQL编辑器中运行 `init-db.sql` 文件中的SQL语句
3. 获取项目的URL和anon key

### 4. 配置环境变量

复制 `.env.local.example` 为 `.env.local`（如果不存在则创建）：

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Foshan 2024 Social Insurance Parameters (Hardcoded)
FOSHAN_BASE_MIN=1900
FOSHAN_BASE_MAX=26421
FOSHAN_RATE=0.15
```

### 5. 运行开发服务器

```bash
npm run dev
# 或
yarn dev
```

打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 使用说明

### 数据上传

1. **城市标准文件**（cities.xlsx）
   - 格式：id, city_name, year, base_min, base_max, rate
   - 示例：1,佛山,2024,1900,26421,0.15

2. **员工工资文件**（salaries.xlsx）
   - 格式：id, employee_id, employee_name, month, salary_amount
   - 示例：1,EMP001,张三,202401,8000

### 计算规则

- 按自然年（2024年1月-12月）计算平均工资
- 缴费基数确定：
  - 平均工资 < 下限（1900）：使用下限
  - 平均工资 > 上限（26421）：使用上限
  - 其他情况：使用平均工资
- 公司缴纳金额 = 缴费基数 × 15%

### 结果说明

- 数据不足12个月的员工会显示黄色提示
- 支持导出CSV格式结果
- 可一键清空所有结果重新计算

## 部署到Vercel

1. 将代码推送到GitHub仓库
2. 在Vercel中导入项目
3. 配置环境变量（与本地开发相同）
4. 部署完成后即可使用

## 项目结构

```
src/
├── app/              # Next.js页面和API路由
│   ├── api/         # API端点
│   ├── upload/      # 上传页面
│   ├── results/     # 结果页面
│   └── page.tsx     # 主页
├── components/      # React组件
├── lib/            # 工具函数
│   ├── supabase.ts # Supabase客户端
│   ├── excel-parser.ts # Excel解析
│   └── calculator.ts # 计算逻辑
└── types/          # TypeScript类型定义
```

## 注意事项

- 硬编码使用佛山2024年标准
- 无需用户登录，任何人都可以使用
- 上传新数据时会清空旧数据
- 计算基于2024自然年数据

## License

MIT