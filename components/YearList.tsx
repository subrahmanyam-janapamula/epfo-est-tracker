import React, { useState } from 'react';
import { FinancialYearRecord } from '../types';
import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react';

interface Props {
  years: FinancialYearRecord[];
  onDeleteYear: (year: number) => void;
}

const formatCurrency = (val: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

const YearList: React.FC<Props> = ({ years, onDeleteYear }) => {
  const [expandedYear, setExpandedYear] = useState<string | null>(years.length > 0 ? years[years.length-1].label : null);

  const toggleYear = (label: string) => {
    if (expandedYear === label) setExpandedYear(null);
    else setExpandedYear(label);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Yearly Records</h2>
      
      {years.length === 0 && (
         <div className="text-center py-12 bg-white rounded-xl border border-slate-200 text-slate-400">
            No data available. Add transactions or generate contributions to see yearly breakdown.
         </div>
      )}

      <div className="space-y-4">
        {years.map((year) => (
          <div key={year.label} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            
            {/* Header / Summary Row */}
            <div 
              onClick={() => toggleYear(year.label)}
              className="p-6 cursor-pointer hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${expandedYear === year.label ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                  {expandedYear === year.label ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{year.label}</h3>
                  <p className="text-xs text-slate-500">{new Date(year.startDate).toDateString()} - {new Date(year.endDate).toDateString()}</p>
                </div>
              </div>

              <div className="flex items-center gap-6 md:gap-12 text-sm">
                <div>
                   <p className="text-xs text-slate-400">Interest ({year.interestRate}%)</p>
                   <p className="font-semibold text-green-600">+{formatCurrency(year.interestEarned)}</p>
                </div>
                <div className="text-right">
                   <p className="text-xs text-slate-400">Closing Balance</p>
                   <p className="font-bold text-slate-800 text-lg">{formatCurrency(year.closingBalance)}</p>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteYear(year.startYear);
                  }}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-all"
                  title="Delete Entire Year Data"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            {/* Detailed Monthly Table */}
            {expandedYear === year.label && (
              <div className="border-t border-slate-100 bg-slate-50/50 p-4 md:p-6 animate-in slide-in-from-top-2 duration-200">
                <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                  <table className="w-full text-xs md:text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                      <tr>
                        <th className="px-4 py-3">Month</th>
                        <th className="px-4 py-3">Opening</th>
                        <th className="px-4 py-3 text-indigo-600">Credits</th>
                        <th className="px-4 py-3 text-red-500">Debits</th>
                        <th className="px-4 py-3 text-green-600">Accr. Interest</th>
                        <th className="px-4 py-3 text-right">Running Bal.</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {year.monthlyBreakdown.map((m, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="px-4 py-3 font-medium text-slate-700">
                            {m.monthName} <span className="text-slate-400 text-[10px]">{m.year}</span>
                          </td>
                          <td className="px-4 py-3 text-slate-600">{formatCurrency(m.openingBalance)}</td>
                          <td className="px-4 py-3 text-indigo-600 font-medium">
                            {m.totalCredits > 0 ? `+${formatCurrency(m.totalCredits)}` : '-'}
                          </td>
                          <td className="px-4 py-3 text-red-500">
                            {m.totalDebits > 0 ? `-${formatCurrency(m.totalDebits)}` : '-'}
                          </td>
                          <td className="px-4 py-3 text-green-600">
                            {formatCurrency(m.interestAccrued)}
                          </td>
                          <td className="px-4 py-3 text-right font-bold text-slate-700">
                             {formatCurrency(m.closingBalance)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="p-3 bg-blue-50 text-blue-700 text-xs text-center border-t border-blue-100">
                     Interest calculated monthly on opening balance. Total accrued interest is credited to the corpus at the end of the financial year.
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default YearList;