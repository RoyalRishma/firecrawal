import { NextResponse } from 'next/server';
import { scrapeJobs } from '@/lib/firecrawl/scraper';
import { supabase } from '@/lib/supabase/client';
import { matchJobWithAI } from '@/lib/ai/matcher';

export async function POST(request: Request) {
  try {
    const { query, location, userId } = await request.json();

    if (!query || !location || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Fetch user profile for matching
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('skills, preferred_role')
      .eq('user_id', userId)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    // 2. Scrape jobs from Firecrawl
    const scrapedJobs = await scrapeJobs(query, location);

    // 3. Process each job with AI matching (in parallel for performance)
    const processedJobs = await Promise.all(
      scrapedJobs.map(async (job) => {
        try {
          const matchResult = await matchJobWithAI(job.description, {
            skills: profile.skills,
            preferredRole: profile.preferred_role || query,
          });

          // 4. Save job to database
          const { data: savedJob, error: jobError } = await supabase
            .from('jobs')
            .upsert({
              title: job.title,
              company: job.company,
              location: job.location,
              description: job.description,
              apply_url: job.apply_url,
              raw_data: { ...matchResult },
            }, { onConflict: 'apply_url' })
            .select()
            .single();

          if (jobError) {
            console.error('Error saving job:', jobError.message);
            return null;
          }

          return { ...savedJob, matchResult };
        } catch (err) {
          console.error('Error processing job with AI:', err);
          return null;
        }
      })
    );

    const validJobs = processedJobs.filter(j => j !== null);

    return NextResponse.json({ 
      success: true, 
      count: validJobs.length,
      jobs: validJobs 
    });

  } catch (error: any) {
    console.error('Scrape API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
