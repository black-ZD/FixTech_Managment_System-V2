import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

export default function Alert({ type = 'error', message }) {
  if (!message) return null;
  const isErr = type === 'error';
  return (
    <div className={`flex items-start gap-2.5 rounded-xl px-4 py-3 text-sm mb-4 ${isErr ? 'bg-red-950/60 border border-red-800/60 text-red-300' : 'bg-emerald-950/60 border border-emerald-800/60 text-emerald-300'}`}>
      {isErr ? <AlertCircle size={15} className="mt-0.5 flex-shrink-0" /> : <CheckCircle size={15} className="mt-0.5 flex-shrink-0" />}
      <span>{message}</span>
    </div>
  );
}
