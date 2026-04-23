import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Zap, Eye, EyeOff } from 'lucide-react';
import Alert from '../components/Alert';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form, setForm]       = useState({ username: '', password: '' });
  const [showPw, setShowPw]   = useState(false);
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  
  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.username, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 relative overflow-hidden">


      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 via-black to-black pointer-events-none" />
      <div className="absolute w-[500px] h-[500px] bg-indigo-600/20 blur-3xl rounded-full top-[-100px] left-[-100px]" />

      <div className="w-full max-w-md relative z-10">

        {/* Logo + Heading */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-900/40 mb-4">
            <Zap size={28} className="text-white" />
          </div>

          <h1 className="text-3xl font-semibold text-white tracking-tight">
            Welcome back
          </h1>
          <p className="text-zinc-400 text-sm mt-2">
            Sign in to your FixTech dashboard
          </p>
        </div>

        {/* Card */}
        <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6 shadow-2xl">

          <Alert type="error" message={error} />

          <form onSubmit={handleSubmit} className="space-y-5 mt-3">

            {/* Username */}
            <div>
              <label className="text-sm text-zinc-400 block mb-1">
                Username
              </label>
              <input
                type="text"
                placeholder="Enter your username"
                value={form.username}
                onChange={e =>
                  setForm(f => ({ ...f, username: e.target.value }))
                }
                required
                autoComplete="username"
                className="w-full px-4 py-2.5 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm text-zinc-400 block mb-1">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={e =>
                    setForm(f => ({ ...f, password: e.target.value }))
                  }
                  required
                  autoComplete="current-password"
                  className="w-full px-4 py-2.5 pr-10 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />

                <button
                  type="button"
                  onClick={() => setShowPw(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white font-medium py-2.5 rounded-lg transition disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>
          <button
                type="button"
                 onClick={() => navigate('/')}
                 className="w-full mt-4 text-sm text-zinc-400 hover:text-white transition flex items-center justify-center gap-2"
                 >
                  ← Back to Landing Page
          </button>

          {/* Footer */}
          <p className="text-center text-xs text-zinc-600 mt-6">
            FixTech © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
}