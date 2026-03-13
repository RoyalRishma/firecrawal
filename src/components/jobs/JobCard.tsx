'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Bookmark, BookmarkCheck, ExternalLink, MapPin, Building2, Briefcase } from 'lucide-react';

interface JobCardProps {
  job: {
    id: string;
    title: string;
    company: string;
    location: string;
    description: string;
    apply_url: string;
    raw_data: {
      score: number;
      matchedSkills: string[];
      missingSkills: string[];
      reasoning: string;
    };
  };
  isSaved?: boolean;
  onSave?: (jobId: string) => void;
}

export function JobCard({ job, isSaved, onSave }: JobCardProps) {
  const [loading, setLoading] = useState(false);
  const { score, matchedSkills, missingSkills, reasoning } = job.raw_data || { score: 0, matchedSkills: [], missingSkills: [], reasoning: '' };

  const getScoreColor = (s: number) => {
    if (s >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-100';
    if (s >= 50) return 'text-blue-600 bg-blue-50 border-blue-100';
    return 'text-slate-600 bg-slate-50 border-slate-100';
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-all group overflow-hidden relative">
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
            {job.title}
          </h3>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1"><Building2 size={14} /> {job.company}</span>
            <span className="flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
          </div>
        </div>
        <div className={`px-3 py-2 rounded-xl border text-center font-bold ${getScoreColor(score)}`}>
          <div className="text-xs uppercase tracking-wider opacity-70 mb-0.5">Match</div>
          <div className="text-lg leading-none">{score}%</div>
        </div>
      </div>

      <div className="mb-5">
        <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed italic">
          "{reasoning}"
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {matchedSkills.slice(0, 4).map(skill => (
          <span key={skill} className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-100">
            {skill}
          </span>
        ))}
        {missingSkills.length > 0 && (
          <span className="px-2.5 py-1 rounded-md bg-slate-50 text-slate-500 text-xs font-medium border border-slate-100">
            +{missingSkills.length} more
          </span>
        )}
      </div>

      <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
        <a href={job.apply_url} target="_blank" rel="noopener noreferrer" className="flex-1">
          <Button variant="primary" className="w-full">
            Apply Now
            <ExternalLink size={16} className="ml-2" />
          </Button>
        </a>
        <Button 
          variant="outline" 
          onClick={() => onSave?.(job.id)}
          className={isSaved ? "text-blue-600 border-blue-200 bg-blue-50" : ""}
        >
          {isSaved ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
        </Button>
      </div>
    </div>
  );
}
