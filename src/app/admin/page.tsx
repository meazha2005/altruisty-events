'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  User,
  LogOut,
  RefreshCw,
  Search,
  Download,
  Users,
  CreditCard,
  DollarSign,
  Sparkles,
  Eye,
  Mail,
  Phone,
  School,
  BookOpen,
  Calendar,
  X,
  CheckCircle,
  AlertCircle,
  Clock,
  Send,
  Loader2,
  ArrowLeft,
  Briefcase,
} from 'lucide-react';

interface Member {
  id: number;
  team_id: string;
  member_number: number;
  is_leader: number;
  name: string;
  email: string;
  phone: string;
  college_name: string;
  dept: string;
  year_of_study: string;
}

interface Team {
  id: number;
  team_id: string;
  team_name: string;
  team_size: number;
  idea_title: string;
  domain: string;
  description: string;
  amount: number;
  currency: string;
  payment_status: 'PENDING' | 'PAID' | 'FAILED';
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  email_sent: number;
  created_at: string;
  leaderName: string;
  leaderEmail: string;
  leaderPhone: string;
  members: Member[];
}

interface Stats {
  totalTeams: number;
  totalPaid: number;
  totalRevenue: number;
  totalParticipants: number;
  domainBreakdown: Record<string, number>;
}

export default function AdminPage() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  // Dashboard Data State
  const [teams, setTeams] = useState<Team[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loadingTeams, setLoadingTeams] = useState(false);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  // Modal State
  const [activeTeamModal, setActiveTeamModal] = useState<Team | null>(null);
  const [resendingEmailId, setResendingEmailId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Fetch Teams
  const fetchTeams = useCallback(async () => {
    setLoadingTeams(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.set('search', searchTerm);
      if (selectedDomain !== 'ALL') params.set('domain', selectedDomain);
      if (selectedStatus !== 'ALL') params.set('status', selectedStatus);

      const res = await fetch(`/api/admin/teams?${params.toString()}`);
      const data = await res.json();

      if (res.ok && data.success) {
        setTeams(data.teams);
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Failed to fetch teams:', err);
    } finally {
      setLoadingTeams(false);
    }
  }, [searchTerm, selectedDomain, selectedStatus]);

  // Check auth status on load
  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/me');
      const data = await res.json();
      if (res.ok && data.authenticated) {
        setIsAuthenticated(true);
        fetchTeams();
      } else {
        setIsAuthenticated(false);
      }
    } catch {
      setIsAuthenticated(false);
    }
  }, [fetchTeams]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Invalid credentials');
      }

      setIsAuthenticated(true);
      fetchTeams();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      setLoginError(msg);
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      setIsAuthenticated(false);
      setTeams([]);
      setStats(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Trigger search on filter changes
  useEffect(() => {
    if (isAuthenticated) {
      const delay = setTimeout(() => {
        fetchTeams();
      }, 300);
      return () => clearTimeout(delay);
    }
  }, [searchTerm, selectedDomain, selectedStatus, isAuthenticated, fetchTeams]);

  // Resend confirmation email
  const handleResendEmail = async (teamId: string) => {
    setResendingEmailId(teamId);
    try {
      const res = await fetch('/api/admin/resend-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamId }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        showToast('Confirmation email resent successfully!');
        fetchTeams();
      } else {
        showToast(data.error || 'Failed to resend email');
      }
    } catch {
      showToast('Network error while resending email.');
    } finally {
      setResendingEmailId(null);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Export to CSV
  const exportToCSV = () => {
    if (!teams || teams.length === 0) {
      alert('No teams to export.');
      return;
    }

    const headers = [
      'Registration ID',
      'Team Name',
      'Team Size',
      'Domain',
      'Idea Title',
      'Idea Description',
      'Payment Status',
      'Amount (INR)',
      'Razorpay Order ID',
      'Razorpay Payment ID',
      'Email Sent',
      'Created At',
      'Leader Name',
      'Leader Email',
      'Leader Phone',
      'Leader College',
      'Leader Dept',
      'Leader Year',
      'Member 2 Name',
      'Member 2 Email',
      'Member 2 Phone',
      'Member 2 College',
      'Member 2 Dept',
      'Member 2 Year',
      'Member 3 Name',
      'Member 3 Email',
      'Member 3 Phone',
      'Member 3 College',
      'Member 3 Dept',
      'Member 3 Year',
      'Member 4 Name',
      'Member 4 Email',
      'Member 4 Phone',
      'Member 4 College',
      'Member 4 Dept',
      'Member 4 Year',
    ];

    const rows = teams.map((team) => {
      const m1 = team.members.find((m) => m.member_number === 1) || team.members[0];
      const m2 = team.members.find((m) => m.member_number === 2);
      const m3 = team.members.find((m) => m.member_number === 3);
      const m4 = team.members.find((m) => m.member_number === 4);

      const escape = (val: unknown) =>
        `"${String(val || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`;

      return [
        escape(team.team_id),
        escape(team.team_name),
        escape(team.team_size),
        escape(team.domain),
        escape(team.idea_title),
        escape(team.description),
        escape(team.payment_status),
        escape(team.amount),
        escape(team.razorpay_order_id),
        escape(team.razorpay_payment_id),
        escape(team.email_sent ? 'YES' : 'NO'),
        escape(team.created_at),
        // M1 (Leader)
        escape(m1?.name),
        escape(m1?.email),
        escape(m1?.phone),
        escape(m1?.college_name),
        escape(m1?.dept),
        escape(m1?.year_of_study),
        // M2
        escape(m2?.name),
        escape(m2?.email),
        escape(m2?.phone),
        escape(m2?.college_name),
        escape(m2?.dept),
        escape(m2?.year_of_study),
        // M3
        escape(m3?.name),
        escape(m3?.email),
        escape(m3?.phone),
        escape(m3?.college_name),
        escape(m3?.dept),
        escape(m3?.year_of_study),
        // M4
        escape(m4?.name),
        escape(m4?.email),
        escape(m4?.phone),
        escape(m4?.college_name),
        escape(m4?.dept),
        escape(m4?.year_of_study),
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `HACKPICK_Teams_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Loading session
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin text-sky-600" />
      </div>
    );
  }

  // LOGIN SCREEN (White Theme)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-3">
              <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 p-1 flex items-center justify-center shadow-sm">
                <Image src="/logo.png" alt="HackPick" width={48} height={48} className="object-contain" />
              </div>
            </Link>
            <h1 className="text-2xl font-black text-[#0b192c] font-heading">
              Organizer <span className="text-sky-600">Admin Portal</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              HACKPICK 2026 • Altruisty Innovation
            </p>
          </div>

          {/* Login Card */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl">
            {loginError && (
              <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Admin Username
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="admin"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-blue-700 shadow-md shadow-sky-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {loginLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Sign In to Dashboard</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-100 text-center">
              <Link href="/" className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-sky-600 font-semibold">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Registration Page
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ADMIN DASHBOARD (White Theme)
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 p-4 rounded-xl bg-white border border-sky-300 text-sky-800 text-xs shadow-xl flex items-center gap-2 animate-bounce">
          <CheckCircle className="w-4 h-4 text-sky-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-40 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center shadow-2xs">
                <Image src="/logo.png" alt="HackPick" width={32} height={32} className="object-contain" />
              </div>
              <div>
                <span className="font-extrabold text-base text-[#0b192c] font-heading">
                  HACK<span className="text-sky-600">PICK</span>
                </span>
                <span className="block text-[10px] text-sky-700 font-bold uppercase tracking-wider">
                  ADMIN DASHBOARD
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchTeams}
              disabled={loadingTeams}
              className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loadingTeams ? 'animate-spin text-sky-600' : ''}`} />
            </button>

            <button
              onClick={exportToCSV}
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* KPI Stats Grid */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase tracking-wider text-slate-500 font-bold">Total Registered</span>
                <Users className="w-4 h-4 text-sky-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-[#0b192c] font-mono">
                {stats.totalTeams}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Teams submitted</div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase tracking-wider text-emerald-700 font-bold">Paid & Confirmed</span>
                <CheckCircle className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-600 font-mono">
                {stats.totalPaid}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Active paid teams</div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase tracking-wider text-amber-700 font-bold">Total Revenue</span>
                <DollarSign className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-[#0b192c] font-mono">
                ₹{stats.totalRevenue.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">@ ₹149 / team fee</div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase tracking-wider text-indigo-700 font-bold">Participants</span>
                <Sparkles className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-[#0b192c] font-mono">
                {stats.totalParticipants}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Registered students</div>
            </div>

          </div>
        )}

        {/* Toolbar: Search, Filters & Export */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-center">
          
          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search team, leader, phone, college, ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 text-xs sm:text-sm"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            
            {/* Domain Filter */}
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-700 text-xs focus:outline-none focus:border-sky-500 font-medium"
            >
              <option value="ALL">All Domains</option>
              <option value="edu tech">Edu Tech</option>
              <option value="saas">SaaS</option>
              <option value="heath care">Health Care</option>
              <option value="cyber security">Cyber Security</option>
              <option value="fintech">FinTech</option>
              <option value="bio medical">Bio Medical</option>
              <option value="hardware">Hardware & IoT</option>
              <option value="automations">Automations</option>
              <option value="agriculture">Agriculture</option>
              <option value="open innovation">Open Innovation</option>
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-700 text-xs focus:outline-none focus:border-sky-500 font-medium"
            >
              <option value="ALL">All Statuses</option>
              <option value="PAID">PAID</option>
              <option value="PENDING">PENDING</option>
              <option value="FAILED">FAILED</option>
            </select>

            <button
              onClick={exportToCSV}
              className="sm:hidden px-3 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
            >
              CSV
            </button>
          </div>

        </div>

        {/* Teams Table / Cards */}
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
            <h3 className="font-bold text-sm text-[#0b192c]">
              Registered Teams ({teams.length})
            </h3>
            <span className="text-xs text-slate-500">Click any row to view complete member breakdown</span>
          </div>

          {loadingTeams ? (
            <div className="py-20 text-center text-slate-500 flex flex-col items-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-sky-600" />
              <span className="text-xs">Loading teams data...</span>
            </div>
          ) : teams.length === 0 ? (
            <div className="py-16 text-center text-slate-500 text-xs">
              No registered teams found matching the criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3.5 px-4">Team ID / Name</th>
                    <th className="py-3.5 px-4">Domain</th>
                    <th className="py-3.5 px-4">Leader Details</th>
                    <th className="py-3.5 px-4">Size</th>
                    <th className="py-3.5 px-4">Payment</th>
                    <th className="py-3.5 px-4">Email Sent</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {teams.map((team) => (
                    <tr
                      key={team.team_id}
                      className="hover:bg-sky-50/50 transition-colors cursor-pointer group"
                      onClick={() => setActiveTeamModal(team)}
                    >
                      {/* Team ID & Name */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono text-sky-700 font-bold">
                          {team.team_id}
                        </div>
                        <div className="font-bold text-[#0b192c] text-sm group-hover:text-sky-600 transition-colors">
                          {team.team_name}
                        </div>
                        <div className="text-[11px] text-slate-500 line-clamp-1 max-w-[200px]">
                          {team.idea_title}
                        </div>
                      </td>

                      {/* Domain */}
                      <td className="py-3.5 px-4 capitalize">
                        <span className="bg-sky-50 text-sky-700 border border-sky-200 px-2.5 py-0.5 rounded-md text-[11px] font-semibold">
                          {team.domain}
                        </span>
                      </td>

                      {/* Leader Details */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800">{team.leaderName}</div>
                        <div className="text-slate-600">{team.leaderEmail}</div>
                        <div className="text-slate-500 font-mono text-[11px] font-semibold">{team.leaderPhone}</div>
                      </td>

                      {/* Team Size */}
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                        {team.team_size} Members
                      </td>

                      {/* Payment Status */}
                      <td className="py-3.5 px-4">
                        {team.payment_status === 'PAID' ? (
                          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md font-bold text-[10px]">
                            <CheckCircle className="w-3 h-3 text-emerald-600" /> PAID (₹{team.amount})
                          </span>
                        ) : team.payment_status === 'FAILED' ? (
                          <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-md font-bold text-[10px]">
                            FAILED
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-md font-bold text-[10px]">
                            <Clock className="w-3 h-3 text-amber-600" /> PENDING
                          </span>
                        )}
                        {team.razorpay_payment_id && (
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5 truncate max-w-[120px]">
                            {team.razorpay_payment_id}
                          </div>
                        )}
                      </td>

                      {/* Confirmation Email Sent */}
                      <td className="py-3.5 px-4">
                        {team.email_sent ? (
                          <span className="text-emerald-700 font-bold text-[11px] flex items-center gap-1">
                            ✓ Sent
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Not Sent</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td
                        className="py-3.5 px-4 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setActiveTeamModal(team)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-black cursor-pointer"
                            title="View Full Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleResendEmail(team.team_id)}
                            disabled={resendingEmailId === team.team_id}
                            className="p-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-700 cursor-pointer"
                            title="Resend Confirmation Email"
                          >
                            {resendingEmailId === team.team_id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Send className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>

      </main>

      {/* MODAL: FULL TEAM DETAILS (White Theme) */}
      {activeTeamModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl my-8 overflow-hidden shadow-2xl animate-fade-in">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <div className="text-[11px] font-mono text-sky-700 font-black uppercase tracking-wider">
                  Registration ID: {activeTeamModal.team_id}
                </div>
                <h3 className="text-xl font-black text-[#0b192c] mt-1 font-heading">
                  {activeTeamModal.team_name}
                </h3>
              </div>
              <button
                onClick={() => setActiveTeamModal(null)}
                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs sm:text-sm">
              
              {/* Project Abstract */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">
                    Innovation Track
                  </span>
                  <span className="text-sky-700 font-bold uppercase text-xs bg-sky-100 px-2 py-0.5 rounded-md">
                    {activeTeamModal.domain}
                  </span>
                </div>
                <div className="text-[#0b192c] font-bold text-sm">
                  {activeTeamModal.idea_title}
                </div>
                <p className="text-slate-600 text-xs leading-relaxed whitespace-pre-wrap">
                  {activeTeamModal.description}
                </p>
              </div>

              {/* Payment & Status */}
              <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <div className="text-[11px] text-slate-500">Payment Status:</div>
                  <div className="font-bold text-emerald-600 mt-0.5">
                    {activeTeamModal.payment_status} (₹{activeTeamModal.amount})
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-500">Razorpay Payment ID:</div>
                  <div className="font-mono text-slate-700 text-xs mt-0.5 truncate">
                    {activeTeamModal.razorpay_payment_id || 'N/A'}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-500">Razorpay Order ID:</div>
                  <div className="font-mono text-slate-700 text-xs mt-0.5 truncate">
                    {activeTeamModal.razorpay_order_id || 'N/A'}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-500">Registered On:</div>
                  <div className="text-slate-700 text-xs mt-0.5">
                    {new Date(activeTeamModal.created_at).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Members Breakdown */}
              <div>
                <div className="text-xs uppercase tracking-wider text-slate-700 font-bold mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4 text-sky-600" />
                  <span>Team Members ({activeTeamModal.members.length})</span>
                </div>

                <div className="space-y-3">
                  {activeTeamModal.members.map((m, i) => (
                    <div
                      key={m.id || i}
                      className={`p-4 rounded-xl border ${
                        m.is_leader
                          ? 'bg-sky-50/70 border-sky-300'
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-bold text-[#0b192c] flex items-center gap-2">
                          <span>{m.name}</span>
                          {m.is_leader ? (
                            <span className="text-[10px] bg-sky-600 text-white font-bold px-2 py-0.5 rounded-full">
                              Leader
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-500 font-medium">
                              Member {m.member_number}
                            </span>
                          )}
                        </div>
                        <a
                          href={`tel:${m.phone}`}
                          className="text-xs font-mono text-sky-700 hover:underline flex items-center gap-1 font-bold"
                        >
                          <Phone className="w-3 h-3" /> {m.phone}
                        </a>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <a href={`mailto:${m.email}`} className="hover:text-sky-600 truncate">
                            {m.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-1.5 truncate">
                          <School className="w-3.5 h-3.5 text-slate-400" />
                          <span className="truncate">{m.college_name}</span>
                        </div>
                        <div className="flex items-center gap-1.5 truncate">
                          <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                          <span className="truncate">{m.dept}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{m.year_of_study}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Modal Actions */}
            <div className="p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
              <button
                onClick={() => handleResendEmail(activeTeamModal.team_id)}
                disabled={resendingEmailId === activeTeamModal.team_id}
                className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs"
              >
                {resendingEmailId === activeTeamModal.team_id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span>Resend Confirmation Email</span>
              </button>

              <button
                onClick={() => setActiveTeamModal(null)}
                className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-black text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
