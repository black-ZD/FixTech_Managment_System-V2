import React, { useEffect, useState } from 'react';
import { staffAPI } from '../services/modules';
import { useAuth } from '../context/AuthContext';
import { Plus, Pencil, Trash2, CalendarCheck } from 'lucide-react';
import Modal from '../components/Modal';
import Alert from '../components/Alert';

const EMPTY = { name:'', role:'', salary:'', phone:'', hire_date:'' };

export default function StaffPage() {
  const { isAdmin } = useAuth();
  const [staff, setStaff] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [attForm, setAttForm] = useState({
    staff_id:'',
    date: new Date().toISOString().slice(0,10),
    status:'present'
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // 🔥 UNDO SYSTEM
  const [pendingDelete, setPendingDelete] = useState(null);
  const [progress, setProgress] = useState(100);

  const load = async () => {
    try {
      const [s,a] = await Promise.all([staffAPI.getAll(), staffAPI.getAttendance()]);
      setStaff(s.data.data);
      setAttendance(a.data.data);
    } catch(e){ console.error(e); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);


  useEffect(() => {
    if (!pendingDelete) return;

    const interval = setInterval(() => {
      const elapsed = Date.now() - pendingDelete.startTime;
      const percent = Math.max(0, 100 - (elapsed / pendingDelete.duration) * 100);
      setProgress(percent);
    }, 50);

    return () => clearInterval(interval);
  }, [pendingDelete]);

  // cleanup timeout
  useEffect(() => {
    return () => {
      if (pendingDelete?.timeout) clearTimeout(pendingDelete.timeout);
    };
  }, [pendingDelete]);

  const openAdd  = () => { setForm(EMPTY); setEditing(null); setError(''); setModal('staff'); };
  const openEdit = s  => { setForm({ name:s.name, role:s.role, salary:s.salary, phone:s.phone||'', hire_date:s.hire_date?.slice(0,10)||'' }); setEditing(s); setError(''); setModal('staff'); };

  const handleSave = async e => {
    e.preventDefault(); setSaving(true); setError('');
    try {
      const p = { ...form, salary:+form.salary };
      if (editing) await staffAPI.update(editing.id, p);
      else await staffAPI.create(p);
      await load(); setModal(null);
    } catch(err){ setError(err.response?.data?.message||err.response?.data?.errors?.[0]?.msg||'Failed.'); } finally { setSaving(false); }
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete staff member?')) return;

    const removed = staff.find(s => s.id === id);
    const index = staff.findIndex(s => s.id === id);

    setStaff(prev => prev.filter(s => s.id !== id));

    const duration = 5000;
    const startTime = Date.now();

    const timeout = setTimeout(async () => {
      try {
        await staffAPI.delete(id);
      } catch {
        alert('Delete failed');
        setStaff(prev => {
          const copy = [...prev];
          copy.splice(index, 0, removed);
          return copy;
        });
      }
      setPendingDelete(null);
    }, duration);

    setProgress(100);

    setPendingDelete({ id, data: removed, index, timeout, startTime, duration });
  };

  const undoDelete = () => {
    if (!pendingDelete) return;

    clearTimeout(pendingDelete.timeout);

    setStaff(prev => {
      const copy = [...prev];
      copy.splice(pendingDelete.index, 0, pendingDelete.data);
      return copy;
    });

    setPendingDelete(null);
  };

  const handleAttendance = async e => {
    e.preventDefault(); setSaving(true); setError('');
    try { await staffAPI.markAttendance(attForm); await load(); setModal(null); }
    catch(err){ setError(err.response?.data?.message||'Failed.'); } finally { setSaving(false); }
  };

  const totalPayroll = staff.reduce((s,m)=>s + +m.salary, 0);
  const fmt = n => new Intl.NumberFormat().format(Math.round(n));

  return (
    <div className="space-y-5">

      {/* HEADER */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-white">Staff</h1>
          <p className="text-zinc-500 text-sm">{staff.length} members · Payroll: RWF {fmt(totalPayroll)}/mo</p>
        </div>
        <div className="flex gap-2">
          <button onClick={()=>{ setAttForm(f=>({...f,staff_id:''})); setError(''); setModal('att'); }} className="btn-secondary">
            <CalendarCheck size={14}/> Attendance
          </button>
          {isAdmin && <button onClick={openAdd} className="btn-primary"><Plus size={14}/> Add Staff</button>}
        </div>
      </div>

      {/* STAFF GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? <div className="col-span-3 text-center py-10 text-zinc-600">Loading…</div>
        : staff.length===0 ? <div className="col-span-3 text-center py-10 text-zinc-600">No staff added yet</div>
        : staff.map(s=>(
          <div key={s.id} className="card gap-3 flex flex-col">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-700/30 rounded-xl flex items-center justify-center text-indigo-300 font-bold text-sm">
                  {s.name[0]?.toUpperCase()}
                </div>
                <div>
                  <div className="font-semibold text-white text-sm">{s.name}</div>
                  <div className="text-xs text-zinc-500">{s.role}</div>
                </div>
              </div>
              {isAdmin && (
                <div className="flex gap-1">
                  <button onClick={()=>openEdit(s)} className="btn-icon"><Pencil size={13}/></button>
                  <button onClick={()=>handleDelete(s.id)} className="btn-icon text-red-400"><Trash2 size={13}/></button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ATTENDANCE TABLE */}
      {attendance.length > 0 && (
        <div className="card p-0 overflow-x-auto">
          <div className="px-4 py-3 border-b border-zinc-800 text-sm font-semibold text-zinc-300">Recent Attendance</div>
          <table className="w-full text-sm">
            <thead>
              <tr className="tbl-head">
                <th className="px-4 py-3 text-left">Staff</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {attendance.slice(0,15).map(a=>(
                <tr key={a.id} className="tbl-row">
                  <td className="px-4 py-3">{a.staff_name}</td>
                  <td className="px-4 py-3">{new Date(a.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3">{a.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/*  UNDO TOAST */}
      {pendingDelete && (
        <div className="fixed bottom-5 right-5 w-80 bg-zinc-900 border border-zinc-700 rounded-xl shadow-lg overflow-hidden">
          <div className="h-1 bg-indigo-500" style={{ width: `${progress}%` }} />
          <div className="flex justify-between px-4 py-3">
            <span className="text-sm text-zinc-300">Deleting staff…</span>
            <button onClick={undoDelete} className="text-indigo-400 text-sm">Undo</button>
          </div>
        </div>
      )}

    </div>
  );
}