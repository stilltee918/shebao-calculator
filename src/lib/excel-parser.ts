import * as XLSX from 'xlsx';
import { City, Salary } from '@/types';

// Node.js 环境下的 Excel 解析函数
export async function parseCitiesExcel(file: File): Promise<City[]> {
  try {
    // 将 File 转换为 Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 使用 XLSX 解析 Buffer
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    const cities: City[] = jsonData.map((row: any) => ({
      id: parseInt(row.id) || 0,
      city_name: row.city_name || '',
      year: String(row.year || ''),
      base_min: parseInt(row.base_min) || 0,
      base_max: parseInt(row.base_max) || 0,
      rate: parseFloat(row.rate) || 0,
    }));

    return cities;
  } catch (error) {
    throw new Error('解析城市数据失败: ' + error);
  }
}

export async function parseSalariesExcel(file: File): Promise<Salary[]> {
  try {
    // 将 File 转换为 Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 使用 XLSX 解析 Buffer
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    const salaries: Salary[] = jsonData.map((row: any) => ({
      id: parseInt(row.id) || 0,
      employee_id: String(row.employee_id || ''),
      employee_name: row.employee_name || '',
      month: String(row.month || ''),
      salary_amount: parseInt(row.salary_amount) || 0,
    }));

    return salaries;
  } catch (error) {
    throw new Error('解析工资数据失败: ' + error);
  }
}

export function createCitiesTemplate(): void {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet([
    { id: 1, city_name: '佛山', year: '2024', base_min: 1900, base_max: 26421, rate: 0.15 },
  ]);
  XLSX.utils.book_append_sheet(wb, ws, 'cities');
  XLSX.writeFile(wb, 'cities_template.xlsx');
}

export function createSalariesTemplate(): void {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet([
    { id: 1, employee_id: 'EMP001', employee_name: '张三', month: '202401', salary_amount: 8000 },
    { id: 2, employee_id: 'EMP002', employee_name: '李四', month: '202401', salary_amount: 12000 },
  ]);
  XLSX.utils.book_append_sheet(wb, ws, 'salaries');
  XLSX.writeFile(wb, 'salaries_template.xlsx');
}