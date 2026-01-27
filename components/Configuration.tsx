import React, { useState } from 'react';
import { AppData } from '../types';
import { HISTORICAL_INTEREST_RATES, DEFAULT_INTEREST_RATE } from '../constants';
import { Upload, Download, Wand2, FileJson, Briefcase, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { exportData, importData } from '../services/storageService';

interface Props {
  data: AppData;
  onUpdateProfile: (field: string, value: any) => void;
  onBatchGenerate: (year: number, amount: number, rate: number) => void;
  onImport: (data: AppData) => void;
}

const Configuration: React.FC<Props> = ({ data, onUpdateProfile, onBatchGenerate, onImport }) => {
  const { profile } = data;
  
  // Batch Generator State
  const currentYear = new Date().getFullYear();
  const [genYear, setGenYear] = useState<number>(new Date().getMonth() < 3 ? currentYear - 1 : currentYear);
  const [genAmount, setGenAmount] = useState<string>('');
  const [genRate, setGenRate] = useState<string>(HISTORICAL_INTEREST_RATES[genYear]?.toString() || DEFAULT_INTEREST_RATE.toString());
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleGenerate = () => {
    const amount = parseFloat(genAmount);
    const rate = parseFloat(genRate);
    if (amount > 0 && rate > 0) {
      try {
        onBatchGenerate(genYear, amount, rate);
        setGenAmount(''); 
        showMessage('success', `Successfully generated 12 monthly contributions for FY${genYear}-${(genYear+1)%100}`);
      } catch (e) {
        showMessage('error', 'An error occurred while generating transactions.');
      }
    } else {
      showMessage('error', 'Please enter a valid monthly amount and interest rate.');
    }
  };

  const handleExport = () => {
      try {
          exportData(data);
          showMessage('success', 'Data exported successfully. Check your downloads.');
      } catch (e) {
          showMessage('error', 'Failed to export data.');
      }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const imported = await importData(e.target.files[0]);
        onImport(imported);
        showMessage('success', 'Data imported successfully!');
      } catch (err) {
        showMessage('error', 'Failed to import data. Please check the file format.');
      }
      // Reset input to allow selecting same file again
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-10">
      <div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Configuration</h2>
        <p className="text-slate-500">Manage your profile, data, and bulk operations.</p>
      </div>

      {message && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-5 shadow-2xl ${message.type === 'success' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-rose-100 text-rose-800 border border-rose-200'}`}>
            {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <span className="font-medium">{message.text}</span>
          </div>
      )}

      {/* Employment Profile */}
      <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50">
        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
           <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
             <Briefcase size={22} />
           </div>
           Employment Profile
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="col-span-2">
            <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider block mb-2">Employer Name</label>
            <input 
              type="text" 
              value={profile.employerName}
              onChange={(e) => onUpdateProfile('employerName', e.target.value)}
              placeholder="e.g. Acme Corp"
              className="w-full border border-slate-200 rounded-lg px-4 py-3 text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-slate-50/50"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider block mb-2">Joining Date</label>
            <input 
              type="date" 
              value={profile.joiningDate}
              onChange={(e) => onUpdateProfile('joiningDate', e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-4 py-3 text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-slate-50/50"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider block mb-2">End Date (Optional)</label>
            <input 
              type="date" 
              value={profile.endDate}
              onChange={(e) => onUpdateProfile('endDate', e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-4 py-3 text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-slate-50/50"
            />
            <p className="text-xs text-slate-400 mt-1">Leave blank if currently employed</p>
          </div>
          
           <div className="col-span-2 pt-4 border-t border-slate-100">
             <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider block mb-2">Target Date for Projection</label>
             <div className="flex items-center gap-4">
               <input 
                 type="date" 
                 value={profile.targetDate}
                 onChange={(e) => onUpdateProfile('targetDate', e.target.value)}
                 className="flex-1 border border-slate-200 rounded-lg px-4 py-3 text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-slate-50/50"
               />
               <p className="flex-1 text-sm text-slate-500">This date determines how far into the future the application calculates estimated interest.</p>
             </div>
           </div>
        </div>
      </div>

      {/* Batch Generator */}
      <div className="bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-100 rounded-2xl p-8 shadow-inner relative overflow-hidden">
        <h3 className="text-xl font-bold text-violet-900 mb-4 flex items-center gap-2 relative z-10">
          <div className="bg-violet-200 p-2 rounded-lg text-violet-700">
             <Wand2 size={22} />
          </div>
          Batch Generate Contributions
        </h3>
        <p className="text-violet-700 mb-6 max-w-2xl leading-relaxed relative z-10">
          Quickly populate a financial year with 12 monthly contribution entries. 
          <br/>
          <span className="text-sm opacity-80 font-medium bg-violet-200/50 px-2 py-0.5 rounded text-violet-800">Note: This will overwrite existing auto-generated entries for the selected year.</span>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end bg-white/60 p-6 rounded-xl border border-violet-100 backdrop-blur-sm relative z-10">
          <div>
            <label className="text-xs font-bold text-violet-500 uppercase tracking-wider block mb-2">Financial Year</label>
            <select 
              value={genYear} 
              onChange={(e) => {
                 const y = parseInt(e.target.value);
                 setGenYear(y);
                 setGenRate(HISTORICAL_INTEREST_RATES[y]?.toString() || DEFAULT_INTEREST_RATE.toString());
              }}
              className="w-full px-4 py-3 bg-white border border-violet-200 rounded-lg focus:ring-2 focus:ring-violet-500 outline-none font-medium text-slate-700"
            >
              {Array.from({ length: 10 }, (_, i) => currentYear - 5 + i).map(y => (
                <option key={y} value={y}>FY {y}-{y+1}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-violet-500 uppercase tracking-wider block mb-2">Monthly Amount (₹)</label>
            <input 
              type="number" 
              value={genAmount}
              onChange={(e) => setGenAmount(e.target.value)}
              placeholder="e.g. 15000"
              className="w-full px-4 py-3 bg-white border border-violet-200 rounded-lg focus:ring-2 focus:ring-violet-500 outline-none font-medium text-slate-700"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-violet-500 uppercase tracking-wider block mb-2">Interest Rate (%)</label>
            <input 
              type="number" 
              step="0.05"
              value={genRate}
              onChange={(e) => setGenRate(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-violet-200 rounded-lg focus:ring-2 focus:ring-violet-500 outline-none font-medium text-slate-700"
            />
          </div>
          <button 
            onClick={handleGenerate}
            className="px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-bold transition-all shadow-lg shadow-violet-500/30 flex items-center justify-center gap-2 active:transform active:scale-95"
          >
            <RefreshCw size={18} /> Generate
          </button>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50">
        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
           <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
             <FileJson size={22} />
           </div>
           Data Management
        </h3>
        <p className="text-slate-500 mb-6">Backup your data to a JSON file or restore from a previous backup.</p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={handleExport} 
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-white border-2 border-slate-200 rounded-xl text-slate-700 font-bold hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 transition-all group"
          >
            <Download size={20} className="text-slate-400 group-hover:text-emerald-500" /> 
            Export Data
          </button>
          
          <label className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-white border-2 border-slate-200 rounded-xl text-slate-700 font-bold hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all cursor-pointer group">
            <Upload size={20} className="text-slate-400 group-hover:text-blue-500" /> 
            Import Data
            <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
      </div>
    </div>
  );
};

export default Configuration;