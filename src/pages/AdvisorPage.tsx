import React, { useMemo } from 'react';
import { useExpenses } from '@/hooks/useExpenses';
import { useProfile } from '@/hooks/useProfile';
import { useAdvisor } from '@/hooks/useAdvisor';
import { AdvisorResult } from '@/components/advisor/AdvisorResult';
import { AdvisorChat } from '@/components/advisor/AdvisorChat';
import { Sparkles, AlertCircle, Loader2 } from 'lucide-react';

export const AdvisorPage: React.FC = () => {
  const { expenses, loading: expensesLoading } = useExpenses();
  const { profile, isLoading: profileLoading } = useProfile();
  const {
    analysis,
    chatHistory,
    loading: advisorLoading,
    chatLoading,
    triggerAnalysis,
    sendFollowUpMessage,
  } = useAdvisor(profile);

  // Check current month expenses
  const currentMonthExpenses = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    return expenses.filter((exp) => {
      const parts = exp.date.split('-');
      if (parts.length !== 3) return false;
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // 0-indexed
      return year === currentYear && month === currentMonth;
    });
  }, [expenses]);

  const hasExpensesThisMonth = currentMonthExpenses.length > 0;

  const handleStartAnalysis = () => {
    triggerAnalysis(expenses);
  };

  const handleSendMessage = async (msg: string) => {
    await sendFollowUpMessage(expenses, msg);
  };

  if (expensesLoading || profileLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <p className="text-sm text-text-secondary">Memuat data transaksi dan AI Advisor...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Intro Header */}
      <div className="flex flex-col gap-1 pb-2 border-b border-border/20 select-none">
        <h2 className="text-xl font-bold text-text-primary">AI Financial Advisor 🤖</h2>
        <p className="text-xs text-text-secondary">Dapatkan rekomendasi keuangan personal dan analisis otomatis berbasis pola belanjamu.</p>
      </div>

      {advisorLoading ? (
        /* Loader state during analysis */
        <div className="bg-surface border border-border rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[300px] shadow-xl select-none animate-pulse">
          <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl text-primary animate-bounce mb-4">
            <Sparkles className="w-10 h-10" />
          </div>
          <h3 className="font-bold text-lg text-text-primary mb-2">SmartSpend AI sedang menganalisis...</h3>
          <p className="text-sm text-text-secondary max-w-md leading-relaxed">
            AI sedang membaca data transaksi bulan ini, menghitung pola pengeluaran, dan merumuskan 3 saran konkret terbaik untuk finansialmu.
          </p>
          <div className="flex items-center gap-1.5 mt-6">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      ) : !analysis ? (
        /* Welcome / CTA page (Analysis not started yet) */
        <div className="bg-surface border border-border rounded-2xl p-6 md:p-10 text-center flex flex-col items-center justify-center min-h-[350px] shadow-xl relative overflow-hidden select-none">
          {/* Light glow effects */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-primary/5 blur-[80px] pointer-events-none"></div>

          <div className="p-4.5 bg-primary/10 border border-primary/20 rounded-2xl text-primary mb-5 relative">
            <Sparkles className="w-12 h-12" />
          </div>

          <h3 className="font-bold text-xl text-text-primary mb-3">Analisis Finansial Instan</h3>
          <p className="text-sm text-text-secondary max-w-md mb-8 leading-relaxed">
            Temukan apakah pengeluaranmu bulan ini masuk kategori <span className="text-success font-semibold">hemat</span>, <span className="text-info font-semibold">normal</span>, atau <span className="text-danger font-semibold">boros</span> beserta saran konkret penghematan.
          </p>

          {!hasExpensesThisMonth ? (
            /* Warning if no expenses */
            <div className="p-4 bg-danger/10 border border-danger/25 text-danger text-xs font-semibold rounded-xl flex items-center gap-2 max-w-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>Belum ada transaksi di bulan ini. Silakan catat transaksi pengeluaranmu terlebih dahulu.</span>
            </div>
          ) : (
            /* Action button to analyze */
            <button
              onClick={handleStartAnalysis}
              className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-hover text-text-primary text-sm font-semibold rounded-xl transition-all shadow-xl shadow-primary/25 active:scale-[0.97]"
            >
              <span>Mulai Analisis Keuanganku</span>
              <Sparkles className="w-4.5 h-4.5" />
            </button>
          )}
        </div>
      ) : (
        /* Show Analysis Report & Conversation Box */
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Left panel: Static analysis result */}
          <div className="md:col-span-7">
            <AdvisorResult
              result={analysis}
              onRefresh={handleStartAnalysis}
              isLoading={advisorLoading}
            />
          </div>

          {/* Right panel: Chat interface */}
          <div className="md:col-span-5">
            <AdvisorChat
              history={chatHistory}
              onSendMessage={handleSendMessage}
              isLoading={chatLoading}
            />
          </div>
        </div>
      )}
    </div>
  );
};
