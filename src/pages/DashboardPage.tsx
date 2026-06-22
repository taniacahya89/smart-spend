import React, { useState } from 'react';
import { useExpenses } from '@/hooks/useExpenses';
import { useProfile } from '@/hooks/useProfile';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { SummaryCard } from '@/components/dashboard/SummaryCard';
import { SpendingChart } from '@/components/dashboard/SpendingChart';
import { CategoryBreakdown } from '@/components/dashboard/CategoryBreakdown';
import { BudgetProgress } from '@/components/dashboard/BudgetProgress';
import { ExpenseForm } from '@/components/expense/ExpenseForm';
import { formatRupiah } from '@/lib/formatters';
import { TrendingDown, Hash, Award, Plus, Sparkles, AlertCircle, X, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { expenses, loading: expensesLoading, saving, addExpense } = useExpenses();
  const { profile, isLoading: profileLoading } = useProfile();
  const stats = useDashboardStats(expenses);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const monthlyIncome = profile?.monthlyIncome || 0;
  const remainingBudget = monthlyIncome - stats.totalThisMonth;
  const loading = expensesLoading || profileLoading;

  // Month label in Indonesian
  const currentMonthLabel = new Intl.DateTimeFormat('id-ID', {
    month: 'long',
    year: 'numeric'
  }).format(new Date());

  const handleQuickAdd = async (data: any) => {
    const newExp = await addExpense(data);
    if (newExp) {
      setIsAddOpen(false);
      return true;
    }
    return false;
  };

  return (
    <div className="space-y-6">
      {/* Warning banner if monthly income is 0 */}
      {!loading && monthlyIncome === 0 && (
        <div className="p-4 bg-[#FBBF24]/10 border border-[#FBBF24]/20 rounded-xl text-[#FBBF24] flex items-center justify-between gap-3 animate-fade-in select-none">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-xs font-semibold leading-relaxed">
              Pendapatan bulanan belum diatur! Set pendapatan Anda di Settings untuk mengaktifkan pelacakan anggaran AI.
            </p>
          </div>
          <Link
            to="/settings"
            className="text-xs font-bold underline hover:text-[#FBBF24]/85 shrink-0"
          >
            Atur Sekarang
          </Link>
        </div>
      )}

      {/* Welcome header & quick shortcut button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none pb-2 border-b border-border/20">
        <div>
          <h2 className="text-xl font-bold text-text-primary">Hai, Selamat Datang! 👋</h2>
          <p className="text-xs text-text-secondary mt-0.5">Berikut ringkasan kondisi keuanganmu di bulan {currentMonthLabel}.</p>
        </div>
        
        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-hover text-text-primary text-sm font-semibold rounded-xl transition-all shadow-lg shadow-primary/25 active:scale-[0.97]"
        >
          <Plus className="w-4.5 h-4.5" />
          <span>Tambah Pengeluaran</span>
        </button>
      </div>

      {/* Statistics Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          // Shimmer cards
          [1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-surface border border-border rounded-xl p-5 min-h-[140px] animate-pulse flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="space-y-2 w-2/3">
                  <div className="h-4 bg-background/50 rounded w-16"></div>
                  <div className="h-6 bg-background/80 rounded w-28"></div>
                </div>
                <div className="w-10 h-10 bg-background/50 rounded-xl"></div>
              </div>
              <div className="h-4 bg-background/50 rounded w-32 mt-4"></div>
            </div>
          ))
        ) : (
          <>
            {/* 1. Total Spend Card */}
            <SummaryCard
              title="Total Pengeluaran"
              value={formatRupiah(stats.totalThisMonth)}
              subtitle={`Periode ${currentMonthLabel}`}
              icon={<TrendingDown className="w-6 h-6 text-danger" />}
              trend={{
                text: stats.totalThisMonth > 1000000 ? 'Perlu Hemat' : 'Stabil',
                isNegative: stats.totalThisMonth > 1000000,
                isPositive: stats.totalThisMonth <= 1000000 && stats.totalThisMonth > 0
              }}
            />

            {/* 2. Transaction Count Card */}
            <SummaryCard
              title="Jumlah Transaksi"
              value={`${stats.transactionCount} Transaksi`}
              subtitle="Telah dicatat bulan ini"
              icon={<Hash className="w-6 h-6 text-primary" />}
              trend={{
                text: stats.transactionCount > 15 ? 'Aktif' : 'Normal'
              }}
            />

            {/* 3. Top Category Card */}
            <SummaryCard
              title="Kategori Terbesar"
              value={stats.topCategory || 'Belum Ada'}
              subtitle="Porsi belanja tertinggi"
              icon={<Award className="w-6 h-6 text-info" />}
              trend={
                stats.topCategory
                  ? { text: 'Perlu Dikurangi', isNegative: true }
                  : undefined
              }
            />

            {/* 4. Remaining Budget Card */}
            <SummaryCard
              title="Sisa Budget"
              value={formatRupiah(remainingBudget)}
              subtitle={monthlyIncome > 0 ? `Dari pendapatan bulan ini` : `Pendapatan belum diset`}
              icon={<Wallet className="w-6 h-6 text-[#22C55E]" />}
              trend={
                monthlyIncome > 0
                  ? {
                      text: remainingBudget < 0 ? 'Overbudget' : 'Aman',
                      isNegative: remainingBudget < 0,
                      isPositive: remainingBudget >= 0
                    }
                  : undefined
              }
            />
          </>
        )}
      </div>

      {/* Budget Progress bar component */}
      {!loading && (
        <BudgetProgress monthlyIncome={monthlyIncome} totalExpenses={stats.totalThisMonth} />
      )}

      {/* Main statistics graphics grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? (
          // Shimmer charts
          [1, 2].map((i) => (
            <div key={i} className="bg-surface border border-border rounded-xl p-5 h-[320px] animate-pulse flex flex-col justify-between">
              <div className="space-y-2">
                <div className="h-5 bg-background/60 rounded w-32"></div>
                <div className="h-4 bg-background/60 rounded w-48"></div>
              </div>
              <div className="flex-1 bg-background/40 rounded-xl mt-4 w-full"></div>
            </div>
          ))
        ) : (
          <>
            {/* 7 Days spending bar chart */}
            <SpendingChart data={stats.dailySpending} />

            {/* Category breakdown pie chart */}
            <CategoryBreakdown data={stats.categoryBreakdown} />
          </>
        )}
      </div>

      {/* Quick AI Advisor Promo Box */}
      <div className="bg-surface border border-border rounded-2xl p-6 select-none flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        {/* Glow styling */}
        <div className="absolute right-[-100px] top-[-50px] w-[300px] h-[300px] rounded-full bg-primary/10 blur-[60px] pointer-events-none"></div>
        
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary/15 border border-primary/20 rounded-2xl text-primary shrink-0 animate-bounce">
            <Sparkles className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-bold text-base text-text-primary">Punya Pertanyaan Finansial?</h3>
            <p className="text-xs text-text-secondary mt-1 leading-relaxed max-w-md">
              Kondisi pengeluaranmu bulan ini sudah terpantau. Ingin tahu tips menghemat makanan, belanja pintar, atau analisis kebiasaan belanjamu dari AI Advisor?
            </p>
          </div>
        </div>

        <Link
          to="/advisor"
          className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-hover text-text-primary text-sm font-semibold rounded-xl transition-all shadow-lg shadow-primary/20 active:scale-[0.97] shrink-0"
        >
          <span>Tanya AI Advisor</span>
          <Sparkles className="w-4 h-4" />
        </Link>
      </div>

      {/* Reusable Modal Dialog for Quick Add Expense */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-surface border border-border rounded-2xl p-6 shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between pb-3.5 border-b border-border/40 mb-4 select-none">
              <h3 className="font-bold text-base text-text-primary">Tambah Pengeluaran Baru</h3>
              <button
                onClick={() => setIsAddOpen(false)}
                className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-background transition-all active:scale-[0.97]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <ExpenseForm
              onSubmit={handleQuickAdd}
              onCancel={() => setIsAddOpen(false)}
              isSaving={saving}
            />
          </div>
        </div>
      )}
    </div>
  );
};
