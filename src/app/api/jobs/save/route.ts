import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function POST(request: Request) {
  try {
    const { userId, jobId } = await request.json();

    if (!userId || !jobId) {
      return NextResponse.json({ error: 'Missing userId or jobId' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('saved_jobs')
      .insert({ user_id: userId, job_id: jobId })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        return NextResponse.json({ message: 'Job already saved' }, { status: 200 });
      }
      throw error;
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { userId, jobId } = await request.json();

    if (!userId || !jobId) {
      return NextResponse.json({ error: 'Missing userId or jobId' }, { status: 400 });
    }

    const { error } = await supabase
      .from('saved_jobs')
      .delete()
      .eq('user_id', userId)
      .eq('job_id', jobId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
