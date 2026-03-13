'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Save, Plus, X, User, Briefcase, MapPin, BarChart } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [formData, setFormData] = useState({
    preferredRole: '',
    location: '',
    experienceLevel: 'Mid-Level',
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`/api/profile?userId=${user?.id}`);
      const data = await res.json();
      if (data && !data.error) {
        setSkills(data.skills || []);
        setFormData({
          preferredRole: data.preferred_role || '',
          location: data.location || '',
          experienceLevel: data.experience_level || 'Mid-Level',
        });
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          skills,
          ...formData,
        }),
      });
      if (res.ok) alert('Profile saved successfully!');
    } catch (err) {
      console.error('Error saving profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  if (initialLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading Profile...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 py-24">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-blue-600 px-8 py-10 text-white">
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <User size={32} />
              Your Career AI Profile
            </h1>
            <p className="mt-2 text-blue-100 opacity-90">
              Update your skills and preferences to improve AI job matching accuracy.
            </p>
          </div>

          <form onSubmit={handleSave} className="p-8 space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Preferred Role */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Briefcase size={16} className="text-blue-500" />
                  Preferred Job Role
                </label>
                <input
                  type="text"
                  value={formData.preferredRole}
                  onChange={(e) => setFormData({ ...formData, preferredRole: e.target.value })}
                  placeholder="e.g. Senior Frontend Engineer"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  required
                />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <MapPin size={16} className="text-blue-500" />
                  Preferred Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Remote, New York, London"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  required
                />
              </div>

              {/* Experience Level */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <BarChart size={16} className="text-blue-500" />
                  Experience Level
                </label>
                <select
                  value={formData.experienceLevel}
                  onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-white"
                >
                  <option>Entry-Level</option>
                  <option>Junior</option>
                  <option>Mid-Level</option>
                  <option>Senior</option>
                  <option>Lead / Principal</option>
                  <option>Managerial</option>
                </select>
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-4">
              <label className="text-sm font-semibold text-slate-700 block">Skills & Expertise</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  placeholder="Add a skill (e.g. React, Python, Cloud Architecture)"
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                />
                <Button type="button" onClick={addSkill} variant="secondary">
                  <Plus size={20} />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-medium border border-blue-100"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="text-blue-400 hover:text-blue-600 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
                {skills.length === 0 && (
                  <p className="text-slate-400 text-sm italic">No skills added yet.</p>
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex justify-end">
              <Button type="submit" size="lg" isLoading={loading} className="px-10">
                <Save className="mr-2" size={20} />
                Save Career Profile
              </Button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
