import React, { useState, useEffect, useRef } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Package, ShoppingCart, Receipt,
  Users, BarChart2, LogOut, Menu, Zap, Bell, ClipboardList
} from 'lucide-react';

const NAV = [
  { to: '/app/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/app/inventory', icon: Package, label: 'Inventory' },
  { to: '/app/sales', icon: ShoppingCart, label: 'Sales' },
  { to: '/app/expenses', icon: Receipt, label: 'Expenses' },
  { to: '/app/staff', icon: Users, label: 'Staff' },
  { to: '/app/requests', icon: ClipboardList, label: 'Requests' }, 
  { to: '/app/reports', icon: BarChart2, label: 'Reports' },
];

function Sidebar({ onClose }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full">

      {/* LOGO */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-zinc-800">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
          <Zap size={18} />
        </div>
        <div>
          <h1 className="font-semibold">FixTech</h1>
          <p className="text-xs text-zinc-500">Management</p>
        </div>
      </div>

      {/* NAV */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition
              ${isActive
                ? 'bg-indigo-600 text-white'
                : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'}`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* USER + LOGOUT */}
      <div className="border-t border-zinc-800 p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-500 rounded-full flex items-center justify-center text-sm font-bold">
            {user?.name?.[0] || 'U'}
          </div>
          <div>
            <p className="text-sm font-medium">{user?.username || 'User'}</p>
            <p className="text-xs text-zinc-500">{user?.role || 'Staff'}</p>
          </div>
        </div>

        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="flex items-center gap-2 text-zinc-400 hover:text-red-400 text-sm"
        >
          <LogOut size={14} />
          Logout
        </button>
      </div>
    </div>
  );
}

export default function MainLayout() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [show, setShow] = useState(false);
  const boxRef = useRef();

  const fetchNotifications = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/notifications');
      const data = await res.json();
      setNotifications(data.data || []);
    } catch (err) {
      console.log("Notification error", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const t = setInterval(fetchNotifications, 5000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) {
        setShow(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const unread = notifications.filter(n => n.is_read === 0).length;

  return (
    <div className="flex min-h-screen bg-zinc-950 text-white">

      {/* SIDEBAR */}
      <aside className="hidden lg:flex w-64 bg-zinc-900 border-r border-zinc-800">
        <Sidebar />
      </aside>

      {/* MOBILE */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <aside className="w-64 h-full bg-zinc-900">
            <Sidebar onClose={() => setOpen(false)} />
          </aside>
        </div>
      )}

      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        {/* HEADER */}
        <header className="flex items-center justify-between px-4 py-3 bg-zinc-900 border-b border-zinc-800">

          {/* LEFT */}
          <div className="flex items-center gap-3">
            <button onClick={() => setOpen(true)} className="lg:hidden">
              <Menu />
            </button>
            <h2 className="text-sm text-zinc-400">Welcome back</h2>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4">

            {/* NOTIFICATIONS */}
            <div className="relative" ref={boxRef}>
              <button onClick={() => setShow(!show)} className="relative p-2 rounded-lg hover:bg-zinc-800">
                <Bell size={18} />
                {unread > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-xs px-1 rounded-full">
                    {unread}
                  </span>
                )}
              </button>

              {show && (
                <div className="absolute right-0 mt-2 w-80 bg-zinc-900 border border-zinc-700 rounded-xl shadow-xl overflow-hidden">

                  <div className="p-3 border-b border-zinc-700 font-semibold flex justify-between">
                    Notifications
                    <span className="text-xs text-zinc-500">{unread} new</span>
                  </div>

                  {notifications.length === 0 ? (
                    <p className="p-4 text-sm text-zinc-500">No notifications</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-3 border-b border-zinc-800 text-sm hover:bg-zinc-800 transition
                        ${n.is_read === 0 ? 'bg-zinc-800/60' : ''}`}
                      >
                        <p className="font-medium">{n.title}</p>
                        <p className="text-xs text-zinc-400">{n.message}</p>
                      </div>
                    ))
                  )}

                </div>
              )}
            </div>

          </div>
        </header>

        <main className="p-4">
          <Outlet />
        </main>

      </div>
    </div>
  );
}