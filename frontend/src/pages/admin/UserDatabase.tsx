// src/pages/admin/UserDatabase.tsx
import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { 
  Search, 
  MoreVertical, 
  Shield, 
  User, 
  Mail, 
  Ban, 
  CheckCircle, 
  Download, 
  Loader2, 
  Trash2,
  ShieldAlert,
  Unlock
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import api from '../../services/api';
import toast from 'react-hot-toast';

interface UserData {
  _id: string;
  name: string;
  email: string;
  role: string;
  status?: string; // Optional field for now
  createdAt: string;
}

const UserDatabase = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeMenu, setActiveMenu] = useState<string | null>(null); // Track open menu

  // Close menu when clicking outside
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/users');
      // Ensure status exists (default to Active if missing from DB)
      const processedData = data.map((u: UserData) => ({
        ...u,
        status: u.status || 'Active' 
      }));
      setUsers(processedData);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  // --- ACTION HANDLERS ---

  const handleRoleToggle = async (user: UserData) => {
    const newRole = user.role === 'admin' ? 'candidate' : 'admin';
    setActiveMenu(null); // Close menu immediately

    try {
      // 1. Call API
      await api.put(`/users/${user._id}/role`, { role: newRole });
      
      // 2. Update UI (Success)
      setUsers(users.map(u => u._id === user._id ? { ...u, role: newRole } : u));
      toast.success(`User role updated to ${newRole}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update role");
    }
  };

  const handleStatusToggle = async (user: UserData) => {
    const newStatus = user.status === 'Active' ? 'Suspended' : 'Active';
    setActiveMenu(null);

    try {
      // 1. Call API
      await api.put(`/users/${user._id}/status`, { status: newStatus });

      // 2. Update UI (Success)
      setUsers(users.map(u => u._id === user._id ? { ...u, status: newStatus } : u));
      toast.success(newStatus === 'Active' ? 'User activated' : 'User suspended');
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if(!window.confirm("Are you sure? This cannot be undone.")) return;
    setActiveMenu(null);

    try {
      // 1. Call API
      await api.delete(`/users/${id}`);

      // 2. Update UI (Success)
      setUsers(users.filter(u => u._id !== id));
      toast.success('User permanently removed');
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete user");
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">User Database</h1>
          <p className="text-slate-400">Manage platform access and permissions.</p>
        </div>
        <Button className="!w-auto bg-slate-800 hover:bg-slate-700">
          <Download className="w-4 h-4 mr-2" /> Export CSV
        </Button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-visible"> {/* overflow-visible for dropdowns */}
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-800 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search users by name or email..." 
              className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-red-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="bg-slate-950 text-slate-200 uppercase font-bold text-xs">
              <tr>
                <th className="px-6 py-4">User Identity</th>
                <th className="px-6 py-4">System Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Joined Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                 <tr>
                    <td colSpan={5} className="p-8 text-center">
                        <div className="flex justify-center items-center gap-2">
                             <Loader2 className="w-5 h-5 animate-spin text-slate-500" />
                             <span>Loading User Data...</span>
                        </div>
                    </td>
                 </tr>
              ) : filteredUsers.length === 0 ? (
                 <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500 italic">No users found.</td>
                 </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-800/50 transition-colors group relative">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold border border-slate-700">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-white font-medium">{user.name}</div>
                          <div className="text-xs text-slate-500 flex items-center gap-1">
                            <Mail className="w-3 h-3" /> {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border w-fit ${
                        user.role === 'admin' 
                          ? 'bg-red-500/10 text-red-400 border-red-500/20' 
                          : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      }`}>
                        {user.role === 'admin' ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                        <span className="capitalize">{user.role}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {user.status === 'Active' ? (
                        <span className="text-emerald-400 flex items-center gap-1.5 text-xs font-medium bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20 w-fit">
                          <CheckCircle className="w-3 h-3" /> Active
                        </span>
                      ) : (
                        <span className="text-rose-400 flex items-center gap-1.5 text-xs font-medium bg-rose-500/10 px-2 py-1 rounded border border-rose-500/20 w-fit">
                          <Ban className="w-3 h-3" /> Suspended
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">
                        {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    
                    {/* --- ACTIONS COLUMN --- */}
                    <td className="px-6 py-4 text-right relative">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenu(activeMenu === user._id ? null : user._id);
                        }}
                        className={`p-2 rounded-lg transition-colors ${activeMenu === user._id ? 'bg-slate-700 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {/* Dropdown Menu */}
                      {activeMenu === user._id && (
                        <div 
                          ref={menuRef}
                          className="absolute right-8 top-8 z-50 w-48 bg-slate-950 border border-slate-800 rounded-lg shadow-2xl py-1 animate-in fade-in zoom-in-95 duration-100"
                        >
                          <div className="px-3 py-2 text-xs font-bold text-slate-500 uppercase border-b border-slate-800 mb-1">
                            User Actions
                          </div>
                          
                          <button 
                            onClick={() => handleRoleToggle(user)}
                            className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2 transition-colors"
                          >
                            {user.role === 'admin' ? <User className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4 text-yellow-500" />}
                            {user.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                          </button>

                          <button 
                            onClick={() => handleStatusToggle(user)}
                            className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2 transition-colors"
                          >
                            {user.status === 'Active' ? <Ban className="w-4 h-4 text-orange-500" /> : <Unlock className="w-4 h-4 text-emerald-500" />}
                            {user.status === 'Active' ? 'Suspend Access' : 'Reactivate User'}
                          </button>

                          <div className="my-1 border-t border-slate-800" />

                          <button 
                            onClick={() => handleDelete(user._id)}
                            className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-950/30 hover:text-red-300 flex items-center gap-2 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                            Remove User
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UserDatabase;