// src/pages/admin/AdminLogin.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import { ShieldAlert, Lock, Terminal } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import toast, { Toaster } from 'react-hot-toast';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Verify Credentials & Role via API first
      const { data } = await api.post('/users/login', { email, password });
      
      if (data.role !== 'admin') {
         toast.error("ACCESS DENIED: Insufficient Privileges");
         setLoading(false);
         return;
      }

      // 2. Update Auth State
      login(data);
      
      // 3. ADMIN REDIRECT (Explicit)
      toast.success("Welcome, Commander.");
      navigate('/admin');

    } catch (error: any) {
      toast.error(error.response?.data?.message || 'System Access Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-mono">
      <Toaster position="top-center" />
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
         <div className="absolute top-0 left-1/4 w-px h-full bg-red-500/50"></div>
         <div className="absolute top-0 right-1/4 w-px h-full bg-red-500/50"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-slate-900 border border-red-900/30 rounded-xl shadow-2xl overflow-hidden">
          
          <div className="bg-red-950/20 p-6 border-b border-red-900/20 flex flex-col items-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4 border border-red-500/20">
              <ShieldAlert className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-xl font-bold text-red-100 tracking-widest uppercase">Restricted Area</h1>
          </div>

          <div className="p-8 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs text-red-400/70 uppercase font-bold tracking-wider">System ID</label>
                <div className="relative">
                  <Terminal className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded text-sm py-2 pl-10 focus:border-red-500 focus:outline-none transition-colors"
                    placeholder="admin@pyforge.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-red-400/70 uppercase font-bold tracking-wider">Passcode</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded text-sm py-2 pl-10 focus:border-red-500 focus:outline-none transition-colors"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                isLoading={loading} 
                className="w-full bg-red-700 hover:bg-red-600 text-white font-bold py-3 mt-4 border border-red-500/20"
              >
                AUTHENTICATE
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;