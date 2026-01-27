import { GoogleGenAI } from "@google/genai";
import { YearlySummary } from "../types";

// Helper to format currency
const formatCurrency = (amount: number) => 
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

export const getAIAnalysis = async (summary: YearlySummary, interestRate: number) => {
  try {
    // Initialize GoogleGenAI with the API key directly from the environment variable.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `
      Act as a senior financial advisor specializing in Indian Provident Funds (EPF).
      Analyze the following EPF projection for a user:

      Financial Data:
      - Opening Balance: ${formatCurrency(summary.openingBalance)}
      - Annual Contribution: ${formatCurrency(summary.totalContribution)}
      - Withdrawals: ${formatCurrency(summary.totalWithdrawal)}
      - Estimated Interest Earned: ${formatCurrency(summary.totalInterest)} (at ${interestRate}%)
      - Projected Closing Balance: ${formatCurrency(summary.closingBalance)}

      Please provide a concise analysis in markdown format:
      1. **Growth Assessment**: Is the corpus growing healthily?
      2. **Interest Impact**: Comment on the power of compounding for this year (even though EPF is simple interest annually, the corpus grows).
      3. **Withdrawal Warning** (If any withdrawals exist): Explain the impact of the withdrawal on future long-term wealth.
      4. **Recommendation**: Suggest if they should increase VPF (Voluntary Provident Fund) contributions based on the current contribution ratio.

      Keep the tone professional, encouraging, and concise (under 200 words).
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Unable to generate AI insights at this time. Please try again later.";
  }
};