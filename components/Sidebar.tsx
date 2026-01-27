import React from 'react';
import { LayoutDashboard, History, ArrowRightLeft, Building2, Menu, X, Settings } from 'lucide-react';

interface Props {
  currentView: string;
  setView: (view: string) => void;
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}

const Sidebar: React.FC<Props> = ({ currentView, setView, isOpen, setIsOpen }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'years', label: 'Yearly Records', icon: History },
    { id: 'transactions', label: 'Transactions', icon: ArrowRightLeft },
    { id: 'configuration', label: 'Configuration', icon: Settings },
  ];

  const handleNav = (id: string) => {
    setView(id);
    setIsOpen(false); // Close mobile menu on select
  };

  return (
    <>
      {/* Mobile Header Overlay */}
      <div className={`fixed inset-0 bg-slate-900/50 z-20 lg:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsOpen(false)} />

      <div className={`fixed lg:static inset-y-0 left-0 w-64 bg-[#0f172a] text-slate-300 flex flex-col z-30 transform transition-transform duration-200 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} border-r border-slate-800`}>
        <div className="p-6 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-violet-600 to-fuchsia-600 p-2 rounded-lg shadow-lg shadow-violet-900/50">
              <Building2 size={24} className="text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">EPFO Tracker</h1>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                currentView === item.id 
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-indigo-900/30 translate-x-1' 
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon size={20} className={currentView === item.id ? 'animate-pulse' : ''} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
        
        <div className="p-6 border-t border-slate-800">
          <p className="text-xs text-slate-500 font-medium">
            Version 1.2
          </p>
        </div>
      </div>
    </>
  );
};

export default Sidebar;