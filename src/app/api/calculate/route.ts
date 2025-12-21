import { NextResponse } from 'next/server';
import { calculateContributions, saveCalculationResults } from '@/lib/calculator';

export async function POST() {
  try {
    // 执行计算
    const results = await calculateContributions();

    // 保存结果到数据库
    await saveCalculationResults(results);

    return NextResponse.json({
      message: '计算完成',
      count: results.length,
      results: results
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}