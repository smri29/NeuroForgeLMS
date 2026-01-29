// src/pages/Login.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import toast, { Toaster } from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Call Backend
      const { data } = await api.post('/users/login', { email, password });
      
      // 2. Save Token (Global State)
      login(data);
      
      toast.success('Welcome back!');

      // 3. SMART REDIRECT LOGIC
      if (data.role === 'admin') {
          console.log("👑 Admin detected. Redirecting to Command Center...");
          navigate('/admin'); // <--- Send Admins here
      } else {
          console.log("🎓 Student detected. Redirecting to Dashboard...");
          navigate('/dashboard'); // <--- Send Students here
      }
      
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <Toaster position="top-right" />
      
      <div className="w-full max-w-md bg-slate-800 rounded-xl shadow-2xl p-8 border border-slate-700">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">NeuroForge</h1>
          <p className="text-slate-400">Enter the system</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Input 
            label="Email Address" 
            type="email" 
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <Input 
            label="Password" 
            type="password" 
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="flex justify-end mb-6">
            <Link to="/forgot-password" className="text-xs text-violet-400 hover:text-violet-300">
              Forgot Password?
            </Link>
          </div>

          <Button type="submit" isLoading={isLoading}>
            Sign In
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-violet-400 hover:text-violet-300 font-medium">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;