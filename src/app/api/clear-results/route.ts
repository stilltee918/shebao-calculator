import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST() {
  try {
    // @ts-ignore
    const { error } = await supabase
      .from('results')
      .delete()
      .neq('id', -1);

    if (error) {
      return NextResponse.json({ error: '清空结果失败: ' + error.message }, { status: 500 });
    }

    return NextResponse.json({
      message: '结果已清空'
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}