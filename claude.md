# 五险一金计算器项目 - 上下文管理中枢

## 项目概述
构建一个迷你的"五险一金"计算器Web应用，根据预设的员工工资数据和佛山社保标准，计算公司为每位员工应缴纳的社保公积金费用。

## 技术栈
- **前端框架**: Next.js
- **UI/样式**: Tailwind CSS
- **后端/数据库**: Supabase

## 数据库设计（Supabase）

### cities 表 - 城市社保标准
```sql
CREATE TABLE cities (
  id INT PRIMARY KEY,
  city_name TEXT NOT NULL,          -- 城市名（固定为"佛山"）
  year TEXT NOT NULL,               -- 年份（如"2024"）
  base_min INT NOT NULL,            -- 社保基数下限
  base_max INT NOT NULL,            -- 社保基数上限
  rate FLOAT NOT NULL               -- 综合缴纳比例（如 0.15）
);
```

### salaries 表 - 员工工资数据
```sql
CREATE TABLE salaries (
  id INT PRIMARY KEY,
  employee_id TEXT NOT NULL,        -- 员工工号
  employee_name TEXT NOT NULL,      -- 员工姓名
  month TEXT NOT NULL,              -- 年份月份（YYYYMM格式）
  salary_amount INT NOT NULL        -- 该月工资金额
);
```

### results 表 - 计算结果
```sql
CREATE TABLE results (
  id INT PRIMARY KEY,
  employee_name TEXT NOT NULL,      -- 员工姓名
  avg_salary FLOAT NOT NULL,        -- 年度月平均工资
  contribution_base FLOAT NOT NULL, -- 最终缴费基数
  company_fee FLOAT NOT NULL        -- 公司缴纳金额
);
```

## 核心业务逻辑

### 计算规则（硬编码佛山2024年标准）
- 社保基数下限：根据实际数据填写
- 社保基数上限：根据实际数据填写
- 缴纳比例：15%（0.15）

### 计算流程
1. **读取工资数据**：从salaries表读取所有数据
2. **按自然年分组**：根据当前年份，统计每个员工上一自然年（1-12月）的工资
3. **计算平均工资**：
   - 计算每个员工年度月平均工资
   - 若不足12个月，按实际月份计算平均值
4. **确定缴费基数**：
   - 若平均工资 < 下限，使用下限
   - 若平均工资 > 上限，使用上限
   - 若在下限和上限之间，使用平均工资
5. **计算公司缴纳金额**：缴费基数 × 缴纳比例
6. **存储结果**：将计算结果存入results表

## 前端页面设计

### 1. 主页 (/)
- **布局**：两个并排或垂直排列的功能卡片
- **卡片1 - 数据上传**：
  - 标题：数据上传
  - 说明：上传Excel文件并执行计算
  - 链接：/upload
- **卡片2 - 结果查询**：
  - 标题：结果查询
  - 说明：查看计算结果
  - 链接：/results

### 2. 数据上传页 (/upload)
- **功能区域1**：上传Excel文件
  - 城市标准文件上传（cities表）
  - 工资数据文件上传（salaries表）
- **功能区域2**：执行计算
  - 按钮：执行计算并存储结果
  - 执行后显示成功/失败提示

### 3. 结果展示页 (/results)
- **表格展示**：
  - 表头：员工姓名、年度月平均工资、缴费基数、公司缴纳金额
  - 数据行：展示所有计算结果
- **黄色提示**：对于数据不足12个月的员工，显示"XX 仅 N 个月数据，结果仅供参考"
- **操作按钮**：一键清空results表

## 开发任务清单（Todo List）

### 环境准备
- [ ] 创建Next.js项目
- [ ] 安装Tailwind CSS
- [ ] 配置Supabase
- [ ] 设置环境变量

### 数据库配置
- [ ] 创建Supabase项目
- [ ] 创建cities表（插入佛山2024年初始数据）
- [ ] 创建salaries表
- [ ] 创建results表
- [ ] 设置数据库权限（公开读写）

### 后端功能开发
- [ ] 配置Supabase客户端
- [ ] 实现Excel文件解析功能（使用xlsx库）
- [ ] 实现数据上传API（cities和salaries表）
- [ ] 实现计算核心逻辑API
- [ ] 实现结果查询API
- [ ] 实现清空结果API

### 前端页面开发
- [ ] 创建基础布局和导航
- [ ] 开发主页（/）- 两个功能卡片
- [ ] 开发上传页（/upload）- 文件上传和计算触发
- [ ] 开发结果页（/results）- 数据表格展示

### 功能测试与优化
- [ ] 测试Excel文件上传功能
- [ ] 测试计算逻辑准确性
- [ ] 测试结果展示功能
- [ ] 添加错误处理和用户提示
- [ ] 优化页面样式和用户体验

### 部署准备
- [ ] 配置生产环境变量
- [ ] 部署到Vercel
- [ ] 最终功能验证

## 注意事项
1. 佛山2024年社保基数需要根据实际政策填写
2. Excel文件格式需要预先定义好模板
3. 数据不足12个月的员工需要特殊标记
4. 所有计算结果可以一键清空重算
5. 无需用户认证，任何人都可以使用