import React from 'react';
import { CATEGORIES } from '@/constants/categories';
import { Search, Filter, ArrowUpDown } from 'lucide-react';

interface ExpenseFiltersProps {
  search: string;
  setSearch: (val: string) => void;
  category: string;
  setCategory: (val: string) => void;
  month: string; // "YYYY-MM" format
  setMonth: (val: string) => void;
  sortBy: string;
  setSortBy: (val: string) => void;
}

export const ExpenseFilters: React.FC<ExpenseFiltersProps> = ({
  search,
  setSearch,
  category,
  setCategory,
  month,
  setMonth,
  sortBy,
  setSortBy,
}) => {
  return (
    <div className="flex flex-col lg:flex-row gap-4 bg-surface border border-border p-4 rounded-xl select-none">
      {/* Search description */}
      <div className="flex-1 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-secondary">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari pengeluaran..."
          className="w-full bg-background border border-border rounded-lg pl-9 pr-4 py-2 text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
        />
      </div>

      {/* Grid of filters */}
      <div className="grid grid-cols-2 sm:flex items-center gap-3">
        {/* Category filter */}
        <div className="relative">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full sm:w-44 bg-background border border-border rounded-lg pl-3 pr-8 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all appearance-none"
          >
            <option value="">Semua Kategori</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-text-secondary">
            <Filter className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Month Picker */}
        <div className="relative">
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="w-full sm:w-40 bg-background border border-border rounded-lg px-3 py-1.5 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
          />
        </div>

        {/* Sorting selection */}
        <div className="relative col-span-2 sm:col-span-1">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full sm:w-48 bg-background border border-border rounded-lg pl-3 pr-8 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all appearance-none"
          >
            <option value="date-desc">Tanggal Terbaru</option>
            <option value="date-asc">Tanggal Terlama</option>
            <option value="amount-desc">Nominal Terbesar</option>
            <option value="amount-asc">Nominal Terkecil</option>
          </select>
          <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-text-secondary">
            <ArrowUpDown className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
};
