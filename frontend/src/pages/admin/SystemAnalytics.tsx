// src/pages/admin/SystemAnalytics.tsx
import React, { useEffect, useState, useRef } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { Server, Activity, Cpu, Globe, Zap, Terminal, Loader2 } from 'lucide-react';
import api from '../../services/api';

interface SystemData {
  uptime: string;
  latency: number;
  cpuLoad: number;
  memoryUsage: number; // New metric for real data
  requestCount: number;
  logs: string[];
}

const SystemAnalytics = () => {
  const [data, setData] = useState<SystemData | null>(null);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. Function to fetch real server metrics
  const fetchMetrics = async () => {
    try {
      const { data } = await api.get('/analytics'); // We will build this endpoint next
      setData(data);
    } catch (error) {
      console.error("Failed to fetch system metrics");
    } finally {
      setLoading(false);
    }
  };

  // 2. Poll every 3 seconds for "Real Time" feel
  useEffect(() => {
    fetchMetrics(); // Initial fetch
    const interval = setInterval(fetchMetrics, 3000); 
    return () => clearInterval(interval);
  }, []);

  // 3. Auto-scroll logs to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [data?.logs]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex h-[80vh] items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-slate-500" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">System Analytics</h1>
        <p className="text-slate-400">Live infrastructure monitoring.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        
        {/* Uptime Card */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
              <Activity className="w-5 h-5" />
            </div>
            <span className="text-emerald-400 text-xs font-bold bg-emerald-500/10 px-2 py-1 rounded">
              Online
            </span>
          </div>
          <div className="text-xl font-bold text-white font-mono">
            {data?.uptime || "0s"}
          </div>
          <div className="text-xs text-slate-500 mt-1">System Uptime</div>
        </div>

        {/* Latency Card */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
              <Server className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white">
            {data?.latency}ms
          </div>
          <div className="text-xs text-slate-500 mt-1">API Latency</div>
        </div>

        {/* CPU/Memory Card */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-violet-500/10 rounded-lg text-violet-400">
              <Cpu className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white">
            {data?.memoryUsage}%
          </div>
          <div className="text-xs text-slate-500 mt-1">Memory Usage</div>
        </div>

        {/* Requests Card */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white">
            {data?.requestCount}
          </div>
          <div className="text-xs text-slate-500 mt-1">Active Session Requests</div>
        </div>
      </div>

      {/* Deep Dive Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Traffic Source (Still Simulated as we don't have GeoIP yet) */}
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

        {/* Live Logs */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex flex-col h-[350px]">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-slate-400" /> Live System Logs
          </h3>
          <div 
            ref={scrollRef}
            className="flex-1 space-y-2 font-mono text-xs bg-slate-950 p-4 rounded-lg border border-slate-800 overflow-y-auto"
          >
            {data?.logs.length === 0 ? (
               <div className="text-slate-600 italic">Waiting for incoming signals...</div>
            ) : (
               data?.logs.map((log, idx) => {
                 // Basic Syntax Highlighting for Logs
                 const isError = log.includes('ERR') || log.includes('404') || log.includes('500');
                 const isWarn = log.includes('WARN');
                 const isSuccess = log.includes('200') || log.includes('Connected');

                 return (
                   <div key={idx} className="border-b border-slate-900/50 pb-1 mb-1 last:border-0">
                     <span className="text-slate-600 mr-2">
                        [{new Date().toLocaleTimeString()}]
                     </span>
                     <span className={
                        isError ? "text-red-400" : 
                        isWarn ? "text-amber-400" : 
                        isSuccess ? "text-emerald-400" : "text-slate-300"
                     }>
                        {log}
                     </span>
                   </div>
                 );
               })
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SystemAnalytics;