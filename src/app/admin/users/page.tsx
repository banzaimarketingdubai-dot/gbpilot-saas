'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  ShieldCheck,
  UserPlus,
  Crown,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Zap,
  Sparkles,
  ShieldAlert,
  Building2,
  Coffee,
  HelpCircle
} from 'lucide-react';
import {
  UserRole,
  UserRoleRecord,
  ROLE_DEFINITIONS,
  getAllUserRoles,
  setUserRole,
  removeUserRole,
  isPermanentSuperAdmin
} from '@/lib/roles';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRoleRecord[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('OPS_LEAD');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadUsers = () => {
    const list = getAllUserRoles();
    setUsers(list);
  };

  useEffect(() => {
    loadUsers();
    const handleUpdate = () => loadUsers();
    window.addEventListener('gbpilot_user_roles_changed', handleUpdate);
    return () => window.removeEventListener('gbpilot_user_roles_changed', handleUpdate);
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleAssignRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newEmail.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Update client storage & dispatch event
      const updated = setUserRole(newEmail, newRole, '0451611@gmail.com (Superadmin)', newName);
      setUsers(updated);

      // 2. Sync with API
      await fetch('/api/v1/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newEmail,
          role: newRole,
          name: newName,
          assignedBy: '0451611@gmail.com (Superadmin)',
        }),
      }).catch(() => {});

      showToast(`Role "${ROLE_DEFINITIONS[newRole].label}" successfully assigned to ${newEmail}`);
      setNewEmail('');
      setNewName('');
    } catch (err: any) {
      showToast(err.message || 'Failed to assign role', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRole = async (email: string) => {
    if (isPermanentSuperAdmin(email)) {
      showToast('Cannot remove a permanent superadmin', 'error');
      return;
    }

    try {
      const updated = removeUserRole(email);
      setUsers(updated);

      await fetch(`/api/v1/admin/users?email=${encodeURIComponent(email)}`, {
        method: 'DELETE',
      }).catch(() => {});

      showToast(`Role for ${email} has been revoked`);
    } catch (err: any) {
      showToast(err.message || 'Failed to revoke role', 'error');
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return <Crown className="w-4 h-4 text-amber-400" />;
      case 'OPS_LEAD':
        return <Zap className="w-4 h-4 text-blue-400" />;
      case 'SENTINEL_OFFICER':
        return <ShieldAlert className="w-4 h-4 text-emerald-400" />;
      case 'CLIENT_OWNER':
        return <Building2 className="w-4 h-4 text-indigo-400" />;
      case 'LOCATION_MANAGER':
        return <Coffee className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-16 right-6 z-50 p-4 rounded-2xl border shadow-2xl flex items-center gap-3 text-xs text-white animate-in slide-in-from-top duration-200 ${
            toast.type === 'error'
              ? 'bg-red-950/90 border-red-800 text-red-200'
              : 'bg-slate-900 border-slate-700'
          }`}
        >
          {toast.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <span className="font-semibold">{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
              <Crown className="w-7 h-7 text-amber-400" />
              <span>Team &amp; Role Governance</span>
            </h1>
            <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
              RBAC Governance
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Assign roles to team members, enforce granular access control, and manage platform permissions.
          </p>
        </div>
      </div>

      {/* Current Superadmin Highlight Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg shadow-amber-500/5">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center font-bold text-slate-950 shadow-md shadow-amber-500/20">
            <Crown className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-base">0451611@gmail.com</span>
              <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                ROOT SUPERADMIN
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Your account is configured as a permanent superadmin with full platform administration privileges.
            </p>
          </div>
        </div>

        <div className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 flex items-center gap-1.5 self-stretch sm:self-auto justify-center">
          <ShieldCheck className="w-4 h-4" />
          <span>Full Privileges Active</span>
        </div>
      </div>

      {/* Form: Assign New Role */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
          <UserPlus className="w-4 h-4 text-blue-400" />
          <h3 className="font-bold text-base text-white">Assign Role to New User</h3>
        </div>

        <form onSubmit={handleAssignRole} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">User Email</label>
            <input
              type="email"
              required
              placeholder="colleague@gmail.com"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Name / Job Title (optional)</label>
            <input
              type="text"
              placeholder="Alex (SEO Lead)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Assigned Role</label>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value as UserRole)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
            >
              {(Object.keys(ROLE_DEFINITIONS) as UserRole[]).map((r) => (
                <option key={r} value={r}>
                  {ROLE_DEFINITIONS[r].badge} — {ROLE_DEFINITIONS[r].label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-all shadow-md shadow-blue-600/20 disabled:opacity-50"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Save Role Assignment</span>
          </button>
        </form>

        <div className="text-[11px] text-slate-400 bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
          <span className="font-bold text-slate-300">Selected Role Permissions: </span>
          {ROLE_DEFINITIONS[newRole].description}
        </div>
      </div>

      {/* Team Users Table */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-400" />
            <h3 className="font-bold text-base text-white">Users &amp; Active Role Assignments</h3>
          </div>
          <span className="text-xs text-slate-500">{users.length} team members</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="pb-3 font-semibold">User</th>
                <th className="pb-3 font-semibold">Assigned Role</th>
                <th className="pb-3 font-semibold">/admin Access</th>
                <th className="pb-3 font-semibold">Assigned By</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {users.map((u) => {
                const def = ROLE_DEFINITIONS[u.role] || ROLE_DEFINITIONS.CLIENT_OWNER;
                const isPerm = u.isPermanent || isPermanentSuperAdmin(u.email);

                return (
                  <tr key={u.email} className="hover:bg-slate-800/40">
                    <td className="py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-[11px] text-white">
                          {u.name ? u.name.charAt(0).toUpperCase() : u.email.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-white flex items-center gap-1.5">
                            <span>{u.email}</span>
                            {isPerm && (
                              <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                            )}
                          </div>
                          {u.name && <div className="text-[10px] text-slate-400">{u.name}</div>}
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                          u.role === 'SUPER_ADMIN'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            : u.role === 'OPS_LEAD'
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                            : u.role === 'SENTINEL_OFFICER'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}
                      >
                        {getRoleIcon(u.role)}
                        <span>{def.badge}</span>
                      </span>
                    </td>

                    <td className="py-3.5">
                      {def.canAccessAdmin ? (
                        <span className="text-emerald-400 font-semibold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Granted
                        </span>
                      ) : (
                        <span className="text-slate-500 font-normal">Client Cockpit Only</span>
                      )}
                    </td>

                    <td className="py-3.5 text-slate-400 text-[11px]">
                      {u.assignedBy || 'Root'}
                    </td>

                    <td className="py-3.5 text-right">
                      {isPerm ? (
                        <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                          Immutable
                        </span>
                      ) : (
                        <button
                          onClick={() => handleDeleteRole(u.email)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-colors"
                          title="Revoke Role"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
