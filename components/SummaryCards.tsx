import React from 'react';
import { YearlySummary } from '../types';
import { IndianRupee, TrendingUp, Wallet, ArrowDownCircle } from 'lucide-react';

interface Props {
  summary: YearlySummary;
}

const formatCurrency = (amount: number) => 
  new Intl.NumberFormat('en-IN', { 
    style: 'currency', 
    currency: 'INR', 
    maximumFractionDigits: 0 
  }).format(amount);

const SummaryCards: React.FC<Props> = ({ summary }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Closing Balance */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-5 text-white shadow-lg shadow-blue-200">
        <div className="flex justify-between items-start mb-4">
          <div className="bg-white/20 p-2 rounded-lg">
            <Wallet className="text-white" size={24} />
          </div>
          <span className="text-xs font-medium bg-blue-500/30 px-2 py-1 rounded-full text-blue-50">
            Projected
          </span>
        </div>
        <p className="text-blue-100 text-sm font-medium mb-1">Closing Balance (Mar 31)</p>
        <h3 className="text-2xl font-bold">{formatCurrency(summary.closingBalance)}</h3>
      </div>

      {/* Interest Earned */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <div className="bg-green-100 p-2 rounded-lg">
            <TrendingUp className="text-green-600" size={24} />
          </div>
        </div>
        <p className="text-slate-500 text-sm font-medium mb-1">Est. Interest Earned</p>
        <h3 className="text-2xl font-bold text-slate-800">{formatCurrency(summary.totalInterest)}</h3>
      </div>

       {/* Total Contribution */}
       <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <div className="bg-indigo-100 p-2 rounded-lg">
            <IndianRupee className="text-indigo-600" size={24} />
          </div>
        </div>
        <p className="text-slate-500 text-sm font-medium mb-1">Total Contribution</p>
        <h3 className="text-2xl font-bold text-slate-800">{formatCurrency(summary.totalContribution)}</h3>
      </div>

      {/* Total Withdrawals */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <div className="bg-orange-100 p-2 rounded-lg">
            <ArrowDownCircle className="text-orange-600" size={24} />
          </div>
        </div>
        <p className="text-slate-500 text-sm font-medium mb-1">Total Withdrawals</p>
        <h3 className="text-2xl font-bold text-slate-800">{formatCurrency(summary.totalWithdrawal)}</h3>
      </div>
    </div>
  );
};

export default SummaryCards;
