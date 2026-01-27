import React, { useState } from 'react';
import { EPFInputState, Withdrawal } from '../types';
import { MONTHS } from '../constants';
import { Plus, Trash2, IndianRupee, Percent, Calendar } from 'lucide-react';

interface Props {
  inputs: EPFInputState;
  setInputs: React.Dispatch<React.SetStateAction<EPFInputState>>;
}

const InputSection: React.FC<Props> = ({ inputs, setInputs }) => {
  const [newWithdrawalAmount, setNewWithdrawalAmount] = useState<string>('');
  const [newWithdrawalMonth, setNewWithdrawalMonth] = useState<number>(0);

  const handleChange = (field: keyof EPFInputState, value: number) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const addWithdrawal = () => {
    const amount = parseFloat(newWithdrawalAmount);
    if (!amount || amount <= 0) return;

    const newWithdrawal: Withdrawal = {
      id: Date.now().toString(),
      monthIndex: newWithdrawalMonth,
      amount: amount,
      description: 'Manual Withdrawal'
    };

    setInputs(prev => ({
      ...prev,
      withdrawals: [...prev.withdrawals, newWithdrawal]
    }));
    setNewWithdrawalAmount('');
  };

  const removeWithdrawal = (id: string) => {
    setInputs(prev => ({
      ...prev,
      withdrawals: prev.withdrawals.filter(w => w.id !== id)
    }));
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-8 h-full">
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span className="bg-blue-100 text-blue-600 p-1.5 rounded-lg">
            <Calendar size={20} />
          </span>
          Configuration
        </h2>
        
        <div className="grid grid-cols-1 gap-6">
          {/* Opening Balance */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">Opening Balance (Apr 1st)</label>
            <div className="relative">
              <IndianRupee size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="number"
                value={inputs.currentBalance}
                onChange={(e) => handleChange('currentBalance', parseFloat(e.target.value) || 0)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Monthly Contribution */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">Monthly EPF Contribution (Total)</label>
            <div className="relative">
              <IndianRupee size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="number"
                value={inputs.monthlyContribution}
                onChange={(e) => handleChange('monthlyContribution', parseFloat(e.target.value) || 0)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
            <p className="text-xs text-slate-400">Include both Employee and Employer (EPF share only) contributions.</p>
          </div>

          {/* Interest Rate */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">Interest Rate (%)</label>
            <div className="relative">
              <Percent size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="number"
                step="0.05"
                value={inputs.interestRate}
                onChange={(e) => handleChange('interestRate', parseFloat(e.target.value) || 0)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 pt-6">
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span className="bg-orange-100 text-orange-600 p-1.5 rounded-lg">
            <Trash2 size={20} />
          </span>
          Withdrawals
        </h2>

        <div className="flex gap-2 mb-4">
          <select 
            value={newWithdrawalMonth}
            onChange={(e) => setNewWithdrawalMonth(parseInt(e.target.value))}
            className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none"
          >
            {MONTHS.map((m, i) => (
              <option key={i} value={i}>{m}</option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Amount"
            value={newWithdrawalAmount}
            onChange={(e) => setNewWithdrawalAmount(e.target.value)}
            className="w-32 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none"
          />
          <button 
            onClick={addWithdrawal}
            className="bg-slate-800 hover:bg-slate-900 text-white p-2 rounded-lg transition-colors"
          >
            <Plus size={20} />
          </button>
        </div>

        {inputs.withdrawals.length === 0 ? (
          <p className="text-sm text-slate-400 italic text-center py-2">No withdrawals added.</p>
        ) : (
          <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar pr-1">
            {inputs.withdrawals.map((w) => (
              <div key={w.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100 group">
                <div>
                  <span className="text-sm font-semibold text-slate-700 block">{MONTHS[w.monthIndex]}</span>
                  <span className="text-xs text-red-500">-₹{w.amount.toLocaleString('en-IN')}</span>
                </div>
                <button 
                  onClick={() => removeWithdrawal(w.id)}
                  className="text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InputSection;
