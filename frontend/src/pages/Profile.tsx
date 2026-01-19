import React from 'react';
import AppLayout from '../components/layout/AppLayout';
import { User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Profile = () => {
  const { user } = useAuth();

  return (
    <AppLayout>
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 max-w-2xl">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center text-slate-400">
            <User className="w-10 h-10" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{user?.name}</h1>
            <p className="text-slate-400">{user?.email}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-violet-500/10 text-violet-400 text-xs rounded-full border border-violet-500/20 capitalize">
              {user?.role}
            </span>
          </div>
        </div>
        
        <div className="border-t border-slate-800 pt-6">
          <h2 className="text-lg font-bold text-white mb-4">Account Settings</h2>
          <p className="text-slate-500 text-sm">Profile management features coming soon.</p>
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;