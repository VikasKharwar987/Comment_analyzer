import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer, Legend,
  AreaChart, Area, LineChart, Line,
} from 'recharts';
import {
  MessageSquare, AlertOctagon, CheckCircle2, Loader2,
  AlertCircle, ArrowLeft, AlertTriangle, TrendingUp, Activity,
} from 'lucide-react';
import { getAnalysis } from '../services/api';
import StatCard from '../components/StatCard';

/* ─── shared tooltip style ─────────────────────────── */
const TT = {
  backgroundColor: 'var(--surface)',
  backdropFilter: 'blur(8px)',
  borderColor: 'var(--border)',
  borderRadius: '1rem',
  color: 'var(--text)',
  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)',
  padding: '10px 16px',
  fontSize: '13px',
};

const GRID = { strokeDasharray: '4 4', stroke: 'var(--border)', vertical: false, opacity: 0.4 };
const XAX  = { tick: { fill: 'var(--text-secondary)', fontSize: 11 }, axisLine: { stroke: 'var(--border)' }, tickLine: false, dy: 8, interval: 'preserveStartEnd' };
const YAX  = { tick: { fill: 'var(--text-secondary)', fontSize: 11 }, axisLine: false, tickLine: false, allowDecimals: false, dx: -4 };

/* ─── bucketing: always 40 equal-width bins ────────── */
const N = 40;

function monthLabel(ts) {
  const d = new Date(ts);
  return d.toLocaleString('default', { month: 'short', year: '2-digit' });
}

function buildBuckets(sorted) {
  if (sorted.length < 2) return { rows: [], sizeLabel: '-' };
  const first  = +new Date(sorted[0].timestamp);
  const last   = +new Date(sorted.at(-1).timestamp);
  const span   = Math.max(last - first, 1);
  const bMs    = Math.ceil(span / N);

  const rows = Array.from({ length: N }, (_, i) => ({
    ts: first + i * bMs,
    toxic: 0, mild: 0, safe: 0, total: 0,
  }));

  sorted.forEach(c => {
    const idx = Math.min(Math.floor((+new Date(c.timestamp) - first) / bMs), N - 1);
    const r = rows[idx];
    if (c.label === 'TOXIC')       r.toxic++;
    else if (c.label === 'MILD TOXIC') r.mild++;
    else r.safe++;
    r.total++;
  });

  // human-readable label
  const hrs = bMs / 3_600_000, days = bMs / 86_400_000;
  const sizeLabel =
    hrs  < 1  ? `${Math.round(bMs/60_000)} min`
  : hrs  < 24 ? `${Math.round(hrs)} h`
  : days < 14 ? `${Math.round(days)} day${days>1?'s':''}`
  : days < 60 ? `${Math.round(days/7)} wk`
  :             `${Math.round(days/30)} mo`;

  return {
    rows: rows.map(r => ({
      label: monthLabel(r.ts),
      toxic: r.toxic, mild: r.mild, safe: r.safe, total: r.total,
      toxicRate: r.total ? +((r.toxic / r.total) * 100).toFixed(1) : 0,
    })),
    sizeLabel,
  };
}

/* ─── component ─────────────────────────────────────── */
export default function DashboardPage() {
  const videoUrl = new URLSearchParams(useLocation().search).get('video_url');
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    (async () => {
      if (!videoUrl) { setError('No Video URL provided.'); setLoading(false); return; }
      try { setData(await getAnalysis(videoUrl)); }
      catch { setError('Failed to load analysis data.'); }
      finally { setLoading(false); }
    })();
  }, [videoUrl]);

  const sorted = useMemo(() => {
    if (!data?.details) return [];
    return [...data.details].filter(c => c.timestamp)
      .sort((a, b) => +new Date(a.timestamp) - +new Date(b.timestamp));
  }, [data]);

  const { rows: buckets, sizeLabel } = useMemo(() => buildBuckets(sorted), [sorted]);

  // non-empty buckets only for per-category charts
  const toxicRows = useMemo(() => buckets.filter(b => b.toxic > 0), [buckets]);
  const mildRows  = useMemo(() => buckets.filter(b => b.mild  > 0), [buckets]);
  const safeRows  = useMemo(() => buckets.filter(b => b.safe  > 0), [buckets]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] space-y-4">
      <Loader2 className="w-12 h-12 text-primary animate-spin" />
      <p className="text-text-secondary font-medium animate-pulse">Analyzing comments…</p>
    </div>
  );

  if (error || !data) return (
    <div className="max-w-3xl mx-auto mt-16 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/50 rounded-2xl p-8 flex flex-col items-center text-center space-y-6">
      <AlertCircle className="w-16 h-16 text-red-500" />
      <div>
        <h2 className="text-2xl font-bold text-red-800 dark:text-red-300">Analysis Failed</h2>
        <p className="text-red-600 dark:text-red-400 mt-2">{error}</p>
      </div>
      <Link to="/" className="flex items-center gap-2 px-6 py-3 bg-surface border border-border hover:bg-background text-text rounded-xl transition-colors font-medium">
        <ArrowLeft className="w-5 h-5" /> Back to Home
      </Link>
    </div>
  );

  const pct = n => data.total ? `${((n / data.total) * 100).toFixed(1)}%` : '0%';
  const pieData = [
    { name: 'Toxic',      value: data.toxic,      g: 'pT' },
    { name: 'Mild Toxic', value: data.mild_toxic,  g: 'pM' },
    { name: 'Safe',       value: data.safe,        g: 'pS' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2 text-primary font-mono text-sm mb-2 bg-primary/10 w-fit px-3 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Analysis Complete
          </div>
          <h1 className="text-3xl font-bold text-text">Toxicity Dashboard</h1>
          <p className="text-text-secondary mt-1 max-w-lg truncate" title={videoUrl}>
            <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{videoUrl}</a>
          </p>
        </div>
        <Link to="/" className="flex items-center gap-2 px-4 py-2 bg-surface border border-border hover:bg-background text-text rounded-xl transition-colors text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> Analyze Another
        </Link>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Comments" value={data.total}                                   icon={MessageSquare} colorClass="bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400" />
        <StatCard title="Toxic"          value={`${data.toxic} (${pct(data.toxic)})`}          icon={AlertOctagon}  colorClass="bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400" />
        <StatCard title="Mild Toxic"     value={`${data.mild_toxic} (${pct(data.mild_toxic)})`} icon={AlertTriangle} colorClass="bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400" />
        <StatCard title="Safe"           value={`${data.safe} (${pct(data.safe)})`}             icon={CheckCircle2}  colorClass="bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400" />
      </div>

      {/* Pie + Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard title="Toxicity Distribution" accent="from-blue-50/40 dark:from-blue-900/10">
          <div className="h-72 relative">
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 pb-10">
              <span className="text-4xl font-black text-text">{data.total}</span>
              <span className="text-xs text-text-secondary uppercase tracking-widest font-semibold mt-1">Total</span>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <defs>
                  <linearGradient id="pT" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#f87171"/><stop offset="100%" stopColor="#dc2626"/></linearGradient>
                  <linearGradient id="pM" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#fbbf24"/><stop offset="100%" stopColor="#d97706"/></linearGradient>
                  <linearGradient id="pS" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#4ade80"/><stop offset="100%" stopColor="#16a34a"/></linearGradient>
                </defs>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={72} outerRadius={108} paddingAngle={6} dataKey="value" stroke="none" cornerRadius={6}>
                  {pieData.map((e, i) => <Cell key={i} fill={`url(#${e.g})`} />)}
                </Pie>
                <RechartsTooltip contentStyle={TT} itemStyle={{ color: 'var(--text)', fontWeight: 600 }} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: 14, fontSize: 13, fontWeight: 500 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard title="Category Comparison" accent="from-purple-50/40 dark:from-purple-900/10">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pieData} margin={{ top: 20, right: 24, left: -10, bottom: 0 }} barCategoryGap="40%">
                <defs>
                  <linearGradient id="bT" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f87171"/><stop offset="100%" stopColor="#ef4444" stopOpacity={0.8}/></linearGradient>
                  <linearGradient id="bM" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#fbbf24"/><stop offset="100%" stopColor="#f59e0b" stopOpacity={0.8}/></linearGradient>
                  <linearGradient id="bS" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4ade80"/><stop offset="100%" stopColor="#22c55e" stopOpacity={0.8}/></linearGradient>
                </defs>
                <CartesianGrid {...GRID} />
                <XAxis dataKey="name" {...XAX} />
                <YAxis {...YAX} />
                <RechartsTooltip cursor={{ fill: 'var(--primary)', opacity: 0.05 }} contentStyle={TT} />
                <Bar dataKey="value" radius={[10, 10, 0, 0]} maxBarSize={80} animationDuration={1400}
                  label={{ position: 'top', fill: 'var(--text-secondary)', fontSize: 12, fontWeight: 600 }}>
                  {pieData.map((e, i) => <Cell key={i} fill={e.name==='Toxic'?'url(#bT)':e.name==='Mild Toxic'?'url(#bM)':'url(#bS)'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* Stacked Area — Comment volume over time */}
      {buckets.length > 1 && (
        <GlassCard
          title="Comment Volume Over Time"
          badge={sizeLabel + ' per bucket'}
          icon={<TrendingUp className="w-5 h-5 text-primary" />}
        >
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={buckets} margin={{ top: 8, right: 20, left: -4, bottom: 0 }}>
                <defs>
                  <linearGradient id="aS" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#22c55e" stopOpacity={0.35}/><stop offset="95%" stopColor="#22c55e" stopOpacity={0}/></linearGradient>
                  <linearGradient id="aM" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/><stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/></linearGradient>
                  <linearGradient id="aT" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/><stop offset="95%" stopColor="#ef4444" stopOpacity={0}/></linearGradient>
                </defs>
                <CartesianGrid {...GRID} />
                <XAxis dataKey="label" {...XAX} />
                <YAxis {...YAX} label={{ value: 'comments', angle: -90, position: 'insideLeft', fill: 'var(--text-secondary)', fontSize: 11, dx: -2 }} />
                <RechartsTooltip contentStyle={TT} labelStyle={{ color: 'var(--text-secondary)', marginBottom: 4 }}
                  formatter={(v, n) => [v, n==='safe'?'Safe':n==='mild'?'Mild Toxic':'Toxic']} />
                <Legend formatter={v => v==='safe'?'Safe':v==='mild'?'Mild Toxic':'Toxic'} wrapperStyle={{ fontSize: 13, paddingTop: 14 }} />
                <Area type="monotone" dataKey="safe"  stackId="a" stroke="#22c55e" strokeWidth={2} fill="url(#aS)" dot={false} />
                <Area type="monotone" dataKey="mild"  stackId="a" stroke="#f59e0b" strokeWidth={2} fill="url(#aM)" dot={false} />
                <Area type="monotone" dataKey="toxic" stackId="a" stroke="#ef4444" strokeWidth={2} fill="url(#aT)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      )}

      {/* Toxicity Rate % over time */}
      {buckets.filter(b => b.total > 0).length > 1 && (
        <GlassCard
          title="Toxicity Rate Over Time"
          badge="% toxic per period"
          icon={<Activity className="w-5 h-5 text-red-400" />}
          accent="from-red-50/30 dark:from-red-900/10"
        >
          <p className="text-xs text-text-secondary mb-4">Shows what % of comments in each time period were toxic — helps spot spikes independent of volume.</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={buckets.filter(b => b.total > 0)} margin={{ top: 8, right: 20, left: -4, bottom: 0 }}>
                <defs>
                  <linearGradient id="rG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid {...GRID} />
                <XAxis dataKey="label" {...XAX} />
                <YAxis {...YAX} allowDecimals tickFormatter={v => `${v}%`} />
                <RechartsTooltip contentStyle={TT} formatter={v => [`${v}%`, 'Toxic Rate']} labelStyle={{ color: 'var(--text-secondary)', marginBottom: 4 }} />
                <Line type="monotone" dataKey="toxicRate" stroke="#ef4444" strokeWidth={2.5} dot={{ r: 3, fill: '#ef4444', strokeWidth: 0 }} activeDot={{ r: 6, fill: '#dc2626', stroke: 'white', strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      )}

      {/* Per-category small charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <MiniChart title="Toxic Comments" dot="#ef4444" grad="cT" data={toxicRows} dataKey="toxic" empty="No toxic comments" />
        <MiniChart title="Mild Toxic"     dot="#f59e0b" grad="cM" data={mildRows}  dataKey="mild"  empty="No mild toxic comments" />
        <MiniChart title="Safe Comments"  dot="#22c55e" grad="cS" data={safeRows}  dataKey="safe"  empty="No safe comments" />
      </div>

    </div>
  );
}

/* ─── helpers ───────────────────────────────────────── */
function GlassCard({ title, badge, icon, accent = 'from-slate-50/30 dark:from-slate-800/10', children }) {
  return (
    <div className="bg-surface/60 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-xl border border-white/50 dark:border-slate-700/50 relative overflow-hidden group">
      <div className={`absolute inset-0 bg-gradient-to-br ${accent} to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`} />
      <div className="flex items-center justify-between mb-5 relative">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-lg font-bold text-text">{title}</h3>
        </div>
        {badge && <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">{badge}</span>}
      </div>
      {children}
    </div>
  );
}

function MiniChart({ title, dot, grad, data, dataKey, empty }) {
  return (
    <div className="bg-surface/60 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/50 dark:border-slate-700/50 relative overflow-hidden group">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: dot }} />
        <h3 className="text-base font-bold text-text">{title}</h3>
      </div>
      <p className="text-xs text-text-secondary mb-4">Count per bucket</p>
      <div className="h-48">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id={grad} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={dot} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={dot} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid {...GRID} />
              <XAxis dataKey="label" {...XAX} />
              <YAxis {...YAX} />
              <RechartsTooltip contentStyle={TT} formatter={v => [v, '# comments']} labelStyle={{ color: 'var(--text-secondary)', marginBottom: 2 }} />
              <Area type="monotone" dataKey={dataKey} stroke={dot} strokeWidth={2.5} fill={`url(#${grad})`} dot={false} activeDot={{ r: 5, fill: dot }} />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-text-secondary text-sm">{empty}</div>
        )}
      </div>
    </div>
  );
}
