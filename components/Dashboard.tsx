import React from 'react';
import { AppData, FinancialYearRecord } from '../types';
import { TrendingUp, Calendar, Wallet } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Props {
  data: AppData;
  calculations: { years: FinancialYearRecord[], totalBalance: number };
}

const formatCurrency = (val: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

const Dashboard: React.FC<Props> = ({ data, calculations }) => {
  const { profile } = data;
  const { years, totalBalance } = calculations;
  
  const currentYear = new Date().getFullYear();
  // Get active FY stats for display
  const activeFY = years.find(y => {
     const fyStart = new Date(y.startDate).getFullYear();
     return fyStart === currentYear || (new Date().getMonth() < 3 && fyStart === currentYear - 1);
  }) || years[years.length - 1];

  // Prepare Chart Data
  const chartData = years.map(y => ({
    name: y.label,
    Credits: y.totalContributions,
    Interest: y.interestEarned,
    Withdrawal: y.totalWithdrawals
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-md p-4 border border-slate-100 shadow-xl rounded-xl text-sm">
          <p className="font-bold text-slate-800 mb-2 text-base">{label}</p>
          <p className="text-indigo-600 font-medium">Credits: {formatCurrency(payload[0].value)}</p>
          <p className="text-emerald-600 font-medium">Interest: {formatCurrency(payload[1].value)}</p>
          {payload[2].value > 0 && <p className="text-rose-500 font-medium">Withdrawal: {formatCurrency(payload[2].value)}</p>}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      
      {/* Welcome Header */}
      <div>
        <h2 className="text-3xl font-bold text-slate-800">
           Hello, {profile.employerName ? <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600">{profile.employerName}</span> : 'Employee'}
        </h2>
        <p className="text-slate-500 mt-1">Here is the growth summary of your Provident Fund.</p>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Total Balance */}
        <div className="relative overflow-hidden bg-gradient-to-br from-violet-600 to-indigo-700 text-white p-6 rounded-3xl shadow-xl shadow-indigo-200 group">
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
              <Wallet size={120} />
           </div>
           <p className="text-indigo-100 text-sm font-semibold mb-2 uppercase tracking-wide">Projected Balance</p>
           <h2 className="text-4xl font-bold mb-1">{formatCurrency(totalBalance)}</h2>
           <p className="text-xs text-indigo-200 mt-2 font-medium bg-white/10 inline-block px-2 py-1 rounded-md border border-white/10">
             Target: {new Date(profile.targetDate).toLocaleDateString()}
           </p>
        </div>
        
        {/* Card 2: Total Interest */}
        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-6 rounded-3xl shadow-xl shadow-teal-200 group">
           <div className="absolute -bottom-4 -right-4 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
              <TrendingUp size={120} />
           </div>
           <div className="flex items-center gap-3 mb-2">
             <p className="text-emerald-100 text-sm font-semibold uppercase tracking-wide">Total Interest Earned</p>
           </div>
           <h2 className="text-4xl font-bold">{formatCurrency(years.reduce((sum, y) => sum + y.interestEarned, 0))}</h2>
           <p className="text-xs text-emerald-100 mt-3 opacity-90">
             Compound growth over time
           </p>
        </div>

        {/* Card 3: Recent Activity */}
        <div className="relative overflow-hidden bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 group">
           <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-full -mr-10 -mt-10 z-0"></div>
           <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-orange-100 p-2.5 rounded-xl text-orange-600">
                    <Calendar size={20} />
                </div>
                <p className="text-slate-500 text-sm font-bold uppercase tracking-wide">Current FY Stats</p>
              </div>
              <div className="flex justify-between items-end">
                <div>
                    <p className="text-xs text-slate-400 font-semibold mb-1">Financial Year</p>
                    <p className="font-bold text-slate-800 text-xl">{activeFY?.label || '-'}</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-slate-400 font-semibold mb-1">Rate</p>
                    <div className="font-bold text-orange-600 text-xl bg-orange-50 px-2 py-0.5 rounded-lg border border-orange-100">
                        {activeFY?.interestRate || 0}%
                    </div>
                </div>
              </div>
           </div>
        </div>
      </div>

      {/* Yearly Growth Chart */}
      {years.length > 0 && (
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40">
          <div className="flex items-center justify-between mb-8">
             <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <div className="bg-fuchsia-100 p-2 rounded-lg text-fuchsia-600">
                  <TrendingUp size={22} />
                </div>
                Yearly Growth Breakdown
             </h3>
             <div className="flex gap-4 text-xs font-semibold">
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-violet-500"></div> Credits</div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-emerald-500"></div> Interest</div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-rose-500"></div> Withdrawals</div>
             </div>
          </div>
          
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} barGap={0}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  tick={{fontSize: 12, fill: '#64748b', fontWeight: 500}} 
                  axisLine={false}
                  tickLine={false} 
                  dy={10}
                />
                <YAxis 
                  tickFormatter={(val) => `₹${val/1000}k`}
                  tick={{fontSize: 12, fill: '#64748b', fontWeight: 500}} 
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{fill: '#f8fafc', radius: 4}} />
                <Bar dataKey="Credits" name="Contributions" fill="url(#colorCredits)" radius={[6, 6, 0, 0]} maxBarSize={50} />
                <Bar dataKey="Interest" name="Interest Accrued" fill="url(#colorInterest)" radius={[6, 6, 0, 0]} maxBarSize={50} />
                <Bar dataKey="Withdrawal" name="Withdrawals" fill="url(#colorWithdrawal)" radius={[6, 6, 0, 0]} maxBarSize={50} />
                
                <defs>
                  <linearGradient id="colorCredits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#6d28d9" />
                  </linearGradient>
                  <linearGradient id="colorInterest" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                  <linearGradient id="colorWithdrawal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f43f5e" />
                    <stop offset="100%" stopColor="#e11d48" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;