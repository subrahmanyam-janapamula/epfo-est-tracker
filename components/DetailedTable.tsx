import React from 'react';
import { MonthlyData } from '../types';

interface Props {
  data: MonthlyData[];
}

const DetailedTable: React.FC<Props> = ({ data }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <h3 className="text-lg font-bold text-slate-800">Monthly Breakdown</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-600 font-medium">
            <tr>
              <th className="px-6 py-4 rounded-tl-lg">Month</th>
              <th className="px-6 py-4">Opening Bal.</th>
              <th className="px-6 py-4 text-indigo-600">Contribution (+)</th>
              <th className="px-6 py-4 text-red-500">Withdrawals (-)</th>
              <th className="px-6 py-4 text-green-600">Interest (Accrued)</th>
              <th className="px-6 py-4 rounded-tr-lg text-right">Closing Bal.</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-800">{row.monthName}</td>
                <td className="px-6 py-4 text-slate-600">₹{row.openingBalance.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                <td className="px-6 py-4 text-indigo-600 font-medium">+₹{row.contribution.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                <td className="px-6 py-4 text-red-500">
                  {row.withdrawal > 0 ? `-₹${row.withdrawal.toLocaleString('en-IN', { maximumFractionDigits: 0 })}` : '-'}
                </td>
                <td className="px-6 py-4 text-green-600 font-medium">+₹{Math.round(row.interestEarned).toLocaleString('en-IN')}</td>
                <td className="px-6 py-4 text-right font-bold text-slate-800">₹{row.closingBalance.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-blue-50/50 font-semibold text-slate-800">
             <tr>
               <td className="px-6 py-4" colSpan={6}>
                 <p className="text-xs text-slate-500 font-normal">* Interest is accrued monthly on opening balance but credited to account at the end of financial year.</p>
               </td>
             </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default DetailedTable;
