import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { calculateContributions } from '@/lib/calculator';

export async function GET() {
  try {
    const { data: results, error } = await supabase
      .from('results')
      .select('*')
      .order('employee_name');

    if (error) {
      return NextResponse.json({ error: '获取结果失败: ' + error.message }, { status: 500 });
    }

    // 获取原始计算数据以检查月份数量
    const calculationResults = await calculateContributions();

    // 合并数据，添加月份信息
    const resultsWithMonths = results?.map(result => {
      const calcResult = calculationResults.find(r => r.employee_name === result.employee_name);
      return {
        ...result,
        months_count: calcResult?.months_count || 12
      };
    }) || [];

    return NextResponse.json({
      results: resultsWithMonths
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}