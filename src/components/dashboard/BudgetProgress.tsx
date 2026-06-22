import React from 'react';
import { Link } from 'react-router-dom';
import { formatRupiah } from '@/lib/formatters';
import { AlertCircle, ArrowRight } from 'lucide-react';

interface BudgetProgressProps {
  monthlyIncome: number;
  totalExpenses: number;
}

export const BudgetProgress: React.FC<BudgetProgressProps> = ({
  monthlyIncome,
  totalExpenses,
}) => {
  if (monthlyIncome <= 0) {
    return (
      <div className="bg-surface border border-border/80 rounded-2xl p-5 select-none flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-info/10 border border-info/20 rounded-xl text-info">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-text-primary">Status Anggaran Belum Aktif</h4>
            <p className="text-xs text-text-secondary mt-0.5">Set pendapatan di Settings untuk melihat budget status.</p>
          </div>
        </div>
        <Link
          to="/settings"
          className="flex items-center gap-1.5 text-xs font-bold text-primary hover:underline hover:translate-x-0.5 transition-all shrink-0"
        >
          <span>Set Pendapatan Sekarang</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const ratio = monthlyIncome > 0 ? Math.round((totalExpenses / monthlyIncome) * 100) : 0;
  const cappedRatio = Math.min(ratio, 100);

  // Dynamic colors: hijau (#22C55E) jika < 50%, kuning (#FBBF24) jika 50-80%, merah (#F43F5E) jika > 80%
  let progressColor = 'bg-[#22C55E]';
  let textColor = 'text-[#22C55E]';

  if (ratio >= 50 && ratio <= 80) {
    progressColor = 'bg-[#FBBF24]';
    textColor = 'text-[#FBBF24]';
  } else if (ratio > 80) {
    progressColor = 'bg-[#F43F5E]';
    textColor = 'text-[#F43F5E]';
  }

  return (
    <div className="bg-surface border border-border rounded-2xl p-5 shadow-xl select-none space-y-4">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <div>
          <h4 className="text-sm font-bold text-text-primary">Progres Anggaran Bulanan</h4>
          <p className="text-xs text-text-secondary mt-0.5">Persentase pengeluaran terhadap pendapatan.</p>
        </div>
        <span className={`text-sm font-bold ${textColor}`}>
          {formatRupiah(totalExpenses)} dari {formatRupiah(monthlyIncome)} ({ratio}%)
        </span>
      </div>

      {/* Progress Bar Track */}
      <div className="h-2.5 w-full bg-background border border-border rounded-full overflow-hidden">
        <div
          className={`h-full ${progressColor} transition-all duration-500 rounded-full`}
          style={{ width: `${cappedRatio}%` }}
        ></div>
      </div>
    </div>
  );
};
