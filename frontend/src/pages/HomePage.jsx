import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Activity, AlertTriangle, PlayCircle } from 'lucide-react';

export default function HomePage() {
  const [url, setUrl] = useState('');
  const navigate = useNavigate();

  const handleAnalyze = (e) => {
    e.preventDefault();
    if (!url.trim()) return;
    navigate(`/dashboard?video_url=${encodeURIComponent(url)}`);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      
      {/* Background blobs for glassmorphism */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 dark:bg-primary/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-cyan-400/20 dark:bg-cyan-400/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-purple-400/20 dark:bg-purple-400/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 w-full max-w-3xl backdrop-blur-xl bg-white/40 dark:bg-slate-800/40 border border-white/50 dark:border-slate-700/50 rounded-3xl p-8 md:p-12 shadow-2xl shadow-slate-200/50 dark:shadow-black/50">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-4 bg-white/50 dark:bg-slate-700/50 rounded-full mb-6 shadow-inner ring-1 ring-white/60 dark:ring-slate-600/60">
            <PlayCircle className="w-12 h-12 text-red-500" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-slate-800 dark:text-white tracking-tight mb-4 drop-shadow-sm">
            YouTube Toxicity <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-500">Analyzer</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-medium">
            Paste a YouTube video link to analyze the sentiment and toxicity of its top comments using advanced machine learning models.
          </p>
        </div>

        <form onSubmit={handleAnalyze} className="relative mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
              </div>
              <input
                type="text"
                className="block w-full pl-12 pr-4 py-4 text-base border-2 border-white/60 dark:border-slate-600/60 rounded-2xl bg-white/50 dark:bg-slate-800/50 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all backdrop-blur-sm shadow-inner"
                placeholder="https://www.youtube.com/watch?v=..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-blue-600 hover:from-primary hover:to-blue-500 text-white px-6 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-primary/30 transform hover:scale-[1.02] active:scale-95 whitespace-nowrap"
            >
              <Activity className="w-5 h-5" />
              <span>Analyze</span>
            </button>
          </div>
        </form>

        {/* Disclaimer Section */}
        <div className="mt-8 p-6 backdrop-blur-md bg-amber-50/50 dark:bg-amber-900/20 border border-amber-200/60 dark:border-amber-700/50 rounded-2xl flex items-start space-x-4">
          <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-full flex-shrink-0">
            <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-amber-800 dark:text-amber-300 mb-1">
              Disclaimer
            </h3>
            <p className="text-amber-700 dark:text-amber-400 text-sm leading-relaxed">
              As of now, please do not fully rely on the predictions or analytics provided by this tool. The underlying AI model may occasionally produce inaccurate classifications. This dashboard is for demonstration and research purposes only.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
