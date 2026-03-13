'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { JobCard } from '@/components/jobs/JobCard';
import { Search, Filter, Loader2, RefreshCcw, Bookmark, Sparkles } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [scraping, setScraping] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'saved'>('all');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [minScore, setMinScore] = useState(0);

  useEffect(() => {
    if (user) {
      fetchJobs();
    }
  }, [user, activeTab]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/jobs?userId=${user?.id}${activeTab === 'saved' ? '&savedOnly=true' : ''}`);
      const data = await res.json();
      setJobs(data || []);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleScrape = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !searchQuery || !searchLocation) return;

    setScraping(true);
    try {
      const res = await fetch('/api/jobs/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          query: searchQuery,
          location: searchLocation,
        }),
      });
      const data = await res.json();
      if (data.success) {
        fetchJobs(); // Refresh jobs list
      }
    } catch (err) {
      console.error('Error scraping jobs:', err);
    } finally {
      setScraping(false);
    }
  };

  const toggleSaveJob = async (jobId: string) => {
    if (!user) return;
    try {
      const res = await fetch('/api/jobs/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, jobId }),
      });
      if (res.ok && activeTab === 'saved') fetchJobs();
    } catch (err) {
      console.error('Error saving job:', err);
    }
  };

  const filteredJobs = jobs.filter(job => {
    const score = job.raw_data?.score || 0;
    return score >= minScore;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
        {/* Search & Header Section */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Job Discovery</h1>
          <p className="text-slate-500 mb-8">Scrape jobs from across the web and find your best AI match.</p>
          
          <form onSubmit={handleScrape} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 space-y-2 w-full">
              <label className="text-sm font-semibold text-slate-700">Role Title</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="e.g. Frontend Developer"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
            </div>
            <div className="flex-1 space-y-2 w-full">
              <label className="text-sm font-semibold text-slate-700">Location</label>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  value={searchLocation}
                  onChange={e => setSearchLocation(e.target.value)}
                  placeholder="e.g. Remote or London"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
            </div>
            <Button size="lg" isLoading={scraping} className="w-full md:w-auto h-fit">
              <Sparkles className="mr-2" size={20} />
              {scraping ? 'Analyzing...' : 'Discover Jobs'}
            </Button>
          </form>
        </div>

        {/* Dashboard Content */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar / Filters */}
          <aside className="w-full md:w-64 shrink-0 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <RefreshCcw size={18} /> Filters
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-600 mb-2 block">Match Score ({minScore}%+)</label>
                  <input 
                    type="range" min="0" max="90" step="10" 
                    value={minScore}
                    onChange={e => setMinScore(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-2">
                    <span>Any</span>
                    <span>50%</span>
                    <span>90%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-600 p-6 rounded-2xl text-white shadow-lg relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 opacity-20">
                    <Sparkles size={100} />
                </div>
                <h4 className="font-bold mb-2">Pro Tip</h4>
                <p className="text-sm text-blue-100">Ensure your profile skills are up to date for better matching accuracy!</p>
            </div>
          </aside>

          {/* Jobs List */}
          <div className="flex-1 space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
              <button 
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 text-sm font-semibold transition-all border-b-2 ${activeTab === 'all' ? 'text-blue-600 border-blue-600' : 'text-slate-500 border-transparent hover:text-slate-700'}`}
              >
                All Potential Matches
              </button>
              <button 
                onClick={() => setActiveTab('saved')}
                className={`px-4 py-2 text-sm font-semibold transition-all border-b-2 ${activeTab === 'saved' ? 'text-blue-600 border-blue-600' : 'text-slate-500 border-transparent hover:text-slate-700'}`}
              >
                <div className="flex items-center gap-2">
                  <Bookmark size={14} /> Saved Jobs
                </div>
              </button>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <Loader2 className="animate-spin mb-4" size={40} />
                <p>Fetching your opportunities...</p>
              </div>
            ) : filteredJobs.length > 0 ? (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {filteredJobs.map(job => (
                  <JobCard 
                    key={job.id} 
                    job={job} 
                    isSaved={activeTab === 'saved'}
                    onSave={() => toggleSaveJob(job.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center">
                <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                  <Search size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No jobs found</h3>
                <p className="text-slate-500 max-w-sm mx-auto">
                    {activeTab === 'saved' ? "You haven't saved any jobs yet." : "Try adjusting your search filters or discover new jobs using the search above."}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
