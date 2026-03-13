'use client';

import { useAuth } from "@/context/AuthContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Search, Sparkles, Shield, Zap, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const { user, signInWithGoogle } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-indigo-50 rounded-full blur-3xl opacity-50" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold mb-6 tracking-wide uppercase">
                <Sparkles size={14} />
                Now Powered by FireCrawl Extract AI
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
                Find Your Dream Job with <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">AI Precision</span>
              </h1>
              <p className="text-xl text-slate-600 mb-10 leading-relaxed">
                FireCrawl AI scrapes the most relevant job listings and uses advanced AI to match them with your unique skills and experience. Save time, apply smarter.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                {user ? (
                  <Link href="/dashboard">
                    <Button size="lg" className="w-full sm:w-auto">
                      Go to Dashboard
                      <ArrowRight className="ml-2" size={20} />
                    </Button>
                  </Link>
                ) : (
                  <Button size="lg" onClick={signInWithGoogle} className="w-full sm:w-auto">
                    Get Started for Free
                    <ArrowRight className="ml-2" size={20} />
                  </Button>
                )}
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  How it Works
                </Button>
              </div>

              <div className="mt-12 flex items-center justify-center gap-6 text-slate-400 text-sm">
                <div className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-blue-500" /> LinkedIn Scraping</div>
                <div className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-blue-500" /> AI Skill Matching</div>
                <div className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-blue-500" /> Dashboard Analytics</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-12">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                  <Search size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Live Web Scraping</h3>
                <p className="text-slate-600">Powered by FireCrawl, we scan LinkedIn, Indeed, and company career pages in real-time to find hidden gems.</p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
                <div className="w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 transition-transform">
                  <Zap size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">AI Matching Logic</h3>
                <p className="text-slate-600">Our AI analyzes job requirements against your profile to give you a match score, highlighting where you excel.</p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
                <div className="w-14 h-14 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform">
                  <Shield size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Automated Discovery</h3>
                <p className="text-slate-600">Set your preferences once and let our system automatically discover and notify you of perfect matches.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-12 md:p-20 relative overflow-hidden text-center text-white">
              <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-6 relative">Ready to stop searching and start finding?</h2>
              <p className="text-lg text-blue-100 mb-10 max-w-2xl mx-auto relative leading-relaxed">
                Join thousands of professionals already using FireCrawl AI to secure their next role. Get started in less than 2 minutes.
              </p>
              <div className="relative">
                <Button variant="secondary" size="lg" onClick={signInWithGoogle}>
                  Try FireCrawl AI Now
                  <Sparkles className="ml-2" size={20} />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
