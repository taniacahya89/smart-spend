import React, { useState, useEffect } from 'react';
import { ExpenseFormData, ExpenseCategory, Expense } from '@/types';
import { CATEGORIES } from '@/constants/categories';
import { AlertCircle, Loader2 } from 'lucide-react';
import { getLocalDateString } from '@/lib/formatters';

interface ExpenseFormProps {
  onSubmit: (data: ExpenseFormData) => Promise<boolean>;
  initialData?: Expense | null;
  onCancel: () => void;
  isSaving: boolean;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({
  onSubmit,
  initialData,
  onCancel,
  isSaving,
}) => {
  const [amountInput, setAmountInput] = useState<string>('');
  const [formData, setFormData] = useState<ExpenseFormData>({
    amount: 0,
    category: '' as ExpenseCategory,
    date: getLocalDateString(),
    description: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ExpenseFormData, string>>>({});

  // Populate form if initialData is provided (Editing mode)
  useEffect(() => {
    if (initialData) {
      setFormData({
        amount: initialData.amount,
        category: initialData.category,
        date: initialData.date,
        description: initialData.description || '',
      });
      setAmountInput(initialData.amount.toLocaleString('id-ID'));
    } else {
      setFormData({
        amount: 0,
        category: '' as ExpenseCategory,
        date: getLocalDateString(),
        description: '',
      });
      setAmountInput('');
    }
    setErrors({});
  }, [initialData]);

  // Handle amount formatting (auto thousands separators)
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/[^\d]/g, ''); // Allow digits only
    const numericVal = rawVal ? parseInt(rawVal, 10) : 0;
    
    setFormData((prev) => ({ ...prev, amount: numericVal }));
    setAmountInput(numericVal > 0 ? numericVal.toLocaleString('id-ID') : '');

    // Clear error
    if (errors.amount) {
      setErrors((prev) => ({ ...prev, amount: undefined }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error
    if (errors[name as keyof ExpenseFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ExpenseFormData, string>> = {};
    const todayStr = getLocalDateString();

    // Amount Validation
    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Nominal harus diisi dan lebih besar dari 0';
    }

    // Category Validation
    if (!formData.category) {
      newErrors.category = 'Kategori wajib dipilih';
    } else if (!CATEGORIES.includes(formData.category)) {
      newErrors.category = 'Kategori tidak valid';
    }

    // Date Validation
    if (!formData.date) {
      newErrors.date = 'Tanggal wajib diisi';
    } else if (formData.date > todayStr) {
      newErrors.date = 'Tanggal tidak boleh di masa depan';
    }

    // Description Validation
    if (formData.description && formData.description.length > 200) {
      newErrors.description = 'Deskripsi maksimal 200 karakter';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    const success = await onSubmit(formData);
    if (success && !initialData) {
      // Reset form if it is a new entry
      setFormData({
        amount: 0,
        category: '' as ExpenseCategory,
        date: getLocalDateString(),
        description: '',
      });
      setAmountInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-text-primary select-none">
      {/* Nominal Input */}
      <div>
        <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
          Nominal (Rupiah) <span className="text-danger">*</span>
        </label>
        <div className="relative rounded-lg shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-text-secondary text-sm font-semibold">Rp</span>
          </div>
          <input
            type="text"
            value={amountInput}
            onChange={handleAmountChange}
            placeholder="0"
            className={`w-full bg-background border rounded-lg pl-10 pr-4 py-2.5 text-sm tabular-nums focus:outline-none focus:ring-1 focus:ring-primary ${
              errors.amount ? 'border-danger/50 focus:border-danger' : 'border-border focus:border-primary'
            }`}
            disabled={isSaving}
          />
        </div>
        {errors.amount && (
          <p className="mt-1.5 flex items-center gap-1 text-xs text-danger">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{errors.amount}</span>
          </p>
        )}
      </div>

      {/* Category Selection */}
      <div>
        <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
          Kategori <span className="text-danger">*</span>
        </label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className={`w-full bg-background border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary ${
            errors.category ? 'border-danger/50 focus:border-danger' : 'border-border focus:border-primary'
          }`}
          disabled={isSaving}
        >
          <option value="" disabled>-- Pilih Kategori --</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="mt-1.5 flex items-center gap-1 text-xs text-danger">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{errors.category}</span>
          </p>
        )}
      </div>

      {/* Date Picker */}
      <div>
        <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
          Tanggal <span className="text-danger">*</span>
        </label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          max={getLocalDateString()}
          className={`w-full bg-background border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary ${
            errors.date ? 'border-danger/50 focus:border-danger' : 'border-border focus:border-primary'
          }`}
          disabled={isSaving}
        />
        {errors.date && (
          <p className="mt-1.5 flex items-center gap-1 text-xs text-danger">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{errors.date}</span>
          </p>
        )}
      </div>

      {/* Description Textarea */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider">
            Deskripsi (Opsional)
          </label>
          <span className="text-[10px] text-text-secondary">
            {formData.description?.length || 0}/200
          </span>
        </div>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          maxLength={200}
          placeholder="Misal: Beli nasi goreng pak kumis dekat kosan"
          className={`w-full bg-background border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary ${
            errors.description ? 'border-danger/50 focus:border-danger' : 'border-border focus:border-primary'
          }`}
          disabled={isSaving}
        />
        {errors.description && (
          <p className="mt-1.5 flex items-center gap-1 text-xs text-danger">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{errors.description}</span>
          </p>
        )}
      </div>

      {/* Submit / Cancel Buttons */}
      <div className="flex items-center justify-end gap-3 pt-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-semibold border border-border rounded-lg text-text-primary hover:bg-surface transition-all active:scale-[0.97]"
          disabled={isSaving}
        >
          Batal
        </button>
        <button
          type="submit"
          className="flex items-center gap-2 px-5 py-2 text-sm font-semibold bg-primary hover:bg-primary-hover text-text-primary rounded-lg transition-all shadow-md shadow-primary/10 active:scale-[0.97]"
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Menyimpan...</span>
            </>
          ) : (
            <span>Simpan</span>
          )}
        </button>
      </div>
    </form>
  );
};
