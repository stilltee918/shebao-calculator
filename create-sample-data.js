const XLSX = require('xlsx');

// 创建城市标准文件
function createCitiesSample() {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet([
    { id: 1, city_name: '佛山', year: '2024', base_min: 1900, base_max: 26421, rate: 0.15 }
  ]);
  XLSX.utils.book_append_sheet(wb, ws, 'cities');
  XLSX.writeFile(wb, 'sample-cities.xlsx');
  console.log('创建了示例城市标准文件: sample-cities.xlsx');
}

// 创建工资数据文件
function createSalariesSample() {
  const wb = XLSX.utils.book_new();
  const salaryData = [];

  // 生成示例员工数据
  const employees = [
    { id: 'EMP001', name: '张三', baseSalary: 8000 },
    { id: 'EMP002', name: '李四', baseSalary: 12000 },
    { id: 'EMP003', name: '王五', baseSalary: 30000 }, // 高工资，会用上限
    { id: 'EMP004', name: '赵六', baseSalary: 1500 }, // 低工资，会用下限
    { id: 'EMP005', name: '钱七', baseSalary: 25000 }
  ];

  let recordId = 1;
  employees.forEach(emp => {
    // 生成12个月的数据
    for (let month = 1; month <= 12; month++) {
      // 添加一些随机波动
      const salary = Math.round(emp.baseSalary * (0.9 + Math.random() * 0.2));

      salaryData.push({
        id: recordId++,
        employee_id: emp.id,
        employee_name: emp.name,
        month: `2024${month.toString().padStart(2, '0')}`,
        salary_amount: salary
      });
    }
  });

  // 添加一个只有6个月数据的员工
  for (let month = 1; month <= 6; month++) {
    const salary = Math.round(18000 * (0.9 + Math.random() * 0.2));
    salaryData.push({
      id: recordId++,
      employee_id: 'EMP006',
      employee_name: '孙八',
      month: `2024${month.toString().padStart(2, '0')}`,
      salary_amount: salary
    });
  }

  const ws = XLSX.utils.json_to_sheet(salaryData);
  XLSX.utils.book_append_sheet(wb, ws, 'salaries');
  XLSX.writeFile(wb, 'sample-salaries.xlsx');
  console.log('创建了示例工资数据文件: sample-salaries.xlsx');
}

// 执行创建
createCitiesSample();
createSalariesSample();