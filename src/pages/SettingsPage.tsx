import React, { useState, useEffect } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { User, Loader2, Sparkles, AlertCircle } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { profile, isLoading, isSaving, error: fetchError, updateProfile } = useProfile();

  const [name, setName] = useState('');
  const [incomeInput, setIncomeInput] = useState('');
  const [incomeValue, setIncomeValue] = useState(0);
  const [errors, setErrors] = useState<{ name?: string; income?: string }>({});

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setIncomeValue(profile.monthlyIncome);
      setIncomeInput(profile.monthlyIncome > 0 ? profile.monthlyIncome.toLocaleString('id-ID') : '');
    }
  }, [profile]);

  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/[^\d]/g, '');
    const numericVal = rawVal ? parseInt(rawVal, 10) : 0;
    setIncomeValue(numericVal);
    setIncomeInput(numericVal > 0 ? numericVal.toLocaleString('id-ID') : '');
    if (errors.income) {
      setErrors((prev) => ({ ...prev, income: undefined }));
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (errors.name) {
      setErrors((prev) => ({ ...prev, name: undefined }));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { name?: string; income?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Nama lengkap wajib diisi';
    }

    if (incomeValue <= 0) {
      newErrors.income = 'Pendapatan bulanan harus lebih besar dari Rp 0';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    await updateProfile({
      name: name.trim(),
      monthlyIncome: incomeValue,
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <p className="text-sm text-text-secondary">Memuat pengaturan profil...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 select-none animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col gap-1 pb-2 border-b border-border/20">
        <h2 className="text-xl font-bold text-text-primary">Pengaturan Profil & Budget ⚙️</h2>
        <p className="text-xs text-text-secondary">Sesuaikan nama dan pendapatan bulanan Anda untuk analisis AI yang akurat.</p>
      </div>

      {fetchError && (
        <div className="p-4 bg-danger/10 border border-danger/20 rounded-xl text-danger flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="text-xs font-semibold leading-relaxed">{fetchError}</p>
        </div>
      )}

      {/* Form Settings */}
      <form onSubmit={handleSave} className="bg-surface border border-border rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        {/* Name Field */}
        <div>
          <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
            Nama Lengkap
          </label>
          <div className="relative rounded-lg shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-secondary">
              <User className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              placeholder="Masukkan nama Anda..."
              className={`w-full bg-background border rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary ${
                errors.name ? 'border-danger/50 focus:border-danger' : 'border-border focus:border-primary'
              }`}
              disabled={isSaving}
            />
          </div>
          {errors.name && (
            <p className="mt-1.5 flex items-center gap-1 text-xs text-danger">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errors.name}</span>
            </p>
          )}
        </div>

        {/* Monthly Income Field */}
        <div>
          <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
            Pendapatan Bulanan
          </label>
          <div className="relative rounded-lg shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-secondary">
              <span className="text-sm font-semibold">Rp</span>
            </div>
            <input
              type="text"
              value={incomeInput}
              onChange={handleIncomeChange}
              placeholder="0"
              className={`w-full bg-background border rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary ${
                errors.income ? 'border-danger/50 focus:border-danger' : 'border-border focus:border-primary'
              }`}
              disabled={isSaving}
            />
          </div>
          {errors.income && (
            <p className="mt-1.5 flex items-center gap-1 text-xs text-danger">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errors.income}</span>
            </p>
          )}
        </div>

        {/* Info Banner */}
        <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5 animate-pulse" />
          <p className="text-xs text-text-secondary leading-relaxed font-medium">
            Pendapatan kamu dipakai AI untuk menilai apakah pengeluaranmu hemat atau boros.
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-hover text-text-primary text-sm font-semibold rounded-xl transition-all shadow-lg shadow-primary/25 active:scale-[0.97] disabled:bg-primary/50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4.5 h-4.5 animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <span>Simpan Perubahan</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
