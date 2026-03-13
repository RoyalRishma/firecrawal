export function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex justify-center items-center gap-2 mb-4">
          <div className="bg-slate-800 p-1 rounded">
            <div className="w-4 h-4 rounded-full border-2 border-white" />
          </div>
          <span className="font-bold text-slate-900">FireCrawl AI</span>
        </div>
        <p className="text-slate-500 text-sm max-w-md mx-auto">
          AI-powered job matching engine using Firecrawl to find your next career opportunity.
        </p>
        <div className="mt-8 flex justify-center gap-6 text-slate-400">
          <a href="#" className="hover:text-slate-600">Privacy Policy</a>
          <a href="#" className="hover:text-slate-600">Terms of Service</a>
          <a href="#" className="hover:text-slate-600">Contact Us</a>
        </div>
        <p className="mt-8 text-slate-400 text-xs">
          Built with Love & AI.
        </p>
      </div>
    </footer>
  );
}
