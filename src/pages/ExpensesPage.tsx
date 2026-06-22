import React, { useState, useMemo } from 'react';
import { useExpenses } from '@/hooks/useExpenses';
import { ExpenseForm } from '@/components/expense/ExpenseForm';
import { ExpenseList } from '@/components/expense/ExpenseList';
import { ExpenseFilters } from '@/components/expense/ExpenseFilters';
import { ConfirmationDialog } from '@/components/ui/ConfirmationDialog';
import { Expense } from '@/types';
import { Plus, X } from 'lucide-react';

export const ExpensesPage: React.FC = () => {
  const {
    expenses,
    loading,
    saving,
    deletingId,
    addExpense,
    updateExpense,
    deleteExpense,
  } = useExpenses();

  // Filters State
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [month, setMonth] = useState(''); // YYYY-MM format
  const [sortBy, setSortBy] = useState('date-desc');

  // Modals & Dialog State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Compute filtered & sorted expenses
  const filteredExpenses = useMemo(() => {
    let result = [...expenses];

    // Description search (real-time)
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((exp) =>
        (exp.description || '').toLowerCase().includes(q)
      );
    }

    // Category filter
    if (category) {
      result = result.filter((exp) => exp.category === category);
    }

    // Month filter (input type=month maps YYYY-MM)
    if (month) {
      result = result.filter((exp) => exp.date.startsWith(month));
    }

    // Sort options
    result.sort((a, b) => {
      if (sortBy === 'date-desc') {
        const diff = new Date(b.date).getTime() - new Date(a.date).getTime();
        return diff !== 0 ? diff : b.createdAt.localeCompare(a.createdAt);
      }
      if (sortBy === 'date-asc') {
        const diff = new Date(a.date).getTime() - new Date(b.date).getTime();
        return diff !== 0 ? diff : a.createdAt.localeCompare(b.createdAt);
      }
      if (sortBy === 'amount-desc') {
        return b.amount - a.amount;
      }
      if (sortBy === 'amount-asc') {
        return a.amount - b.amount;
      }
      return 0;
    });

    return result;
  }, [expenses, search, category, month, sortBy]);

  // Handlers
  const handleAddSubmit = async (data: any) => {
    const res = await addExpense(data);
    if (res) {
      setIsAddOpen(false);
      return true;
    }
    return false;
  };

  const handleEditSubmit = async (data: any) => {
    if (!editingExpense) return false;
    const success = await updateExpense(editingExpense.id, data);
    if (success) {
      setEditingExpense(null);
      return true;
    }
    return false;
  };

  const handleDeleteTrigger = (id: string) => {
    setConfirmDeleteId(id);
  };

  const handleDeleteConfirm = async () => {
    if (!confirmDeleteId) return;
    const success = await deleteExpense(confirmDeleteId);
    if (success) {
      setConfirmDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none pb-2 border-b border-border/20">
        <div>
          <h2 className="text-xl font-bold text-text-primary">Catatan Pengeluaran 💸</h2>
          <p className="text-xs text-text-secondary mt-0.5">Kelola, cari, dan kelompokkan seluruh transaksi pengeluaranmu.</p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-hover text-text-primary text-sm font-semibold rounded-xl transition-all shadow-lg shadow-primary/25 active:scale-[0.97]"
        >
          <Plus className="w-4.5 h-4.5" />
          <span>Tambah Transaksi</span>
        </button>
      </div>

      {/* Real-time Filters */}
      <ExpenseFilters
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        month={month}
        setMonth={setMonth}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {/* Main transactions List section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center text-xs text-text-secondary select-none font-semibold px-2">
          <span>Menampilkan {filteredExpenses.length} dari {expenses.length} pengeluaran</span>
          { (search || category || month) && (
            <button
              onClick={() => {
                setSearch('');
                setCategory('');
                setMonth('');
              }}
              className="text-primary hover:underline"
            >
              Reset Filter
            </button>
          )}
        </div>

        <ExpenseList
          expenses={filteredExpenses}
          onEdit={setEditingExpense}
          onDelete={handleDeleteTrigger}
          deletingId={deletingId}
          isLoading={loading}
          onAddClick={() => setIsAddOpen(true)}
        />
      </div>

      {/* Reusable dialog: Add Expense Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-surface border border-border rounded-2xl p-6 shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between pb-3.5 border-b border-border/40 mb-4 select-none">
              <h3 className="font-bold text-base text-text-primary">Tambah Pengeluaran</h3>
              <button
                onClick={() => setIsAddOpen(false)}
                className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-background transition-all active:scale-[0.97]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <ExpenseForm
              onSubmit={handleAddSubmit}
              onCancel={() => setIsAddOpen(false)}
              isSaving={saving}
            />
          </div>
        </div>
      )}

      {/* Reusable dialog: Edit Expense Modal */}
      {editingExpense && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-surface border border-border rounded-2xl p-6 shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between pb-3.5 border-b border-border/40 mb-4 select-none">
              <h3 className="font-bold text-base text-text-primary">Edit Pengeluaran</h3>
              <button
                onClick={() => setEditingExpense(null)}
                className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-background transition-all active:scale-[0.97]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <ExpenseForm
              onSubmit={handleEditSubmit}
              initialData={editingExpense}
              onCancel={() => setEditingExpense(null)}
              isSaving={saving}
            />
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      <ConfirmationDialog
        isOpen={confirmDeleteId !== null}
        title="Hapus Pengeluaran?"
        message="Yakin mau hapus pengeluaran ini? Tindakan ini tidak dapat dibatalkan."
        confirmLabel="Hapus"
        cancelLabel="Batal"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmDeleteId(null)}
        isConfirming={deletingId === confirmDeleteId}
      />
    </div>
  );
};
