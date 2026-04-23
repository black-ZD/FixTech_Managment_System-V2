import React, { useEffect, useState } from 'react';
import { reportsAPI } from '../services/modules';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell
} from 'recharts';
import { BarChart2, TrendingUp, Receipt, Package, Download } from 'lucide-react';

const TABS  = ['Sales','Profit','Expenses','Products'];
const COLORS = ['#6366f1','#10b981','#f59e0b','#ef4444','#8b5cf6','#06b6d4'];
const fmt    = n => new Intl.NumberFormat().format(Math.round(+n || 0));

function exportCSV(data, filename) {
  if (!data.length) return;
  const headers = Object.keys(data[0]).join(',');
  const rows    = data.map(r => Object.values(r).join(',')).join('\n');
  const blob    = new Blob([`${headers}\n${rows}`], { type: 'text/csv' });
  const url     = URL.createObjectURL(blob);
  const a       = document.createElement('a');
  a.href = url; a.download = `${filename}.csv`; a.click();
  URL.revokeObjectURL(url);
}

export default function ReportsPage() {
  const [tab,      setTab]      = useState('Sales');
  const [data,     setData]     = useState({});
  const [loading,  setLoading]  = useState({});

  const fetchTab = async (t) => {
    if (data[t]) return;
    setLoading(l => ({ ...l, [t]: true }));
    try {
      let res;
      if (t === 'Sales')    res = await reportsAPI.dailySales(30);
      if (t === 'Profit')   res = await reportsAPI.monthlyProfit();
      if (t === 'Expenses') res = await reportsAPI.expenseBreakdown();
      if (t === 'Products') res = await reportsAPI.productPerformance();
      setData(d => ({ ...d, [t]: res.data.data }));
    } catch (e) { console.error(e); }
    finally { setLoading(l => ({ ...l, [t]: false })); }
  };

  useEffect(() => { fetchTab(tab); }, [tab]);

  const d = data[tab] || [];
  const isLoading = loading[tab];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-white">Reports</h1>
          <p className="text-zinc-500 text-sm">Analytics & business intelligence</p>
        </div>
        <button onClick={() => exportCSV(d, `fixtech_${tab.toLowerCase()}_report`)} disabled={!d.length} className="btn-secondary">
          <Download size={14} /> Export CSV
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-zinc-900 border border-zinc-800 rounded-xl p-1 w-fit">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab===t ? 'bg-indigo-600 text-white shadow' : 'text-zinc-500 hover:text-zinc-300'}`}>
            {t}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* SALES REPORT */}
          {tab === 'Sales' && (
            <div className="space-y-5">
              <div className="grid grid-cols-3 gap-4">
                <div className="stat-card"><p className="stat-label">Total Revenue</p><p className="stat-value">RWF {fmt(d.reduce((s,r)=>s + +r.revenue,0))}</p></div>
                <div className="stat-card"><p className="stat-label">Total Profit</p><p className="stat-value text-emerald-400">RWF {fmt(d.reduce((s,r)=>s + +r.profit,0))}</p></div>
                <div className="stat-card"><p className="stat-label">Transactions</p><p className="stat-value">{d.reduce((s,r)=>s + +r.transactions,0)}</p></div>
              </div>
              <div className="card">
                <h2 className="text-sm font-semibold text-zinc-300 mb-4 flex items-center gap-2"><BarChart2 size={14} /> Daily Sales — Last 30 Days</h2>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={d}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis dataKey="date" tick={{fill:'#71717a',fontSize:10}} axisLine={false} tickLine={false} />
                    <YAxis tick={{fill:'#71717a',fontSize:10}} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{background:'#18181b',border:'1px solid #3f3f46',borderRadius:10}} />
                    <Legend formatter={v=><span className="text-zinc-500 text-xs">{v}</span>} />
                    <Bar dataKey="revenue" fill="#6366f1" radius={[3,3,0,0]} name="Revenue" />
                    <Bar dataKey="profit"  fill="#10b981" radius={[3,3,0,0]} name="Profit"  />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="card p-0 overflow-x-auto">
                <table className="w-full text-xs">
                  <thead><tr className="tbl-head"><th className="text-left px-4 py-3">Date</th><th className="text-right px-4 py-3">Revenue</th><th className="text-right px-4 py-3">Profit</th><th className="text-right px-4 py-3">Txns</th><th className="text-right px-4 py-3">Units</th></tr></thead>
                  <tbody>
                    {d.map((r,i)=>(
                      <tr key={i} className="tbl-row">
                        <td className="px-4 py-2 text-zinc-400">{r.date}</td>
                        <td className="px-4 py-2 text-right font-mono text-zinc-200">{fmt(r.revenue)}</td>
                        <td className="px-4 py-2 text-right font-mono text-emerald-400">{fmt(r.profit)}</td>
                        <td className="px-4 py-2 text-right font-mono text-zinc-400">{r.transactions}</td>
                        <td className="px-4 py-2 text-right font-mono text-zinc-400">{r.units_sold}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PROFIT REPORT */}
          {tab === 'Profit' && (
            <div className="space-y-5">
              <div className="card">
                <h2 className="text-sm font-semibold text-zinc-300 mb-4 flex items-center gap-2"><TrendingUp size={14} /> Monthly Profit vs Expenses</h2>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={d}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis dataKey="month" tick={{fill:'#71717a',fontSize:11}} axisLine={false} tickLine={false} />
                    <YAxis tick={{fill:'#71717a',fontSize:11}} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{background:'#18181b',border:'1px solid #3f3f46',borderRadius:10}} />
                    <Legend formatter={v=><span className="text-zinc-500 text-xs">{v}</span>} />
                    <Line type="monotone" dataKey="revenue"      stroke="#6366f1" strokeWidth={2} dot={false} name="Revenue" />
                    <Line type="monotone" dataKey="gross_profit" stroke="#10b981" strokeWidth={2} dot={false} name="Gross Profit" />
                    <Line type="monotone" dataKey="expenses"     stroke="#ef4444" strokeWidth={2} dot={false} name="Expenses" />
                    <Line type="monotone" dataKey="net_profit"   stroke="#f59e0b" strokeWidth={2} dot={false} name="Net Profit" strokeDasharray="4 2" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="card p-0 overflow-x-auto">
                <table className="w-full text-xs">
                  <thead><tr className="tbl-head"><th className="text-left px-4 py-3">Month</th><th className="text-right px-4 py-3">Revenue</th><th className="text-right px-4 py-3">Gross Profit</th><th className="text-right px-4 py-3">Expenses</th><th className="text-right px-4 py-3">Net Profit</th></tr></thead>
                  <tbody>
                    {d.map((r,i)=>(
                      <tr key={i} className="tbl-row">
                        <td className="px-4 py-2 text-zinc-400">{r.month}</td>
                        <td className="px-4 py-2 text-right font-mono text-zinc-200">{fmt(r.revenue)}</td>
                        <td className="px-4 py-2 text-right font-mono text-emerald-400">{fmt(r.gross_profit)}</td>
                        <td className="px-4 py-2 text-right font-mono text-red-400">{fmt(r.expenses)}</td>
                        <td className={`px-4 py-2 text-right font-mono font-semibold ${r.net_profit>=0?'text-amber-400':'text-red-400'}`}>{fmt(r.net_profit)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* EXPENSES REPORT */}
          {tab === 'Expenses' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="card">
                  <h2 className="text-sm font-semibold text-zinc-300 mb-3 flex items-center gap-2"><Receipt size={14}/> Category Breakdown</h2>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={d} dataKey="total" nameKey="category" cx="50%" cy="50%" outerRadius={80} label={({percent})=>`${(percent*100).toFixed(0)}%`} labelLine={false}>
                        {d.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={{background:'#18181b',border:'1px solid #3f3f46',borderRadius:10}} formatter={v=>[`RWF ${fmt(v)}`]} />
                      <Legend iconSize={8} iconType="circle" formatter={v=><span className="text-zinc-500 text-xs">{v}</span>} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="card p-0 overflow-auto">
                  <table className="w-full text-xs">
                    <thead><tr className="tbl-head"><th className="text-left px-4 py-3">Category</th><th className="text-right px-4 py-3">Total</th><th className="text-right px-4 py-3">Count</th><th className="text-right px-4 py-3">Avg</th></tr></thead>
                    <tbody>
                      {d.map((r,i)=>(
                        <tr key={i} className="tbl-row">
                          <td className="px-4 py-2 text-zinc-300">{r.category}</td>
                          <td className="px-4 py-2 text-right font-mono text-red-400">{fmt(r.total)}</td>
                          <td className="px-4 py-2 text-right font-mono text-zinc-500">{r.count}</td>
                          <td className="px-4 py-2 text-right font-mono text-zinc-500">{fmt(r.avg_amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* PRODUCTS REPORT */}
          {tab === 'Products' && (
            <div className="space-y-5">
              <div className="card">
                <h2 className="text-sm font-semibold text-zinc-300 mb-4 flex items-center gap-2"><Package size={14}/> Product Performance</h2>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={d.slice(0,10)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis dataKey="name" tick={{fill:'#71717a',fontSize:10}} axisLine={false} tickLine={false} />
                    <YAxis tick={{fill:'#71717a',fontSize:10}} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{background:'#18181b',border:'1px solid #3f3f46',borderRadius:10}} />
                    <Bar dataKey="total_units_sold" fill="#6366f1" radius={[3,3,0,0]} name="Units Sold" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="card p-0 overflow-x-auto">
                <table className="w-full text-xs">
                  <thead><tr className="tbl-head"><th className="text-left px-4 py-3">Product</th><th className="text-left px-4 py-3">Category</th><th className="text-right px-4 py-3">Stock</th><th className="text-right px-4 py-3">Sold</th><th className="text-right px-4 py-3">Revenue</th><th className="text-right px-4 py-3">Profit</th></tr></thead>
                  <tbody>
                    {d.map((r,i)=>(
                      <tr key={i} className="tbl-row">
                        <td className="px-4 py-2 text-zinc-200 font-medium">{r.name}</td>
                        <td className="px-4 py-2"><span className="badge-blue">{r.category}</span></td>
                        <td className="px-4 py-2 text-right font-mono text-zinc-400">{r.current_stock}</td>
                        <td className="px-4 py-2 text-right font-mono text-indigo-400">{r.total_units_sold}</td>
                        <td className="px-4 py-2 text-right font-mono text-zinc-200">{fmt(r.total_revenue)}</td>
                        <td className="px-4 py-2 text-right font-mono text-emerald-400">{fmt(r.total_profit)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
