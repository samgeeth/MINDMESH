import React, { useState } from 'react';
import { X, Lock, Mail, Shield, Key, AlertCircle, RefreshCw } from 'lucide-react';
import { api, setStoredToken } from '../../services/api.ts';
import type { User } from '../../types/index.ts';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.login(email, password);
      setStoredToken(res.token);
      onLoginSuccess(res.user);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid login credentials');
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (userEmail: string, pass: string) => {
    setEmail(userEmail);
    setPassword(pass);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 sm:p-8 relative shadow-2xl text-left">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">MINDMESH Admin Login</h3>
            <span className="text-[11px] font-mono text-blue-400">Secure Staff Access</span>
          </div>
        </div>

        <p className="text-xs text-slate-400 mb-6 leading-relaxed">
          Sign in to manage client inquiries, daily price changes, catalog products, and live site content.
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/70 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@mindmesh.in"
                required
                className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-blue-600/30 disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Key className="w-3.5 h-3.5" />}
            <span>Sign In to Dashboard</span>
          </button>
        </form>

        {/* Quick-fill Demo Accounts for Instant Review */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 space-y-2">
          <span className="text-[11px] text-slate-500 font-mono block">
            Demo Credentials (Quick-Fill):
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillCredentials('admin@mindmesh.in', 'MindMesh@2026!')}
              className="py-1.5 px-2 text-[11px] bg-slate-950 hover:bg-slate-800 border border-slate-800 text-blue-400 rounded-lg text-left transition-colors cursor-pointer truncate"
            >
              <span className="font-semibold block truncate">Founder / Owner</span>
              <span className="text-[10px] text-slate-500 truncate block">admin@mindmesh.in</span>
            </button>

            <button
              type="button"
              onClick={() => fillCredentials('editor@mindmesh.in', 'Editor@2026!')}
              className="py-1.5 px-2 text-[11px] bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg text-left transition-colors cursor-pointer truncate"
            >
              <span className="font-semibold block truncate">Editor Account</span>
              <span className="text-[10px] text-slate-500 truncate block">editor@mindmesh.in</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
