import { AppData, Transaction } from '../types';
import { DEFAULT_PROFILE } from '../constants';

const STORAGE_KEY = 'epfo_tracker_data_v1';

export const loadData = (): AppData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      
      // Migration logic for old transaction format
      const migratedTransactions: Transaction[] = Array.isArray(parsed.transactions) 
        ? parsed.transactions.map((t: any) => ({
            ...t,
            // Map legacy 'date' to both new fields if they don't exist
            contributionDate: t.contributionDate || t.date,
            transactionDate: t.transactionDate || t.date || t.contributionDate
          }))
        : [];

      return {
        profile: { ...DEFAULT_PROFILE, ...parsed.profile },
        transactions: migratedTransactions,
        interestRates: parsed.interestRates || {}
      };
    }
  } catch (e) {
    console.error("Failed to load data", e);
  }
  return {
    profile: DEFAULT_PROFILE,
    transactions: [],
    interestRates: {}
  };
};

export const saveData = (data: AppData) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save data", e);
  }
};

export const exportData = (data: AppData) => {
  const dataStr = JSON.stringify(data, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `epfo_tracker_backup_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const importData = (file: File): Promise<AppData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = e.target?.result as string;
        const parsed = JSON.parse(result);
        
        // Basic validation and Migration
        if (parsed.profile && Array.isArray(parsed.transactions)) {
           const migratedTransactions = parsed.transactions.map((t: any) => ({
            ...t,
            contributionDate: t.contributionDate || t.date,
            transactionDate: t.transactionDate || t.date || t.contributionDate
          }));

          resolve({
            ...parsed,
            transactions: migratedTransactions
          });
        } else {
          reject(new Error("Invalid file format"));
        }
      } catch (err) {
        reject(err);
      }
    };
    reader.readAsText(file);
  });
};
