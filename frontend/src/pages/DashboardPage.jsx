import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
  MessageSquare, AlertOctagon, CheckCircle2, Filter, Loader2, AlertCircle, ArrowLeft, Download
} from 'lucide-react';
import { getAnalysis } from '../services/api';
import StatCard from '../components/StatCard';
import CommentCard from '../components/CommentCard';

export default function DashboardPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await getAnalysis(id);
        setData(result);
      } catch (err) {
        setError('Failed to load analysis data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const filteredComments = useMemo(() => {
    if (!data?.details) return [];
    if (filter === 'All') return data.details;
    return data.details.filter(c => c.label === filter);
  }, [data, filter]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] space-y-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-text-secondary font-medium animate-pulse">Analyzing comments with ML model...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-3xl mx-auto mt-16 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/50 rounded-2xl p-8 flex flex-col items-center text-center space-y-6">
        <AlertCircle className="w-16 h-16 text-red-500" />
        <div>
          <h2 className="text-2xl font-bold text-red-800 dark:text-red-300">Analysis Failed</h2>
          <p className="text-red-600 dark:text-red-400 mt-2">{error}</p>
        </div>
        <Link to="/" className="flex items-center space-x-2 px-6 py-3 bg-surface border border-border hover:bg-background text-text rounded-xl transition-colors font-medium">
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Posts</span>
        </Link>
      </div>
    );
  }

  const pieData = [
    { name: 'Toxic', value: data.toxic, gradientId: "colorToxic" },
    { name: 'Safe', value: data.safe, gradientId: "colorSafe" }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in slide-in-from-bottom-4 duration-500">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center space-x-2 text-primary font-mono text-sm mb-2 bg-primary/10 w-fit px-3 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span>Analysis Complete</span>
          </div>
          <h1 className="text-3xl font-bold text-text">Dashboard Results</h1>
          <p className="text-text-secondary mt-1">Post ID: <span className="font-mono bg-background px-1.5 py-0.5 rounded">{id}</span></p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Comments"
          value={data.total}
          icon={MessageSquare}
          colorClass="bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400"
        />
        <StatCard
          title="Toxic Comments"
          value={data.toxic}
          icon={AlertOctagon}
          colorClass="bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400"
        />
        <StatCard
          title="Safe Comments"
          value={data.safe}
          icon={CheckCircle2}
          colorClass="bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface rounded-2xl p-6 shadow-sm border border-border group relative overflow-hidden transition-all hover:shadow-md">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-900/10 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          <h3 className="text-lg font-bold text-text mb-6">Toxicity Distribution</h3>
          <div className="h-72 relative">
            {/* Center label for Pie Chart */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 pb-6">
              <span className="text-3xl font-black text-text">{data.total}</span>
              <span className="text-xs text-text-secondary uppercase tracking-widest font-semibold mt-1">Total</span>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <defs>
                  <linearGradient id="colorToxic" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#f87171" />
                    <stop offset="100%" stopColor="#dc2626" />
                  </linearGradient>
                  <linearGradient id="colorSafe" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#4ade80" />
                    <stop offset="100%" stopColor="#16a34a" />
                  </linearGradient>
                  <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.15" />
                  </filter>
                </defs>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={75}
                  outerRadius={105}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                  cornerRadius={8}
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={`url(#${entry.gradientId})`}
                      style={{ filter: 'url(#shadow)' }}
                    />
                  ))}
                </Pie>
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: 'var(--surface)',
                    backdropFilter: 'blur(8px)',
                    borderColor: 'var(--border)',
                    borderRadius: '1rem',
                    color: 'var(--text)',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                    border: '1px solid var(--border)',
                    padding: '12px 16px'
                  }}
                  itemStyle={{ color: 'var(--text)', fontWeight: 'bold' }}
                />
                <Legend
                  iconType="circle"
                  wrapperStyle={{ paddingTop: '20px', fontSize: '14px', fontWeight: '500' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-surface rounded-2xl p-6 shadow-sm border border-border group relative overflow-hidden transition-all hover:shadow-md">
          <div className="absolute inset-0 bg-gradient-to-bl from-green-50/50 to-transparent dark:from-green-900/10 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          <h3 className="text-lg font-bold text-text mb-6">Comparison Bar Chart</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pieData} margin={{ top: 20, right: 30, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="barToxic" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f87171" />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity={0.8} />
                  </linearGradient>
                  <linearGradient id="barSafe" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4ade80" />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" vertical={false} opacity={0.6} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: 'var(--text-secondary)', fontWeight: 500, fontSize: 13 }}
                  axisLine={{ stroke: 'var(--border)', strokeWidth: 2 }}
                  tickLine={false}
                  dy={10}
                />
                <YAxis
                  tick={{ fill: 'var(--text-secondary)', fontSize: 13 }}
                  axisLine={false}
                  tickLine={false}
                  dx={-10}
                />
                <RechartsTooltip
                  cursor={{ fill: 'var(--text-secondary)', opacity: 0.05 }}
                  contentStyle={{
                    backgroundColor: 'var(--surface)',
                    backdropFilter: 'blur(8px)',
                    borderColor: 'var(--border)',
                    borderRadius: '1rem',
                    color: 'var(--text)',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                    padding: '12px 16px'
                  }}
                />
                <Bar
                  dataKey="value"
                  radius={[8, 8, 8, 8]}
                  maxBarSize={50}
                  animationBegin={200}
                  animationDuration={1500}
                  animationEasing="ease-out"
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.name === 'Toxic' ? 'url(#barToxic)' : 'url(#barSafe)'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-surface rounded-2xl p-6 shadow-sm border border-border flex flex-col h-[600px]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h3 className="text-xl font-bold text-text">Analyzed Comments</h3>
            <p className="text-sm text-text-secondary mt-1">Showing {filteredComments.length} results</p>
          </div>

          <div className="flex bg-background p-1 rounded-xl border border-border w-full sm:w-auto">
            {['All', 'Toxic', 'Safe'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === f
                  ? 'bg-surface text-text shadow-sm'
                  : 'text-text-secondary hover:text-text hover:bg-surface/50'
                  }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-4">
          {filteredComments.length > 0 ? (
            filteredComments.map((comment, idx) => (
              <div key={idx} className="animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: `${idx * 50}ms` }}>
                <CommentCard comment={comment} />
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-3">
              <Filter className="w-12 h-12 text-border" />
              <p className="text-text-secondary font-medium">No comments match the selected filter.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
