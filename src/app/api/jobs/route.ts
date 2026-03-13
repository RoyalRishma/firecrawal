import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const savedOnly = searchParams.get('savedOnly') === 'true';

  try {
    if (savedOnly) {
      if (!userId) return NextResponse.json({ error: 'User ID required for saved jobs' }, { status: 400 });
      
      const { data, error } = await supabase
        .from('saved_jobs')
        .select(`
          job_id,
          jobs (*)
        `)
        .eq('user_id', userId);

      if (error) throw error;
      return NextResponse.json(data.map(d => d.jobs));
    }

    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
