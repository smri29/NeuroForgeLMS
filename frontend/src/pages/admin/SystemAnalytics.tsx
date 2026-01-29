// src/pages/admin/SystemAnalytics.tsx
import React from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
// FIX: Added 'Terminal' to the import list below
import { Server, Activity, Cpu, Globe, AlertTriangle, Zap, Terminal } from 'lucide-react';

const SystemAnalytics = () => {
  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">System Analytics</h1>
        <p className="text-slate-400">Real-time infrastructure monitoring.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400"><Activity className="w-5 h-5" /></div>
            <span className="text-emerald-400 text-xs font-bold bg-emerald-500/10 px-2 py-1 rounded">Healthy</span>
          </div>
          <div className="text-3xl font-bold text-white">99.9%</div>
          <div className="text-xs text-slate-500 mt-1">Uptime (Last 30d)</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400"><Server className="w-5 h-5" /></div>
          </div>
          <div className="text-3xl font-bold text-white">45ms</div>
          <div className="text-xs text-slate-500 mt-1">Avg Response Latency</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-violet-500/10 rounded-lg text-violet-400"><Cpu className="w-5 h-5" /></div>
          </div>
          <div className="text-3xl font-bold text-white">12%</div>
          <div className="text-xs text-slate-500 mt-1">Server CPU Load</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400"><Zap className="w-5 h-5" /></div>
          </div>
          <div className="text-3xl font-bold text-white">1.2k</div>
          <div className="text-xs text-slate-500 mt-1">Daily API Requests</div>
        </div>
      </div>

      {/* Deep Dive Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Traffic Source */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
          <h3 className="text-white font-bold mb-6 flex items-center gap-2">
            <Globe className="w-4 h-4 text-slate-400" /> User Traffic Origin
          </h3>
          <div className="space-y-5">
             {[
               { region: 'North America', percent: 65, color: 'bg-blue-500' },
               { region: 'Europe', percent: 20, color: 'bg-indigo-500' },
               { region: 'Asia Pacific', percent: 12, color: 'bg-violet-500' },
               { region: 'Others', percent: 3, color: 'bg-slate-600' },
             ].map(item => (
               <div key={item.region}>
                 <div className="flex justify-between text-xs text-slate-400 mb-1.5 font-medium">
                   <span>{item.region}</span>
                   <span>{item.percent}%</span>
                 </div>
                 <div className="h-2 bg-slate-950 rounded-full overflow-hidden">
                   <div className={`h-full ${item.color} rounded-full`} style={{width: `${item.percent}%`}}></div>
                 </div>
               </div>
             ))}
          </div>
        </div>

        {/* System Logs */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
          <h3 className="text-white font-bold mb-6 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-slate-400" /> Live System Logs
          </h3>
          <div className="space-y-3 font-mono text-xs bg-slate-950 p-4 rounded-lg border border-slate-800 h-[200px] overflow-y-auto">
            <div className="flex gap-2">
              <span className="text-slate-600">[10:42:01]</span>
              <span className="text-emerald-400 font-bold">INFO</span>
              <span className="text-slate-300">User login successful (ID: 482)</span>
            </div>
            <div className="flex gap-2">
              <span className="text-slate-600">[10:41:55]</span>
              <span className="text-blue-400 font-bold">POST</span>
              <span className="text-slate-300">/api/submissions - 200 OK</span>
            </div>
            <div className="flex gap-2">
              <span className="text-slate-600">[10:40:12]</span>
              <span className="text-amber-400 font-bold">WARN</span>
              <span className="text-slate-300">High memory usage detected (Pod 2)</span>
            </div>
            <div className="flex gap-2">
              <span className="text-slate-600">[10:38:00]</span>
              <span className="text-emerald-400 font-bold">INFO</span>
              <span className="text-slate-300">Database backup completed</span>
            </div>
            <div className="flex gap-2">
              <span className="text-slate-600">[10:36:12]</span>
              <span className="text-red-400 font-bold">ERR</span>
              <span className="text-slate-300">Failed to connect to SMTP server</span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SystemAnalytics;