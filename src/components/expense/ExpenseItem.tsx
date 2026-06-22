import React from 'react';
import { Expense } from '@/types';
import { CATEGORY_MAP } from '@/constants/categories';
import { formatRupiah, formatDate } from '@/lib/formatters';
import { Pencil, Trash2, Calendar } from 'lucide-react';
import * as Icons from 'lucide-react';

interface ExpenseItemProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export const ExpenseItem: React.FC<ExpenseItemProps> = ({
  expense,
  onEdit,
  onDelete,
  isDeleting,
}) => {
  const categoryInfo = CATEGORY_MAP[expense.category] || CATEGORY_MAP['Lainnya'];
  
  // Resolve Lucide Icon dynamically
  const IconComponent = (Icons as any)[categoryInfo.icon] || Icons.HelpCircle;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-surface border border-border rounded-xl transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg hover:shadow-background/50 select-none">
      <div className="flex items-start gap-4">
        {/* Category Icon Wrapper */}
        <div className={`p-3 rounded-xl border ${categoryInfo.bgClass} ${categoryInfo.borderClass} ${categoryInfo.textClass} shrink-0`}>
          <IconComponent className="w-5 h-5" />
        </div>

        {/* Content details */}
        <div className="min-w-0">
          <div className="flex items-center flex-wrap gap-2 mb-1">
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${categoryInfo.bgClass} ${categoryInfo.textClass} ${categoryInfo.borderClass}`}>
              {expense.category}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-text-secondary">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(expense.date)}</span>
            </span>
          </div>

          <p className="text-sm font-semibold text-text-primary truncate">
            {expense.description || <span className="text-text-secondary italic">Tanpa deskripsi</span>}
          </p>
        </div>
      </div>

      {/* Numeric Amount & Actions Area */}
      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 mt-4 sm:mt-0 pt-3 sm:pt-0 border-t border-border/40 sm:border-t-0">
        <span className="text-base font-bold text-text-primary tabular-nums">
          {formatRupiah(expense.amount)}
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(expense)}
            className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-background border border-transparent hover:border-border transition-all active:scale-[0.97]"
            title="Edit Pengeluaran"
          >
            <Pencil className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => onDelete(expense.id)}
            className="p-2 rounded-lg text-danger/80 hover:text-danger hover:bg-danger/10 border border-transparent hover:border-danger/10 transition-all active:scale-[0.97] flex items-center justify-center"
            title="Hapus Pengeluaran"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <span className="w-4 h-4 border-2 border-danger border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
