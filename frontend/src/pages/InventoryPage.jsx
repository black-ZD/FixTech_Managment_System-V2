import React, { useEffect, useState } from 'react';
import { productsAPI } from '../services/modules';
import { useAuth } from '../context/AuthContext';
import { Plus, Pencil, Trash2, Search, AlertTriangle, History } from 'lucide-react';
import Modal from '../components/Modal';
import Alert from '../components/Alert';

const EMPTY = { name:'', category:'', brand:'', purchase_price:'', selling_price:'', quantity:'', supplier:'' };

export default function InventoryPage() {
  const { isAdmin } = useAuth();
  const [products, setProducts]     = useState([]);
  const [history,  setHistory]      = useState([]);
  const [loading,  setLoading]      = useState(true);
  const [search,   setSearch]       = useState('');
  const [modal,    setModal]        = useState(null); // 'form' | 'history'
  const [editing,  setEditing]      = useState(null);
  const [form,     setForm]         = useState(EMPTY);
  const [saving,   setSaving]       = useState(false);
  const [error,    setError]        = useState('');

  const load = async () => {
    try { const r = await productsAPI.getAll(); setProducts(r.data.data); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openAdd  = () => { setForm(EMPTY); setEditing(null); setError(''); setModal('form'); };
  const openEdit = p  => { setForm({ name:p.name, category:p.category, brand:p.brand||'', purchase_price:p.purchase_price, selling_price:p.selling_price, quantity:p.quantity, supplier:p.supplier||'' }); setEditing(p); setError(''); setModal('form'); };
  const openHistory = async () => {
    const r = await productsAPI.getStockHistory();
    setHistory(r.data.data);
    setModal('history');
  };

  const handleSave = async e => {
    e.preventDefault(); setSaving(true); setError('');
    try {
      const payload = { ...form, purchase_price: +form.purchase_price, selling_price: +form.selling_price, quantity: +form.quantity };
      if (editing) await productsAPI.update(editing.id, payload);
      else         await productsAPI.create(payload);
      await load(); setModal(null);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Failed to save.');
    } finally { setSaving(false); }
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this product? (soft delete — data preserved)')) return;
    try { await productsAPI.delete(id); setProducts(p => p.filter(x => x.id !== id)); }
    catch { alert('Failed to delete.'); }
  };

  const filtered = products.filter(p =>
    `${p.name} ${p.category} ${p.brand||''}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-white">Inventory</h1>
          <p className="text-zinc-500 text-sm">{products.length} products</p>
        </div>
        <div className="flex gap-2">
          <button onClick={openHistory} className="btn-secondary"><History size={14} /> Stock History</button>
          {isAdmin && <button onClick={openAdd} className="btn-primary"><Plus size={14} /> Add Product</button>}
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-xs">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
        <input className="input pl-8 text-sm" placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Table */}
      <div className="card p-0 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="tbl-head">
              <th className="text-left px-4 py-3">Product</th>
              <th className="text-left px-4 py-3">Category</th>
              <th className="text-right px-4 py-3">Cost</th>
              <th className="text-right px-4 py-3">Price</th>
              <th className="text-right px-4 py-3">Margin</th>
              <th className="text-right px-4 py-3">Stock</th>
              {isAdmin && <th className="px-4 py-3 w-20" />}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center py-12 text-zinc-600">Loading…</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-12 text-zinc-600">No products found</td></tr>
            ) : filtered.map(p => {
              const margin = p.selling_price > 0 ? (((p.selling_price - p.purchase_price) / p.selling_price) * 100).toFixed(0) : 0;
              return (
                <tr key={p.id} className="tbl-row">
                  <td className="px-4 py-3">
                    <div className="font-medium text-zinc-200">{p.name}</div>
                    {p.brand && <div className="text-xs text-zinc-600">{p.brand} · {p.supplier||''}</div>}
                  </td>
                  <td className="px-4 py-3"><span className="badge-blue">{p.category}</span></td>
                  <td className="px-4 py-3 text-right font-mono text-zinc-400 text-xs">{(+p.purchase_price).toLocaleString()}</td>
                  <td className="px-4 py-3 text-right font-mono text-zinc-200 text-xs">{(+p.selling_price).toLocaleString()}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={`font-mono text-xs ${margin >= 20 ? 'text-emerald-400' : margin >= 10 ? 'text-amber-400' : 'text-red-400'}`}>{margin}%</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={p.quantity===0?'badge-red':p.quantity<=5?'badge-yellow':'badge-green'}>
                      {p.quantity===0 && <AlertTriangle size={9} />}
                      {p.quantity}
                    </span>
                  </td>
                  {isAdmin && (
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5 justify-end">
                        <button onClick={() => openEdit(p)} className="btn-icon text-zinc-500 hover:text-indigo-400 hover:bg-indigo-900/20"><Pencil size={13} /></button>
                        <button onClick={() => handleDelete(p.id)} className="btn-icon text-zinc-500 hover:text-red-400 hover:bg-red-900/20"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {modal === 'form' && (
        <Modal title={editing ? 'Edit Product' : 'Add Product'} onClose={() => setModal(null)}>
          <Alert type="error" message={error} />
          <form onSubmit={handleSave} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2"><label className="label">Product Name *</label><input className="input" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} required /></div>
              <div><label className="label">Category *</label><input className="input" value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))} required /></div>
              <div><label className="label">Brand</label><input className="input" value={form.brand} onChange={e=>setForm(f=>({...f,brand:e.target.value}))} /></div>
              <div><label className="label">Cost Price *</label><input className="input" type="number" min="0" step="0.01" value={form.purchase_price} onChange={e=>setForm(f=>({...f,purchase_price:e.target.value}))} required /></div>
              <div><label className="label">Sell Price *</label><input className="input" type="number" min="0" step="0.01" value={form.selling_price} onChange={e=>setForm(f=>({...f,selling_price:e.target.value}))} required /></div>
              <div><label className="label">Quantity *</label><input className="input" type="number" min="0" value={form.quantity} onChange={e=>setForm(f=>({...f,quantity:e.target.value}))} required /></div>
              <div><label className="label">Supplier</label><input className="input" value={form.supplier} onChange={e=>setForm(f=>({...f,supplier:e.target.value}))} /></div>
            </div>
            <div className="flex gap-2 pt-2">
              <button type="button" onClick={()=>setModal(null)} className="btn-secondary flex-1">Cancel</button>
              <button type="submit" disabled={saving} className="btn-primary flex-1">{saving?'Saving…':editing?'Update':'Add Product'}</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Stock History Modal */}
      {modal === 'history' && (
        <Modal title="Stock History" onClose={() => setModal(null)} wide>
          <div className="overflow-x-auto -mx-1">
            <table className="w-full text-xs">
              <thead><tr className="tbl-head"><th className="text-left px-3 py-2">Product</th><th className="text-left px-3 py-2">Type</th><th className="text-right px-3 py-2">Change</th><th className="text-right px-3 py-2">Before</th><th className="text-right px-3 py-2">After</th><th className="text-left px-3 py-2">By</th><th className="text-left px-3 py-2">Date</th></tr></thead>
              <tbody>
                {history.length === 0
                  ? <tr><td colSpan={7} className="text-center py-8 text-zinc-600">No stock history yet</td></tr>
                  : history.map(h => (
                    <tr key={h.id} className="tbl-row">
                      <td className="px-3 py-2 text-zinc-300">{h.product_name}</td>
                      <td className="px-3 py-2"><span className={h.change_type==='sale'?'badge-red':h.change_type==='restock'?'badge-green':'badge-gray'}>{h.change_type}</span></td>
                      <td className={`px-3 py-2 text-right font-mono ${h.quantity_changed<0?'text-red-400':'text-emerald-400'}`}>{h.quantity_changed>0?'+':''}{h.quantity_changed}</td>
                      <td className="px-3 py-2 text-right font-mono text-zinc-500">{h.previous_quantity}</td>
                      <td className="px-3 py-2 text-right font-mono text-zinc-200">{h.new_quantity}</td>
                      <td className="px-3 py-2 text-zinc-400">{h.changed_by_name}</td>
                      <td className="px-3 py-2 text-zinc-600">{new Date(h.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Modal>
      )}
    </div>
  );
}
