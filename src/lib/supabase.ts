import { createClient } from '@supabase/supabase-js';

let supabaseInstance: ReturnType<typeof createClient> | null = null;

// 创建一个单例模式的Supabase客户端
export function getSupabase() {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables. Please check your configuration.');
  }

  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  return supabaseInstance;
}

// 为了兼容现有代码，导出一个动态属性
export const supabase = new Proxy({} as ReturnType<typeof createClient>, {
  get(target, prop) {
    const client = getSupabase();
    return client[prop as keyof typeof client];
  }
});