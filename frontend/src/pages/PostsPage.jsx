import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ExternalLink, Activity, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';
import { getPosts } from '../services/api';

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPosts();
      setPosts(data);
    } catch (err) {
      if (err.response && err.response.status === 500) {
        setError('Backend Server Error (500): The Render server crashed. Reddit might be blocking your Render IP.');
      } else {
        setError('Failed to load posts. Please ensure the backend server is running and allows CORS.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-500">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-text tracking-tight">
            Recent Discussions
          </h1>
          <p className="text-text-secondary mt-2 text-lg">
            Select a Reddit thread to analyze comment toxicity.
          </p>
        </div>
        
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-text-secondary" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-border rounded-xl leading-5 bg-surface text-text placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition-all"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-surface rounded-2xl p-6 border border-border animate-pulse h-48">
              <div className="h-6 bg-border rounded-md w-3/4 mb-4"></div>
              <div className="h-4 bg-border rounded-md w-full mb-2"></div>
              <div className="h-4 bg-border rounded-md w-5/6 mb-8"></div>
              <div className="flex justify-between items-center">
                <div className="h-8 bg-border rounded-lg w-24"></div>
                <div className="h-8 bg-border rounded-lg w-28"></div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/50 rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-4">
          <div className="p-4 bg-red-100 dark:bg-red-900/40 rounded-full text-red-600 dark:text-red-400">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-red-800 dark:text-red-300">
              {error.includes("Server Error") ? "Backend Server Error" : "Connection Error"}
            </h3>
            <p className="text-red-600 dark:text-red-400 mt-1 max-w-md mx-auto">{error}</p>
          </div>
          <button 
            onClick={fetchPosts}
            className="flex items-center space-x-2 px-4 py-2 bg-red-100 dark:bg-red-900/40 hover:bg-red-200 dark:hover:bg-red-900/60 text-red-700 dark:text-red-300 rounded-lg transition-colors font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="bg-surface border border-border rounded-2xl p-12 text-center flex flex-col items-center">
          <div className="p-4 bg-background rounded-full mb-4">
            <Search className="w-8 h-8 text-text-secondary" />
          </div>
          <h3 className="text-lg font-bold text-text">No posts found</h3>
          <p className="text-text-secondary mt-1">Try adjusting your search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map(post => (
            <div 
              key={post.id} 
              className="bg-surface border border-border rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-blue-400 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              
              <div className="flex-1 mb-6">
                <h3 className="text-lg font-bold text-text line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-text-secondary mt-2 font-mono bg-background px-2 py-1 rounded inline-block">
                  ID: {post.id}
                </p>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                <a 
                  href={post.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1.5 text-sm text-text-secondary hover:text-primary transition-colors font-medium"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span>View Post</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
                
                <Link
                  to={`/dashboard/${post.id}`}
                  className="flex items-center space-x-2 bg-primary hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm shadow-primary/30"
                >
                  <Activity className="w-4 h-4" />
                  <span>Analyze</span>
                  <ArrowRight className="w-4 h-4 ml-1 opacity-70 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
