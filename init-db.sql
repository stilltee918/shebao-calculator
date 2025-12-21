-- 创建cities表
CREATE TABLE IF NOT EXISTS cities (
  id INT PRIMARY KEY,
  city_name TEXT NOT NULL,
  year TEXT NOT NULL,
  base_min INT NOT NULL,
  base_max INT NOT NULL,
  rate FLOAT NOT NULL
);

-- 插入佛山2024年默认数据
INSERT INTO cities (id, city_name, year, base_min, base_max, rate) VALUES
(1, '佛山', '2024', 1900, 26421, 0.15);

-- 创建salaries表
CREATE TABLE IF NOT EXISTS salaries (
  id INT PRIMARY KEY,
  employee_id TEXT NOT NULL,
  employee_name TEXT NOT NULL,
  month TEXT NOT NULL,
  salary_amount INT NOT NULL
);

-- 创建results表
CREATE TABLE IF NOT EXISTS results (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  employee_name TEXT NOT NULL,
  avg_salary FLOAT NOT NULL,
  contribution_base FLOAT NOT NULL,
  company_fee FLOAT NOT NULL
);

-- 设置RLS策略（Row Level Security）
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE salaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;

-- 允许所有操作（因为这是一个公开工具，无需认证）
CREATE POLICY "Allow all operations on cities" ON cities FOR ALL USING (true);
CREATE POLICY "Allow all operations on salaries" ON salaries FOR ALL USING (true);
CREATE POLICY "Allow all operations on results" ON results FOR ALL USING (true);