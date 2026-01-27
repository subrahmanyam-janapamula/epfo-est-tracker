import React, { useState } from 'react';
import { Sparkles, Loader2, Bot } from 'lucide-react';
import { YearlySummary } from '../types';
import { getAIAnalysis } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

interface Props {
  summary: YearlySummary;
  interestRate: number;
}

const AIAdvisor: React.FC<Props> = ({ summary, interestRate }) => {
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    const result = await getAIAnalysis(summary, interestRate);
    setInsight(result);
    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-1 shadow-lg text-white mb-6">
      <div className="bg-slate-900/90 rounded-xl p-6 h-full backdrop-blur-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Sparkles className="text-yellow-400" size={20} />
            AI Financial Insights
          </h3>
          {!insight && (
             <button
             onClick={handleAnalyze}
             disabled={loading}
             className="bg-white text-indigo-900 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-50 transition-colors disabled:opacity-70 flex items-center gap-2"
           >
             {loading ? <Loader2 className="animate-spin" size={16} /> : <Bot size={16} />}
             Analyze my Growth
           </button>
          )}
        </div>

        {loading && (
           <div className="text-center py-8 text-slate-300">
              <Loader2 className="animate-spin mx-auto mb-2" size={32} />
              <p className="text-sm">Consulting Gemini AI models...</p>
           </div>
        )}

        {insight && !loading && (
          <div className="prose prose-invert prose-sm max-w-none">
            <ReactMarkdown>{insight}</ReactMarkdown>
            <div className="mt-4 flex justify-end">
                 <button 
                  onClick={() => setInsight(null)}
                  className="text-xs text-indigo-300 hover:text-white underline"
                 >
                    Clear Analysis
                 </button>
            </div>
          </div>
        )}

        {!insight && !loading && (
          <p className="text-slate-400 text-sm">
            Get personalized advice on your EPF growth trajectory, inflation impact, and withdrawal implications powered by Gemini.
          </p>
        )}
      </div>
    </div>
  );
};

export default AIAdvisor;
