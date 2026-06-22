import { useState, useCallback, useEffect } from 'react';
import { Expense, AdvisorMessage, UserProfile, AdvisorAnalysis, CategorySummary, ExpenseCategory } from '@/types';
import { analyzeExpenses, chatWithAdvisor } from '@/lib/groq';
import { useToast } from '@/context/ToastContext';
import { CATEGORY_MAP } from '@/constants/categories';

export const useAdvisor = (userProfile: UserProfile | null) => {
  const { showToast } = useToast();
  const [analysis, setAnalysis] = useState<AdvisorAnalysis | null>(null);
  const [chatHistory, setChatHistory] = useState<AdvisorMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [chatLoading, setChatLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load advisor state from localStorage for persistence if available
  useEffect(() => {
    const cachedAnalysis = localStorage.getItem('smartspend_advisor_analysis');
    const cachedHistory = localStorage.getItem('smartspend_advisor_history');
    if (cachedAnalysis) {
      try {
        setAnalysis(JSON.parse(cachedAnalysis));
      } catch (e) {
        console.error('Error parsing cached analysis:', e);
      }
    }
    if (cachedHistory) {
      try {
        const parsed = JSON.parse(cachedHistory) as any[];
        setChatHistory(
          parsed.map((item) => ({
            ...item,
            timestamp: new Date(item.timestamp)
          }))
        );
      } catch (e) {
        console.error('Error parsing cached chat history:', e);
      }
    }
  }, []);

  const triggerAnalysis = useCallback(async (expenses: Expense[]) => {
    setLoading(true);
    setError(null);
    try {
      // Filter current calendar month expenses
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();
      const currentMonthExpenses = expenses.filter((exp) => {
        const parts = exp.date.split('-');
        if (parts.length !== 3) return false;
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // 0-indexed
        return year === currentYear && month === currentMonth;
      });

      // Compute statistics for rich context
      const totalExpenses = currentMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      const transactionCount = currentMonthExpenses.length;

      // Category breakdown
      const categoryTotals: Record<string, number> = {};
      currentMonthExpenses.forEach((exp) => {
        categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
      });

      const categoryBreakdown: CategorySummary[] = Object.entries(categoryTotals)
        .map(([cat, total]) => {
          const percentage = totalExpenses > 0 ? (total / totalExpenses) * 100 : 0;
          const category = cat as ExpenseCategory;
          return {
            category,
            total,
            percentage: Math.round(percentage * 100) / 100,
            color: CATEGORY_MAP[category]?.color || '#94A3B8'
          };
        })
        .sort((a, b) => b.total - a.total);

      // Top 5 largest transactions
      const topTransactions = [...currentMonthExpenses]
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5);

      // Remaining days in month
      const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
      const daysRemainingInMonth = totalDaysInMonth - now.getDate();
      
      const currentDateString = new Intl.DateTimeFormat('id-ID', { dateStyle: 'long' }).format(now);

      const params = {
        userName: userProfile?.name || 'Pengguna',
        monthlyIncome: userProfile?.monthlyIncome || 0,
        totalExpenses,
        transactionCount,
        categoryBreakdown,
        topTransactions,
        currentDate: currentDateString,
        daysRemainingInMonth,
      };

      let response: AdvisorAnalysis;
      try {
        response = await analyzeExpenses(params);
      } catch (err: any) {
        console.error('Error in analyzeExpenses raw API call or parse:', err);
        throw err;
      }

      setAnalysis(response);
      localStorage.setItem('smartspend_advisor_analysis', JSON.stringify(response));

      // Reset follow-up chat history when a fresh analysis is run
      setChatHistory([]);
      localStorage.removeItem('smartspend_advisor_history');
      showToast('Analisis selesai!', 'success');
    } catch (err: any) {
      console.error('Error getting AI analysis:', err);
      setError(err.message || 'Gagal menganalisis keuangan');
      showToast(err.message || 'Gagal menganalisis keuangan', 'danger');
    } finally {
      setLoading(false);
    }
  }, [userProfile, showToast]);

  const sendFollowUpMessage = useCallback(async (expenses: Expense[], userMessage: string) => {
    if (!userMessage.trim()) return;
    
    const userMsgObj: AdvisorMessage = {
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    };

    const updatedHistory = [...chatHistory, userMsgObj];
    setChatHistory(updatedHistory);
    setChatLoading(true);

    try {
      // Filter current calendar month expenses
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();
      const currentMonthExpenses = expenses.filter((exp) => {
        const parts = exp.date.split('-');
        if (parts.length !== 3) return false;
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // 0-indexed
        return year === currentYear && month === currentMonth;
      });

      const reply = await chatWithAdvisor(
        currentMonthExpenses,
        updatedHistory,
        userMessage,
        userProfile?.monthlyIncome || 0,
        analysis
      );
      
      const assistantMsgObj: AdvisorMessage = {
        role: 'assistant',
        content: reply,
        timestamp: new Date()
      };

      const finalHistory = [...updatedHistory, assistantMsgObj];
      setChatHistory(finalHistory);
      localStorage.setItem('smartspend_advisor_history', JSON.stringify(finalHistory));
    } catch (err: any) {
      console.error('Error in AI follow up chat:', err);
      showToast('Gagal mengirim pesan', 'danger');
    } finally {
      setChatLoading(false);
    }
  }, [chatHistory, showToast, userProfile, analysis]);

  const resetAnalysis = useCallback(() => {
    setAnalysis(null);
    setChatHistory([]);
    localStorage.removeItem('smartspend_advisor_analysis');
    localStorage.removeItem('smartspend_advisor_history');
  }, []);

  return {
    analysis,
    chatHistory,
    loading,
    chatLoading,
    error,
    triggerAnalysis,
    sendFollowUpMessage,
    resetAnalysis
  };
};
