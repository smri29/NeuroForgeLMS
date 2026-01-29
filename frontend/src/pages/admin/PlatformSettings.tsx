// src/pages/admin/PlatformSettings.tsx
import React, { useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { Button } from '../../components/ui/Button';
import { ToggleLeft, ToggleRight, Save, Lock, Smartphone, Database } from 'lucide-react';
import toast from 'react-hot-toast';

const PlatformSettings = () => {
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    allowRegistrations: true,
    aiModel: 'Gemini 1.5 Flash',
    maxDailySubmissions: 50,
    emailNotifications: true
  });

  const toggle = (key: keyof typeof settings) => {
    // @ts-ignore
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    toast.success("Configuration saved successfully");
  };

  return (
    <AdminLayout>
      <div className="max-w-3xl">
        <h1 className="text-2xl font-bold text-white mb-2">Platform Settings</h1>
        <p className="text-slate-400 mb-8">Global configuration for PyForge.</p>

        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-800">
          
          {/* Section: Access Control */}
          <div className="p-6">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Lock className="w-4 h-4" /> Access Control
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">Maintenance Mode</h3>
                  <p className="text-slate-500 text-sm">Disable access for all non-admin users immediately.</p>
                </div>
                <button onClick={() => toggle('maintenanceMode')} className="text-slate-400 hover:text-white transition-colors">
                  {settings.maintenanceMode ? <ToggleRight className="w-10 h-10 text-red-500" /> : <ToggleLeft className="w-10 h-10" />}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">Allow New Registrations</h3>
                  <p className="text-slate-500 text-sm">Open or close the public signup page.</p>
                </div>
                <button onClick={() => toggle('allowRegistrations')} className="text-slate-400 hover:text-white transition-colors">
                  {settings.allowRegistrations ? <ToggleRight className="w-10 h-10 text-emerald-500" /> : <ToggleLeft className="w-10 h-10" />}
                </button>
              </div>
            </div>
          </div>

          {/* Section: AI Engine */}
          <div className="p-6">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Database className="w-4 h-4" /> AI Configuration
            </h3>
            
            <div className="grid gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Active LLM Model</label>
                <select 
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-3 focus:border-red-500 outline-none"
                  value={settings.aiModel}
                  onChange={(e) => setSettings({...settings, aiModel: e.target.value})}
                >
                  <option>Gemini 1.5 Flash (Fastest)</option>
                  <option>Gemini 1.5 Pro (Most Capable)</option>
                  <option disabled>GPT-4o (License Required)</option>
                  <option disabled>Claude 3.5 Sonnet (License Required)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section: Save */}
          <div className="p-6 bg-slate-950 flex justify-end">
             <Button className="!w-auto bg-red-600 hover:bg-red-700" onClick={handleSave}>
               <Save className="w-4 h-4 mr-2" /> Save Changes
             </Button>
          </div>

        </div>
      </div>
    </AdminLayout>
  );
};

export default PlatformSettings;