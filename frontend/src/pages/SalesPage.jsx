import React, { useEffect, useState, useRef } from 'react';
import { salesAPI, productsAPI } from '../services/modules';
import { Plus, Printer } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Modal from '../components/Modal';
import Alert from '../components/Alert';

export default function SalesPage() {
  const [sales,    setSales]   = useState([]);
  const [products, setProds]   = useState([]);
  const [monthly,  setMonthly] = useState([]);
  const [loading,  setLoading] = useState(true);
  const [modal,    setModal]   = useState(null); // 'new' | 'receipt'
  const [lastSale, setLastSale]= useState(null);
  const [form,     setForm]    = useState({ product_id:'', quantity:1 });
  const [preview,  setPreview] = useState(null);
  const [saving,   setSaving]  = useState(false);
  const [error,    setError]   = useState('');
  const receiptRef = useRef();

  const load = async () => {
    try {
      const [s,p,m] = await Promise.all([salesAPI.getAll(), productsAPI.getAll(), salesAPI.getMonthly()]);
      setSales(s.data.data);
      setProds(p.data.data.filter(x=>x.quantity>0));
      setMonthly(m.data.data.slice(0,6).reverse().map(r=>({ month:r.month, revenue:+r.revenue, profit:+r.profit })));
    } catch(e){ console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (!form.product_id || !form.quantity) { setPreview(null); return; }
    const p = products.find(x => x.id===+form.product_id);
    if (!p) return;
    const qty = +form.quantity || 0;
    setPreview({ product: p.name, sell: +p.selling_price, total: +p.selling_price*qty, profit: (+p.selling_price - +p.purchase_price)*qty, stock: p.quantity });
  }, [form, products]);

  const openNew = () => { setForm({ product_id:'', quantity:1 }); setPreview(null); setError(''); setModal('new'); };

  const handleSale = async e => {
    e.preventDefault(); setSaving(true); setError('');
    try {
      const r = await salesAPI.create({ product_id:+form.product_id, quantity:+form.quantity });
      setLastSale({ ...r.data.data, date: new Date().toLocaleString() });
      setModal('receipt');
      await load();
    } catch(err) { setError(err.response?.data?.message||'Sale failed.'); }
    finally { setSaving(false); }
  };

  const printReceipt = () => {
    const w = window.open('', '_blank');
    w.document.write(`<html><head><title>Receipt</title><style>body{font-family:monospace;padding:20px;max-width:320px;margin:auto}h2{text-align:center}hr{border:1px dashed #999}p{margin:4px 0}.total{font-size:1.2em;font-weight:bold}</style></head><body>${receiptRef.current.innerHTML}</body></html>`);
    w.document.close(); w.print();
  };

  const fmt = n => new Intl.NumberFormat().format(Math.round(n));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-bold text-white">Sales</h1><p className="text-zinc-500 text-sm">{sales.length} transactions</p></div>
        <button onClick={openNew} className="btn-primary"><Plus size={14} /> New Sale</button>
      </div>

      {/* Monthly chart */}
      {monthly.length > 0 && (
        <div className="card">
          <h2 className="text-sm font-semibold text-zinc-300 mb-4">Monthly Revenue & Profit</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthly} barGap={3}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="month" tick={{fill:'#71717a',fontSize:11}} axisLine={false} tickLine={false} />
              <YAxis tick={{fill:'#71717a',fontSize:11}} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{background:'#18181b',border:'1px solid #3f3f46',borderRadius:10}} />
              <Bar dataKey="revenue" fill="#6366f1" radius={[4,4,0,0]} name="Revenue" />
              <Bar dataKey="profit"  fill="#10b981" radius={[4,4,0,0]} name="Profit"  />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Table */}
      <div className="card p-0 overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="tbl-head"><th className="text-left px-4 py-3">#</th><th className="text-left px-4 py-3">Product</th><th className="text-right px-4 py-3">Qty</th><th className="text-right px-4 py-3">Total</th><th className="text-right px-4 py-3">Profit</th><th className="text-left px-4 py-3">Sold By</th><th className="text-left px-4 py-3">Date</th></tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={7} className="text-center py-10 text-zinc-600">Loading…</td></tr>
            : sales.length===0 ? <tr><td colSpan={7} className="text-center py-10 text-zinc-600">No sales yet</td></tr>
            : sales.map(s=>(
              <tr key={s.id} className="tbl-row">
                <td className="px-4 py-3 font-mono text-zinc-600 text-xs">#{s.id}</td>
                <td className="px-4 py-3"><div className="text-zinc-200 font-medium">{s.product_name}</div><div className="text-xs text-zinc-600">{s.category}</div></td>
                <td className="px-4 py-3 text-right font-mono text-zinc-400">{s.quantity}</td>
                <td className="px-4 py-3 text-right font-mono text-zinc-200">{fmt(s.total_price)}</td>
                <td className="px-4 py-3 text-right font-mono text-emerald-400">+{fmt(s.profit)}</td>
                <td className="px-4 py-3 text-zinc-400 text-xs">{s.seller_name}</td>
                <td className="px-4 py-3 text-zinc-600 text-xs">{new Date(s.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* New Sale Modal */}
      {modal==='new' && (
        <Modal title="Record New Sale" onClose={()=>setModal(null)}>
          <Alert type="error" message={error} />
          <form onSubmit={handleSale} className="space-y-4">
            <div>
              <label className="label">Product *</label>
              <select className="input" value={form.product_id} onChange={e=>setForm(f=>({...f,product_id:e.target.value}))} required>
                <option value="">Select product…</option>
                {products.map(p=><option key={p.id} value={p.id}>{p.name} — Stock: {p.quantity}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Quantity *</label>
              <input className="input" type="number" min="1" value={form.quantity} onChange={e=>setForm(f=>({...f,quantity:e.target.value}))} required />
            </div>
            {preview && (
              <div className="bg-zinc-800 rounded-xl p-4 space-y-2 text-sm border border-zinc-700">
                <div className="flex justify-between text-zinc-400"><span>Unit price</span><span className="font-mono text-zinc-200">RWF {fmt(preview.sell)}</span></div>
                <div className="flex justify-between text-zinc-400"><span>Total</span><span className="font-mono text-white font-bold">RWF {fmt(preview.total)}</span></div>
                <div className="flex justify-between text-zinc-400"><span>Profit</span><span className="font-mono text-emerald-400">+{fmt(preview.profit)}</span></div>
                <div className="flex justify-between text-zinc-400 border-t border-zinc-700 pt-2"><span>Remaining stock</span>
                  <span className={`font-mono ${preview.stock-(+form.quantity||0)<=5?'text-amber-400':'text-zinc-300'}`}>{preview.stock-(+form.quantity||0)}</span>
                </div>
              </div>
            )}
            <div className="flex gap-2 pt-1">
              <button type="button" onClick={()=>setModal(null)} className="btn-secondary flex-1">Cancel</button>
              <button type="submit" disabled={saving} className="btn-primary flex-1">{saving?'Processing…':'Confirm Sale'}</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Receipt Modal */}
      {modal==='receipt' && lastSale && (
        <Modal title="Sale Receipt" onClose={()=>setModal(null)}>
          <div ref={receiptRef} className="font-mono text-sm space-y-2 text-zinc-300">
            <h2 className="text-center text-white font-bold text-lg">FIXTECH SHOP</h2>
            <p className="text-center text-zinc-500 text-xs">Electricity & Computer Solutions</p>
            <hr className="border-zinc-700 border-dashed" />
            <p>Date: {lastSale.date}</p>
            <p>Receipt #: {lastSale.id}</p>
            <hr className="border-zinc-700 border-dashed" />
            <div className="flex justify-between"><span>{lastSale.product_name}</span><span>x{lastSale.quantity}</span></div>
            <hr className="border-zinc-700 border-dashed" />
            <div className="flex justify-between font-bold text-white text-base"><span>TOTAL</span><span>RWF {fmt(lastSale.total_price)}</span></div>
            <hr className="border-zinc-700 border-dashed" />
            <p className="text-center text-zinc-500 text-xs">Thank you for your business!</p>
          </div>
          <div className="flex gap-2 mt-5">
            <button onClick={()=>setModal(null)} className="btn-secondary flex-1">Close</button>
            <button onClick={printReceipt} className="btn-primary flex-1"><Printer size={14} /> Print</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
