import React, { useEffect, useState } from 'react';
import { dashboardAPI, salesAPI } from '../services/modules';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Package, ShoppingCart, TrendingUp, DollarSign, AlertTriangle, Users, Activity } from 'lucide-react';

const fmt    = n => new Intl.NumberFormat().format(Math.round(n));
const fmtRwf = n => `RWF ${fmt(n)}`;

function StatCard({ label, value, sub, icon: Icon, accent }) {
  return (
    <div className="stat-card">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="stat-label">{label}</p>
          <p className="stat-value mt-1 truncate">{value}</p>
          {sub && <p className="text-xs text-zinc-600 mt-1">{sub}</p>}
        </div>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ml-3 ${accent}`}>
          <Icon size={16} className="text-white" />
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [stats,   setStats]   = useState(null);
  const [daily,   setDaily]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([dashboardAPI.getStats(), salesAPI.getDaily()])
      .then(([s, d]) => {
        setStats(s.data.data);
        setDaily(d.data.data.slice(-14).map(r => ({
          date:    r.date?.slice(5),
          revenue: +r.revenue,
          profit:  +r.profit,
        })));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const d = stats || {};

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Dashboard</h1>
        <p className="text-zinc-500 text-sm mt-0.5">Real-time overview of your shop</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Products"   value={fmt(d.totalProducts||0)}          sub={`${fmt(d.totalStock||0)} units`}       icon={Package}     accent="bg-indigo-600" />
        <StatCard label="Today's Sales"    value={fmtRwf(d.todaySales?.revenue||0)} sub={`${d.todaySales?.transactions||0} txns`} icon={ShoppingCart} accent="bg-emerald-600" />
        <StatCard label="Monthly Revenue"  value={fmtRwf(d.monthlySales?.revenue||0)} sub="This month"                           icon={TrendingUp}   accent="bg-violet-600" />
        <StatCard label="Net Profit"       value={fmtRwf(d.netProfit||0)}           sub="Revenue − Expenses"                    icon={DollarSign}   accent={d.netProfit>=0?'bg-amber-500':'bg-red-600'} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Chart */}
        <div className="card xl:col-span-2">
          <h2 className="text-sm font-semibold text-zinc-300 mb-4">Sales & Profit — Last 14 Days</h2>
          {daily.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={daily}>
                <defs>
                  <linearGradient id="gR" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="gP" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="date" tick={{ fill:'#71717a', fontSize:11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill:'#71717a', fontSize:11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background:'#18181b', border:'1px solid #3f3f46', borderRadius:10 }} labelStyle={{ color:'#a1a1aa' }} />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" fill="url(#gR)" name="Revenue" strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="profit"  stroke="#10b981" fill="url(#gP)" name="Profit"  strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-zinc-600 text-sm">No sales data yet</div>
          )}
        </div>

        {/* Side panels */}
        <div className="space-y-4">
          {/* Low stock */}
          <div className="card-sm">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={14} className="text-amber-400" />
              <span className="text-sm font-medium text-zinc-300">Low Stock</span>
              <span className="ml-auto badge-yellow">{d.lowStock?.length || 0}</span>
            </div>
            {d.lowStock?.length > 0 ? (
              <ul className="space-y-2">
                {d.lowStock.slice(0,5).map(p => (
                  <li key={p.id} className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400 truncate">{p.name}</span>
                    <span className={`font-mono ml-2 flex-shrink-0 ${p.quantity===0?'text-red-400':'text-amber-400'}`}>{p.quantity}</span>
                  </li>
                ))}
              </ul>
            ) : <p className="text-zinc-600 text-xs">All stocked ✓</p>}
          </div>

          {/* Best sellers */}
          <div className="card-sm">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={14} className="text-indigo-400" />
              <span className="text-sm font-medium text-zinc-300">Best Sellers</span>
            </div>
            {d.bestSelling?.length > 0 ? (
              <ul className="space-y-2">
                {d.bestSelling.map((p,i) => (
                  <li key={i} className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400 truncate">{p.name}</span>
                    <span className="text-indigo-400 font-mono ml-2 flex-shrink-0">{p.total_sold} sold</span>
                  </li>
                ))}
              </ul>
            ) : <p className="text-zinc-600 text-xs">No sales yet</p>}
          </div>

          {/* Staff */}
          <div className="card-sm flex items-center gap-3">
            <div className="w-9 h-9 bg-purple-700/40 rounded-xl flex items-center justify-center"><Users size={16} className="text-purple-400" /></div>
            <div><p className="stat-label">Staff</p><p className="stat-value">{d.staffCount||0}</p></div>
          </div>
        </div>
      </div>

      {/* Recent audit activity */}
      {d.recentActivity?.length > 0 && (
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Activity size={15} className="text-zinc-400" />
            <h2 className="text-sm font-semibold text-zinc-300">Recent Activity</h2>
          </div>
          <div className="space-y-2">
            {d.recentActivity.slice(0,8).map(a => (
              <div key={a.id} className="flex items-center gap-3 text-xs">
                <span className="badge-gray w-20 justify-center flex-shrink-0">{a.action}</span>
                <span className="text-zinc-500">{a.table_name}</span>
                <span className="text-zinc-600">by</span>
                <span className="text-zinc-400">{a.username || 'system'}</span>
                <span className="ml-auto text-zinc-600">{new Date(a.timestamp).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
