export interface JobListing {
  title: string;
  company: string;
  location: string;
  description: string;
  apply_url: string;
}

export async function scrapeJobs(query: string, location: string): Promise<JobListing[]> {
  const apiKey = process.env.FIRECRAWL_API_KEY;

  if (!apiKey) {
    throw new Error('FIRECRAWL_API_KEY is not defined');
  }

  // Use Firecrawl's /scrape or /search endpoint
  // For this implementation, we simulate the scraping logic via search + extract
  const response = await fetch('https://api.firecrawl.dev/v1/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      query: `job listings for ${query} in ${location} site:linkedin.com/jobs OR site:indeed.com/jobs`,
      limit: 5,
      scrapeOptions: {
        formats: ['markdown'],
      }
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('Firecrawl API error:', errorBody);
    throw new Error(`Failed to fetch from Firecrawl: ${response.statusText}`);
  }

  const data = await response.json();
  
  // Map Firecrawl results to JobListing format
  // Note: Actual implementation would need extraction logic or 
  // Firecrawl's extract endpoint for structured data.
  // Here we assume basic mapping for demonstration.
  return data.data.map((item: any) => ({
    title: item.title || 'Unknown Title',
    company: item.metadata?.source || 'Unknown Company',
    location: location,
    description: item.markdown || item.description || '',
    apply_url: item.url || '',
  }));
}
