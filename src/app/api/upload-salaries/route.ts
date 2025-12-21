import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { parseSalariesExcel } from '@/lib/excel-parser';

export async function POST(request: NextRequest) {
  try {
    // 测试Supabase连接
    console.log('Testing Supabase connection...');
    const { data, error: testError } = await supabase.from('salaries').select('count');
    if (testError) {
      console.error('Supabase connection error:', testError);
      return NextResponse.json({ error: 'Supabase连接失败: ' + testError.message }, { status: 500 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: '没有上传文件' }, { status: 400 });
    }

    console.log('Processing file:', file.name);

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      return NextResponse.json({ error: '请上传Excel文件' }, { status: 400 });
    }

    console.log('Parsing Excel file...');
    const salaries = await parseSalariesExcel(file);
    console.log('Parsed salaries:', salaries.length);

    if (salaries.length === 0) {
      return NextResponse.json({ error: 'Excel文件中没有有效的工资数据' }, { status: 400 });
    }

    // 清空现有数据
    console.log('Clearing existing data...');
    const { error: deleteError } = await supabase.from('salaries').delete().neq('id', -1);
    if (deleteError) {
      console.error('Delete error:', deleteError);
      return NextResponse.json({ error: '清空数据失败: ' + deleteError.message }, { status: 500 });
    }

    // 插入新数据
    console.log('Inserting new data...');
    const { error } = await supabase.from('salaries').insert(salaries as any[]);

    if (error) {
      console.error('Insert error:', error);
      return NextResponse.json({ error: '数据库插入失败: ' + error.message }, { status: 500 });
    }

    return NextResponse.json({
      message: '工资数据上传成功',
      count: salaries.length
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error.message || '上传过程中发生未知错误' }, { status: 500 });
  }
}