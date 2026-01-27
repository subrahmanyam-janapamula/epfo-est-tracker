import { AppData, FinancialYearRecord, MonthlyBalance, Transaction } from '../types';
import { DEFAULT_INTEREST_RATE, MONTHS } from '../constants';

export const calculateTimeline = (data: AppData): { years: FinancialYearRecord[], totalBalance: number } => {
  const { profile, transactions, interestRates } = data;
  
  const safeTransactions = transactions || [];
  
  // Sort transactions by TRANSACTION DATE for calculation purposes
  // If dates are equal, put contributions before withdrawals
  const sortedTransactions = [...safeTransactions].sort((a, b) => {
    const dateA = new Date(a.transactionDate).getTime();
    const dateB = new Date(b.transactionDate).getTime();
    return dateA - dateB;
  });
  
  if (sortedTransactions.length === 0 && !profile.joiningDate) {
      return { years: [], totalBalance: 0 };
  }

  const joinDate = new Date(profile.joiningDate);
  const targetDate = new Date(profile.targetDate);
  // Last transaction date is based on transactionDate
  const lastTxDate = sortedTransactions.length > 0 
    ? new Date(sortedTransactions[sortedTransactions.length - 1].transactionDate) 
    : joinDate;
    
  const calcEnd = targetDate > lastTxDate ? targetDate : lastTxDate;
  
  const startFyYear = joinDate.getMonth() < 3 ? joinDate.getFullYear() - 1 : joinDate.getFullYear();
  const endFyYear = calcEnd.getMonth() < 3 ? calcEnd.getFullYear() - 1 : calcEnd.getFullYear();

  const years: FinancialYearRecord[] = [];
  let globalRunningBalance = 0;
  let lastContributionAmount = 0;

  for (let fyYear = startFyYear; fyYear <= endFyYear; fyYear++) {
    const fyStartDate = new Date(fyYear, 3, 1); // April 1st
    const fyEndDate = new Date(fyYear + 1, 2, 31); // March 31st next year
    
    const label = `FY${fyYear}-${(fyYear + 1).toString().slice(-2)}`;
    const interestRate = interestRates[fyYear] || DEFAULT_INTEREST_RATE;

    let fyOpeningBalance = globalRunningBalance;
    let fyTotalContrib = 0;
    let fyTotalWithdrawal = 0;
    let fyInterestAccruedTotal = 0;
    
    const monthlyBreakdown: MonthlyBalance[] = [];

    // Iterate months in this FY
    for (let m = 0; m < 12; m++) {
       const actualMonthIndex = (m + 3) % 12; // 0->3 (April)
       const actualYear = m < 9 ? fyYear : fyYear + 1;
       
       const monthStartDate = new Date(actualYear, actualMonthIndex, 1);
       const monthEndDate = new Date(actualYear, actualMonthIndex + 1, 0); // Last day of month

       // Skip logic remains similar
       if (monthEndDate < joinDate) continue;

       const isProjectedFuture = monthStartDate > new Date();

       // 1. Get Real Transactions based on TRANSACTION DATE falling in this month
       // FIX: Use manual date parsing
       const monthTxs = sortedTransactions.filter(t => {
           const [tY, tM, tD] = t.transactionDate.split('-').map(Number);
           const d = new Date(tY, tM - 1, tD); 
           return d >= monthStartDate && d <= monthEndDate;
       });

       // 2. Projection Logic
       let projectedCredits = 0;
       // Only project if we have no REAL transactions for this calculation month
       if (monthTxs.length === 0 && isProjectedFuture && (!profile.endDate || monthStartDate < new Date(profile.endDate))) {
           if (lastContributionAmount > 0) {
               projectedCredits = lastContributionAmount;
           }
       }

       const monthOpening = globalRunningBalance;
       
       let monthCredits = 0;
       let monthDebits = 0;

       // Process Real Transactions
       monthTxs.forEach(t => {
           if (t.type === 'contribution' || t.type === 'transfer_in' || t.type === 'interest') {
               monthCredits += t.amount;
               if (t.type === 'contribution') lastContributionAmount = t.amount;
           } else if (t.type === 'withdrawal' || t.type === 'transfer_out') {
               monthDebits += t.amount;
           }
       });

       // Add Projection
       monthCredits += projectedCredits;

       // Apply to running balance
       globalRunningBalance += monthCredits;
       globalRunningBalance -= monthDebits;

       // Interest Calculation on OPENING balance of the month
       // Note: EPF rule is generally interest on monthly running balance, 
       // but typically deposits made after 15th don't count for that month.
       // Since we use transactionDate to bucket, if a tx date is May 15, it lands in May bucket.
       // It adds to 'monthCredits'.
       // 'monthOpening' is the balance BEFORE May 1st. 
       // So (monthOpening * rate)/1200 correctly calculates interest on the money present at START of month.
       const monthlyInterest = (monthOpening * interestRate) / 1200;
       fyInterestAccruedTotal += monthlyInterest;

       monthlyBreakdown.push({
           monthName: MONTHS[(actualMonthIndex + 9) % 12],
           year: actualYear,
           openingBalance: monthOpening,
           totalCredits: monthCredits,
           totalDebits: monthDebits,
           interestAccrued: monthlyInterest,
           closingBalance: globalRunningBalance
       });

       // Don't double count interest in contributions stat if we have explicit interest transactions
       // But here we are calculating 'stats' for the year.
       // Explicit interest transactions (from previous years) count as 'contribution' to the corpus in broad sense? 
       // No, usually kept separate.
       const realContribs = monthTxs.filter(t => t.type === 'contribution' || t.type === 'transfer_in').reduce((sum, t) => sum + t.amount, 0) + projectedCredits;
       const realDebits = monthTxs.filter(t => t.type === 'withdrawal' || t.type === 'transfer_out').reduce((sum, t) => sum + t.amount, 0);

       fyTotalContrib += realContribs;
       fyTotalWithdrawal += realDebits;
    }

    // --- END OF FINANCIAL YEAR INTEREST INJECTION ---
    
    // Add the calculated interest as a "Transaction" to the balance
    // This makes it compounding for the next year.
    globalRunningBalance += fyInterestAccruedTotal;

    // We also want to VISUALLY show this interest credit in the March breakdown or as a summary
    // The requirement says "Add interest transaction as a credit transaction, on 31st March"
    // To visualize this in the monthly breakdown (which just finished March), we can update the last month entry
    if (monthlyBreakdown.length > 0) {
        const lastMonth = monthlyBreakdown[monthlyBreakdown.length - 1];
        // Only if it's March
        if (lastMonth.monthName === 'March') {
             lastMonth.totalCredits += fyInterestAccruedTotal;
             lastMonth.closingBalance += fyInterestAccruedTotal;
             // Note: We don't add it to 'fyTotalContrib' because it's interest, not contribution.
        }
    }

    years.push({
        startYear: fyYear,
        label,
        startDate: fyStartDate.toISOString(),
        endDate: fyEndDate.toISOString(),
        openingBalance: fyOpeningBalance,
        totalContributions: fyTotalContrib,
        totalWithdrawals: fyTotalWithdrawal,
        interestRate,
        interestEarned: fyInterestAccruedTotal,
        closingBalance: globalRunningBalance,
        isProjected: fyYear >= new Date().getFullYear(),
        monthlyBreakdown
    });
  }

  return { years, totalBalance: globalRunningBalance };
};
