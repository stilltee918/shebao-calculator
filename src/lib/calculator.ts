import { supabase } from '@/lib/supabase';
import { City, Salary, CalculationResult } from '@/types';

export async function calculateContributions(): Promise<CalculationResult[]> {
  // 获取佛山2024年社保标准
  const { data: cityData, error: cityError } = await supabase
    .from('cities')
    .select('*')
    .eq('city_name', '佛山')
    .eq('year', '2024')
    .single();

  if (cityError || !cityData) {
    // 使用硬编码值作为后备
    const defaultCity: City = {
      id: 1,
      city_name: '佛山',
      year: '2024',
      base_min: 1900,
      base_max: 26421,
      rate: 0.15
    };
    return calculateWithCityData(defaultCity);
  }

  return calculateWithCityData(cityData);
}

async function calculateWithCityData(cityData: City): Promise<CalculationResult[]> {
  // 获取所有工资数据
  const { data: salaries, error: salariesError } = await supabase
    .from('salaries')
    .select('*')
    .order('employee_name, month');

  if (salariesError || !salaries) {
    throw new Error('获取工资数据失败');
  }

  // 按员工分组
  const employeeGroups = (salaries as Salary[]).reduce((acc: { [key: string]: Salary[] }, salary) => {
    if (!acc[salary.employee_name]) {
      acc[salary.employee_name] = [];
    }
    acc[salary.employee_name].push(salary);
    return acc;
  }, {});

  // 计算每个员工的结果
  const results: CalculationResult[] = [];

  for (const [employeeName, employeeSalaries] of Object.entries(employeeGroups)) {
    // 筛选2024年的数据（YYYYMM格式）
    const year2024Salaries = employeeSalaries.filter(s => s.month.startsWith('2024'));

    if (year2024Salaries.length === 0) {
      continue; // 跳过没有2024年数据的员工
    }

    // 计算年度月平均工资
    const totalSalary = year2024Salaries.reduce((sum, s) => sum + s.salary_amount, 0);
    const avgSalary = totalSalary / year2024Salaries.length;

    // 确定缴费基数
    let contributionBase: number;
    if (avgSalary < cityData.base_min) {
      contributionBase = cityData.base_min;
    } else if (avgSalary > cityData.base_max) {
      contributionBase = cityData.base_max;
    } else {
      contributionBase = avgSalary;
    }

    // 计算公司缴纳金额
    const companyFee = contributionBase * cityData.rate;

    results.push({
      employee_name: employeeName,
      avg_salary: Math.round(avgSalary * 100) / 100, // 保留两位小数
      contribution_base: Math.round(contributionBase * 100) / 100,
      company_fee: Math.round(companyFee * 100) / 100,
      months_count: year2024Salaries.length
    });
  }

  return results;
}

export async function saveCalculationResults(results: CalculationResult[]): Promise<void> {
  // 转换为数据库格式
  const dbResults = results.map(r => ({
    employee_name: r.employee_name,
    avg_salary: r.avg_salary,
    contribution_base: r.contribution_base,
    company_fee: r.company_fee
  }));

  // 清空现有结果
  await supabase.from('results').delete().neq('id', -1);

  // 插入新结果
  // @ts-ignore
  const { error } = await supabase.from('results').insert(dbResults);

  if (error) {
    throw new Error('保存计算结果失败: ' + error.message);
  }
}