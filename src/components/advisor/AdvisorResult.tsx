import React from 'react';
import { Link } from 'react-router-dom';
import { AdvisorAnalysis } from '@/types';
import { Sparkles, RefreshCw, CheckCircle2, TrendingUp, AlertTriangle, ShieldCheck, AlertCircle } from 'lucide-react';

interface AdvisorResultProps {
  result: AdvisorAnalysis;
  onRefresh: () => void;
  isLoading: boolean;
}

export const AdvisorResult: React.FC<AdvisorResultProps> = ({
  result,
  onRefresh,
  isLoading,
}) => {
  const { ringkasan, penilaian, alasan_penilaian, saran, highlight } = result;

  // Resolve assessment status styles
  const getStatusConfig = (rating: typeof penilaian) => {
    switch (rating) {
      case 'hemat':
        return {
          label: 'Hemat 👍',
          bg: 'bg-[#22C55E]/15 border-[#22C55E]/30',
          text: 'text-[#22C55E]',
          icon: <ShieldCheck className="w-5 h-5" />,
          desc: 'Pengeluaran bulananmu terkendali dengan sangat baik. Pertahankan!'
        };
      case 'normal':
        return {
          label: 'Wajar / Normal ⚖️',
          bg: 'bg-[#FBBF24]/15 border-[#FBBF24]/30',
          text: 'text-[#FBBF24]',
          icon: <CheckCircle2 className="w-5 h-5" />,
          desc: 'Pengeluaranmu masih berada dalam batas wajar, namun perlu beberapa penyesuaian.'
        };
      case 'boros':
        return {
          label: 'Boros 🚨',
          bg: 'bg-[#F43F5E]/15 border-[#F43F5E]/30',
          text: 'text-[#F43F5E]',
          icon: <AlertTriangle className="w-5 h-5" />,
          desc: 'Waduh, pengeluaranmu bulan ini cukup tinggi. Waktunya mengerem belanja!'
        };
      case 'tidak_dapat_dinilai':
        return {
          label: 'Belum Dinilai ❓',
          bg: 'bg-text-secondary/15 border-text-secondary/30',
          text: 'text-text-secondary',
          icon: <AlertCircle className="w-5 h-5" />,
          desc: 'Pendapatan belum diset di Settings, sehingga AI tidak bisa membandingkan anggaran.'
        };
      default:
        return {
          label: 'Belum Dinilai',
          bg: 'bg-text-secondary/15 border-text-secondary/30',
          text: 'text-text-secondary',
          icon: <AlertCircle className="w-5 h-5" />,
          desc: ''
        };
    }
  };

  const status = getStatusConfig(penilaian);

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-xl select-none space-y-6">
      {/* Header section with AI label */}
      <div className="flex items-center justify-between pb-4 border-b border-border/40 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 border border-primary/20 rounded-xl text-primary animate-pulse">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-text-primary">Analisis Keuangan Personal</h3>
            <span className="text-[10px] text-text-secondary">Dianalisis secara langsung oleh SmartSpend AI</span>
          </div>
        </div>

        <button
          onClick={onRefresh}
          className="flex items-center gap-2 px-3 py-1.5 bg-background border border-border hover:border-primary hover:text-primary text-xs font-semibold rounded-lg transition-all active:scale-[0.97]"
          disabled={isLoading}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Analisis Ulang</span>
        </button>
      </div>

      {/* Assessment indicator */}
      <div className={`p-4 rounded-xl border ${status.bg} flex flex-col gap-3`}>
        <div className="flex items-start gap-3">
          <div className={status.text}>{status.icon}</div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-wider text-text-secondary">Penilaian Keuangan</p>
            <h4 className={`text-base font-bold mt-0.5 ${status.text}`}>{status.label}</h4>
            <p className="text-xs text-text-secondary mt-1 font-medium">{alasan_penilaian}</p>
          </div>
        </div>
        {penilaian === 'tidak_dapat_dinilai' && (
          <div className="pt-2 border-t border-border/20 flex justify-end">
            <Link
              to="/settings"
              className="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary-hover text-text-primary text-xs font-bold rounded-lg transition-all shadow-md active:scale-[0.97]"
            >
              <span>Set Pendapatan di Settings</span>
            </Link>
          </div>
        )}
      </div>

      {/* AI Highlight / Insight Card */}
      {highlight && (
        <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl flex items-start gap-3 animate-fade-in">
          <div className="p-1.5 bg-primary/20 rounded-lg text-primary shrink-0">
            <span className="text-base leading-none">💡</span>
          </div>
          <div className="min-w-0">
            <h5 className="text-xs font-bold text-text-primary uppercase tracking-wider">AI Highlight</h5>
            <p className="text-sm text-text-secondary mt-1 font-medium leading-relaxed">{highlight}</p>
          </div>
        </div>
      )}

      {/* Spending Pattern summary */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider flex items-center gap-1.5">
          <TrendingUp className="w-4 h-4 text-primary" /> Ringkasan Pola Pengeluaran
        </h4>
        <p className="text-sm text-text-primary leading-relaxed bg-background/50 border border-border/50 rounded-xl p-4 font-medium">
          {ringkasan}
        </p>
      </div>

      {/* Actionable Suggestions */}
      <div className="space-y-3.5">
        <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider">
          💡 3 Saran Konkret untuk Bulan Depan
        </h4>
        <div className="grid grid-cols-1 gap-3">
          {saran.map((item, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-4 bg-background border border-border/60 hover:border-primary/30 rounded-xl transition-all group"
            >
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold shrink-0 mt-0.5 group-hover:bg-primary group-hover:text-text-primary transition-all">
                {idx + 1}
              </div>
              <p className="text-sm text-text-primary font-medium leading-relaxed">
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
