import React, { useEffect, useState } from 'react';
import { expensesAPI } from '../services/modules';
import { useAuth } from '../context/AuthContext';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import Modal from '../components/Modal';
import Alert from '../components/Alert';

const COLORS   = ['#6366f1','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899','#06b6d4','#84cc16'];
const CATS     = ['General','Rent','Electricity','Salaries','Supplies','Transport','Marketing','Other'];
const EMPTY    = { description:'', amount:'', category:'General' };

export default function ExpensesPage() {
  const { isAdmin } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [summary,  setSummary]  = useState([]);
  const [trend,    setTrend]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [modal,    setModal]    = useState(false);
  const [editing,  setEditing]  = useState(null);
  const [form,     setForm]     = useState(EMPTY);
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState('');

  const load = async () => {
    try {
      const [e,s,t] = await Promise.all([expensesAPI.getAll(), expensesAPI.getSummary(), expensesAPI.getMonthlyTrend()]);
      setExpenses(e.data.data);
      setSummary(s.data.data.map(r=>({ name:r.category, value:+r.total })));
      setTrend(t.data.data.slice(0,6).reverse().map(r=>({ month:r.month, total:+r.total })));
    } catch(e){ console.error(e); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const openAdd  = () => { setForm(EMPTY); setEditing(null); setError(''); setModal(true); };
  const openEdit = e  => { setForm({ description:e.description, amount:e.amount, category:e.category }); setEditing(e); setError(''); setModal(true); };

  const handleSave = async ev => {
    ev.preventDefault(); setSaving(true); setError('');
    try {
      const p = { ...form, amount:+form.amount };
      if (editing) await expensesAPI.update(editing.id, p);
      else         await expensesAPI.create(p);
      await load(); setModal(false);
    } catch(err) { setError(err.response?.data?.message||'Failed.'); } finally { setSaving(false); }
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete?')) return;
    try { await expensesAPI.delete(id); setExpenses(e=>e.filter(x=>x.id!==id)); } catch { alert('Failed.'); }
  };

  const total = expenses.reduce((s,e)=>s + +e.amount, 0);
  const fmt   = n => new Intl.NumberFormat().format(Math.round(n));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-bold text-white">Expenses</h1><p className="text-zinc-500 text-sm">Total: RWF {fmt(total)}</p></div>
        {isAdmin && <button onClick={openAdd} className="btn-primary"><Plus size={14} /> Add Expense</button>}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {summary.length > 0 && (
          <div className="card">
            <h2 className="text-sm font-semibold text-zinc-300 mb-3">By Category</h2>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={summary} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} label={({percent})=>`${(percent*100).toFixed(0)}%`} labelLine={false}>
                  {summary.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{background:'#18181b',border:'1px solid #3f3f46',borderRadius:10}} formatter={v=>[`RWF ${fmt(v)}`]} />
                <Legend iconSize={8} iconType="circle" formatter={v=><span className="text-zinc-500 text-xs">{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {trend.length > 0 && (
          <div className="card">
            <h2 className="text-sm font-semibold text-zinc-300 mb-3">Monthly Trend</h2>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={trend}>
                <defs><linearGradient id="gE" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/><stop offset="95%" stopColor="#ef4444" stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="month" tick={{fill:'#71717a',fontSize:11}} axisLine={false} tickLine={false} />
                <YAxis tick={{fill:'#71717a',fontSize:11}} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{background:'#18181b',border:'1px solid #3f3f46',borderRadius:10}} />
                <Area type="monotone" dataKey="total" stroke="#ef4444" fill="url(#gE)" name="Expenses" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="card p-0 overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="tbl-head"><th className="text-left px-4 py-3">Description</th><th className="text-left px-4 py-3">Category</th><th className="text-right px-4 py-3">Amount</th><th className="text-left px-4 py-3">Date</th>{isAdmin&&<th className="px-4 py-3 w-20"/>}</tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={5} className="text-center py-10 text-zinc-600">Loading…</td></tr>
            : expenses.length===0 ? <tr><td colSpan={5} className="text-center py-10 text-zinc-600">No expenses recorded</td></tr>
            : expenses.map(e=>(
              <tr key={e.id} className="tbl-row">
                <td className="px-4 py-3 text-zinc-200">{e.description}</td>
                <td className="px-4 py-3"><span className="badge-blue">{e.category}</span></td>
                <td className="px-4 py-3 text-right font-mono text-red-400 text-sm">−{fmt(e.amount)}</td>
                <td className="px-4 py-3 text-zinc-600 text-xs">{new Date(e.created_at).toLocaleDateString()}</td>
                {isAdmin && (
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5 justify-end">
                      <button onClick={()=>openEdit(e)} className="btn-icon text-zinc-500 hover:text-indigo-400 hover:bg-indigo-900/20"><Pencil size={13}/></button>
                      <button onClick={()=>handleDelete(e.id)} className="btn-icon text-zinc-500 hover:text-red-400 hover:bg-red-900/20"><Trash2 size={13}/></button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal title={editing?'Edit Expense':'Add Expense'} onClose={()=>setModal(false)}>
          <Alert type="error" message={error} />
          <form onSubmit={handleSave} className="space-y-4">
            <div><label className="label">Description *</label><input className="input" value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} required /></div>
            <div><label className="label">Category</label>
              <select className="input" value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}>
                {CATS.map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <div><label className="label">Amount (RWF) *</label><input className="input" type="number" min="0.01" step="0.01" value={form.amount} onChange={e=>setForm(f=>({...f,amount:e.target.value}))} required /></div>
            <div className="flex gap-2 pt-1">
              <button type="button" onClick={()=>setModal(false)} className="btn-secondary flex-1">Cancel</button>
              <button type="submit" disabled={saving} className="btn-primary flex-1">{saving?'Saving…':editing?'Update':'Add'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
